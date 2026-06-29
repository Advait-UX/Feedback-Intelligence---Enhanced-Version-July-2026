/* Survey Campaigns grid + Create New Survey Campaign form. */

const CAMPAIGNS = [
  { id: 1, name: "Post-Chat CSAT — Tier 1 Billing",
    status: "active", channels: ["digital"], surveyDesignId: "csat-quick",
    hasWorkingCopy: true, workingCopyVersion: 4, publishedVersion: 3, publishedAt: "May 04, 2026", workingCopyEditedBy: "Maria Cohen", workingCopyEditedAt: "May 10, 2026",
    sampling: 50, sent: 12480, completion: 31.2, vu: 76,
    owner: "Maria Cohen", created: "Mar 14, 2026", updated: "May 02, 2026" },
  { id: 2, name: "Negative Sentiment Catcher — All Digital",
    status: "active", channels: ["digital"], surveyDesignId: "csat-quick",
    sampling: 100, sent: 4220, completion: 28.6, vu: 41,
    owner: "Dev Patel", created: "Jan 22, 2026", updated: "May 08, 2026" },
  { id: 3, name: "Email Support — Resolution Quality",
    status: "active", channels: ["digital"], surveyDesignId: "csat-list",
    sampling: 25, sent: 8910, completion: 22.4, vu: 68,
    owner: "Maria Cohen", created: "Feb 04, 2026", updated: "Apr 28, 2026" },
  { id: 4, name: "Cognigy AI Session — Bot Handoff Audit",
    status: "active", channels: ["digital"], surveyDesignId: "bot-simple",
    sampling: 80, sent: 6122, completion: 19.7, vu: 54,
    owner: "Tomás Reyes", created: "Mar 30, 2026", updated: "May 09, 2026" },
  { id: 5, name: "Social DM — Brand Health Pulse",
    status: "paused", channels: ["digital"], surveyDesignId: "brand-pulse",
    sampling: 100, sent: 1840, completion: 14.1, vu: 62,
    owner: "Aisha Khan", created: "Dec 01, 2025", updated: "Apr 12, 2026" },
  { id: 6, name: "VIP Escalation Follow-Up",
    status: "draft", channels: ["digital"], surveyDesignId: "vip-followup",
    sampling: 100, sent: 0, completion: 0, vu: null,
    owner: "Maria Cohen", created: "May 06, 2026", updated: "May 06, 2026" },
  { id: 7, name: "Holiday Returns — Email",
    status: "ended", channels: ["digital"], surveyDesignId: "csat-quick",
    sampling: 100, sent: 21450, completion: 26.8, vu: 71,
    owner: "Dev Patel", created: "Nov 12, 2025", updated: "Jan 15, 2026" },
];

function ChannelChip({ kind }) {
  const map = {
    digital: <><path d="M7 4h9a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-1v2.5a.5.5 0 0 1-.82.39L10.5 16H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/></>,
    voice:  <><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></>,
  };
  return (
    <span className="channel-chip" title={kind}>
      <svg viewBox="0 0 24 24">{map[kind] || map.digital}</svg>
    </span>
  );
}

function StatusPill({ s }) {
  const label = { active: "Active", paused: "Paused", draft: "Draft", ended: "Ended", working: "Working Copy" }[s] || s;
  return <span className={`fi-pill ${s}`}><span className="dot"/>{label}</span>;
}

function WorkingCopyChip() {
  return (
    <span className="fi-pill working" title="This campaign has unpublished changes">
      <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
      Working Copy
    </span>
  );
}

function DesignPreviewCard({ design, compact }) {
  if (!design) return null;
  return (
    <div style={{
      marginTop: 8,
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 8,
      background: "var(--lyra-white)",
      overflow: "hidden",
      maxWidth: 460,
    }}>
      <div style={{
        padding: "10px 14px",
        background: "var(--fi-accent-bg)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="var(--fi-accent-strong)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/>
        </svg>
        <div style={{ flex: 1, font: "500 14px/20px var(--font-sans)", color: "var(--fi-accent-strong)" }}>
          {design.name}
        </div>
        <a className="agent-link" href="#" onClick={e => e.preventDefault()}
          style={{ font: "500 12px/16px var(--font-sans)" }}>
          Open design →
        </a>
      </div>
      <div style={{ padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 8 }}>
        <DesignChip label={design.surveyType}/>
        <DesignChip label={design.displayStyle}/>
        <DesignChip label={`AI questions ${design.aiQuestions ? "on" : "off"}`} on={design.aiQuestions}/>
        <DesignChip label={`${design.maxQuestions} question${design.maxQuestions !== 1 ? "s" : ""}`}/>
        <DesignChip label={`Free text: ${design.freeText}`}/>
        <DesignChip label={`${design.expiryMinutes} min expiry`}/>
        {design.realtimeAlerts ? <DesignChip label="Real-time alerts" on/> : null}
      </div>
    </div>
  );
}

function DesignChip({ label, on }) {
  return (
    <span style={{
      font: "500 12px/16px var(--font-sans)",
      color: on ? "var(--fi-green)" : "var(--lyra-slate-600)",
      background: on ? "rgba(28,94,37,0.08)" : "rgba(0,0,0,0.04)",
      padding: "3px var(--space-2)", borderRadius: 4,
    }}>{label}</span>
  );
}

function Sparkline({ seed = 1, color = "var(--fi-accent)" }) {
  // Deterministic pseudo-random sparkline.
  const pts = [];
  let x = seed * 17;
  for (let i = 0; i < 14; i++) {
    x = (x * 9301 + 49297) % 233280;
    pts.push(8 + (x % 14));
  }
  const max = Math.max(...pts), min = Math.min(...pts);
  const d = pts.map((p, i) => {
    const xi = (i / (pts.length - 1)) * 80;
    const yi = 22 - ((p - min) / (max - min || 1)) * 18;
    return `${i === 0 ? "M" : "L"}${xi.toFixed(1)} ${yi.toFixed(1)}`;
  }).join(" ");
  return (
    <svg className="spark" viewBox="0 0 80 22">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* Reusable Lyra filter chip with click-outside dropdown menu.
   Renders as: [Label] [: Value] [▾]  [×] when active, or [Label ▾] when empty. */
function FilterChip({ label, value, options, onSelect, onClear }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const isActive = value != null && value !== "";

  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className={`filter-chip ${isActive ? "active" : "muted"}`} ref={ref}>
      <span className="filter-chip-trigger" onClick={() => setOpen(o => !o)}>
        <span>{label}{isActive ? ":" : ""}</span>
        {isActive && <span className="filter-chip-value">{value}</span>}
        <svg className="chev" viewBox="0 0 16 16">
          <polyline points="4 6 8 10 12 6" stroke="currentColor" strokeWidth="1.5"
            fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {isActive && (
        <button className="filter-chip-x" onClick={onClear} title={`Remove ${label} filter`}>
          <svg viewBox="0 0 16 16">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      {open && (
        <div className="filter-chip-menu">
          {options.map(opt => (
            <button key={opt}
              className={`filter-chip-menu-item ${opt === value ? "selected" : ""}`}
              onClick={() => { onSelect(opt); setOpen(false); }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RowActions({ campaign, statusOf, onActivate, onDeactivate, onDelete, onEdit }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const closeTimer = React.useRef(null);
  const s = statusOf(campaign);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        className="row-action-btn"
        onClick={() => setOpen(o => !o)}
      >
        Actions
        <svg viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
          <polyline points="4 6 8 10 12 6"/>
        </svg>
      </button>
      {open && (
        <div className="row-action-menu"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <button className="row-action-item" onClick={() => { onEdit(campaign); setOpen(false); }}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
            Edit
          </button>
          {s !== "active" && s !== "ended" && (
            <button className="row-action-item" onClick={() => { onActivate(campaign.id); setOpen(false); }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Activate
            </button>
          )}
          {s === "active" && (
            <button className="row-action-item" onClick={() => { onDeactivate(campaign.id); setOpen(false); }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>
              </svg>
              Deactivate
            </button>
          )}
          {s === "paused" && (
            <button className="row-action-item" onClick={() => { onActivate(campaign.id); setOpen(false); }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Resume
            </button>
          )}
          <div className="row-action-divider"/>
          <button className="row-action-item danger" onClick={() => { onDelete(campaign.id); setOpen(false); }}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function SurveyCampaignsGrid({ onCreate, onOpen }) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState(null);   // null = no filter (show all)
  const [ownerFilter, setOwnerFilter] = React.useState(null);
  const [order, setOrder] = React.useState(() => CAMPAIGNS.map(c => c.id));
  const [dragId, setDragId] = React.useState(null);
  const [dropBeforeId, setDropBeforeId] = React.useState(null);
  const [selectedIds, setSelectedIds] = React.useState(() => new Set());
  const [statusOverride, setStatusOverride] = React.useState({}); // id -> status
  const [deletedIds, setDeletedIds] = React.useState(() => new Set());

  const statusOf = (c) => statusOverride[c.id] || c.status;
  const toggleSelect = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const clearSelection = () => setSelectedIds(new Set());
  const selCount = selectedIds.size;
  const selectedRows = () => [...selectedIds].map(id => CAMPAIGNS.find(c => c.id === id)).filter(Boolean);
  const canActivate = selCount > 0 && selectedRows().some(c => statusOf(c) !== "active" && statusOf(c) !== "ended");
  const canDeactivate = selCount > 0 && selectedRows().some(c => statusOf(c) === "active");
  const canDelete = selCount > 0;
  const bulkSetStatus = (status) => {
    setStatusOverride(prev => {
      const next = { ...prev };
      selectedRows().forEach(c => {
        if (status === "active" && statusOf(c) === "ended") return;
        next[c.id] = status;
      });
      return next;
    });
    clearSelection();
  };
  const bulkDelete = () => {
    setDeletedIds(prev => {
      const next = new Set(prev);
      selectedIds.forEach(id => next.add(id));
      return next;
    });
    clearSelection();
  };

  const rowActivate = (id) => setStatusOverride(prev => ({ ...prev, [id]: "active" }));
  const rowDeactivate = (id) => setStatusOverride(prev => ({ ...prev, [id]: "paused" }));
  const rowDelete = (id) => {
    const c = CAMPAIGNS.find(x => x.id === id);
    if (!window.confirm(`Delete "${c?.name}"? This cannot be undone.`)) return;
    setDeletedIds(prev => { const next = new Set(prev); next.add(id); return next; });
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  // Routing-active = active + paused. Draft/Ended don't participate in priority.
  const isRouting = c => {
    if (deletedIds.has(c.id)) return false;
    const s = statusOf(c);
    return s === "active" || s === "paused";
  };
  const orderedAll = order.map(id => CAMPAIGNS.find(c => c.id === id)).filter(Boolean);
  const priorityMap = {};
  let p = 0;
  orderedAll.forEach(c => { if (isRouting(c)) { p++; priorityMap[c.id] = p; } });

  function reorder(srcId, beforeId) {
    if (srcId === beforeId) return;
    const next = order.filter(id => id !== srcId);
    if (beforeId == null) next.push(srcId);
    else {
      const i = next.indexOf(beforeId);
      next.splice(i, 0, srcId);
    }
    setOrder(next);
  }

  const liveCampaigns = CAMPAIGNS.filter(c => !deletedIds.has(c.id));
  /* Owner options come from the dataset itself so the menu stays in sync. */
  const ownerOptions = Array.from(new Set(liveCampaigns.map(c => c.owner))).sort();
  const statusOptions = ["Active", "Paused", "Draft", "Ended"];
  const hasAnyFilter = !!(search || statusFilter || ownerFilter);
  const clearAllFilters = () => { setSearch(""); setStatusFilter(null); setOwnerFilter(null); };

  const rows = orderedAll.filter(c => {
    if (deletedIds.has(c.id)) return false;
    const s = statusOf(c);
    if (statusFilter && s !== statusFilter.toLowerCase()) return false;
    if (ownerFilter && c.owner !== ownerFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const allRowsSelected = rows.length > 0 && rows.every(r => selectedIds.has(r.id));
  const someRowsSelected = rows.some(r => selectedIds.has(r.id)) && !allRowsSelected;

  return (
    <div className="pane">
      <div className="pane-head">
        <h1>Survey Campaigns</h1>
        <div className="head-actions">
          <button className="btn primary" onClick={onCreate}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Campaign
          </button>
        </div>
      </div>

      {/* Lyra Filter Bar — Search on the left, filter chips, then Clear */}
      <div className="toolbar" style={{ paddingTop: 14 }}>
        <div className="search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input placeholder="Search campaigns"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <FilterChip label="Status" value={statusFilter} options={statusOptions}
          onSelect={setStatusFilter} onClear={() => setStatusFilter(null)}/>
        <FilterChip label="Owner" value={ownerFilter} options={ownerOptions}
          onSelect={setOwnerFilter} onClear={() => setOwnerFilter(null)}/>
        {hasAnyFilter && (
          <button className="clear-link" onClick={clearAllFilters}>Clear</button>
        )}
        <span style={{ flex: 1 }}/>
        {selCount > 0 && (
          <span style={{ font: "500 12px/16px var(--font-sans)", color: "var(--fi-accent-strong)", marginRight: 4 }}>
            {selCount} selected
            <span style={{ color: "var(--lyra-slate-400)", marginLeft: 8, cursor: "pointer", textDecoration: "underline" }} onClick={clearSelection}>Clear</span>
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button className="btn" disabled={!canActivate}
            style={!canActivate ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            title={selCount === 0 ? "Select campaigns to enable" : "Activate selected"}
            onClick={() => canActivate && bulkSetStatus("active")}>
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Activate
          </button>
          <button className="btn" disabled={!canDeactivate}
            style={!canDeactivate ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            title={selCount === 0 ? "Select campaigns to enable" : "Pause selected"}
            onClick={() => canDeactivate && bulkSetStatus("paused")}>
            <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            Deactivate
          </button>
          <button className="btn" disabled={!canDelete}
            style={!canDelete ? { opacity: 0.5, cursor: "not-allowed" } : { color: "var(--fi-red)" }}
            title={selCount === 0 ? "Select campaigns to enable" : "Delete selected"}
            onClick={() => canDelete && window.confirm(`Delete ${selCount} campaign${selCount===1?"":"s"}? This cannot be undone.`) && bulkDelete()}>
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            Delete
          </button>
        </div>
      </div>

      <div className="info-banner">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>Drag any row by its grip handle to reorder routing priority. When an interaction matches multiple campaigns, the lower-numbered campaign wins. Draft and ended campaigns don't participate.</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 28, padding: 0 }}></th>
              <th style={{ width: 36 }}>
                <input type="checkbox"
                  checked={allRowsSelected}
                  ref={el => { if (el) el.indeterminate = someRowsSelected; }}
                  onChange={e => {
                    if (e.target.checked) setSelectedIds(new Set(rows.map(r => r.id)));
                    else clearSelection();
                  }}/>
              </th>
              <th style={{ width: 110 }} title="Drag rows to reorder routing priority">
                Campaign priority
                <svg viewBox="0 0 24 24" width="11" height="11" style={{ marginLeft: 4, opacity: 0.5, verticalAlign: "-1px" }} stroke="currentColor" fill="none" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
              </th>
              <th>Campaign</th>
              <th>Status</th>
              <th>Channels</th>
              <th>Sampling</th>
              <th>Owner</th>
              <th>Last updated</th>
              <th style={{ width: 48 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, idx) => {
              const routing = isRouting(c);
              const isDragging = dragId === c.id;
              const dropAbove = dropBeforeId === c.id;
              const isRowSelected = selectedIds.has(c.id);
              return (
                <tr key={c.id}
                  className={isRowSelected ? "selected" : ""}
                  draggable={routing}
                  onDragStart={e => {
                    if (!routing) { e.preventDefault(); return; }
                    setDragId(c.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(c.id));
                  }}
                  onDragOver={e => {
                    if (dragId == null || !routing) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    const rect = e.currentTarget.getBoundingClientRect();
                    const above = (e.clientY - rect.top) < rect.height / 2;
                    setDropBeforeId(above ? c.id : (rows[idx+1]?.id ?? null));
                  }}
                  onDragLeave={() => { /* no-op */ }}
                  onDrop={e => {
                    e.preventDefault();
                    if (dragId != null) reorder(dragId, dropBeforeId);
                    setDragId(null);
                    setDropBeforeId(null);
                  }}
                  onDragEnd={() => { setDragId(null); setDropBeforeId(null); }}
                  style={{
                    opacity: isDragging ? 0.4 : 1,
                    boxShadow: dropAbove ? "inset 0 2px 0 var(--fi-accent-strong)" : undefined,
                    cursor: routing ? "default" : undefined,
                  }}>
                  <td style={{ padding: 0, textAlign: "center", color: "var(--lyra-slate-400)",
                    cursor: routing ? "grab" : "not-allowed",
                    opacity: routing ? 1 : 0.25 }}
                    title={routing ? "Drag to reorder" : "Draft/Ended campaigns don't participate in routing"}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <circle cx="9" cy="6" r="1.3"/><circle cx="15" cy="6" r="1.3"/>
                      <circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/>
                      <circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="18" r="1.3"/>
                    </svg>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleSelect(c.id)}/>
                  </td>
                  <td>
                    {routing ? (
                      /* Priority badge — bold so it's recognizable as main grid text (per Lyra instructions).
                         All priorities use the same style for consistency; the order itself conveys ranking. */
                      <div style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        minWidth: 28, height: 24, padding: "0 var(--space-2)", borderRadius: 6,
                        background: "var(--color-bg-active-moderate)",   /* Lyra: #d3e6fd */
                        color: "var(--color-fg-active-strong)",          /* Lyra: brand-700 */
                        font: "600 14px/20px var(--font-sans)", letterSpacing: 0,   /* Lyra Heading-sm bold */
                      }}>
                        {priorityMap[c.id]}
                      </div>
                    ) : (
                      <span style={{ color: "var(--lyra-slate-400)", font: "600 14px/20px var(--font-sans)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <a className="agent-link" href="#" onClick={e => { e.preventDefault(); onOpen && onOpen(c); }}>
                      {c.name}
                    </a>
                    <div style={{ font: "400 12px/16px var(--font-sans)", color: "var(--color-fg-secondary)", marginTop: 4 }}>
                      Created {c.created}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <StatusPill s={statusOf(c)}/>
                      {c.hasWorkingCopy ? <WorkingCopyChip/> : null}
                    </div>
                  </td>
                  <td>
                    <div className="channel-stack">
                      {c.channels.map(k => <ChannelChip key={k} kind={k}/>)}
                    </div>
                  </td>
                  <td>{c.sampling}%</td>
                  <td>{c.owner}</td>
                  <td>{c.updated}</td>
                  <td style={{ textAlign: "right", paddingRight: "var(--space-3)" }}>
                    <RowActions
                      campaign={c}
                      statusOf={statusOf}
                      onActivate={rowActivate}
                      onDeactivate={rowDeactivate}
                      onDelete={rowDelete}
                      onEdit={onOpen}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= Create New Survey Campaign ========================= */

const SURVEY_DESIGNS = [
  {
    id: "csat-quick", name: "Post-Chat CSAT", category: "Customer Satisfaction",
    why: "Best for digital interactions where the conversation just ended. Short surveys (2–3 questions) get the highest response rates.",
    channels: "Digital · Chat",
    intents: [
      { group: "Primary",   tags: ["Resolution quality", "Agent friendliness"] },
      { group: "Secondary", tags: ["Response time", "First-contact resolution"] },
    ],
  },
  {
    id: "bot-simple", name: "Bot Handoff Audit", category: "AI Quality",
    why: "Use after virtual agent transfers to measure where AI confidence dropped and human escalation was needed.",
    channels: "Digital · AI / Bot",
    intents: [
      { group: "Primary",   tags: ["Bot containment", "Handoff smoothness"] },
      { group: "Secondary", tags: ["Escalation trigger", "AI confidence"] },
    ],
  },
  {
    id: "vip-followup", name: "VIP Escalation Follow-Up", category: "Retention",
    why: "Deploy after high-priority escalations. VIP customers churn silently — a personal survey shows the brand cares.",
    channels: "All channels",
    intents: [
      { group: "Primary",   tags: ["Satisfaction", "Relationship recovery"] },
      { group: "Secondary", tags: ["Churn risk", "Brand perception"] },
    ],
  },
  {
    id: "nps-pulse", name: "NPS Pulse Survey", category: "Net Promoter",
    why: "Captures likelihood to recommend after any significant interaction. Pairs well with open-text follow-up for promoter and detractor classification.",
    channels: "All channels",
    intents: [
      { group: "Primary",   tags: ["Recommend likelihood", "Promoter signal"] },
      { group: "Secondary", tags: ["Detractor risk", "Passive conversion"] },
    ],
  },
  {
    id: "fcr-check", name: "First Contact Resolution", category: "Resolution Quality",
    why: "One focused question on whether the issue was fully resolved. High correlation with loyalty — ideal for QA teams tracking resolution rates.",
    channels: "Voice · Digital · Email",
    intents: [
      { group: "Primary",   tags: ["Issue resolved", "Follow-up needed"] },
      { group: "Secondary", tags: ["Root cause", "Knowledge gap flag"] },
    ],
  },
  {
    id: "email-quality", name: "Email Support Quality", category: "Email Channel",
    why: "Optimised for async email threads. Measures clarity, helpfulness and tone — signals often lost in real-time chat surveys.",
    channels: "Email",
    intents: [
      { group: "Primary",   tags: ["Response clarity", "Helpfulness"] },
      { group: "Secondary", tags: ["Tone quality", "Resolution satisfaction"] },
    ],
  },
];

const AI_MODELS = [
  {
    id: "vu-score",
    name: "VU Score Model",
    badge: "Recommended",
    description: "Analyses customer effort, sentiment and resolution quality using NiCE's proprietary VU scoring framework.",
    whenToUse: "Best for comprehensive post-interaction analysis across all contact centre operations.",
    industry: "All industries",
    tags: ["Sentiment", "Effort", "Resolution"],
    categoryIntents: [
      { category: "Customer Satisfaction", intents: ["Resolution quality", "Agent friendliness", "Response time"] },
      { category: "Sentiment Recovery",    intents: ["Escalation risk", "Churn prediction", "Complaint handling"] },
      { category: "Quality Assurance",     intents: ["Accuracy of response", "Follow-up needed", "First-contact resolution"] },
    ],
  },
  {
    id: "sentiment-pulse",
    name: "Sentiment Pulse",
    badge: null,
    description: "Real-time emotional tone detection across customer messages. Ideal for tracking mood shifts mid-interaction.",
    whenToUse: "Use when tracking emotional shifts in real-time during customer conversations.",
    industry: "Retail · E-commerce · Healthcare",
    tags: ["Sentiment", "Tone"],
    categoryIntents: [
      { category: "Emotional Signals", intents: ["Frustration level", "Satisfaction tone", "Neutral detection"] },
      { category: "Trend Analysis",    intents: ["Sentiment shift", "Recovery rate", "Peak negativity"] },
    ],
  },
  {
    id: "csat-predictor",
    name: "CSAT Predictor",
    badge: "New",
    description: "Predicts likely CSAT scores before the survey completes, enabling proactive intervention on at-risk interactions.",
    whenToUse: "Use when you need to intervene before survey completion on at-risk interactions.",
    industry: "Financial services · Telecom · Retail",
    tags: ["CSAT", "Predictive"],
    categoryIntents: [
      { category: "Score Prediction", intents: ["Predicted CSAT", "Confidence score", "Risk flag"] },
      { category: "Intervention",     intents: ["Alert threshold", "Supervisor notify", "Follow-up trigger"] },
    ],
  },
  {
    id: "effort-engine",
    name: "Effort Score Engine",
    badge: null,
    description: "Quantifies the effort a customer had to exert to resolve their issue. Low effort = high loyalty.",
    whenToUse: "Best for measuring friction in complex support or service resolution journeys.",
    industry: "Financial services · Telecom · Healthcare",
    tags: ["Effort", "CES"],
    categoryIntents: [
      { category: "Effort Signals",   intents: ["Repeat contacts", "Channel switches", "Resolution steps"] },
      { category: "Friction Points",  intents: ["Transfer count", "Hold time impact", "Self-service failure"] },
    ],
  },
  {
    id: "resolution-intel",
    name: "Resolution Intelligence",
    badge: null,
    description: "Tracks whether customer issues were fully resolved and identifies root causes of unresolved cases.",
    whenToUse: "Use to identify why issues go unresolved and reduce repeat contact rates.",
    industry: "Technology · Telecom · Retail",
    tags: ["Resolution", "Root Cause"],
    categoryIntents: [
      { category: "Resolution Signals", intents: ["First-contact resolution", "Issue recurrence", "Escalation rate"] },
      { category: "Root Cause",         intents: ["Policy gap", "Knowledge gap", "System failure"] },
    ],
  },
  {
    id: "quality-compass",
    name: "Quality Compass",
    badge: null,
    description: "QA-aligned scoring that maps survey responses directly to quality evaluation rubrics for agent coaching.",
    whenToUse: "Best for QA teams aligning survey feedback directly to agent coaching rubrics.",
    industry: "All industries",
    tags: ["Quality", "Coaching"],
    categoryIntents: [
      { category: "Agent Behaviours",   intents: ["Empathy shown", "Process adherence", "Active listening"] },
      { category: "QA Alignment",       intents: ["Rubric match", "Coaching flag", "Calibration score"] },
    ],
  },
  {
    id: "brand-health",
    name: "Brand Health Monitor",
    badge: null,
    description: "Measures brand perception signals from post-interaction feedback — beyond just service quality.",
    whenToUse: "Use when measuring how interactions affect long-term brand perception.",
    industry: "Retail · Hospitality · Media",
    tags: ["Brand", "NPS"],
    categoryIntents: [
      { category: "Brand Signals",  intents: ["Trust level", "Recommend likelihood", "Brand association"] },
      { category: "NPS Drivers",    intents: ["Promoter indicators", "Detractor risk", "Passive conversion"] },
    ],
  },
  {
    id: "churn-detector",
    name: "Churn Risk Detector",
    badge: null,
    description: "Identifies customers at high risk of churning based on dissatisfaction patterns and interaction history.",
    whenToUse: "Best for proactively identifying at-risk customers before they cancel or leave.",
    industry: "Telecom · Financial services · SaaS",
    tags: ["Churn", "Retention"],
    categoryIntents: [
      { category: "Churn Signals",   intents: ["Cancellation language", "Competitor mention", "Frustration spike"] },
      { category: "Retention Intel", intents: ["Win-back opportunity", "Loyalty indicators", "VIP risk score"] },
    ],
  },
  {
    id: "agent-performance",
    name: "Agent Performance Index",
    badge: null,
    description: "Correlates survey feedback with individual agent metrics to surface coaching priorities across your team.",
    whenToUse: "Use to connect individual agent behaviour to customer satisfaction outcomes.",
    industry: "All industries",
    tags: ["Agent", "Coaching"],
    categoryIntents: [
      { category: "Performance Signals", intents: ["Agent satisfaction delta", "Skill gap flag", "Top performer traits"] },
      { category: "Coaching Actions",    intents: ["Priority coaching", "Knowledge refresher", "Peer benchmark"] },
    ],
  },
  {
    id: "topic-classifier",
    name: "Topic & Intent Classifier",
    badge: null,
    description: "Classifies open-text survey responses into structured topics and intents for trend analysis at scale.",
    whenToUse: "Best for categorising open-text feedback at scale for trend analysis.",
    industry: "All industries",
    tags: ["Topics", "NLP"],
    categoryIntents: [
      { category: "Topic Detection",   intents: ["Billing queries", "Technical issues", "Delivery complaints"] },
      { category: "Intent Mapping",    intents: ["Refund intent", "Churn language", "Upsell receptivity"] },
    ],
  },
];

const DEFAULT_CAMPAIGN = {
  name: "",
  description: "",
  ongoing: true,
  startDate: "2026-05-12",
  endDate: "",
  channels: ["digital"],
  queues: ["All queues"],
  teams: ["All teams"],

  samplingPct: 50,
  minCustomerTurns: 3,
  minAgentTurns: 2,
  perAgentPerDay: 3,

  suppressOptOut: true,
  suppressRecent: true,
  recentDays: 30,
  suppressInternal: true,

  startTime: "",
  endTime: "",

  triggerEvent: "Post-digital interaction",
  delay: "Immediate",
  delayValue: 0,

  aiModelId: "",
  surveyDesignId: "",
};

function FieldRow({ label, hint, req, tooltip, children }) {
  return (
    <div className="field-row">
      <label className="field-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {label}{req ? <span className="req">*</span> : null}
        {tooltip ? (
          <span className="tooltip-wrap" style={{ display: "inline-flex" }}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-fg-secondary)", cursor: "default", flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6"/>
              <path d="M8 11v-3"/>
              <circle cx="8" cy="5.5" r=".5" fill="currentColor" stroke="none"/>
            </svg>
            <span className="tooltip-bubble" style={{ width: 240, textAlign: "left", whiteSpace: "normal" }}>{tooltip}</span>
          </span>
        ) : null}
      </label>
      <div className="field-control">
        {children}
        {hint ? <span className="hint">{hint}</span> : null}
      </div>
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map(o => (
        <button key={o} className={value === o ? "on" : ""} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="switch-row">
      <span className="switch">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/>
        <span className="slider"/>
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}

function ChipWell({ values, onChange, placeholder, brand }) {
  const [draft, setDraft] = React.useState("");
  function addChip(v) {
    v = v.trim();
    if (!v) return;
    if (values.includes(v)) return;
    onChange([...values, v]);
    setDraft("");
  }
  return (
    <div className="chip-well">
      {values.map(v => (
        <span key={v} className={`chip ${brand ? "brand" : ""}`}>
          {v}
          <span className="x" onClick={() => onChange(values.filter(x => x !== v))}>
            <svg viewBox="0 0 16 16" width="10" height="10"><line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </span>
        </span>
      ))}
      <input
        placeholder={placeholder}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip(draft); } }}
        onBlur={() => addChip(draft)}
      />
    </div>
  );
}

function FormSection({ num, title, sub, defaultOpen = true, complete, children, id }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className={`form-section ${open ? "" : "collapsed"}`} id={id}>
      <header className={`form-section-head ${complete ? "complete" : ""}`} onClick={() => setOpen(!open)}>
        <span className="step-num">{num}</span>
        <div>
          <h3>{title}</h3>
          {sub ? <div className="sub">{sub}</div> : null}
        </div>
        <svg className="chev" viewBox="0 0 16 16"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </header>
      <div className="form-section-body">{children}</div>
    </section>
  );
}

function FiDatePicker({ value, onChange, disabled, placeholder = "Select date" }) {
  const ref = React.useRef(null);
  const fmt = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return "";
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[m-1]} ${String(d).padStart(2,"0")}, ${y}`;
  };
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
      <input
        type="text"
        readOnly
        className="fi-input"
        placeholder={placeholder}
        disabled={disabled}
        value={fmt(value)}
        onClick={() => !disabled && (ref.current?.showPicker ? ref.current.showPicker() : ref.current?.focus())}
        style={{ cursor: disabled ? "not-allowed" : "pointer", paddingRight: 36 }}
      />
      <svg viewBox="0 0 24 24" width="14" height="14"
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          color: disabled ? "var(--lyra-slate-300)" : "var(--lyra-slate-500)", pointerEvents: "none" }}
        stroke="currentColor" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="8" y1="3" x2="8" y2="7"/>
        <line x1="16" y1="3" x2="16" y2="7"/>
      </svg>
      <input
        ref={ref}
        type="date"
        value={value || ""}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{
          position: "absolute", inset: 0, opacity: 0, pointerEvents: "none",
          width: "100%", height: "100%", border: 0,
        }}
      />
    </div>
  );
}

function FiTimePicker({ value, onChange }) {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const ampm = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      slots.push(`${h12}:${String(m).padStart(2,"0")} ${ampm}`);
    }
  }
  return (
    <div style={{ position: "relative" }}>
      <select
        className="fi-input"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        style={{ paddingRight: 36, appearance: "none", WebkitAppearance: "none", cursor: "pointer", color: value ? "var(--lyra-color-fg-default, var(--color-fg-default))" : "var(--lyra-color-fg-disabled, var(--color-fg-disabled))" }}
      >
        <option value="" disabled>HH:MM AM/PM</option>
        {slots.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <svg viewBox="0 0 24 24" width="14" height="14"
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--lyra-slate-500)", pointerEvents: "none" }}
        stroke="currentColor" fill="none" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
      </svg>
    </div>
  );
}

function CreateCampaign({ template: initialTemplate, onCancel, onSave }) {
  const [selectedTemplate, setSelectedTemplate] = React.useState(initialTemplate || null);
  const [samplingAutofilled, setSamplingAutofilled] = React.useState(!!initialTemplate);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modelDrawerOpen, setModelDrawerOpen] = React.useState(false);
  const [surveyDrawerOpen, setSurveyDrawerOpen] = React.useState(false);
  const [c, setC] = React.useState(() =>
    initialTemplate
      ? { ...DEFAULT_CAMPAIGN, samplingPct: initialTemplate.suggestedSampling, channels: initialTemplate.channels || DEFAULT_CAMPAIGN.channels }
      : DEFAULT_CAMPAIGN
  );
  const [activeStep, setActiveStep] = React.useState(0);
  const [visitedSteps, setVisitedSteps] = React.useState(new Set());
  const [reviewing, setReviewing] = React.useState(false);
  const set = (k, v) => setC(prev => ({ ...prev, [k]: v }));

  function pickTemplate(t) {
    setSelectedTemplate(t);
    setSamplingAutofilled(true);
    setDrawerOpen(false);
    set("samplingPct", t.suggestedSampling);
    set("channels", t.channels || DEFAULT_CAMPAIGN.channels);
  }

  function goScratch() {
    setSelectedTemplate(null);
    setSamplingAutofilled(false);
    setDrawerOpen(false);
  }

  const ALL_STEPS = [
    { n: 0, label: "Template & Identity",   done: !!c.name },
    { n: 1, label: "Suppression Rules",     done: true },
    { n: 2, label: "Volume & Sampling",     done: c.samplingPct > 0 },
    { n: 3, label: "Intelligence & Survey", done: !!c.aiModelId && !!c.surveyDesignId },
    { n: 4, label: "Summary & Review",      done: false },
  ];

  function stepState(s) {
    if (s.n === activeStep) return "active";
    if (visitedSteps.has(s.n) && s.done) return "done";
    if (visitedSteps.has(s.n) && !s.done) return "error";
    return "default";
  }

  function goNext() {
    setVisitedSteps(prev => new Set([...prev, activeStep]));
    setActiveStep(prev => Math.min(prev + 1, 4));
  }

  function goBack() {
    setActiveStep(prev => Math.max(prev - 1, 0));
  }

  if (reviewing) {
    const SummarySection = ({ title, children }) => (
      <div style={{ background: "var(--lyra-white)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "var(--space-3)" }}>
        <div style={{ padding: "var(--space-2) var(--space-4)", background: "var(--lyra-slate-50)", borderBottom: "1px solid var(--color-border-subtle)", font: "500 11px/16px var(--font-sans)", color: "var(--color-fg-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {title}
        </div>
        <div style={{ padding: "0 var(--space-4)" }}>{children}</div>
      </div>
    );
    const SRow = ({ label, value }) => (
      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)", padding: "var(--space-2) 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
        <span style={{ font: "500 13px/20px var(--font-sans)", color: "var(--color-fg-secondary)", minWidth: 200, flexShrink: 0 }}>{label}</span>
        <span style={{ font: "400 13px/20px var(--font-sans)", color: "var(--color-fg-default)" }}>{value ?? "—"}</span>
      </div>
    );
    return (
      <div className="pane" style={{ overflow: "hidden" }}>
        <div className="crumbs">
          <a href="#" onClick={e => { e.preventDefault(); onCancel(); }}>Feedback Intelligence</a>
          <span className="sep">/</span>
          <a href="#" onClick={e => { e.preventDefault(); onCancel(); }}>Survey Campaigns</a>
          <span className="sep">/</span>
          <a href="#" onClick={e => { e.preventDefault(); setReviewing(false); }}>Create Campaign</a>
          <span className="sep">/</span>
          <span className="last">Review &amp; Activate</span>
        </div>
        <div className="pane-head" style={{ paddingTop: 6 }}>
          <div style={{ flex: 1 }}>
            <h1>Review &amp; Activate</h1>
            <p style={{ margin: "var(--space-1) 0 0", font: "400 13px/20px var(--font-sans)", color: "var(--color-fg-secondary)" }}>
              Confirm your campaign settings before it goes live.
            </p>
          </div>
          <div className="head-actions">
            <button className="btn" onClick={() => setReviewing(false)}>← Back to edit</button>
            <button className="btn" onClick={() => onSave({ ...c, status: "draft" })}>Save as draft</button>
            <button className="btn primary" onClick={() => onSave({ ...c, status: "active" })}>
              Activate Campaign →
            </button>
          </div>
        </div>
        <div style={{ padding: "var(--space-5) var(--space-6)", overflow: "auto", flex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            {selectedTemplate && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-4)", background: "var(--color-bg-active-subtle)", border: "1px solid var(--lyra-brand-200)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)", font: "400 13px/20px var(--font-sans)", color: "var(--lyra-brand-700)" }}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>
                <strong>Template:</strong>&nbsp;{selectedTemplate.name}
              </div>
            )}
            <SummarySection title="Campaign Identity">
              <SRow label="Campaign Name" value={c.name}/>
              <SRow label="Description" value={c.description || null}/>
              <SRow label="Start Date" value={c.startDate}/>
              <SRow label="End Date" value={c.ongoing ? "Ongoing" : (c.endDate || null)}/>
              <SRow label="Start Time" value={c.startTime || null}/>
              <SRow label="End Time" value={c.endTime || null}/>
              <SRow label="Channels" value={c.channels.join(", ")}/>
              <SRow label="Agent Teams" value={(c.queues || []).join(", ")}/>
              <SRow label="Agent Group" value={(c.teams || []).join(", ")}/>
            </SummarySection>
            <SummarySection title="Volume & Sampling">
              <SRow label="Sampling %" value={`${c.samplingPct}%`}/>
              <SRow label="Min. customer turns" value={c.minCustomerTurns}/>
              <SRow label="Min. agent turns" value={c.minAgentTurns}/>
            </SummarySection>
            <SummarySection title="Suppression Rules">
              <SRow label="Opt-out suppression" value={c.suppressOptOut ? "Enabled" : "Disabled"}/>
              <SRow label="Recency window" value={c.suppressRecent ? `${c.recentDays} days` : "Disabled"}/>
              <SRow label="Internal interactions" value="Always suppressed"/>
            </SummarySection>
            <SummarySection title="Trigger Rules">
              <SRow label="Trigger event" value={c.triggerEvent}/>
              <SRow label="Delay" value={c.delay === "Immediate" ? "Immediate" : `${c.delayValue || 5} ${c.delay.toLowerCase()} after end`}/>
            </SummarySection>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", paddingTop: "var(--space-2)" }}>
              <button className="btn" onClick={() => setReviewing(false)}>← Back to edit</button>
              <button className="btn" onClick={() => onSave({ ...c, status: "draft" })}>Save as draft</button>
              <button className="btn primary" onClick={() => onSave({ ...c, status: "active" })}>
                Activate Campaign →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canDraft    = !!(c.name && c.channels?.length && c.samplingPct);
  const canActivate = !!(c.name && c.channels?.length && c.queues?.length);

  return (
    <div className="pane" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="crumbs">
        <a href="#" onClick={e => { e.preventDefault(); onCancel(); }}>Survey Campaigns</a>
        <span className="sep">/</span>
        <span className="last">Create New Survey Campaign</span>
      </div>

      <div className="pane-head" style={{ paddingTop: 6 }}>
        <h1>Create New Survey Campaign</h1>
        <div className="head-actions">
          <button className="ai-sparkle-btn">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42"/></svg>
            AI Campaign Assistant
          </button>
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn" disabled={!canDraft} onClick={() => onSave({ ...c, status: "draft" })}>Save as draft</button>
        </div>
      </div>

      {/* ── Horizontal Wizard Bar ── */}
      <div className="wz-bar">
        <div className="wz-bar-inner">
          {ALL_STEPS.map((s, i) => {
            const st = stepState(s);
            const prevDone = i > 0 && stepState(ALL_STEPS[i - 1]) === "done";
            return (
              <React.Fragment key={s.n}>
                {i > 0 && <div className={`wz-line ${prevDone ? "done" : ""}`}/>}
                <div className={`wz-step ${st}`} onClick={() => setActiveStep(s.n)}>
                  <div className="wz-node">
                    {st === "done" ? (
                      <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9.5 10 2.5"/></svg>
                    ) : s.n + 1}
                  </div>
                  <div className="wz-label">{s.label}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Wizard body: scrollable area + footer ── */}
      <div className="wz-scroll-area">
        <div className="wz-body">
          <div className="form-pane">

          {/* ── Step 0: Template & Identity ── */}
          {activeStep === 0 && (()=>{
            const showErr  = visitedSteps.has(0);
            const nameErr  = showErr && !c.name;
            const teamsErr = showErr && !c.queues?.[0];
            const groupErr = showErr && !c.teams?.[0];
            const chansErr = showErr && c.channels.length === 0;
            return <div className="wz-step-content">

              {/* ── Section A: Choose a Template ── */}
              <div className="setup-section">
                <div className="setup-section-head">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <h2 className="setup-section-title">Choose a Template</h2>
                      <span style={{ font: "400 12px/16px var(--font-sans)", color: "var(--color-fg-secondary)", background: "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: "var(--radius-round)" }}>Optional</span>
                    </div>
                    <p className="setup-section-sub">Jumpstart your campaign — templates pre-fill channels, sampling rate &amp; survey design.</p>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    {selectedTemplate && (
                      <button className="btn btn-ghost btn-icon-only" title="Remove template" onClick={() => { setSelectedTemplate(null); setSamplingAutofilled(false); }} style={{ color: "var(--color-fg-secondary)" }}>
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>
                      </button>
                    )}
                    <button className="btn" onClick={() => setDrawerOpen(true)}>{selectedTemplate ? "Change template" : "Browse templates →"}</button>
                  </div>
                </div>
                {selectedTemplate && (
                  <div className="setup-section-body" style={{ paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)" }}>
                    <div className="tmpl-selected-banner">
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="var(--lyra-brand-700)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}><rect x="2" y="1" width="12" height="14" rx="1.5"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="9" y2="11"/></svg>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: "500 14px/20px var(--font-sans)", color: "var(--color-fg-default)" }}>{selectedTemplate.name}</div>
                        <div style={{ font: "400 12px/16px var(--font-sans)", color: "var(--color-fg-secondary)", marginTop: 1 }}>{selectedTemplate.why}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Section B: Start from Scratch ── */}
              <div className="setup-section">
                <div className="setup-section-head">
                  <div>
                    <h2 className="setup-section-title">Start from Scratch</h2>
                    <p className="setup-section-sub">Configure every detail of your campaign manually.</p>
                  </div>
                </div>
                <div className="setup-section-body">
                <div className="field-grid-2">
                  <div className="field-cell">
                    <label className="field-label">Campaign Name<span className="req">*</span></label>
                    <input className={`fi-input${nameErr ? " error" : ""}`} placeholder="Type"
                      aria-invalid={nameErr || undefined}
                      value={c.name} onChange={e => set("name", e.target.value)}/>
                    {nameErr && <div className="field-control"><span className="error-msg">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
                      Campaign name is required
                    </span></div>}
                  </div>
                  <div className="field-cell">
                    <label className="field-label">
                      Description
                      <span className="char-counter">{(c.description || "").length}/100</span>
                    </label>
                    <input className="fi-input" maxLength={100} placeholder="Type"
                      value={c.description} onChange={e => set("description", e.target.value)}/>
                  </div>
                </div>

                <div style={{ padding: "var(--space-6) 0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                    <div className="section-heading" style={{ padding: 0 }}>Active Date Range</div>
                    <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", font: "400 13px/20px var(--font-sans)", color: "var(--color-fg-secondary)", cursor: "pointer" }}>
                      <Toggle checked={c.ongoing} onChange={v => set("ongoing", v)}/>
                      <span>Ongoing</span>
                    </label>
                  </div>
                  <div className="field-grid-2" style={{ padding: 0, borderTop: 0 }}>
                    <div className="field-cell">
                      <label className="field-label" style={{ fontWeight: 400 }}>Start Date</label>
                      <FiDatePicker value={c.startDate} onChange={v => set("startDate", v)} placeholder="Oct 30, 2025"/>
                    </div>
                    <div className="field-cell">
                      <label className="field-label" style={{ fontWeight: 400, color: c.ongoing ? "var(--color-fg-disabled)" : undefined }}>End Date</label>
                      <FiDatePicker value={c.endDate} onChange={v => set("endDate", v)} disabled={c.ongoing} placeholder={c.ongoing ? "Ongoing" : "Oct 30, 2025"}/>
                    </div>
                  </div>
                  <div className="field-grid-2" style={{ padding: 0, borderTop: 0, marginTop: 18 }}>
                    <div className="field-cell">
                      <label className="field-label">Start Time<span className="req">*</span></label>
                      <FiTimePicker value={c.startTime} onChange={v => set("startTime", v)}/>
                    </div>
                    <div className="field-cell">
                      <label className="field-label">End Time<span className="req">*</span></label>
                      <FiTimePicker value={c.endTime} onChange={v => set("endTime", v)}/>
                    </div>
                  </div>
                </div>

                <FieldRow label="Channels" req>
                  <div className={`lyra-check-group${chansErr ? " lyra-check-group--error" : ""}`}>
                    {[{ k: "digital", l: "Digital", icon: "digital" }, { k: "voice", l: "Voice", icon: "voice" }].map(opt => {
                      const on = c.channels.includes(opt.k);
                      return (
                        <label key={opt.k} className="lyra-check">
                          <input type="checkbox" checked={on}
                            onChange={() => set("channels", on ? c.channels.filter(x => x !== opt.k) : [...c.channels, opt.k])}/>
                          <ChannelChip kind={opt.icon}/>
                          <span>{opt.l}</span>
                        </label>
                      );
                    })}
                  </div>
                  {chansErr && <div className="field-control" style={{ marginTop: "var(--space-1)" }}><span className="error-msg">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
                    Select at least one channel
                  </span></div>}
                </FieldRow>

                <div className="section-heading" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-2)" }}>Agents</div>
                <div className="field-grid-2" style={{ borderTop: "none", paddingTop: 0, paddingBottom: 0 }}>
                  <div className="field-cell">
                    <label className="field-label">Agent Teams<span className="req">*</span></label>
                    <select className={`fi-input${teamsErr ? " error" : ""}`} aria-invalid={teamsErr || undefined}
                      value={c.queues?.[0] || ""} onChange={e => set("queues", e.target.value ? [e.target.value] : [])}>
                      <option value="">Select Teams</option>
                      <option value="Tier 1 Billing">Tier 1 Billing</option>
                      <option value="Tier 2 Support">Tier 2 Support</option>
                      <option value="Sales">Sales</option>
                      <option value="Retention">Retention</option>
                    </select>
                    {teamsErr && <div className="field-control"><span className="error-msg">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
                      Select an agent team
                    </span></div>}
                  </div>
                  <div className="field-cell">
                    <label className="field-label">Agent Group<span className="req">*</span></label>
                    <select className={`fi-input${groupErr ? " error" : ""}`} aria-invalid={groupErr || undefined}
                      value={c.teams?.[0] || ""} onChange={e => set("teams", e.target.value ? [e.target.value] : [])}>
                      <option value="">Select Group</option>
                      <option value="North America">North America</option>
                      <option value="EMEA">EMEA</option>
                      <option value="APAC">APAC</option>
                    </select>
                    {groupErr && <div className="field-control"><span className="error-msg">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
                      Select an agent group
                    </span></div>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginTop: "var(--space-2)", padding: "0 var(--space-3)", height: 36, background: "var(--lyra-white)", border: "1px solid var(--color-border-soft)", borderRadius: "var(--radius-md)", font: "400 14px/20px var(--font-sans)", color: "var(--color-fg-default)" }}>
                  Current Total Number Of Agents Selected: <strong style={{ marginLeft: 4 }}>{(c.queues?.length || 0) + (c.teams?.length || 0)}</strong>
                </div>

                <div style={{ paddingTop: "var(--space-6)" }}>
                  <FieldRow label="Language">
                    <label className="lyra-check disabled" style={{ pointerEvents: "none" }}>
                      <input type="checkbox" checked readOnly disabled/>
                      <span>English</span>
                      <span style={{ font: "500 11px/16px var(--font-sans)", color: "var(--lyra-slate-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginLeft: 4 }}>Default</span>
                    </label>
                  </FieldRow>
                </div>
                </div>{/* /setup-section-body */}
              </div>

            </div>;
          })()}

          {/* ── Step 1: Suppression Rules ── */}
          {activeStep === 1 && (
            <div className="wz-step-content">
              <div className="wz-content-card">
              <div className="wz-step-head">
                <h2>Suppression Rules</h2>
                <p>When not to send surveys, even if everything else qualifies.</p>
              </div>
              <div className="sup-row">
                <Toggle checked={c.suppressOptOut} onChange={v => set("suppressOptOut", v)}/>
                <div className="meta">
                  <div className="title">
                    Opt-Out Tag
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" style={{ marginLeft: 4, color: "var(--color-fg-secondary)" }}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2 2.2-2.5 3.2"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>
                  </div>
                  <div className="ex">Skip any customer flagged as opted out. Sending anyway destroys trust and risks compliance.</div>
                </div>
              </div>
              <div className="sup-row">
                <Toggle checked={c.suppressRecent} onChange={v => set("suppressRecent", v)}/>
                <div className="meta">
                  <div className="title">
                    Recency window
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" style={{ marginLeft: 4, color: "var(--color-fg-secondary)" }}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2 2.2-2.5 3.2"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>
                  </div>
                  <div className="ex" style={{ marginTop: 6 }}>Don't send if the same customer was surveyed within (X Days)</div>
                  <div className="inline-row" style={{ marginTop: 8, maxWidth: "50%" }}>
                    <input type="number" className="fi-input"
                      value={c.recentDays} onChange={e => set("recentDays", parseInt(e.target.value || 0))}
                      disabled={!c.suppressRecent}/>
                    <span style={{ color: "var(--color-fg-secondary)", fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>Days</span>
                  </div>
                </div>
              </div>
              <div className="sup-row">
                <Toggle checked={true} onChange={() => {}}/>
                <div className="meta">
                  <div className="title">
                    Internal / test interactions
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" style={{ marginLeft: 4, color: "var(--color-fg-secondary)" }}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2 2.2-2.5 3.2"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>
                  </div>
                  <div className="ex">Suppress interactions flagged as internal or test. Hard-coded — QA agents testing IVR flows never generate customer surveys.</div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Volume & Sampling ── */}
          {activeStep === 2 && (
            <div className="wz-step-content">
              <div className="wz-content-card">
              <div className="wz-step-head">
                <h2>Volume & Sampling</h2>
                <p>How many interactions get a survey, & which ones.</p>
              </div>
              <FieldRow label="Sampling %" hint="">
                <div>
                  <input type="range" min="10" max="100" step="5" value={c.samplingPct}
                    style={{ width: "100%", accentColor: "var(--color-fg-active-strong)" }}
                    onChange={e => { set("samplingPct", parseInt(e.target.value)); setSamplingAutofilled(false); }}/>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, font: "400 11px/16px var(--font-sans)", letterSpacing: "0.2px", color: "var(--color-fg-secondary)" }}>
                    {[10,20,30,40,50,60,65,70,75,80,85,90,95,100].map(n => <span key={n}>{n}</span>)}
                  </div>
                </div>
              </FieldRow>
              <div style={{ paddingTop: "var(--space-4)" }}>
                <div className="section-heading" style={{ marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: 4 }}>
                  Interaction Length Filter
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" style={{ color: "var(--color-fg-secondary)", flexShrink: 0 }}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2 2.2-2.5 3.2"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>
                </div>
                <div className="field-grid-2" style={{ borderTop: "none", paddingTop: 0 }}>
                  <div className="field-cell">
                    <label className="field-label">Customer turns greater than</label>
                    <input type="number" className="fi-input" min="0"
                      value={c.minCustomerTurns}
                      onChange={e => set("minCustomerTurns", parseInt(e.target.value || 0))}/>
                  </div>
                  <div className="field-cell">
                    <label className="field-label">Agent turns greater than</label>
                    <input type="number" className="fi-input" min="0"
                      value={c.minAgentTurns}
                      onChange={e => set("minAgentTurns", parseInt(e.target.value || 0))}/>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Intelligence & Survey ── */}
          {activeStep === 3 && (
            <div className="wz-step-content">
              <div className="wz-content-card">
              <div className="wz-step-head">
                <h2>Intelligence & Survey</h2>
                <p>Choose the AI model and survey design for this campaign.</p>
              </div>
              <div className="intel-sub-section">
                {(() => {
                  const activeModel = AI_MODELS.find(m => m.id === c.aiModelId);
                  if (!activeModel) return (
                    <header className="form-section-head no-border" style={{ cursor: "default" }}>
                      <span className="step-num" style={{ display: "flex", fontSize: 0 }}>
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42"/></svg>
                      </span>
                      <div style={{ flex: 1 }}><h3>Topic AI Model</h3><div className="sub">Select an AI model to power your campaign intelligence</div></div>
                      <button className="btn" onClick={() => setModelDrawerOpen(true)}>Choose Topic AI Model →</button>
                    </header>
                  );
                  return (
                    <div className="selected-model-summary">
                      <div className="selected-model-summary-inner">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                            <span style={{ font: "600 15px/22px var(--font-sans)", color: "var(--color-fg-default)", letterSpacing: "-0.01rem" }}>{activeModel.name}</span>
                            {activeModel.badge && <span className="model-badge">{activeModel.badge}</span>}
                          </div>
                          {activeModel.whenToUse && <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}><svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--color-fg-action)" }}><circle cx="7" cy="7" r="6"/><path d="M7 4.5v3l1.8 1.2"/></svg><div><span style={{ font: "500 11px/15px var(--font-sans)", color: "var(--color-fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>When to use  </span><span style={{ font: "400 12px/18px var(--font-sans)", color: "var(--color-fg-secondary)" }}>{activeModel.whenToUse}</span></div></div>}
                          {activeModel.industry && <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)" }}><svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--color-fg-action)" }}><rect x="1" y="6" width="12" height="7" rx="1"/><path d="M5 6V4.5a2.5 2.5 0 0 1 5 0V6"/></svg><div><span style={{ font: "500 11px/15px var(--font-sans)", color: "var(--color-fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry  </span><span style={{ font: "400 12px/18px var(--font-sans)", color: "var(--color-fg-secondary)" }}>{activeModel.industry}</span></div></div>}
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
                          <button className="btn btn-ghost btn-icon-only" title="Remove model" onClick={() => set("aiModelId", "")} style={{ color: "var(--color-fg-secondary)" }}>
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>
                          </button>
                          <button className="btn" onClick={() => setModelDrawerOpen(true)}>Change model</button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="intel-sub-section">
                {(() => {
                  const activeSurvey = SURVEY_DESIGNS.find(s => s.id === c.surveyDesignId);
                  if (!activeSurvey) return (
                    <header className="form-section-head no-border" style={{ cursor: "default" }}>
                      <span className="step-num" style={{ display: "flex", fontSize: 0 }}>
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="1" width="12" height="14" rx="1.5"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="9" y2="11"/></svg>
                      </span>
                      <div style={{ flex: 1 }}><h3>Survey Template</h3><div className="sub">Pick the survey design that will be sent to customers</div></div>
                      <button className="btn" onClick={() => setSurveyDrawerOpen(true)}>Choose Survey Template →</button>
                    </header>
                  );
                  return (
                    <div className="selected-model-summary">
                      <div className="selected-model-summary-inner">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                            <span style={{ font: "600 15px/22px var(--font-sans)", color: "var(--color-fg-default)", letterSpacing: "-0.01rem" }}>{activeSurvey.name}</span>
                            <span style={{ font: "400 12px/18px var(--font-sans)", color: "var(--color-fg-secondary)" }}>· {activeSurvey.category}</span>
                          </div>
                          {activeSurvey.why && <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)" }}><svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--color-fg-action)" }}><circle cx="7" cy="7" r="6"/><path d="M7 4.5v3l1.8 1.2"/></svg><div><span style={{ font: "500 11px/15px var(--font-sans)", color: "var(--color-fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>When to use  </span><span style={{ font: "400 12px/18px var(--font-sans)", color: "var(--color-fg-secondary)" }}>{activeSurvey.why}</span></div></div>}
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
                          <button className="btn btn-ghost btn-icon-only" title="Remove survey" onClick={() => set("surveyDesignId", "")} style={{ color: "var(--color-fg-secondary)" }}>
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>
                          </button>
                          <button className="btn" onClick={() => setSurveyDrawerOpen(true)}>Change survey</button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Summary & Review ── */}
          {activeStep === 4 && (() => {
            const CHANNEL_LABEL = { digital: "Digital", voice: "Voice", email: "Email", sms: "SMS" };
            const aiModel = AI_MODELS?.find(m => m.id === c.aiModelId);
            const survey  = SURVEY_DESIGNS?.find(s => s.id === c.surveyDesignId);
            const SRSection = ({ title, num, onEdit, children }) => (
              <div className="sr-section">
                <div className="sr-section-head">
                  <span className="sr-section-num">{num}</span>
                  <span className="sr-section-title">{title}</span>
                  <button className="btn btn-ghost" style={{ marginLeft: "auto", font: "var(--text-body-sm)", color: "var(--color-fg-action)" }}
                    onClick={() => setActiveStep(num - 1)}>
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M11 3.5a2 2 0 0 1 2.8 2.8L5 15l-3.5.8.8-3.5z"/></svg>
                    Edit
                  </button>
                </div>
                <div className="sr-section-body">{children}</div>
              </div>
            );
            const SRRow = ({ label, children }) => (
              <div className="sr-row">
                <div className="sr-row-label">{label}</div>
                <div className="sr-row-value">{children || <span style={{ color: "var(--color-fg-secondary)" }}>—</span>}</div>
              </div>
            );
            const missingRequired = !c.name || !c.channels?.length || !c.queues?.length;
            return (
              <div className="wz-step-content">
                {/* Header */}
                <div style={{ marginBottom: "var(--space-5)" }}>
                  <h2 className="setup-section-title">Summary &amp; Review</h2>
                  <p className="setup-section-sub">Review every setting before activating. Click Edit on any section to go back.</p>
                </div>

                {missingRequired && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", background: "#fff0f0", border: "1px solid var(--color-status-error)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)", font: "var(--text-body-sm)", color: "var(--color-status-error)" }}>
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
                    Some required fields are incomplete. Return to the relevant steps to fill them in before activating.
                  </div>
                )}

                {selectedTemplate && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-4)", background: "var(--color-bg-active-subtle)", border: "1px solid var(--lyra-brand-200)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)", font: "var(--text-body-sm)", color: "var(--lyra-brand-700)" }}>
                    <svg viewBox="0 0 16 16" width="13" height="13" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="1" width="12" height="14" rx="1.5"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="9" y2="11"/></svg>
                    <span><strong>Template applied:</strong> {selectedTemplate.name}</span>
                  </div>
                )}

                <SRSection title="Template & Identity" num={1}>
                  <SRRow label="Campaign Name">{c.name || <span style={{ color: "var(--color-status-error)" }}>Required</span>}</SRRow>
                  {c.description && <SRRow label="Description">{c.description}</SRRow>}
                  <SRRow label="Active Date Range">
                    {c.startDate ? (c.ongoing ? `Ongoing from ${c.startDate}` : c.endDate ? `${c.startDate} — ${c.endDate}` : c.startDate) : "Not set"}
                  </SRRow>
                  <SRRow label="Channels">
                    {c.channels?.length
                      ? <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                          {c.channels.map(ch => <span key={ch} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ChannelChip kind={ch}/>{CHANNEL_LABEL[ch] || ch}</span>)}
                        </div>
                      : <span style={{ color: "var(--color-status-error)" }}>Required</span>}
                  </SRRow>
                  <SRRow label="Agent Teams">{c.queues?.length ? c.queues.join(", ") : <span style={{ color: "var(--color-status-error)" }}>Required</span>}</SRRow>
                  <SRRow label="Agent Groups">{c.teams?.length ? c.teams.join(", ") : "All groups"}</SRRow>
                  <SRRow label="Language">English</SRRow>
                </SRSection>

                <SRSection title="Suppression Rules" num={2}>
                  <SRRow label="Opt-out tag">{c.suppressOptOut !== false ? "Enabled" : "Disabled"}</SRRow>
                  <SRRow label="Recency window">{c.suppressRecent !== false ? `Enabled · ${c.recentDays ?? 30} days` : "Disabled"}</SRRow>
                </SRSection>

                <SRSection title="Volume & Sampling" num={3}>
                  <SRRow label="Sampling Rate">{c.samplingPct ? `${c.samplingPct}%` : <span style={{ color: "var(--color-fg-secondary)" }}>Not set</span>}</SRRow>
                </SRSection>

                <SRSection title="Intelligence & Survey" num={4}>
                  <SRRow label="Topic AI Model">{aiModel ? aiModel.name : <span style={{ color: "var(--color-fg-secondary)" }}>Not configured</span>}</SRRow>
                  <SRRow label="Survey Template">{survey ? survey.name : <span style={{ color: "var(--color-fg-secondary)" }}>Not configured</span>}</SRRow>
                </SRSection>
              </div>
            );
          })()}

          </div>{/* /form-pane */}

          {/* Right rail summary */}
          <aside className="summary-pane">
            <FloatingMetrics campaign={c}/>
          </aside>
        </div>{/* /wz-body */}
      </div>{/* /wz-scroll-area */}

      {/* ── Back / Next footer — outside scroll area, always visible ── */}
      <div className="wz-footer">
        {activeStep > 0 && (
          <button className="btn" onClick={goBack}>← Back</button>
        )}
        <span style={{ flex: 1 }}/>
        {activeStep < 4 ? (
          <button className="btn primary" onClick={goNext}>
            {activeStep === 3 ? "Review →" : "Next →"}
          </button>
        ) : (
          <>
            <button className="btn" onClick={() => onSave({ ...c, status: "draft" })}>Save as draft</button>
            <button className="btn primary" disabled={!canActivate}
              onClick={() => onSave({ ...c, status: "active" })}>
              Activate Campaign →
            </button>
          </>
        )}
      </div>

      {/* Template drawer */}
      {drawerOpen && ReactDOM.createPortal(
        <div className="tmpl-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="tmpl-drawer" onClick={e => e.stopPropagation()}>
            <div className="tmpl-drawer-head">
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 16px/24px var(--font-sans)", color: "var(--color-fg-default)" }}>Choose a Template</div>
                <div style={{ font: "400 13px/20px var(--font-sans)", color: "var(--color-fg-secondary)", marginTop: 2 }}>
                  Start from a preset — every setting can be customised.
                </div>
              </div>
              <button className="tmpl-drawer-close" onClick={() => setDrawerOpen(false)}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="tmpl-drawer-body">
              <div className="tmpl-drawer-grid">
                {CAMPAIGN_TEMPLATES.map(t => {
                  const col = CATEGORY_COLOR[t.category] || CATEGORY_COLOR["Customer Satisfaction"];
                  const effortCol = EFFORT_COLOR[t.effort];
                  const isSelected = selectedTemplate?.id === t.id;
                  return (
                    <div key={t.id}
                      className={`tmpl-drawer-card ${isSelected ? "selected" : ""}`}
                      onClick={() => pickTemplate(t)}>

                      {/* Zone 1 — Identity */}
                      <div className="tmpl-drawer-card-head">
                        <div className="tmpl-icon-sm" style={{ background: col.bg, color: col.fg }}>
                          {TEMPLATE_ICONS[t.icon]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="tmpl-drawer-card-name">{t.name}</div>
                          <div className="tmpl-drawer-category">{t.category}</div>
                        </div>
                        {isSelected &&
                          <svg viewBox="0 0 16 16" width="16" height="16" stroke="var(--lyra-brand-600)" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="3 8 6.5 12 13 4"/></svg>
                        }
                      </div>

                      {/* Zone 2 — Use when */}
                      <div className="tmpl-drawer-usewhen-block">
                        <div className="tmpl-drawer-zone-label">Use when</div>
                        <p className="tmpl-drawer-why">{t.why}</p>
                      </div>

                      {/* Zone 3 — Topics */}
                      <div className="tmpl-drawer-topics-block">
                        <div className="tmpl-drawer-zone-label">Topics</div>
                        <div className="tmpl-tags" style={{ gap: 4 }}>
                          {t.topics.map(tp => <span key={tp} className="tmpl-tag topic">{tp}</span>)}
                        </div>
                      </div>

                      {/* Zone 4 — Meta footer */}
                      <div className="tmpl-drawer-meta-footer">
                        <div className="tmpl-drawer-meta-row-inner">
                          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, color: "var(--lyra-purple-500)" }}><path d="M6 1v2M6 9v2M1 6h2M9 6h2M2.5 2.5l1.5 1.5M8 8l1.5 1.5M2.5 9.5L4 8M8 4l1.5-1.5"/></svg>
                          <span className="tmpl-drawer-meta-text">{t.aiModel}</span>
                          <span className="tmpl-drawer-meta-dot">·</span>
                          <span className="tmpl-drawer-meta-text">{t.industry}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Model picker drawer */}
      {modelDrawerOpen && ReactDOM.createPortal(
        <ModelPickerDrawer
          currentId={c.aiModelId}
          onClose={() => setModelDrawerOpen(false)}
          onSelect={(id) => { set("aiModelId", id); setModelDrawerOpen(false); }}
        />,
        document.body
      )}

      {/* Survey picker drawer */}
      {surveyDrawerOpen && ReactDOM.createPortal(
        <SurveyPickerDrawer
          currentId={c.surveyDesignId}
          onClose={() => setSurveyDrawerOpen(false)}
          onSelect={(id) => { set("surveyDesignId", id); setSurveyDrawerOpen(false); }}
        />,
        document.body
      )}
    </div>
  );
}

function ModelPickerDrawer({ currentId, onClose, onSelect }) {
  const [query, setQuery] = React.useState("");
  const [pendingId, setPendingId] = React.useState(currentId || "");
  const [expandedId, setExpandedId] = React.useState(null);
  const inputRef = React.useRef(null);
  const rowRefs = React.useRef({});
  const detailsRefs = React.useRef({});

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  React.useEffect(() => {
    if (!expandedId) return;
    const el = detailsRefs.current[expandedId];
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  }, [expandedId]);

  const filtered = query.trim()
    ? AI_MODELS.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : AI_MODELS;

  return (
    <div className="tmpl-drawer-overlay" onClick={onClose}>
      <div className="model-picker-drawer" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="model-picker-head">
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 16px/24px var(--font-sans)", color: "var(--color-fg-default)" }}>Choose AI Model</div>
            <div style={{ font: "400 13px/20px var(--font-sans)", color: "var(--color-fg-secondary)", marginTop: 2 }}>
              Select the model that best fits your campaign goals.
            </div>
          </div>
          <button className="tmpl-drawer-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Search */}
        <div className="model-picker-search-wrap">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ color: "var(--color-fg-secondary)", flexShrink: 0 }}><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>
          <input
            ref={inputRef}
            className="model-picker-search"
            placeholder="Search models by name, tags…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="model-picker-search-clear" onClick={() => setQuery("")}>
              <svg viewBox="0 0 12 12" width="10" height="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
            </button>
          )}
        </div>

        {/* Count */}
        <div className="model-picker-count">
          {filtered.length} model{filtered.length !== 1 ? "s" : ""}
          {query ? ` matching "${query}"` : " available"}
        </div>

        {/* Model list */}
        <div className="model-picker-list">
          {filtered.length === 0 ? (
            <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center", color: "var(--color-fg-secondary)", font: "400 14px/20px var(--font-sans)" }}>
              No models match your search.
            </div>
          ) : filtered.map(m => {
            const isSelected = pendingId === m.id;
            return (
              <div key={m.id}
                ref={el => rowRefs.current[m.id] = el}
                className={`model-picker-row ${isSelected ? "selected" : ""}`}
                onClick={() => setPendingId(m.id)}>
                <div className="model-picker-row-head">
                  <span className={`lyra-radio ${isSelected ? "selected" : ""}`} style={{ marginTop: 2, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                      <span style={{ font: "500 14px/20px var(--font-sans)", color: "var(--color-fg-default)" }}>{m.name}</span>
                      {m.badge && <span className="model-badge">{m.badge}</span>}
                    </div>
                    {m.whenToUse && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginTop: 6 }}>
                        <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--color-fg-action)" }}><circle cx="6" cy="6" r="5"/><path d="M6 4v2.5l1.5 1"/></svg>
                        <span style={{ font: "400 11px/16px var(--font-sans)", color: "var(--color-fg-secondary)" }}>{m.whenToUse}</span>
                      </div>
                    )}
                    {m.industry && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginTop: 4 }}>
                        <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--color-fg-action)" }}><rect x="1" y="5" width="10" height="6" rx="1"/><path d="M4 5V3.5a2 2 0 0 1 4 0V5"/></svg>
                        <span style={{ font: "400 11px/16px var(--font-sans)", color: "var(--color-fg-secondary)" }}>{m.industry}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="model-picker-foot">
          <button className="clear-link" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!pendingId} onClick={() => onSelect(pendingId)}>
            Apply selection
          </button>
        </div>

      </div>
    </div>
  );
}

function SurveyPickerDrawer({ currentId, onClose, onSelect }) {
  const [query, setQuery] = React.useState("");
  const [pendingId, setPendingId] = React.useState(currentId || "");
  const [expandedId, setExpandedId] = React.useState(null);
  const inputRef = React.useRef(null);
  const detailsRefs = React.useRef({});

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  React.useEffect(() => {
    if (!expandedId) return;
    const el = detailsRefs.current[expandedId];
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  }, [expandedId]);

  const filtered = query.trim()
    ? SURVEY_DESIGNS.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase()) ||
        s.why.toLowerCase().includes(query.toLowerCase())
      )
    : SURVEY_DESIGNS;

  return (
    <div className="tmpl-drawer-overlay" onClick={onClose}>
      <div className="model-picker-drawer" onClick={e => e.stopPropagation()}>

        <div className="model-picker-head">
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 16px/24px var(--font-sans)", color: "var(--color-fg-default)" }}>Choose Survey Template</div>
            <div style={{ font: "400 13px/20px var(--font-sans)", color: "var(--color-fg-secondary)", marginTop: 2 }}>
              Select the survey that best matches your campaign's measurement goal.
            </div>
          </div>
          <button className="tmpl-drawer-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="model-picker-search-wrap">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ color: "var(--color-fg-secondary)", flexShrink: 0 }}><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>
          <input
            ref={inputRef}
            className="model-picker-search"
            placeholder="Search surveys by name or category…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="model-picker-search-clear" onClick={() => setQuery("")}>
              <svg viewBox="0 0 12 12" width="10" height="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
            </button>
          )}
        </div>

        <div className="model-picker-count">
          {filtered.length} survey{filtered.length !== 1 ? "s" : ""}
          {query ? ` matching "${query}"` : " available"}
        </div>

        <div className="model-picker-list">
          {filtered.length === 0 ? (
            <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center", color: "var(--color-fg-secondary)", font: "400 14px/20px var(--font-sans)" }}>
              No surveys match your search.
            </div>
          ) : filtered.map(s => {
            const isSelected = pendingId === s.id;
            return (
              <div key={s.id}
                className={`model-picker-row ${isSelected ? "selected" : ""}`}
                onClick={() => setPendingId(s.id)}>
                <div className="model-picker-row-head">
                  <span className={`lyra-radio ${isSelected ? "selected" : ""}`} style={{ marginTop: 2, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-1)" }}>
                      <span style={{ font: "500 14px/20px var(--font-sans)", color: "var(--color-fg-default)" }}>{s.name}</span>
                    </div>
                    {s.why && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginTop: 5 }}>
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--color-fg-action)" }}><circle cx="7" cy="7" r="6"/><path d="M7 4.5v3l1.8 1.2"/></svg>
                        <div>
                          <span style={{ font: "500 11px/15px var(--font-sans)", color: "var(--color-fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>When to use  </span>
                          <span style={{ font: "400 12px/18px var(--font-sans)", color: "var(--color-fg-secondary)" }}>{s.why}</span>
                        </div>
                      </div>
                    )}
                    {s.channels && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginTop: 5 }}>
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--color-fg-action)" }}><path d="M1 4.5C3.5 2 10.5 2 13 4.5"/><path d="M3 7c1.4-1.4 7.6-1.4 8 0"/><path d="M5.5 9.5c.8-.8 2.2-.8 3 0"/><circle cx="7" cy="12" r=".6" fill="currentColor" stroke="none"/></svg>
                        <div>
                          <span style={{ font: "500 11px/15px var(--font-sans)", color: "var(--color-fg-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Channels  </span>
                          <span style={{ font: "400 12px/18px var(--font-sans)", color: "var(--color-fg-secondary)" }}>{s.channels}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="model-picker-foot">
          <button className="clear-link" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!pendingId} onClick={() => onSelect(pendingId)}>
            Apply selection
          </button>
        </div>

      </div>
    </div>
  );
}

/* ============================== Campaign Detail ============================== */

function MiniBar({ data, max, color = "var(--fi-accent)", labels }) {
  const m = max || Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 var(--space-1)" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            width: "100%",
            height: `${(v / m) * 100}%`,
            background: color,
            borderRadius: "4px 4px 0 0",
            minHeight: 2,
            opacity: 0.85,
          }}/>
          <div style={{ font: "400 12px/16px var(--font-sans)", color: "var(--lyra-slate-500)" }}>{labels?.[i]}</div>
        </div>
      ))}
    </div>
  );
}

function DonutRing({ value, max = 100, color = "var(--fi-accent)", size = 96, label, sub }) {
  const r = (size - 14) / 2;
  const C = 2 * Math.PI * r;
  const off = C - (value / max) * C;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--lyra-slate-200)" strokeWidth="10"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ font: "700 20px/24px var(--font-sans)", color: "var(--lyra-slate-900)", letterSpacing: "-0.02em" }}>{label}</div>
        {sub ? <div style={{ font: "500 12px/16px var(--font-sans)", color: "var(--lyra-slate-500)" }}>{sub}</div> : null}
      </div>
    </div>
  );
}

const RECENT_RESPONSES = [
  { id: 1, rating: 1, customer: "C-48201", agent: "Alice Johnson", topic: "Billing dispute", sentiment: "Negative", time: "2m ago", flagged: true, comment: "Agent transferred me 3 times. Still no resolution on the duplicate charge." },
  { id: 2, rating: 5, customer: "C-48198", agent: "Bob Smith",     topic: "Plan upgrade",    sentiment: "Positive", time: "8m ago", flagged: false, comment: "Bob made it painless. Upgrade took 4 minutes." },
  { id: 3, rating: 2, customer: "C-48177", agent: "Charlie Davis", topic: "Modem swap",      sentiment: "Negative", time: "23m ago", flagged: true, comment: "Was promised same-day shipping, but tracking still shows pending." },
  { id: 4, rating: 4, customer: "C-48160", agent: "Diana Evans",   topic: "Address change",  sentiment: "Neutral",  time: "41m ago", flagged: false, comment: "Easy enough. Took a bit longer than I expected." },
  { id: 5, rating: 5, customer: "C-48142", agent: "Ethan Foster",  topic: "Refund inquiry",  sentiment: "Positive", time: "1h ago",  flagged: false, comment: "Ethan went the extra mile to find the missing transaction." },
  { id: 6, rating: 1, customer: "C-48129", agent: "Hannah Hall",   topic: "Service outage",  sentiment: "Negative", time: "1h ago",  flagged: true, comment: "Third outage this month. No credit offered without me asking." },
];

const TOP_TOPICS = [
  { name: "Billing dispute", pct: 24, delta: "+6", trend: "up" },
  { name: "Service outage",  pct: 18, delta: "+3", trend: "up" },
  { name: "Plan upgrade",    pct: 12, delta: "-1", trend: "down" },
  { name: "Address change",  pct: 9,  delta: "0",  trend: "flat" },
  { name: "Refund inquiry",  pct: 8,  delta: "-2", trend: "down" },
];

function Stars({ n, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1, color: "var(--color-rating-star)" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size}
          fill={i <= n ? "currentColor" : "var(--lyra-slate-200)"}>
          <polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9"/>
        </svg>
      ))}
    </span>
  );
}

function FloatingMetrics({ campaign: c }) {
  const CHANNEL_LABEL = { digital: "Digital", voice: "Voice", email: "Email", sms: "SMS" };

  const dateRange = c.startDate
    ? (c.ongoing ? `${c.startDate} — Ongoing` : c.endDate ? `${c.startDate} — ${c.endDate}` : `${c.startDate} — No end date`)
    : "Not set";

  const channels = c.channels?.length
    ? c.channels.map(ch => CHANNEL_LABEL[ch] || ch).join(", ")
    : "Not set";

  const teams = c.teams?.length ? c.teams.join(", ") : "All teams";

  const interactions = c.samplingPct
    ? `${c.samplingPct}% of interactions`
    : "Not configured";

  const surveyHours = c.startTime && c.endTime ? `${c.startTime} – ${c.endTime}` : c.startTime || c.endTime || "Not set";

  const rows = [
    { icon: "calendar", label: "Active date range",      value: dateRange },
    { icon: "clock",    label: "Survey Hours",           value: surveyHours },
    { icon: "channel",  label: "Channel",                value: channels },
    { icon: "agents",   label: "Agent teams",            value: teams },
    { icon: "survey",   label: "Interactions surveyed",  value: interactions },
  ];

  return (
    <div className="summary-card">
      <div className="summary-card-head">Campaign Summary</div>
      <div className="summary-card-rows">
        {rows.map(r => (
          <div key={r.label} className="summary-card-row">
            <div className="summary-card-icon">
              {r.icon === "calendar" && <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="5" y1="1.5" x2="5" y2="4.5"/><line x1="11" y1="1.5" x2="11" y2="4.5"/><line x1="2" y1="7" x2="14" y2="7"/></svg>}
              {r.icon === "clock"    && <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><polyline points="8 5 8 8 10.5 10"/></svg>}
              {r.icon === "channel"  && <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 11.5C2 9.5 3.5 8 5.5 8h5C12.5 8 14 9.5 14 11.5"/><circle cx="8" cy="4.5" r="2.5"/></svg>}
              {r.icon === "agents"   && <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="5" r="2"/><path d="M1 13c0-2.2 1.8-4 4-4h2"/><circle cx="11.5" cy="6" r="2"/><path d="M8 13.5c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5"/></svg>}
              {r.icon === "survey"   && <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="1.5" width="10" height="13" rx="1.5"/><line x1="6" y1="5" x2="10" y2="5"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="8.5" y2="11"/></svg>}
            </div>
            <div className="summary-card-row-body">
              <div className="summary-card-label">{r.label}</div>
              <div className="summary-card-value">{r.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignDetail({ campaign, onBack, onEdit }) {
  const [c, setC] = React.useState(campaign);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const publishWorkingCopy = () => {
    setC({ ...c, hasWorkingCopy: false, publishedVersion: c.workingCopyVersion, publishedAt: "May 13, 2026" });
    setToast({ msg: `Working copy published as v${c.workingCopyVersion}. Campaign is now live with new configuration.` });
  };
  const discardWorkingCopy = () => {
    if (!window.confirm("Discard all unpublished changes? The campaign will return to v" + c.publishedVersion + ".")) return;
    setC({ ...c, hasWorkingCopy: false });
    setToast({ msg: `Working copy discarded. v${c.publishedVersion} remains active.` });
  };

  const routingPos = (() => {
    const routing = CAMPAIGNS.filter(x => x.status === "active" || x.status === "paused");
    const idx = routing.findIndex(x => x.id === c.id);
    return idx >= 0 ? { pos: idx + 1, total: routing.length } : null;
  })();

  return (
    <div className="pane" style={{ overflow: "hidden" }}>
      <div className="crumbs">
        <a href="#" onClick={e => { e.preventDefault(); onBack(); }}>Survey Campaigns</a>
        <span className="sep">/</span>
        <span className="last">{c.name}</span>
      </div>

      {/* Page header — title + action buttons (no inline badges per design) */}
      <div className="pane-head" style={{ paddingTop: 6 }}>
        <h1 style={{ flex: 1, margin: 0 }}>{c.name}</h1>
        <div className="head-actions">
          <button className="btn">
            <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            {c.status === "active" ? "Pause" : "Resume"}
          </button>
          <button className="btn">
            <svg viewBox="0 0 24 24"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
            Duplicate
          </button>
          <button className="btn primary" onClick={() => onEdit(c)}>
            <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            Edit Configuration
          </button>
          <div className="kebab">
            <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
          </div>
        </div>
      </div>

      {/* Meta row — info dot-separated on left, status badges on right */}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-8) var(--space-4)",
      }}>
        <div style={{
          flex: 1,
          fontFamily: "var(--font-sans)",
          fontSize: 14, fontWeight: 400, lineHeight: "20px", letterSpacing: 0,
          color: "var(--color-fg-secondary)",
        }}>
          <strong style={{ color: "var(--color-fg-default)", fontWeight: 500 }}>Owner:</strong> {c.owner}
          <span style={{ margin: "0 var(--space-2)" }}>•</span>
          <strong style={{ color: "var(--color-fg-default)", fontWeight: 500 }}>Created:</strong> {c.created}
          <span style={{ margin: "0 var(--space-2)" }}>•</span>
          <strong style={{ color: "var(--color-fg-default)", fontWeight: 500 }}>Last Updated:</strong> {c.updated}
          {routingPos && (
            <>
              <span style={{ margin: "0 var(--space-2)" }}>•</span>
              <strong style={{ color: "var(--color-fg-default)", fontWeight: 500 }}>Routing Position:</strong> {routingPos.pos} out of {routingPos.total}
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <StatusPill s={c.status}/>
          {c.hasWorkingCopy ? <WorkingCopyChip/> : null}
        </div>
      </div>

      {c.hasWorkingCopy ? (
        <div className="working-banner" style={{ margin: "0 var(--space-8) var(--space-4)" }}>
          <div className="working-banner-ico">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
          </div>
          <div className="working-banner-body">
            <div className="working-banner-title">This campaign has unpublished changes</div>
            <div className="working-banner-sub">
              Active version <strong>v{c.publishedVersion}</strong> (published {c.publishedAt}) continues to run.
              Working copy <strong>v{c.workingCopyVersion}</strong> was edited by {c.workingCopyEditedBy} on {c.workingCopyEditedAt}.
            </div>
          </div>
          <div className="working-banner-actions">
            <button className="btn" onClick={discardWorkingCopy}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              Discard Changes
            </button>
            <button className="btn primary" onClick={publishWorkingCopy}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 13 10 19 20 5"/></svg>
              Publish V{c.workingCopyVersion}
            </button>
          </div>
        </div>
      ) : null}

      <div className="detail-layout">
        <div className="detail-main">
          <ConfigurationView campaign={c}/>
        </div>
        <aside className="detail-sidebar">
          <CampaignSummaryCard campaign={c}/>
        </aside>
      </div>
      {toast ? (
        <div className="toast">
          <svg viewBox="0 0 24 24"><polyline points="4 13 10 19 20 5"/></svg>
          {toast.msg}
        </div>
      ) : null}
    </div>
  );
}

/* Campaign Summary sidebar card */
function CampaignSummaryCard({ campaign: c }) {
  const isLive = c.status === "active" || c.status === "paused";

  /* ── Live metrics (active / paused campaigns) ── */
  const metricRows = [
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="2 10 6 6 9 9 14 4"/></svg>,
      label: "Response Rate", value: c.responseRate || "31%", highlight: true,
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="1.5" width="10" height="13" rx="1.5"/><line x1="6" y1="5" x2="10" y2="5"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="8.5" y2="11"/></svg>,
      label: "Total Surveys Sent", value: c.totalSurveys ? c.totalSurveys.toLocaleString() : "2,847",
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="2 11 6 7 9 10 14 5"/><line x1="14" y1="5" x2="14" y2="9"/><line x1="14" y1="5" x2="10" y2="5"/></svg>,
      label: "Completed Responses", value: c.completedResponses ? c.completedResponses.toLocaleString() : "882",
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5"/></svg>,
      label: "Avg. Completion Time", value: c.avgCompletionTime || "1m 42s",
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.2l-3.7 2.1.7-4.1-3-2.9 4.2-.7z"/></svg>,
      label: "Avg. CSAT Score", value: c.avgCsat || "4.2 / 5",
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="5" y1="1.5" x2="5" y2="4.5"/><line x1="11" y1="1.5" x2="11" y2="4.5"/><line x1="2" y1="7" x2="14" y2="7"/></svg>,
      label: "Last Survey Sent", value: c.lastSurveySent || "Today, 9:41 AM",
    },
  ];

  /* ── Config info (draft / ended campaigns) ── */
  const CHANNEL_LABEL = { digital: "Digital", voice: "Voice", email: "Email", sms: "SMS" };
  const channels = c.channels?.length ? c.channels.map(ch => CHANNEL_LABEL[ch] || ch).join(", ") : "Not set";
  const teams = c.queues?.length ? c.queues.join(", ") : "All teams";
  const dateRange = c.startDate
    ? (c.ongoing ? `Ongoing from ${c.startDate}` : c.endDate ? `${c.startDate} — ${c.endDate}` : `${c.startDate} — No end date`)
    : "Not set";

  const configRows = [
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="5" y1="1.5" x2="5" y2="4.5"/><line x1="11" y1="1.5" x2="11" y2="4.5"/><line x1="2" y1="7" x2="14" y2="7"/></svg>,
      label: "Active Date Range", value: dateRange,
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 11.5C2 9.5 3.5 8 5.5 8h5C12.5 8 14 9.5 14 11.5"/><circle cx="8" cy="4.5" r="2.5"/></svg>,
      label: "Channel", value: channels,
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="5" r="2"/><path d="M1 13c0-2.2 1.8-4 4-4h2"/><circle cx="11.5" cy="6" r="2"/><path d="M8 13.5c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5"/></svg>,
      label: "Agent Teams", value: teams,
    },
    {
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5"/></svg>,
      label: "Sampling Rate", value: c.samplingPct ? `${c.samplingPct}%` : "—",
    },
  ];

  const rows = isLive ? metricRows : configRows;
  const headLabel = isLive ? "Live Metrics" : "Campaign Summary";

  return (
    <div className="detail-summary-card">
      <div className="detail-summary-head">
        {isLive
          ? <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="2 10 6 6 9 9 14 4"/></svg>
          : <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>
        }
        {headLabel}
        {isLive && <span className="detail-summary-live-dot"/>}
      </div>
      <div className="detail-summary-rows">
        {rows.map(r => (
          <div key={r.label} className={`detail-summary-row${r.highlight ? " highlight" : ""}`}>
            <div className="detail-summary-ico">{r.icon}</div>
            <div className="detail-summary-body">
              <div className="detail-summary-label">{r.label}</div>
              <div className="detail-summary-value">{r.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* DefRow — read-only label/value row inside a config section.
   Matches the design: "Label:" on left at 200px width, value on right with the
   regular Lyra Body-md weight; rows separated by border/subtle. */
function DefRow({ label, children }) {
  return (
    <div className="def-row">
      <div className="def-row-label">{label}</div>
      <div className="def-row-value">{children}</div>
    </div>
  );
}

/* ConfigGroup — collapsible accordion card for read-only display. */
function ConfigGroup({ title, num, children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className={`cfg-group${open ? "" : " cfg-group--closed"}`}>
      <header className="cfg-group-head" onClick={() => setOpen(!open)}>
        <span className="cfg-group-num">{num}</span>
        <span className="cfg-group-title">{title}</span>
        <svg className="cfg-group-chev" viewBox="0 0 16 16">
          <path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </header>
      {open && <div className="cfg-group-body">{children}</div>}
    </section>
  );
}

function ConfigurationView({ campaign: c }) {
  const CHANNEL_LABEL = { digital: "Digital", voice: "Voice", email: "Email", sms: "SMS" };
  const channels = c.channels?.length ? c.channels : ["digital", "voice"];
  const dateRange = c.startDate
    ? (c.ongoing ? `Ongoing from ${c.startDate}` : c.endDate ? `${c.startDate} — ${c.endDate}` : `${c.startDate} — No end date`)
    : "Ongoing from " + c.created;

  const aiModel = AI_MODELS?.find(m => m.id === c.aiModelId);
  const survey  = SURVEY_DESIGNS?.find(s => s.id === c.surveyDesignId);

  return (
    <div className="cfg-group-stack">
      {/* Step 0 mirror: Template & Identity */}
      <ConfigGroup num="1" title="Campaign Identity & Scope">
        <DefRow label="Campaign Name">{c.name}</DefRow>
        {c.description && <DefRow label="Description">{c.description}</DefRow>}
        <DefRow label="Active Date Range">{dateRange}</DefRow>
        <DefRow label="Channels">
          <div className="channel-stack" style={{ gap: "var(--space-3)" }}>
            {channels.map(ch => (
              <span key={ch} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ChannelChip kind={ch}/> {CHANNEL_LABEL[ch] || ch}
              </span>
            ))}
          </div>
        </DefRow>
        <DefRow label="Agent Teams">{c.queues?.length ? c.queues.join(", ") : "All teams"}</DefRow>
        <DefRow label="Agent Groups">{c.teams?.length ? c.teams.join(", ") : "All groups"}</DefRow>
        <DefRow label="Language">English</DefRow>
      </ConfigGroup>

      {/* Step 1 mirror: Suppression Rules */}
      <ConfigGroup num="2" title="Suppression Rules">
        <DefRow label="Opt-out tag">{c.suppressOptOut !== false ? "Enabled" : "Disabled"}</DefRow>
        <DefRow label="Recency window">
          {c.suppressRecent !== false ? `Enabled · ${c.recentDays ?? 30} days` : "Disabled"}
        </DefRow>
      </ConfigGroup>

      {/* Step 2 mirror: Volume & Sampling */}
      <ConfigGroup num="3" title="Volume & Sampling">
        <DefRow label="Sampling Rate">
          {c.samplingPct ? `${c.samplingPct}%` : "Not set"}
          {c.samplingPct ? ` — approx. ${Math.round(c.samplingPct * 0.4)} interactions / day` : ""}
        </DefRow>
      </ConfigGroup>

      {/* Step 3 mirror: Intelligence & Survey */}
      <ConfigGroup num="4" title="Intelligence & Survey">
        <DefRow label="Topic AI Model">
          {aiModel ? aiModel.name : <span style={{ color: "var(--color-fg-secondary)" }}>Not configured</span>}
        </DefRow>
        <DefRow label="Survey Template">
          {survey ? survey.name : <span style={{ color: "var(--color-fg-secondary)" }}>Not configured</span>}
        </DefRow>
      </ConfigGroup>
    </div>
  );
}

/* ======================= Campaign Template Picker ========================= */

const CAMPAIGN_TEMPLATES = [
  {
    id: "t-csat-chat",
    name: "Post-Chat CSAT",
    tagline: "Measure satisfaction right after a digital conversation ends.",
    icon: "chat",
    category: "Customer Satisfaction",
    bestFor: ["Chat & messaging", "Tier 1 support", "High-volume digital"],
    topics: ["Resolution quality", "Agent friendliness", "Response time"],
    channels: ["digital"],
    suggestedSampling: 50,
    avgCompletion: "28–34%",
    popularity: 92,
    effort: "Low",
    effortDetail: "Ready in minutes — just name it and pick your team.",
    why: "The single most deployed survey type. Catches satisfaction signals while the interaction is fresh.",
    aiModel: "VU Score Model",
    industry: "All industries",
  },
  {
    id: "t-sentiment",
    name: "Negative Sentiment Catcher",
    tagline: "Auto-target interactions where the AI detected frustration or dissatisfaction.",
    icon: "sentiment",
    category: "Sentiment Recovery",
    bestFor: ["All digital channels", "Escalation-prone queues", "Retention teams"],
    topics: ["Complaint handling", "Escalation rate", "Brand perception"],
    channels: ["digital"],
    suggestedSampling: 100,
    avgCompletion: "26–30%",
    popularity: 78,
    effort: "Low",
    effortDetail: "Plug in your sentiment threshold and go.",
    why: "Surfaces at-risk customers before they churn. Pairs well with a recovery workflow.",
    aiModel: "VU Score Model",
    industry: "All industries",
  },
  {
    id: "t-resolution",
    name: "Email Resolution Quality",
    tagline: "Evaluate whether email interactions actually solved the customer's problem.",
    icon: "email",
    category: "Quality Assurance",
    bestFor: ["Email support", "Back-office queues", "Complex case resolution"],
    topics: ["First-contact resolution", "Accuracy of response", "Follow-up needed"],
    channels: ["digital"],
    suggestedSampling: 25,
    avgCompletion: "20–26%",
    popularity: 65,
    effort: "Medium",
    effortDetail: "Needs a survey design with FCR question — 10 min setup.",
    why: "Email has the lowest natural survey response rate. A focused short survey beats a generic CSAT.",
    aiModel: "VU Score Model",
    industry: "Financial services · Healthcare · Telecom",
  },
  {
    id: "t-bot",
    name: "Bot Handoff Audit",
    tagline: "Track how well your AI agent hands off to a human — and what customers think of the transition.",
    icon: "bot",
    category: "AI Quality",
    bestFor: ["Bot-to-human handoffs", "Cognigy / virtual agent flows", "Self-service improvement"],
    topics: ["Bot containment", "Handoff smoothness", "Issue understood by agent"],
    channels: ["digital"],
    suggestedSampling: 80,
    avgCompletion: "18–24%",
    popularity: 71,
    effort: "Medium",
    effortDetail: "Works best when you tag bot-originating interactions in your routing.",
    why: "Reveals where your virtual agent is losing confidence. Essential for teams investing in AI-first CX.",
    aiModel: "VU Score Model",
    industry: "Technology · Telecom · Retail",
  },
  {
    id: "t-brand",
    name: "Brand Health Pulse",
    tagline: "Lightweight periodic check-in on brand perception and loyalty across social DMs.",
    icon: "brand",
    category: "Brand & Loyalty",
    bestFor: ["Social media DMs", "Long-term customers", "Marketing-aligned support"],
    topics: ["Net Promoter Score", "Brand sentiment", "Likelihood to recommend"],
    channels: ["digital"],
    suggestedSampling: 100,
    avgCompletion: "14–20%",
    popularity: 54,
    effort: "Low",
    effortDetail: "Short NPS-style survey — minimal config needed.",
    why: "Social DM customers tend to be highly engaged. Their opinions carry outsized brand weight.",
    aiModel: "VU Score Model",
    industry: "Retail · E-commerce · Media",
  },
  {
    id: "t-vip",
    name: "VIP Escalation Follow-Up",
    tagline: "A personalised follow-up survey for high-value customers after an escalation is resolved.",
    icon: "vip",
    category: "Retention",
    bestFor: ["VIP / high-value accounts", "Post-escalation", "Executive-level complaints"],
    topics: ["Satisfaction with resolution", "Relationship recovery", "Likelihood to stay"],
    channels: ["digital"],
    suggestedSampling: 100,
    avgCompletion: "35–45%",
    popularity: 60,
    effort: "High",
    effortDetail: "Requires VIP tagging in your contact centre platform.",
    why: "VIP customers have the highest churn risk and highest revenue impact. A personal touch after an escalation converts detractors.",
    aiModel: "VU Score Model",
    industry: "Financial services · Enterprise · Luxury",
  },
];

const TEMPLATE_ICONS = {
  chat: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2v4l-5-4H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
      <circle cx="10" cy="13" r="1" fill="currentColor" stroke="none"/>
      <circle cx="14" cy="13" r="1" fill="currentColor" stroke="none"/>
      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  sentiment: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11"/>
      <path d="M11 20s1.5-2 5-2 5 2 5 2"/>
      <circle cx="12" cy="13" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="20" cy="13" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  email: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="24" height="17" rx="2"/>
      <path d="M4 10l12 8 12-8"/>
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="11" width="18" height="14" rx="3"/>
      <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="20" cy="18" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M13 22h6"/>
      <path d="M16 11V7"/>
      <circle cx="16" cy="6" r="1.5"/>
      <path d="M3 17h4M25 17h4"/>
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l3 7h7l-5.5 4.5 2 7L16 19l-6.5 3.5 2-7L6 11h7z"/>
    </svg>
  ),
  vip: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 5 20 14 29 15.5 22 22l2 9-8-4.5L8 31l2-9-7-6.5L12 14z"/>
    </svg>
  ),
};

const EFFORT_COLOR = {
  Low:    { bg: "var(--lyra-green-50)",    fg: "var(--lyra-green-700)" },
  Medium: { bg: "rgba(236,112,0,0.08)",    fg: "var(--lyra-orange-700)" },
  High:   { bg: "var(--lyra-red-50)",      fg: "var(--lyra-red-600)" },
};

const CATEGORY_COLOR = {
  "Customer Satisfaction": { bg: "var(--color-bg-active-subtle)", fg: "var(--color-fg-active-strong)" },
  "Sentiment Recovery":    { bg: "rgba(120,86,186,0.08)",         fg: "var(--lyra-purple-700)" },
  "Quality Assurance":     { bg: "rgba(0,104,137,0.08)",          fg: "var(--lyra-teal-500)" },
  "AI Quality":            { bg: "rgba(120,86,186,0.08)",         fg: "var(--lyra-purple-700)" },
  "Brand & Loyalty":       { bg: "rgba(248,161,10,0.10)",         fg: "var(--lyra-yellow-700)" },
  "Retention":             { bg: "var(--lyra-green-50)",          fg: "var(--lyra-green-700)" },
};

function CompactTemplateCard({ template: t, selected, onUse }) {
  const iconColor = CATEGORY_COLOR[t.category] || CATEGORY_COLOR["Customer Satisfaction"];
  const effortColor = EFFORT_COLOR[t.effort];
  return (
    <div className={`tmpl-card-compact ${selected ? "selected" : ""}`} onClick={() => onUse(t)}>
      <div className="tmpl-icon-sm" style={{ background: iconColor.bg, color: iconColor.fg }}>
        {TEMPLATE_ICONS[t.icon]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "500 13px/18px var(--font-sans)", color: "var(--color-fg-default)" }}>{t.name}</div>
        <div style={{ font: "400 12px/16px var(--font-sans)", color: "var(--color-fg-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.why}</div>
      </div>
      <span className="tmpl-effort-badge" style={{ background: effortColor.bg, color: effortColor.fg, flexShrink: 0 }}>{t.effort}</span>
    </div>
  );
}

function TemplateCard({ template, onUse }) {
  const iconColor = CATEGORY_COLOR[template.category] || CATEGORY_COLOR["Customer Satisfaction"];
  const effortColor = EFFORT_COLOR[template.effort];

  return (
    <div className="tmpl-card">
      {/* Header: icon + category + name */}
      <div className="tmpl-card-top">
        <div className="tmpl-icon" style={{ background: iconColor.bg, color: iconColor.fg }}>
          {TEMPLATE_ICONS[template.icon]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tmpl-category" style={{ color: iconColor.fg }}>{template.category}</div>
          <div className="tmpl-name">{template.name}</div>
        </div>
        <span className="tmpl-effort-badge" style={{ background: effortColor.bg, color: effortColor.fg }}>
          {template.effort} setup
        </span>
      </div>

      {/* Use when — the primary decision signal for quality managers */}
      <div className="tmpl-use-when">
        <span className="tmpl-use-when-label">Use when</span>
        <span className="tmpl-use-when-text">{template.why}</span>
      </div>

      {/* Interaction types */}
      <div className="tmpl-tags-section">
        <div className="tmpl-tags-label">Interaction types</div>
        <div className="tmpl-tags">
          {template.bestFor.map(t => (
            <span key={t} className="tmpl-tag interaction">{t}</span>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="tmpl-tags-section">
        <div className="tmpl-tags-label">Measures</div>
        <div className="tmpl-tags">
          {template.topics.map(t => (
            <span key={t} className="tmpl-tag topic">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer: sampling hint + CTA */}
      <div className="tmpl-card-foot">
        <span className="tmpl-foot-hint">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6"/><path d="M8 5v3"/><circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none"/>
          </svg>
          {template.suggestedSampling}% sampling · {template.avgCompletion} completion
        </span>
        <button className="tmpl-use-btn" onClick={() => onUse(template)}>
          Use template
          <svg viewBox="0 0 16 16" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function CampaignTemplatePicker({ onSelect, onSkip }) {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState(null);

  const categories = Array.from(new Set(CAMPAIGN_TEMPLATES.map(t => t.category)));

  const filtered = CAMPAIGN_TEMPLATES.filter(t => {
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.bestFor.some(b => b.toLowerCase().includes(q)) ||
        t.topics.some(tp => tp.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="pane" style={{ background: "var(--lyra-slate-100)", overflow: "auto" }}>
      {/* Page header */}
      <div className="pane-head" style={{ background: "var(--lyra-white)", borderBottom: "1px solid var(--color-border-subtle)", padding: "var(--space-4) var(--space-6)" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>Choose a Campaign Template</h1>
          <p style={{ margin: "var(--space-1) 0 0", font: "400 14px/20px var(--font-sans)", color: "var(--color-fg-secondary)" }}>
            Start from a template — we'll pre-fill the settings. You can customise everything before activating.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={onSkip}>
            Start from scratch
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap",
        padding: "var(--space-3) var(--space-6)",
        background: "var(--lyra-white)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}>
        <div className="search" style={{ maxWidth: 280 }}>
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            className={`tmpl-filter-pill ${!categoryFilter ? "on" : ""}`}
            onClick={() => setCategoryFilter(null)}>
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`tmpl-filter-pill ${categoryFilter === cat ? "on" : ""}`}
              onClick={() => setCategoryFilter(c => c === cat ? null : cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div style={{ padding: "var(--space-5) var(--space-6)" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-12) 0", color: "var(--lyra-slate-500)", font: "400 14px/20px var(--font-sans)" }}>
            No templates match your search.{" "}
            <button className="clear-link" onClick={() => { setSearch(""); setCategoryFilter(null); }}>Clear filters</button>
          </div>
        ) : (
          <div className="tmpl-grid">
            {filtered.map(t => (
              <TemplateCard key={t.id} template={t} onUse={onSelect}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SurveyCampaignsGrid, CreateCampaign, CampaignDetail, ChannelChip, StatusPill, Sparkline, CAMPAIGNS, WorkingCopyChip, FilterChip, CampaignTemplatePicker });
