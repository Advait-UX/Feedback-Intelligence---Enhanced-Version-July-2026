/* Feedback Intelligence — Survey Templates admin page.
   Survey templates are reusable presets separated from campaigns, so multiple
   campaigns can share the same question set, display style, and delivery rules.
   (Internal field names like `surveyDesignId` are kept for backward compatibility.) */

const SEED_DESIGNS = [
  { id: "csat-quick",     name: "Standard CSAT — Quick Reply",     description: "Default 1–5 star CSAT for digital channels. Quick-reply bubbles, AI questions on.", channel: "Digital", surveyType: "CSAT (1–5 star)", displayStyle: "Quick Reply", listPickerLabel: "", aiQuestions: true, maxQuestions: 2, freeText: "Conditional", welcomeMode: "with-optout", welcomeMessage: "{{First Name}}, we'd love to hear about your experience today. We have just a few quick questions, just two minutes of your time.", buttonToStart: "Get started", buttonToOptOut: "Not today", defaultScaleQuestion: "On a scale of 1 to 5, how would you rate your experience today?", defaultCommentQuestion: "What could we have done better?", expiryMinutes: 2880, realtimeAlerts: true, usedBy: 3, updated: "May 02, 2026", owner: "Maria Cohen" },
  { id: "csat-list",      name: "CSAT — List Picker",              description: "Same questions as Standard CSAT, but renders as a list picker for desktop chat.",   channel: "Digital", surveyType: "CSAT (1–5 star)", displayStyle: "List Picker",  listPickerLabel: "Rate your experience", aiQuestions: true, maxQuestions: 2, freeText: "Conditional", welcomeMode: "without-optout", welcomeMessage: "{{First Name}}, we'd love your quick feedback. Just two minutes of your time.", buttonToStart: "Get started", buttonToOptOut: "Not today", defaultScaleQuestion: "On a scale of 1 to 5, how would you rate your experience today?", defaultCommentQuestion: "What could we have done better?", expiryMinutes: 2880, realtimeAlerts: true, usedBy: 1, updated: "Apr 28, 2026", owner: "Maria Cohen" },
  { id: "bot-simple",     name: "Bot Handoff — 1 Question",         description: "Minimal one-question survey for AI bot deflection audits. No AI questions, no welcome.", channel: "Digital", surveyType: "Like / Dislike", displayStyle: "Quick Reply", listPickerLabel: "", aiQuestions: false, maxQuestions: 1, freeText: "Always off", welcomeMode: "none", welcomeMessage: "", buttonToStart: "Get started", buttonToOptOut: "Not today", defaultScaleQuestion: "Did the assistant solve your problem?", defaultCommentQuestion: "Anything we should know?", expiryMinutes: 1440, realtimeAlerts: false, usedBy: 1, updated: "Mar 30, 2026", owner: "Tomás Reyes" },
  { id: "vip-followup",   name: "VIP Escalation Follow-Up",         description: "Longer survey for high-value customer escalations. Comment always on, no expiry pressure.", channel: "Both", surveyType: "Both",            displayStyle: "List Picker",  listPickerLabel: "How are we doing?", aiQuestions: true, maxQuestions: 3, freeText: "Always on", welcomeMode: "with-optout", welcomeMessage: "{{First Name}}, thank you for your patience. Your feedback shapes how we serve our VIP customers.", buttonToStart: "Share feedback", buttonToOptOut: "Maybe later", defaultScaleQuestion: "Overall, how would you rate your experience?", defaultCommentQuestion: "Tell us what went well — and what didn't.", expiryMinutes: 4320, realtimeAlerts: true, usedBy: 1, updated: "May 06, 2026", owner: "Maria Cohen" },
  { id: "brand-pulse",    name: "Brand Health Pulse",               description: "Two-question brand-affinity survey for social DMs. Like/dislike + open comment.",       channel: "Digital", surveyType: "Like / Dislike", displayStyle: "Quick Reply", listPickerLabel: "", aiQuestions: false, maxQuestions: 2, freeText: "Always on", welcomeMode: "without-optout", welcomeMessage: "Quick pulse check — how are we doing?", buttonToStart: "Tell us", buttonToOptOut: "Not today", defaultScaleQuestion: "How do you feel about us today?", defaultCommentQuestion: "Tell us why in a few words.", expiryMinutes: 4320, realtimeAlerts: false, usedBy: 1, updated: "Apr 12, 2026", owner: "Aisha Khan" },
];

function designById(id) {
  return SEED_DESIGNS.find(d => d.id === id) || SEED_DESIGNS[0];
}

function SurveyDesignsGrid({ onCreate, onOpen }) {
  const [search, setSearch] = React.useState("");
  const [channelFilter, setChannelFilter] = React.useState(null);
  const [typeFilter, setTypeFilter] = React.useState(null);
  const [ownerFilter, setOwnerFilter] = React.useState(null);

  /* Filter options derived from the data so they stay in sync. */
  const channelOptions = Array.from(new Set(SEED_DESIGNS.map(d => d.channel))).sort();
  const typeOptions = Array.from(new Set(SEED_DESIGNS.map(d => d.surveyType))).sort();
  const ownerOptions = Array.from(new Set(SEED_DESIGNS.map(d => d.owner))).sort();
  const hasAnyFilter = !!(search || channelFilter || typeFilter || ownerFilter);
  const clearAllFilters = () => {
    setSearch(""); setChannelFilter(null); setTypeFilter(null); setOwnerFilter(null);
  };

  const rows = SEED_DESIGNS.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (channelFilter && d.channel !== channelFilter) return false;
    if (typeFilter && d.surveyType !== typeFilter) return false;
    if (ownerFilter && d.owner !== ownerFilter) return false;
    return true;
  });

  /* Same Lyra badge pattern as StatusPill — soft bg + tinted border + 500 12/16 letter-spacing 0.01rem */
  const channelBadgeStyle = (channel) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px",
    borderRadius: 9999,
    border: "1px solid",
    fontFamily: "var(--font-sans)",
    fontSize: 12, fontWeight: 500, lineHeight: "16px", letterSpacing: "0.01rem",
    background: channel === "IVR" ? "var(--fi-amber-bg)" : channel === "Both" ? "var(--fi-purple-bg)" : "var(--fi-accent-bg)",
    color: channel === "IVR" ? "var(--fi-amber)" : channel === "Both" ? "var(--fi-purple)" : "var(--fi-accent-strong)",
    borderColor: channel === "IVR" ? "rgba(166,79,0,0.20)" : channel === "Both" ? "rgba(120,86,186,0.20)" : "rgba(13,138,138,0.20)",
  });

  return (
    <div className="pane">
      <div className="pane-head">
        <h1>Survey Templates</h1>
        <div className="head-actions">
          <button className="btn primary" onClick={() => onCreate()}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Survey Template
          </button>
        </div>
      </div>

      {/* Lyra filter bar — search on the left + Channel / Type / Owner filter chips */}
      <div className="toolbar" style={{ paddingTop: 14 }}>
        <div className="search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input placeholder="Search survey templates"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <window.FilterChip label="Channel" value={channelFilter} options={channelOptions}
          onSelect={setChannelFilter} onClear={() => setChannelFilter(null)}/>
        <window.FilterChip label="Type" value={typeFilter} options={typeOptions}
          onSelect={setTypeFilter} onClear={() => setTypeFilter(null)}/>
        <window.FilterChip label="Owner" value={ownerFilter} options={ownerOptions}
          onSelect={setOwnerFilter} onClear={() => setOwnerFilter(null)}/>
        {hasAnyFilter && (
          <button className="clear-link" onClick={clearAllFilters}>Clear</button>
        )}
      </div>

      {/* Lyra info banner — placed after filters, just above the table */}
      <div className="info-banner">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>Reusable templates that define a survey's questions, display style, and delivery rules. Map one template to many campaigns — change the template once and every linked campaign picks it up.</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Survey template</th>
              <th>Channel</th>
              <th>Type</th>
              <th>Digital style</th>
              <th>AI questions</th>
              <th>Max Qs</th>
              <th>Used by</th>
              <th>Owner</th>
              <th>Last updated</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(d => (
              <tr key={d.id}>
                <td style={{ maxWidth: 360 }}>
                  <a className="agent-link" href="#" onClick={e => { e.preventDefault(); onOpen(d); }}>
                    {d.name}
                  </a>
                  {/* Lyra Body SM secondary text — Inter Regular 12/16 letter-spacing 0.01rem */}
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "0.01rem",
                    color: "var(--color-fg-secondary)",
                    marginTop: 4, whiteSpace: "normal", maxWidth: 340,
                  }}>
                    {d.description}
                  </div>
                </td>
                <td>
                  <span style={channelBadgeStyle(d.channel)}>{d.channel || "Digital"}</span>
                </td>
                <td>{d.surveyType}</td>
                <td>
                  {(d.channel === "Digital" || d.channel === "Both") ? (
                    <>
                      {d.displayStyle}
                      {d.displayStyle === "List Picker" && d.listPickerLabel ? (
                        <div style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "0.01rem",
                          color: "var(--color-fg-secondary)", marginTop: 4,
                        }}>"{d.listPickerLabel}"</div>
                      ) : null}
                    </>
                  ) : <span style={{ color: "var(--lyra-slate-400)" }}>—</span>}
                </td>
                <td>
                  {/* Lyra-style On/Off badge — matches StatusPill treatment */}
                  <span className={`fi-pill ${d.aiQuestions ? "active" : "ended"}`}>
                    <span className="dot"/>{d.aiQuestions ? "On" : "Off"}
                  </span>
                </td>
                <td>{d.maxQuestions}</td>
                <td>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14, fontWeight: 400, lineHeight: "20px", letterSpacing: 0,
                    color: d.usedBy === 0 ? "var(--lyra-slate-400)" : "var(--color-fg-default)",
                  }}>
                    {d.usedBy} {d.usedBy === 1 ? "campaign" : "campaigns"}
                  </span>
                </td>
                <td>{d.owner}</td>
                <td>{d.updated}</td>
                <td>
                  <div className="kebab">
                    <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DEFAULT_DESIGN = {
  name: "",
  description: "",
  channel: "Digital",
  surveyType: "CSAT (1–5 Star)",
  displayStyle: "Quick Reply",
  listPickerLabel: "Rate your experience",
  welcomeMode: "with-optout",
  welcomeMessage: "{{First Name}}, we'd love to hear about your experience today. We have just a few quick questions, just two minutes of your time.",
  buttonToStart: "Get started",
  buttonToOptOut: "Not today",
  aiQuestions: true,
  defaultScaleQuestion: "On a scale of 1 to 5, how would you rate your experience today?",
  defaultCommentQuestion: "What could we have done better?",
  maxQuestions: 2,
  freeText: "Conditional",
  expiryMinutes: 2880,
  realtimeAlerts: true,
};

const STANDARD_QUESTION_BANK = [
  { id: "qb1", text: "What do you think about the speed of the responses you received?",                                                   type: "Free Text"     },
  { id: "qb2", text: "How many times before have you contacted NICE CXone about this query?",                                              type: "Single Select" },
  { id: "qb3", text: "Did you get in touch with us in any other way before using live chat?",                                              type: "Yes/No"        },
  { id: "qb4", text: "How else did you contact NICE CXone with your query?",                                                               type: "Single Select" },
  { id: "qb5", text: "What are the key pieces of feedback you'd like us to take away about your chat experience with NICE CXone?",         type: "Free Text"     },
  { id: "qb6", text: "How likely are you to contact us again if you had a similar issue?",                                                 type: "1-5 Scale"     },
  { id: "qb7", text: "Was the information provided clear and easy to understand?",                                                         type: "Yes/No"        },
  { id: "qb8", text: "Which best describes the nature of your enquiry today?",                                                             type: "Single Select" },
  { id: "qb9", text: "Is there anything else you would like to share about your experience?",                                              type: "Free Text"     },
];

function QTypeBadge({ type }) {
  const map = {
    "1-5 Scale":     { background: "var(--color-bg-active-subtle)",  color: "var(--color-fg-active-strong)" },
    "Yes/No":        { background: "var(--fi-green-bg)",              color: "var(--fi-green)"               },
    "Free Text":     { background: "var(--lyra-slate-100)",           color: "var(--lyra-slate-600)"         },
    "Single Select": { background: "var(--fi-amber-bg)",              color: "var(--fi-amber)"               },
  };
  const s = map[type] || map["Free Text"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px", borderRadius: "var(--radius-full)",
      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
      lineHeight: "16px", letterSpacing: "0.01em", whiteSpace: "nowrap",
      background: s.background, color: s.color,
    }}>{type}</span>
  );
}

function CreateSurveyDesign({ onCancel, onSave, initial }) {
  const [d, setD] = React.useState(initial || DEFAULT_DESIGN);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const isEdit = !!initial;

  /* ── Questions Mode ── */
  const [questionMode, setQuestionMode] = React.useState("standard");
  const [selectedQuestions, setSelectedQuestions] = React.useState([
    { id: "sq1", text: "How do you rate your overall chat experience with us today?",                                       type: "1-5 Scale" },
    { id: "sq2", text: "How satisfied were you with the level of effort required to resolve your question or issue?",      type: "1-5 Scale" },
    { id: "sq3", text: "Did we fully resolve the reason(s) you got in touch with us?",                                     type: "Yes/No"    },
  ]);
  const [questionBankOpen, setQuestionBankOpen] = React.useState(true);

  /* ── Survey Introduction ── */
  const [introMode, setIntroMode] = React.useState("with-optout");

  /* ── Channel Configuration ── */
  const [digitalOpen, setDigitalOpen] = React.useState(false);
  const [ivrOpen, setIvrOpen]         = React.useState(false);

  const bankAvailable = STANDARD_QUESTION_BANK.filter(q => !selectedQuestions.find(s => s.id === q.id));

  const introLabel = introMode === "with-optout"    ? "Invitation with opt out"
                   : introMode === "without-optout" ? "Invitation without opt out"
                   : "None";

  function TemplateSummary() {
    const modeLabel = questionMode === "standard" ? "Standard Questions"
                    : questionMode === "ai"        ? "AI Generated"
                    : questionMode === "hybrid"    ? "Hybrid Mode"
                    : "Brand Reputation";
    const rows = [
      { done: !!d.name,  label: "Template Name",       value: d.name || "—"                              },
      { done: false,     label: "Question Mode",        value: modeLabel                                  },
      { done: false,     label: "Question Added",       value: `${selectedQuestions.length} of 5 max`     },
      { done: false,     label: "Survey Introduction",  value: introLabel                                 },
      { done: false,     label: "Digital",              value: "Setup completed"                          },
      { done: false,     label: "IVR",                  value: "Setup completed"                          },
    ];
    return (
      <div className="summary-card">
        <div className="summary-card-head">Template Summary</div>
        <div className="summary-card-rows">
          {rows.map((r, i) => (
            <div className="summary-card-row" key={i}>
              <div className="summary-card-icon" style={r.done
                ? { background: "var(--fi-green-bg)",    color: "var(--fi-green)"       }
                : { background: "var(--lyra-slate-200)", color: "var(--lyra-slate-500)" }
              }>
                {r.done
                  ? <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 8 6.5 11.5 13 5"/></svg>
                  : <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5"/></svg>
                }
              </div>
              <div className="summary-card-row-body">
                <div className="summary-card-label">{r.label}</div>
                <div className="summary-card-value">{r.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "var(--space-4)" }}>
          <button className="btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Test on Emulator
            <svg viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pane" style={{ overflow: "hidden" }}>

      {/* Breadcrumb */}
      <div className="crumbs">
        <a href="#" onClick={e => { e.preventDefault(); onCancel(); }}>Survey Templates</a>
        <span className="sep">/</span>
        <span className="last">Create New Survey Template</span>
      </div>

      {/* Page header */}
      <div className="pane-head" style={{ paddingTop: 6 }}>
        <h1>{isEdit ? d.name : "Create New Survey Template"}</h1>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <div className="create-grid" style={{ gridTemplateColumns: "1fr 280px" }}>

          {/* Form pane */}
          <div className="form-pane">

            {/* ── Section 1: Identity ── */}
            <FormSection num={1} title="Identity"
              sub="Give this template a name so it can be found in campaigns"
              id="dsec-1" complete={!!d.name}>

              <FieldRow label="Template Name" req>
                <div style={{ position: "relative" }}>
                  <input className="fi-input" placeholder="Type here" maxLength={50}
                    value={d.name} onChange={e => set("name", e.target.value)}
                    style={{ paddingRight: 52 }}/>
                  <span style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, lineHeight: "16px",
                    color: "var(--color-fg-secondary)", pointerEvents: "none",
                  }}>{d.name.length}/50</span>
                </div>
              </FieldRow>

              <FieldRow label="Description">
                <div style={{ position: "relative" }}>
                  <textarea className="fi-input" rows={3} maxLength={200}
                    placeholder="Type here"
                    style={{ paddingRight: 52 }}
                    value={d.description} onChange={e => set("description", e.target.value)}/>
                  <span style={{
                    position: "absolute", right: 10, top: 10,
                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 400, lineHeight: "16px",
                    color: "var(--color-fg-secondary)", pointerEvents: "none",
                  }}>{(d.description || "").length}/200</span>
                </div>
              </FieldRow>
            </FormSection>

            {/* ── Section 2: Questions Mode ── */}
            <FormSection num={2} title="Questions Mode"
              sub="Choose how questions are created for this survey"
              id="dsec-2" complete={selectedQuestions.length > 0}>

              <FieldRow label="Select Question Mode" req>
                {/* 4-column radio card grid — reuses welcome-mode-option pattern */}
                <div className="welcome-mode-radio" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                  {[
                    { v: "ai",       title: "AI Generated Questions",  desc: "Questions adapt to each interaction. The AI writes the most relevant questions for every customer" },
                    { v: "standard", title: "Standard Questions",       desc: "Every customer answers the same fixed set of questions you build below" },
                    { v: "hybrid",   title: "Hybrid Mode",              desc: "Combination of AI generated & Standards Questionnaire" },
                    { v: "brand",    title: "Brand Reputation Quest.",   desc: "Ask customers how they feel about your brand, not just their recent experience." },
                  ].map(opt => (
                    <label key={opt.v} className={`welcome-mode-option ${questionMode === opt.v ? "on" : ""}`}
                      onClick={() => setQuestionMode(opt.v)}>
                      <input type="radio" name="questionMode" value={opt.v}
                        checked={questionMode === opt.v} onChange={() => setQuestionMode(opt.v)}/>
                      <span className="dot"/>
                      <span className="body">
                        <span className="title">{opt.title}</span>
                        <span className="desc">{opt.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </FieldRow>

              {/* Standard questions sub-panel */}
              {questionMode === "standard" && (
                <FieldRow label="Select Standard Questions" req
                  hint="Add questions from the bank below. Every customer who takes this survey will answer these questions.">

                  {/* Selected questions */}
                  <div className="cfg-group" style={{ border: "1px solid var(--color-fg-active-strong)" }}>
                    <div className="cfg-group-head" style={{ cursor: "default", borderBottom: "1px solid var(--color-border-subtle)" }}>
                      <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "var(--color-fg-default)" }}>
                        Selected Standard Survey Questions — {String(selectedQuestions.length).padStart(2, "0")}
                      </span>
                      <button className="btn" style={{ fontSize: 12, padding: "4px 10px", height: "auto" }}>
                        Preview – How Customer Will See It
                      </button>
                    </div>
                    <div>
                      {selectedQuestions.map((q, i) => (
                        <div key={q.id} style={{
                          display: "flex", alignItems: "center", gap: "var(--space-3)",
                          padding: "10px var(--space-5)",
                          borderTop: i === 0 ? "none" : "1px solid var(--color-border-subtle)",
                        }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "var(--color-fg-default)", flex: 1 }}>
                            <strong style={{ fontWeight: 500 }}>Q{i + 1}:</strong> {q.text}
                          </span>
                          <QTypeBadge type={q.type}/>
                          <button className="btn ghost" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "4px 8px", height: "auto", color: "var(--color-fg-secondary)" }}>
                            <svg viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2.5l2.5 2.5-8 8L3 14l.5-2.5 8-8z"/></svg>
                            Edit
                          </button>
                          <button className="btn ghost" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "4px 8px", height: "auto", color: "var(--color-fg-secondary)" }}
                            onClick={() => setSelectedQuestions(prev => prev.filter(x => x.id !== q.id))}>
                            <svg viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 4 13 4"/><path d="M5 4V3h6v1M6 7v5M10 7v5"/><rect x="3" y="4" width="10" height="9" rx="1"/></svg>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Question bank */}
                  {questionBankOpen && (
                    <div className="cfg-group" style={{ marginTop: "var(--space-3)" }}>
                      <div className="cfg-group-head" style={{ cursor: "default", borderBottom: "1px solid var(--color-border-subtle)" }}>
                        <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "var(--color-fg-default)" }}>
                          Standard Question Bank — {String(bankAvailable.length).padStart(2, "0")} Available
                        </span>
                        <button className="btn ghost" style={{ fontSize: 13, padding: "4px 8px", height: "auto" }}
                          onClick={() => setQuestionBankOpen(false)}>Close</button>
                      </div>
                      <div>
                        {bankAvailable.map((q, i) => (
                          <div key={q.id} style={{
                            display: "flex", alignItems: "center", gap: "var(--space-3)",
                            padding: "10px var(--space-5)",
                            borderTop: i === 0 ? "none" : "1px solid var(--color-border-subtle)",
                          }}>
                            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "var(--color-fg-default)", flex: 1 }}>
                              <strong style={{ fontWeight: 500 }}>Q{i + 1}:</strong> {q.text}
                            </span>
                            <QTypeBadge type={q.type}/>
                            <button className="btn ghost" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, padding: "4px 8px", height: "auto", color: "var(--color-fg-active-strong)" }}
                              onClick={() => {
                                if (selectedQuestions.length >= 5) return;
                                setSelectedQuestions(prev => [...prev, q]);
                              }}>
                              <svg viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!questionBankOpen && (
                    <button className="btn ghost" style={{ marginTop: "var(--space-2)", fontSize: 13, color: "var(--color-fg-active-strong)" }}
                      onClick={() => setQuestionBankOpen(true)}>
                      + Add from question bank
                    </button>
                  )}
                </FieldRow>
              )}
            </FormSection>

            {/* ── Section 3: Survey Introduction ── */}
            <FormSection num={3} title="Survey Introduction"
              sub="Optionally greet the customer before the first question starts"
              id="dsec-3" complete>

              <FieldRow label="Select Introduction Mode" req>
                <div className="welcome-mode-radio">
                  {[
                    { v: "with-optout",    title: "Invitation with Opt Out",    desc: "The customer sees your invitation message & can choose to start the survey or decline it."       },
                    { v: "without-optout", title: "Invitation without Opt Out", desc: "The customer sees your invitation message but cannot skip it. They must tap Start to proceed."   },
                    { v: "none",           title: "None",                       desc: "The survey starts immediately with the first question. No greeting is shown."                    },
                  ].map(opt => (
                    <label key={opt.v} className={`welcome-mode-option ${introMode === opt.v ? "on" : ""}`}
                      onClick={() => setIntroMode(opt.v)}>
                      <input type="radio" name="introMode" value={opt.v}
                        checked={introMode === opt.v} onChange={() => setIntroMode(opt.v)}/>
                      <span className="dot"/>
                      <span className="body">
                        <span className="title">{opt.title}</span>
                        <span className="desc">{opt.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </FieldRow>
            </FormSection>

            {/* ── Section 4: Channel Configuration ── */}
            <FormSection num={4} title="Channel Configuration"
              sub="Configure whichever channels you need. What you configure here becomes available in campaigns."
              id="dsec-4" complete>

              {/* Digital accordion */}
              <div className={`cfg-group ${digitalOpen ? "" : "cfg-group--closed"}`}>
                <div className="cfg-group-head" onClick={() => setDigitalOpen(!digitalOpen)}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-fg-secondary)", flexShrink: 0 }}>
                    <rect x="2" y="3" width="16" height="11" rx="2"/><line x1="7" y1="17" x2="13" y2="17"/><line x1="10" y1="14" x2="10" y2="17"/>
                  </svg>
                  <span className="cfg-group-title">Digital Survey – Chat, Message, Email</span>
                  <svg className="cfg-group-chev" viewBox="0 0 16 16"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {digitalOpen && (
                  <div className="cfg-group-body">
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "var(--color-fg-secondary)", margin: 0 }}>
                      Configure display style, question set, and opt-out behaviour for digital channels.
                    </p>
                  </div>
                )}
              </div>

              {/* IVR accordion */}
              <div className={`cfg-group ${ivrOpen ? "" : "cfg-group--closed"}`} style={{ marginTop: "var(--space-2)" }}>
                <div className="cfg-group-head" onClick={() => setIvrOpen(!ivrOpen)}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-fg-secondary)", flexShrink: 0 }}>
                    <path d="M4 4a2 2 0 0 1 2-2h2l2 4-2 2a12 12 0 0 0 4 4l2-2 4 2v2a2 2 0 0 1-2 2A16 16 0 0 1 4 4z"/>
                  </svg>
                  <span className="cfg-group-title">IVR Survey – Call</span>
                  <svg className="cfg-group-chev" viewBox="0 0 16 16"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {ivrOpen && (
                  <div className="cfg-group-body">
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "var(--color-fg-secondary)", margin: 0 }}>
                      Configure IVR keypad prompts and survey flow for phone call interactions.
                    </p>
                  </div>
                )}
              </div>
            </FormSection>

          </div>{/* /form-pane */}

          {/* Right-rail summary */}
          <aside className="summary-pane">
            <TemplateSummary/>
          </aside>

        </div>{/* /create-grid */}
      </div>{/* /scroll area */}

      {/* Sticky footer */}
      <div className="wz-footer">
        <button className="btn" onClick={onCancel}>Cancel</button>
        <span style={{ flex: 1 }}/>
        <button className="btn" disabled={!d.name}
          onClick={() => onSave({ ...d, status: "draft" })}>
          Save as draft
        </button>
        <button className="btn primary" disabled={!d.name}
          onClick={() => onSave(d)}>
          Save Template
          <svg viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><path d="M6 3.5L10.5 8 6 12.5"/></svg>
        </button>
      </div>

    </div>
  );
}

function LinkedCampaignsTable({ linkedIds, currentDesignId, onToggle }) {
  const [search, setSearch] = React.useState("");
  const [hideOtherMapped, setHideOtherMapped] = React.useState(false);
  const all = window.CAMPAIGNS || [];
  const rows = all.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (hideOtherMapped && c.surveyDesignId && c.surveyDesignId !== currentDesignId && !linkedIds.includes(c.id)) return false;
    return true;
  });
  const linkedCount = linkedIds.length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        <div className="search" style={{ flex: "0 0 260px" }}>
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input placeholder="Search campaigns"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "400 14px/20px Inter", color: "var(--lyra-slate-600)", cursor: "pointer" }}>
          <input type="checkbox" checked={hideOtherMapped} onChange={e => setHideOtherMapped(e.target.checked)}/>
          Hide campaigns mapped to another template
        </label>
        <span style={{ flex: 1 }}/>
        <span style={{
          font: "500 12px/16px Inter",
          color: linkedCount > 0 ? "var(--fi-accent-strong)" : "var(--lyra-slate-500)",
          background: linkedCount > 0 ? "var(--fi-accent-bg)" : "rgba(0,0,0,0.04)",
          padding: "var(--space-1) 10px", borderRadius: 999,
        }}>
          {linkedCount} {linkedCount === 1 ? "campaign" : "campaigns"} mapped
        </span>
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", font: "400 14px/20px Inter" }}>
          <thead>
            <tr>
              <th style={{ width: 40, padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", background: "var(--lyra-white)" }}/>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Campaign</th>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Status</th>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Channels</th>
              <th style={{ textAlign: "left", padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.06)", font: "500 var(--space-3)/var(--space-4) Inter", color: "var(--lyra-slate-600)", background: "var(--lyra-white)" }}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => {
              const isLinked = linkedIds.includes(c.id);
              const isMappedElsewhere = c.surveyDesignId && c.surveyDesignId !== currentDesignId;
              return (
                <tr key={c.id} style={{ background: isLinked ? "rgba(13,138,138,0.04)" : "transparent" }}>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <input type="checkbox" checked={isLinked}
                      onChange={() => onToggle(c.id)}/>
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{ font: "500 14px/20px Inter", color: "var(--lyra-slate-900)" }}>{c.name}</div>
                    {c.hasWorkingCopy ? (
                      <div style={{ marginTop: 4 }}>
                        <WorkingCopyChip/>
                      </div>
                    ) : null}
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <StatusPill s={c.status}/>
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="channel-stack">
                      {c.channels.map(k => <ChannelChip key={k} kind={k}/>)}
                    </div>
                  </td>
                  <td style={{ padding: "10px var(--space-3)", borderBottom: "1px solid rgba(0,0,0,0.05)", color: "var(--lyra-slate-600)" }}>{c.owner}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--lyra-slate-400)", font: "400 14px/20px Inter" }}>
                  No campaigns match the current filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {linkedIds.some(id => {
        const c = (window.CAMPAIGNS || []).find(x => x.id === id);
        return c && c.surveyDesignId && c.surveyDesignId !== currentDesignId;
      }) ? (
        <div style={{
          marginTop: 10, padding: "10px var(--space-3)", borderRadius: 6,
          background: "var(--fi-amber-bg, rgba(166,79,0,0.08))",
          border: "1px solid rgba(166,79,0,0.20)",
          color: "var(--fi-amber)",
          font: "400 12px/18px Inter",
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r=".8" fill="currentColor"/>
          </svg>
          <span>
            One or more selected campaigns are currently mapped to a different template. Saving will remap them — future surveys will use this template instead.
          </span>
        </div>
      ) : null}
    </div>
  );
}

Object.assign(window, { SEED_DESIGNS, designById, SurveyDesignsGrid, CreateSurveyDesign, DEFAULT_DESIGN, LinkedCampaignsTable });
