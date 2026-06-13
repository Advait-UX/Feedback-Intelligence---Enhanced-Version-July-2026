import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  ChevronDown,
} from 'lucide-react'
import type { Campaign } from '@/lib/campaigns'

/* ============================================================
 * Campaign Operations — Level 3 operational drill-down for a campaign
 * Funnel · suppression · VU tier mix · per-question landing
 * Reached from the FI Dashboard's "View campaign operations" link.
 * ============================================================ */

const FONT = 'var(--lyra-font-sans)'

export function CampaignMonitorPage({
  campaign,
  onBack,
}: {
  campaign?: Campaign
  onBack: () => void
}) {
  const [showInsights, setShowInsights] = useState(true)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--lyra-color-bg-surface-canvas)', fontFamily: FONT }}
    >
      <Header
        campaign={campaign}
        onBack={onBack}
        showInsights={showInsights}
        onToggleInsights={() => setShowInsights(v => !v)}
      />
      <div
        className="flex-1"
        style={{
          padding: 'var(--space-6) var(--space-7) var(--space-7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-7)',
        }}
      >
        <FilterRow />
        <HeroKpis />

        <SectionHeader
          eyebrow="Section 1"
          title="Delivery & funnel health"
          subtitle="Is the campaign reaching the customers it should be reaching, on the channels it should be reaching them on?"
        />
        <div className="grid grid-cols-3" style={{ gap: 'var(--space-5)' }}>
          <FunnelCard className="col-span-2" />
          <SuppressionCard />
        </div>
        <ChannelHealthCard />
        {showInsights && (
          <InsightBlock
            headline="AI Agent handoff is leaking opens — Cognigy template likely falling silent"
            bullets={[
              'Delivered-to-opened drop on AI Agent channel is 44% — 25pp worse than SMS (82%) and WhatsApp (78%)',
              'No other channel shows this pattern; the gap is isolated to Cognigy handoff',
              'Likely cause: survey lands in the chat session as a message without a prompt to act',
            ]}
            impact={[
              'Restoring AI Agent opens to channel parity would recover ~290 responses per week',
              'Closes a silent failure mode that won\'t show up in any agent-level QA metric',
            ]}
            action="Inspect Cognigy handoff template — add a prompt/cue when the survey link is sent"
          />
        )}

        <SectionHeader
          eyebrow="Section 2"
          title="VU & topic signal quality"
          subtitle="Are we surveying interactions worth surveying, or is the campaign drifting toward low-urgency noise?"
        />
        <div className="grid grid-cols-3" style={{ gap: 'var(--space-5)' }}>
          <VuTierMixCard className="col-span-2" />
          <TopTopicsCard />
        </div>
        <VuDriftCard />
        {showInsights && (
          <InsightBlock
            headline="Call transfer impact is up 24% — it wasn't in the original campaign brief"
            bullets={[
              'Call transfer impact now generates ~210/week at avg VU 33',
              'Topic was not a primary trigger when the campaign was launched 14 days ago',
              'It is currently firing because transferred-call interactions are tagged with Flight Disruption upstream',
            ]}
            impact={[
              'Promoting transfer impact to a primary trigger could yield a more focused survey question set',
              'Alternatively, splitting it into its own campaign isolates the signal for routing improvements',
            ]}
            action="Promote 'Call transfer impact' to a primary trigger, or split into its own campaign"
          />
        )}

        <SectionHeader
          eyebrow="Section 3"
          title="Response & question performance"
          subtitle="Once the survey lands, do customers engage with it — and are the AI-generated questions doing their job?"
        />
        <ResponseCompletionCard />
        <QuestionLandingCard />
        {showInsights && (
          <InsightBlock
            headline='"Was the compensation offered reasonable?" is killing completion'
            bullets={[
              '26% of respondents abandon at this question — 2–3× the rate of every other question in this campaign',
              'Answer rate (52%) and validation alignment (64%) are also the lowest in the survey',
              'Phrasing implies an accusatory frame; respondents who feel under-compensated drop rather than respond',
            ]}
            impact={[
              'Softer phrasing variants in similar campaigns recover 12–18pp on completion',
              'Improved validation alignment means more usable signal per completed survey',
            ]}
            action='Test softer variant: "How fairly were you compensated for the disruption?"'
          />
        )}
      </div>
    </div>
  )
}

/* ---------- Header ---------- */
function Header({
  campaign,
  onBack,
  showInsights,
  onToggleInsights,
}: {
  campaign?: Campaign
  onBack: () => void
  showInsights: boolean
  onToggleInsights: () => void
}) {
  // Defaults preserve the demo story if no campaign is wired through
  const name = campaign?.name ?? 'Flight Disruption Recovery'
  const version = campaign?.version ?? 'v2.1'

  const statusLabel =
    campaign?.status === 'paused'
      ? 'Paused'
      : campaign?.status === 'draft'
      ? 'Draft'
      : campaign?.status === 'ended'
      ? 'Ended'
      : 'Active'

  const statusBg =
    campaign?.status === 'paused' ? 'var(--lyra-color-status-warning-subtle)'
    : campaign?.status === 'draft'  ? 'var(--lyra-slate-100)'
    : campaign?.status === 'ended'  ? 'var(--lyra-slate-200)'
    : 'var(--lyra-color-status-success-subtle)'

  const statusText =
    campaign?.status === 'paused' ? 'var(--lyra-color-status-warning-strong)'
    : campaign?.status === 'draft'  ? 'var(--lyra-slate-600)'
    : campaign?.status === 'ended'  ? 'var(--lyra-slate-500)'
    : 'var(--lyra-color-status-success-strong)'

  const statusBorder =
    campaign?.status === 'paused' ? 'rgba(142,104,0,0.18)'
    : campaign?.status === 'draft'  ? 'rgba(0,0,0,0.10)'
    : campaign?.status === 'ended'  ? 'rgba(0,0,0,0.10)'
    : 'rgba(35,114,45,0.18)'

  const days = campaign?.daysRunning ?? 14
  const channels = campaign?.channels?.join(' · ') ?? 'SMS · WhatsApp · AI Agent (Cognigy)'
  const trigger = campaign?.trigger ?? 'Flight Disruption OR Baggage Claim, VU ≥ 32'

  return (
    <div
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        borderBottom: '1px solid var(--lyra-color-border-subtle)',
        padding: 'var(--space-4) var(--space-7)',
        fontFamily: FONT,
      }}
    >
      <div className="flex items-center justify-between" style={{ gap: 'var(--space-4)' }}>
        <div className="flex items-start" style={{ gap: 'var(--space-4)' }}>
          <button
            onClick={onBack}
            className="mt-1 inline-flex items-center transition-colors"
            style={{
              gap: 'var(--space-1)',
              borderRadius: 'var(--radius-md)',
              padding: '4px 8px',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: FONT,
              color: 'var(--lyra-color-fg-secondary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--lyra-color-state-bg-hover-opacity)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--lyra-color-fg-default)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--lyra-color-fg-secondary)'
            }}
            onFocus={e => {
              (e.currentTarget as HTMLButtonElement).style.outline = '2px solid var(--lyra-color-border-focus-default)'
              ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px'
            }}
            onBlur={e => {
              (e.currentTarget as HTMLButtonElement).style.outline = 'none'
            }}
            title="Back to campaign dashboard"
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back to dashboard
          </button>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--lyra-slate-600)',
                marginBottom: 4,
                fontFamily: FONT,
              }}
            >
              Campaign operations
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                lineHeight: '28px',
                letterSpacing: '-0.02em',
                color: 'var(--lyra-color-fg-default)',
                fontFamily: FONT,
                margin: 0,
              }}
            >
              {name}{' '}
              <span style={{ color: 'var(--lyra-color-fg-disabled)', fontWeight: 500 }}>{version}</span>
            </h1>
            <div className="flex items-center" style={{ gap: 'var(--space-2)', marginTop: 8 }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  borderRadius: 'var(--radius-full)', padding: '2px 8px',
                  fontSize: 12, fontWeight: 500, lineHeight: '16px', letterSpacing: '0.01em',
                  fontFamily: FONT, whiteSpace: 'nowrap',
                  background: statusBg, color: statusText,
                  border: `1px solid ${statusBorder}`,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                {statusLabel}
              </span>
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>{days} days running</span>
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>{channels}</span>
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>Trigger: {trigger}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onToggleInsights}
          className="inline-flex items-center transition-colors"
          style={{
            gap: 6,
            borderRadius: 'var(--radius-md)',
            border: showInsights
              ? '1px solid var(--lyra-brand-200)'
              : '1px solid var(--lyra-color-border-soft)',
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 500,
            fontFamily: FONT,
            cursor: 'pointer',
            outline: 'none',
            background: showInsights
              ? 'var(--lyra-color-bg-ai)'
              : 'var(--lyra-color-bg-surface-base)',
            color: showInsights ? '#4E39A8' : 'var(--lyra-color-fg-secondary)',
          }}
          onFocus={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = '2px solid var(--lyra-color-border-focus-default)'
            ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px'
          }}
          onBlur={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = 'none'
          }}
          title={showInsights ? 'Hide AI insights' : 'Reveal AI insights'}
        >
          <Sparkles
            style={{ width: 14, height: 14, color: showInsights ? '#4E39A8' : 'var(--lyra-color-fg-secondary)' }}
            fill={showInsights ? '#4E39A8' : 'none'}
          />
          {showInsights ? 'Insights on' : 'Insights off'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Filter row ---------- */
function FilterRow() {
  const filters = ['Last 14 days', 'All channels', 'Compare: prior period']
  return (
    <div
      className="flex items-center justify-between"
      style={{
        background: 'var(--lyra-color-bg-surface-shell)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
      }}
    >
      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
        {filters.map(label => (
          <select
            key={label}
            style={{
              height: 32,
              padding: '0 32px 0 12px',
              background: 'var(--lyra-color-bg-surface-base)',
              border: '1px solid var(--lyra-color-border-soft)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: FONT,
              color: 'var(--lyra-color-fg-default)',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M6%208L2%204h8z%22%2F%3E%3C%2Fsvg%3E')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center right 10px',
            }}
          >
            <option>{label}</option>
          </select>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', fontFamily: FONT }}>
        Jun 1, 2026 · 09:14 · Auto-refresh 5m
      </div>
    </div>
  )
}

/* ---------- Section header ---------- */
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div style={{ paddingTop: 8, fontFamily: FONT }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--lyra-slate-600)',
          marginBottom: 4,
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          lineHeight: '24px',
          letterSpacing: '-0.01em',
          color: 'var(--lyra-color-fg-default)',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--lyra-color-fg-secondary)',
          marginTop: 4,
          maxWidth: '42rem',
          lineHeight: '20px',
          margin: '4px 0 0',
        }}
      >
        {subtitle}
      </p>
    </div>
  )
}

/* ---------- Hero KPIs ---------- */
type HeroKpi = {
  label: string
  value: string
  delta: { arrow: '↑' | '↓' | '→'; text: string; tone: 'up' | 'down' | 'flat' }
  note: string
  emphasis?: 'positive' | 'caution'
}

const HERO_KPIS: HeroKpi[] = [
  {
    label: 'Eligible interactions',
    value: '4,820',
    delta: { arrow: '↑', text: '+12%', tone: 'up' },
    note: 'Top of funnel — trigger rules are firing',
  },
  {
    label: 'Surveys sent',
    value: '1,810',
    delta: { arrow: '↑', text: '+8%', tone: 'up' },
    note: 'Net of suppression + 50% B-tier sampling',
  },
  {
    label: 'Response rate',
    value: '67%',
    delta: { arrow: '↑', text: '+6pp', tone: 'up' },
    note: '11.6pp above org baseline (55.4%)',
    emphasis: 'positive',
  },
  {
    label: 'Avg VU of triggered',
    value: '38',
    delta: { arrow: '↓', text: '−4', tone: 'down' },
    note: 'Drift — sampling lower-urgency interactions',
    emphasis: 'caution',
  },
]

function HeroKpis() {
  return (
    <div className="grid grid-cols-4" style={{ gap: 'var(--space-5)' }}>
      {HERO_KPIS.map(k => (
        <HeroKpiCard key={k.label} kpi={k} />
      ))}
    </div>
  )
}

function HeroKpiCard({ kpi }: { kpi: HeroKpi }) {
  // positive emphasis → brand blue; caution → AI purple (used here as a data metric color, not a feature color)
  // Using brand tokens for positive, and status-warning for caution to stay Lyra-compliant
  const valueColor =
    kpi.emphasis === 'positive'
      ? 'var(--lyra-brand-600)'
      : kpi.emphasis === 'caution'
      ? 'var(--lyra-color-status-warning-strong)'
      : 'var(--lyra-color-fg-default)'
  const deltaColor =
    kpi.delta.tone === 'up'
      ? 'var(--lyra-color-status-success-strong)'
      : kpi.delta.tone === 'down'
      ? 'var(--lyra-color-status-critical-strong)'
      : 'var(--lyra-color-fg-secondary)'

  return (
    <div
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        padding: 'var(--space-5) var(--space-6)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--lyra-color-fg-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 8,
          lineHeight: 1,
        }}
      >
        {kpi.label}
      </div>
      <div className="flex items-baseline" style={{ gap: 'var(--space-3)', marginBottom: 8 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: valueColor,
          }}
        >
          {kpi.value}
        </div>
        <div
          className="flex items-center"
          style={{ gap: 4, fontSize: 12, fontWeight: 600, lineHeight: 1, color: deltaColor }}
        >
          <span>{kpi.delta.arrow}</span>
          <span>{kpi.delta.text}</span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', lineHeight: '16px' }}>{kpi.note}</div>
    </div>
  )
}

/* ---------- Funnel card (Section 1) ---------- */
type FunnelStage = {
  label: string
  count: number
  // Conversion from previous stage; null for the top stage
  conv?: number
  // 'expected' = intended drop (e.g. sampling), 'leak' = unintended drop, 'healthy' = small drop
  tone?: 'expected' | 'leak' | 'healthy'
  // Hover hint about which rule caused the drop
  rule?: string
}

const FUNNEL_STAGES: FunnelStage[] = [
  { label: 'Eligible', count: 4820, tone: 'healthy', rule: 'Matched trigger rules' },
  { label: 'Not suppressed', count: 4723, conv: 0.98, tone: 'healthy', rule: 'Passed all 4 suppression rules' },
  { label: 'Sampled', count: 2361, conv: 0.5, tone: 'expected', rule: 'Sampling: 100% A+/A · 50% B · 0% C/D' },
  { label: 'Sent', count: 1810, conv: 0.77, tone: 'healthy', rule: 'Delivery throttling + channel capacity' },
  { label: 'Delivered', count: 1612, conv: 0.89, tone: 'healthy', rule: 'Provider delivery confirmation' },
  { label: 'Opened', count: 1210, conv: 0.75, tone: 'leak', rule: 'Open tracking · pixel / link click' },
  { label: 'Started', count: 1114, conv: 0.92, tone: 'healthy', rule: 'Any question answered' },
  { label: 'Completed', count: 780, conv: 0.7, tone: 'healthy', rule: 'All required questions answered' },
]

function FunnelCard({ className = '' }: { className?: string }) {
  const top = FUNNEL_STAGES[0].count
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
          End-to-end funnel
        </h3>
        <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
          Each stage shows count and conversion from the previous stage
        </p>
      </div>
      <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FUNNEL_STAGES.map(stage => {
          const widthPct = (stage.count / top) * 100
          // Lyra-compliant bar colors using status tokens
          const barColor =
            stage.tone === 'leak'
              ? 'var(--lyra-color-status-warning-subtle)'
              : stage.tone === 'expected'
              ? 'var(--lyra-brand-100)'
              : 'var(--lyra-brand-50)'
          const barAccent =
            stage.tone === 'leak'
              ? 'var(--lyra-color-status-warning-strong)'
              : stage.tone === 'expected'
              ? 'var(--lyra-brand-600)'
              : 'var(--lyra-brand-500)'
          const convColor =
            stage.tone === 'leak'
              ? 'var(--lyra-color-status-warning-strong)'
              : stage.tone === 'expected'
              ? 'var(--lyra-brand-700)'
              : 'var(--lyra-color-status-success-strong)'

          return (
            <div key={stage.label} className="group">
              <div className="flex items-baseline justify-between" style={{ marginBottom: 4 }}>
                <div className="flex items-center" style={{ gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)' }}>
                    {stage.label}
                  </span>
                  {stage.tone === 'leak' && (
                    <span
                      className="inline-flex items-center"
                      style={{
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--lyra-color-status-warning-subtle)',
                        padding: '2px 6px',
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'var(--lyra-color-status-warning-strong)',
                      }}
                    >
                      leak
                    </span>
                  )}
                  {stage.tone === 'expected' && (
                    <span
                      className="inline-flex items-center"
                      style={{
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--lyra-brand-50)',
                        padding: '2px 6px',
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'var(--lyra-brand-700)',
                      }}
                    >
                      by rule
                    </span>
                  )}
                </div>
                <div className="flex items-center" style={{ gap: 12, fontSize: 12 }}>
                  <span style={{ color: 'var(--lyra-color-fg-default)', fontWeight: 600 }} className="tabular-nums">
                    {stage.count.toLocaleString()}
                  </span>
                  {stage.conv !== undefined && (
                    <span style={{ fontWeight: 600, color: convColor }} className="tabular-nums">
                      {Math.round(stage.conv * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div
                className="relative overflow-hidden"
                style={{
                  height: 24,
                  background: 'var(--lyra-color-bg-surface-shell)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: barColor,
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{ width: 3, backgroundColor: barAccent }}
                />
              </div>
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', marginTop: 2 }}
              >
                {stage.rule}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Suppression breakdown (Section 1) ---------- */
// Using brand and slate primitives for donut segments — these are data/chart colors
const SUPPRESSION_ROWS = [
  { reason: 'Opt-out recency', count: 51, color: 'var(--lyra-brand-600)', rule: 'Customer surveyed in last 30 days' },
  { reason: 'Open complaint', count: 28, color: 'var(--lyra-brand-500)', rule: 'Active case in CXone' },
  { reason: 'Recency window', count: 12, color: 'var(--lyra-brand-300)', rule: 'Customer opted out in last 60 days' },
  { reason: 'Internal interaction', count: 6, color: 'var(--lyra-brand-100)', rule: 'Agent-to-agent transfer' },
]

// Resolved hex values for SVG stroke (SVG cannot consume CSS variables)
const SUPPRESSION_HEX_COLORS = ['#166cca', '#3d81e7', '#72a6e8', '#cfe0f8']

function SuppressionCard() {
  const total = SUPPRESSION_ROWS.reduce((sum, r) => sum + r.count, 0)
  const radius = 56
  const stroke = 18
  const circumference = 2 * Math.PI * radius

  let offset = 0
  const arcs = SUPPRESSION_ROWS.map((r, i) => {
    const pct = r.count / total
    const dash = pct * circumference
    const arc = { dash, gap: circumference - dash, offset, color: SUPPRESSION_HEX_COLORS[i] }
    offset -= dash
    return arc
  })

  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
          Suppression breakdown
        </h3>
        <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
          Why {total} eligible interactions were dropped
        </p>
      </div>
      <div
        className="flex flex-col items-center"
        style={{ padding: 'var(--space-5) var(--space-6)', gap: 'var(--space-4)' }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#eef0f2" strokeWidth={stroke} />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeDasharray={`${a.dash} ${a.gap}`}
              strokeDashoffset={a.offset}
              transform="rotate(-90 80 80)"
              strokeLinecap="butt"
            />
          ))}
          <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="600" fill="rgba(0,0,0,0.8)">
            {total}
          </text>
          <text x="80" y="92" textAnchor="middle" fontSize="10" fill="rgba(0,0,0,0.3)" letterSpacing="0.5">
            SUPPRESSED
          </text>
        </svg>
        <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SUPPRESSION_ROWS.map((r, i) => (
            <div key={r.reason} className="flex items-center" style={{ gap: 8 }}>
              <span
                className="flex-shrink-0"
                style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', backgroundColor: SUPPRESSION_HEX_COLORS[i] }}
              />
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-default)', flex: 1 }} className="truncate">
                {r.reason}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--lyra-color-fg-default)' }} className="tabular-nums">
                {r.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Channel health (Section 1) ---------- */
type ChannelHealth = {
  channel: string
  sent: number
  delivered: number
  opened: number
  completed: number
  flag?: 'open-leak'
}

const CHANNELS: ChannelHealth[] = [
  { channel: 'SMS', sent: 920, delivered: 870, opened: 712, completed: 478 },
  { channel: 'WhatsApp', sent: 540, delivered: 522, opened: 408, completed: 264 },
  { channel: 'AI Agent (Cognigy)', sent: 350, delivered: 220, opened: 90, completed: 38, flag: 'open-leak' },
]

function ChannelHealthCard() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
          Send health by channel
        </h3>
        <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
          Funnel performance per delivery channel · flags isolate where opens are leaking
        </p>
      </div>
      <div className="grid grid-cols-3" style={{ gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)' }}>
        {CHANNELS.map(c => {
          const openRate = c.opened / c.delivered
          const completionRate = c.completed / c.opened
          const isLeak = c.flag === 'open-leak'
          return (
            <div
              key={c.channel}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: isLeak
                  ? '1px solid var(--lyra-color-status-warning-medium)'
                  : '1px solid var(--lyra-color-border-subtle)',
                background: isLeak ? 'var(--lyra-color-status-warning-subtle)' : 'var(--lyra-color-bg-surface-canvas)',
                padding: 'var(--space-3) var(--space-4)',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)' }}>{c.channel}</span>
                {isLeak && (
                  <span
                    className="inline-flex items-center"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--lyra-color-status-warning-subtle)',
                      border: '1px solid var(--lyra-color-status-warning-medium)',
                      padding: '2px 6px',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--lyra-color-status-warning-strong)',
                    }}
                  >
                    open leak
                  </span>
                )}
              </div>
              <ChannelBar label="Sent" value={c.sent} max={c.sent} colorToken="var(--lyra-brand-100)" />
              <ChannelBar label="Delivered" value={c.delivered} max={c.sent} colorToken="var(--lyra-brand-200)" />
              <ChannelBar
                label="Opened"
                value={c.opened}
                max={c.sent}
                colorToken={isLeak ? 'var(--lyra-color-status-warning-medium)' : 'var(--lyra-brand-400)'}
                rateLabel={`${Math.round(openRate * 100)}% of delivered`}
              />
              <ChannelBar
                label="Completed"
                value={c.completed}
                max={c.sent}
                colorToken="var(--lyra-brand-700)"
                rateLabel={`${Math.round(completionRate * 100)}% of opened`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChannelBar({
  label,
  value,
  max,
  colorToken,
  rateLabel,
}: {
  label: string
  value: number
  max: number
  colorToken: string
  rateLabel?: string
}) {
  const pct = (value / max) * 100
  return (
    <div style={{ marginBottom: 8 }} className="last:mb-0">
      <div className="flex items-baseline justify-between" style={{ marginBottom: 2 }}>
        <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)' }}>{label}</span>
        <div className="flex items-baseline" style={{ gap: 8 }}>
          {rateLabel && <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)' }}>{rateLabel}</span>}
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--lyra-color-fg-default)' }} className="tabular-nums">
            {value}
          </span>
        </div>
      </div>
      <div
        className="overflow-hidden"
        style={{ height: 6, background: 'var(--lyra-color-bg-surface-shell)', borderRadius: 'var(--radius-full)' }}
      >
        <div
          className="h-full"
          style={{ width: `${pct}%`, backgroundColor: colorToken, borderRadius: 'var(--radius-full)' }}
        />
      </div>
    </div>
  )
}

/* ---------- VU tier mix (Section 2) ---------- */
// Chart data colors — using brand scale for ordered data
const VU_TIERS = [
  { tier: 'A+', label: 'Critical', range: '≥ 50', pct: 18, count: 868, colorToken: 'var(--lyra-brand-800)', hexColor: '#164479' },
  { tier: 'A', label: 'High', range: '35–49', pct: 34, count: 1639, colorToken: 'var(--lyra-brand-600)', hexColor: '#166cca' },
  { tier: 'B', label: 'Medium', range: '25–34', pct: 41, count: 1976, colorToken: 'var(--lyra-brand-400)', hexColor: '#4896ec' },
  { tier: 'C', label: 'Standard', range: '20–24', pct: 6, count: 289, colorToken: 'var(--lyra-brand-200)', hexColor: '#a6c6f0' },
  { tier: 'D', label: 'Low', range: '< 20', pct: 1, count: 48, colorToken: 'var(--lyra-brand-100)', hexColor: '#cfe0f8' },
]

function VuTierMixCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
            VU grade-tier mix
          </h3>
          <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
            How the 4,820 triggered interactions split across urgency tiers
          </p>
        </div>
        <span
          className="inline-flex items-center"
          style={{
            gap: 6,
            borderRadius: 'var(--radius-full)',
            background: 'var(--lyra-brand-50)',
            border: '1px solid var(--lyra-brand-200)',
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--lyra-brand-700)',
          }}
        >
          Sampling: A+/A 100% · B 50% · C/D 0%
        </span>
      </div>
      <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
        <div
          className="flex overflow-hidden"
          style={{ height: 36, borderRadius: 'var(--radius-md)', marginBottom: 16 }}
        >
          {VU_TIERS.map(t => (
            <div
              key={t.tier}
              className="flex items-center justify-center"
              style={{
                width: `${t.pct}%`,
                backgroundColor: t.hexColor,
                fontSize: 12,
                fontWeight: 600,
                color: t.pct >= 34 ? 'var(--lyra-color-fg-inverse)' : 'var(--lyra-brand-800)',
              }}
              title={`${t.tier} (${t.label}) — ${t.count.toLocaleString()} interactions`}
            >
              {t.pct >= 6 ? `${t.pct}%` : ''}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5" style={{ gap: 8 }}>
          {VU_TIERS.map(t => (
            <div
              key={t.tier}
              style={{
                borderRadius: 'var(--radius-md)',
                background: 'var(--lyra-color-bg-surface-canvas)',
                border: '1px solid var(--lyra-color-border-subtle)',
                padding: '8px 10px',
              }}
            >
              <div className="flex items-center" style={{ gap: 6 }}>
                <span
                  className="flex-shrink-0"
                  style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', backgroundColor: t.hexColor }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--lyra-color-fg-default)' }}>{t.tier}</span>
                <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)' }}>{t.range}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', marginTop: 2 }}>{t.label}</div>
              <div
                style={{ fontSize: 14, fontWeight: 600, color: 'var(--lyra-color-fg-default)', marginTop: 4 }}
                className="tabular-nums"
              >
                {t.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Top topics (Section 2) ---------- */
type TopicRow = {
  topic: string
  volume: number
  avgVu: number
  delta: { tone: 'up' | 'flat' | 'down'; text: string }
  flag?: 'rising'
}

const TOPICS: TopicRow[] = [
  { topic: 'Refund processing', volume: 412, avgVu: 41, delta: { tone: 'up', text: '+18%' } },
  { topic: 'Baggage claim', volume: 388, avgVu: 39, delta: { tone: 'flat', text: '→' } },
  { topic: 'Flight disruption', volume: 360, avgVu: 44, delta: { tone: 'down', text: '−6%' } },
  { topic: 'Call transfer impact', volume: 210, avgVu: 33, delta: { tone: 'up', text: '+24%' }, flag: 'rising' },
  { topic: 'Booking change', volume: 180, avgVu: 28, delta: { tone: 'down', text: '−9%' } },
  { topic: 'Payment gateway timeout', volume: 95, avgVu: 36, delta: { tone: 'flat', text: '→' } },
]

function TopTopicsCard() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
          Top topics surfacing
        </h3>
        <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
          Topics firing the trigger · ranked by volume
        </p>
      </div>
      <div>
        {TOPICS.map(t => {
          const deltaColor =
            t.delta.tone === 'up'
              ? 'var(--lyra-color-status-success-strong)'
              : t.delta.tone === 'down'
              ? 'var(--lyra-color-status-critical-strong)'
              : 'var(--lyra-color-fg-disabled)'
          const Icon = t.delta.tone === 'up' ? TrendingUp : t.delta.tone === 'down' ? TrendingDown : Minus
          return (
            <div
              key={t.topic}
              className="flex items-center"
              style={{
                padding: '10px var(--space-6)',
                gap: 12,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center" style={{ gap: 6 }}>
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)' }}
                    className="truncate"
                  >
                    {t.topic}
                  </span>
                  {t.flag === 'rising' && (
                    <span
                      className="inline-flex items-center"
                      style={{
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--lyra-color-status-success-subtle)',
                        padding: '2px 6px',
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'var(--lyra-color-status-success-strong)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      not in brief
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', marginTop: 2 }} className="tabular-nums">
                  {t.volume.toLocaleString()} · avg VU {t.avgVu}
                </div>
              </div>
              <div className="flex items-center" style={{ gap: 4, color: deltaColor }}>
                <Icon style={{ width: 14, height: 14 }} />
                <span style={{ fontSize: 12, fontWeight: 600 }} className="tabular-nums">
                  {t.delta.text}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- VU drift line (Section 2) ---------- */
const VU_DRIFT: number[] = [42, 41, 42, 40, 41, 39, 40, 39, 38, 37, 38, 37, 36, 38]

function VuDriftCard() {
  const width = 800
  const height = 140
  const padding = { top: 12, right: 16, bottom: 24, left: 32 }
  const cw = width - padding.left - padding.right
  const ch = height - padding.top - padding.bottom
  const min = 30
  const max = 50
  const xs = (i: number) => padding.left + (i / (VU_DRIFT.length - 1)) * cw
  const ys = (v: number) => padding.top + ch - ((v - min) / (max - min)) * ch

  const linePath = useMemo(() => {
    const pts = VU_DRIFT.map((v, i) => ({ x: xs(i), y: ys(v) }))
    let path = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return path
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const yTicks = [30, 40, 50]

  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
            Average VU over campaign
          </h3>
          <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
            Drift signal — declining trend = campaign sampling lower-urgency interactions
          </p>
        </div>
        <div className="flex items-center" style={{ gap: 8, fontSize: 12, color: 'var(--lyra-color-fg-disabled)' }}>
          <span>14 days</span>
          <span>·</span>
          <span style={{ color: 'var(--lyra-color-status-critical-strong)', fontWeight: 600 }}>−4 net</span>
        </div>
      </div>
      <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
        {/* VU drift line uses brand-600 (#166cca) instead of indigo/violet */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="vu-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#166cca" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#166cca" stopOpacity="0" />
            </linearGradient>
          </defs>
          {yTicks.map(t => (
            <g key={t}>
              <line
                x1={padding.left}
                y1={ys(t)}
                x2={width - padding.right}
                y2={ys(t)}
                stroke="#d2d8db"
                strokeDasharray="3 5"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={ys(t) + 4} textAnchor="end" fill="#a8b3bb" fontSize="10">
                {t}
              </text>
            </g>
          ))}
          <path
            d={`${linePath} L ${xs(VU_DRIFT.length - 1)} ${ys(min)} L ${xs(0)} ${ys(min)} Z`}
            fill="url(#vu-area)"
          />
          <path d={linePath} fill="none" stroke="#166cca" strokeWidth="2" strokeLinecap="round" />
          {VU_DRIFT.map((v, i) => (
            <circle key={i} cx={xs(i)} cy={ys(v)} r="2.5" fill="#166cca" />
          ))}
          {[0, 6, 13].map(i => (
            <text key={i} x={xs(i)} y={height - 6} textAnchor="middle" fill="#a8b3bb" fontSize="10">
              {i === 0 ? 'Day 1' : i === 13 ? 'Today' : 'Day 7'}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

/* ---------- Response & completion funnel (Section 3) ---------- */
function ResponseCompletionCard() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
          Response & completion
        </h3>
        <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
          From survey delivery to a fully completed response
        </p>
      </div>
      <div className="grid grid-cols-4" style={{ gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)' }}>
        <ResponseStat label="Opens" value="1,210" rate="75%" of="of delivered" />
        <ResponseStat label="Started" value="1,114" rate="92%" of="of opened" />
        <ResponseStat label="Completed" value="780" rate="70%" of="of started" />
        <ResponseStat label="Avg time to complete" value="1m 42s" rate="" of="" />
      </div>
    </div>
  )
}

function ResponseStat({ label, value, rate, of }: { label: string; value: string; rate: string; of: string }) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        background: 'var(--lyra-color-bg-surface-canvas)',
        border: '1px solid var(--lyra-color-border-subtle)',
        padding: 'var(--space-3) var(--space-4)',
        fontFamily: FONT,
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', marginBottom: 4 }}>{label}</div>
      <div className="flex items-baseline" style={{ gap: 8 }}>
        <span
          style={{ fontSize: 22, fontWeight: 600, color: 'var(--lyra-color-fg-default)' }}
          className="tabular-nums"
        >
          {value}
        </span>
        {rate && (
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--lyra-brand-600)' }}>{rate}</span>
        )}
      </div>
      {of && <div style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', marginTop: 2 }}>{of}</div>}
    </div>
  )
}

/* ---------- Per-question landing (Section 3) ---------- */
type QuestionRow = {
  question: string
  uses: number
  answerRate: number
  avgLength: string
  abandon: number
  validation: number | null
  flag?: 'kill-step'
}

const QUESTIONS: QuestionRow[] = [
  {
    question: 'How frustrating was the rebooking process for you?',
    uses: 612,
    answerRate: 88,
    avgLength: '24 words',
    abandon: 4,
    validation: 91,
  },
  {
    question: 'Did the agent acknowledge the disruption upfront?',
    uses: 588,
    answerRate: 84,
    avgLength: '12 words',
    abandon: 6,
    validation: 86,
  },
  {
    question: 'What would have made the resolution easier?',
    uses: 502,
    answerRate: 71,
    avgLength: '41 words',
    abandon: 9,
    validation: null,
  },
  {
    question: 'How likely are you to fly with us again?',
    uses: 480,
    answerRate: 79,
    avgLength: '1 (rating)',
    abandon: 2,
    validation: 82,
  },
  {
    question: 'Was the compensation offered reasonable?',
    uses: 145,
    answerRate: 52,
    avgLength: '8 words',
    abandon: 26,
    validation: 64,
    flag: 'kill-step',
  },
]

function QuestionLandingCard() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--lyra-color-bg-surface-base)',
        border: '1px solid var(--lyra-color-border-soft)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--sol-effect-shadowmd)',
        fontFamily: FONT,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--lyra-color-border-subtle)',
        }}
      >
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', lineHeight: '18px', margin: 0 }}>
            Per-question landing
          </h3>
          <p style={{ fontSize: 12, color: 'var(--lyra-color-fg-disabled)', lineHeight: '16px', marginTop: 2, marginBottom: 0 }}>
            AI-generated question variants clustered semantically · top 5 by usage
          </p>
        </div>
        {/* AI badge — uses AI color treatment per Lyra spec */}
        <span
          className="inline-flex items-center"
          style={{
            gap: 6,
            borderRadius: 'var(--radius-full)',
            background: 'var(--lyra-color-bg-ai)',
            border: '1px solid #4E39A8',
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 500,
            color: '#4E39A8',
          }}
        >
          <Sparkles style={{ width: 12, height: 12 }} fill="#4E39A8" />
          AI-generated per interaction
        </span>
      </div>
      <table className="w-full" style={{ fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <th
              scope="col"
              className="text-left"
              style={{
                padding: '10px var(--space-6)',
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--lyra-color-fg-secondary)',
                background: 'transparent',
              }}
            >
              Question variant
            </th>
            <th
              scope="col"
              className="text-right"
              style={{
                padding: '10px var(--space-4)',
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--lyra-color-fg-secondary)',
                background: 'transparent',
              }}
            >
              Used in
            </th>
            <th
              scope="col"
              className="text-right"
              style={{
                padding: '10px var(--space-4)',
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--lyra-color-fg-secondary)',
                background: 'transparent',
              }}
            >
              Answer rate
            </th>
            <th
              scope="col"
              className="text-right"
              style={{
                padding: '10px var(--space-4)',
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--lyra-color-fg-secondary)',
                background: 'transparent',
              }}
            >
              Avg length
            </th>
            <th
              scope="col"
              className="text-right"
              style={{
                padding: '10px var(--space-4)',
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--lyra-color-fg-secondary)',
                background: 'transparent',
              }}
            >
              Abandon
            </th>
            <th
              scope="col"
              className="text-right"
              style={{
                padding: '10px var(--space-6)',
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--lyra-color-fg-secondary)',
                background: 'transparent',
              }}
            >
              Validation alignment
            </th>
          </tr>
        </thead>
        <tbody>
          {QUESTIONS.map(q => {
            const isKill = q.flag === 'kill-step'
            return (
              <tr
                key={q.question}
                style={{
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  background: isKill ? 'var(--lyra-color-status-warning-subtle)' : 'transparent',
                }}
              >
                <td style={{ padding: 'var(--space-3) var(--space-6)' }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span style={{ fontSize: 14, color: 'var(--lyra-color-fg-default)' }}>"{q.question}"</span>
                    {isKill && (
                      <span
                        className="inline-flex items-center"
                        style={{
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--lyra-color-status-warning-subtle)',
                          border: '1px solid var(--lyra-color-status-warning-medium)',
                          padding: '2px 6px',
                          fontSize: 12,
                          fontWeight: 500,
                          color: 'var(--lyra-color-status-warning-strong)',
                        }}
                      >
                        kill step
                      </span>
                    )}
                  </div>
                </td>
                <td
                  className="text-right tabular-nums"
                  style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--lyra-color-fg-default)' }}
                >
                  {q.uses}
                </td>
                <td className="text-right tabular-nums" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                  <span
                    style={{
                      color:
                        q.answerRate < 70
                          ? 'var(--lyra-color-status-critical-strong)'
                          : 'var(--lyra-color-fg-default)',
                      fontWeight: q.answerRate < 70 ? 600 : 400,
                    }}
                  >
                    {q.answerRate}%
                  </span>
                </td>
                <td
                  className="text-right tabular-nums"
                  style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--lyra-color-fg-secondary)' }}
                >
                  {q.avgLength}
                </td>
                <td className="text-right tabular-nums" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                  <span
                    style={{
                      color:
                        q.abandon >= 15
                          ? 'var(--lyra-color-status-critical-strong)'
                          : 'var(--lyra-color-fg-default)',
                      fontWeight: q.abandon >= 15 ? 600 : 400,
                    }}
                  >
                    {q.abandon}%
                  </span>
                </td>
                <td className="text-right tabular-nums" style={{ padding: 'var(--space-3) var(--space-6)' }}>
                  {q.validation === null ? (
                    <span style={{ color: 'var(--lyra-color-fg-disabled)' }}>n/a (open)</span>
                  ) : (
                    <span
                      style={{
                        color:
                          q.validation < 75
                            ? 'var(--lyra-color-status-critical-strong)'
                            : 'var(--lyra-color-fg-default)',
                        fontWeight: q.validation < 75 ? 600 : 400,
                      }}
                    >
                      {q.validation}%
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Reusable AI insight block ---------- */
type Status = 'pending' | 'done' | 'dismissed'
const TODAY = 'Jun 1'

function InsightBlock({
  headline,
  bullets,
  impact,
  action,
}: {
  headline: string
  bullets: string[]
  impact: string[]
  action: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<Status>('pending')

  if (status === 'done') {
    return (
      <div
        className="flex items-center"
        style={{
          borderRadius: 'var(--radius-lg)',
          background: 'var(--lyra-color-status-success-subtle)',
          border: '1px solid var(--lyra-color-status-success-medium)',
          padding: '8px 12px',
          gap: 8,
          fontFamily: FONT,
        }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 16,
            height: 16,
            borderRadius: 'var(--radius-full)',
            background: 'var(--lyra-color-status-success-strong)',
          }}
        >
          <Check style={{ width: 10, height: 10, color: 'white' }} strokeWidth={3} />
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--lyra-color-status-success-strong)',
          }}
        >
          Done · {TODAY}
        </span>
        <span
          style={{ fontSize: 12, color: 'var(--lyra-color-status-success-strong)', flex: 1 }}
          className="truncate"
        >
          · {action}
        </span>
        <button
          onClick={() => setStatus('pending')}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--lyra-color-status-success-strong)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: FONT,
          }}
        >
          Undo
        </button>
      </div>
    )
  }
  if (status === 'dismissed') {
    return (
      <div
        className="flex items-center"
        style={{
          borderRadius: 'var(--radius-lg)',
          background: 'var(--lyra-color-bg-surface-shell)',
          border: '1px solid var(--lyra-color-border-soft)',
          padding: '8px 12px',
          gap: 8,
          fontFamily: FONT,
        }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 16,
            height: 16,
            borderRadius: 'var(--radius-full)',
            background: 'var(--lyra-color-fg-disabled)',
          }}
        >
          <X style={{ width: 10, height: 10, color: 'white' }} strokeWidth={3} />
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--lyra-color-fg-disabled)',
            flex: 1,
          }}
        >
          Dismissed · {TODAY}
        </span>
        <button
          onClick={() => setStatus('pending')}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--lyra-color-fg-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: FONT,
          }}
        >
          Undo
        </button>
      </div>
    )
  }

  // AI insight block — uses AI color treatment per Lyra spec
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--lyra-color-bg-ai)',
        border: '1px solid #4E39A8',
        fontFamily: FONT,
      }}
    >
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left transition-colors"
        style={{
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          fontFamily: FONT,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(78,57,168,0.06)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        }}
        onFocus={e => {
          (e.currentTarget as HTMLButtonElement).style.outline = '2px solid var(--lyra-color-border-focus-default)'
          ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px'
        }}
        onBlur={e => {
          (e.currentTarget as HTMLButtonElement).style.outline = 'none'
        }}
      >
        <Sparkles
          style={{ width: 14, height: 14, color: '#4E39A8', flexShrink: 0, marginTop: 2 }}
          fill="#4E39A8"
        />
        <div className="flex-1">
          <p style={{ fontSize: 14, fontWeight: 600, color: '#4E39A8', lineHeight: '20px', margin: 0 }}>
            {headline}
          </p>
          <span
            className="inline-flex items-center"
            style={{ fontSize: 12, fontWeight: 500, color: '#4E39A8', marginTop: 4, gap: 4 }}
          >
            <ChevronDown
              style={{
                width: 12,
                height: 12,
                transition: 'transform 150ms',
                transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
              strokeWidth={2.5}
            />
            {expanded ? 'Hide insight & action' : 'See insight & action'}
          </span>
        </div>
      </button>
      {expanded && (
        <div
          style={{
            borderTop: '1px solid rgba(78,57,168,0.2)',
            padding: '12px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start" style={{ gap: 6, fontSize: 12, color: '#4E39A8', lineHeight: '16px' }}>
                <span style={{ color: '#4E39A8', fontWeight: 600, flexShrink: 0 }}>•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ paddingTop: 8, borderTop: '1px solid rgba(78,57,168,0.2)' }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--lyra-color-fg-secondary)',
                marginBottom: 4,
              }}
            >
              Expected impact
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {impact.map((b, i) => (
                <li key={i} className="flex items-start" style={{ gap: 6, fontSize: 12, color: 'var(--lyra-color-fg-default)', lineHeight: '16px' }}>
                  <span style={{ color: 'var(--lyra-color-status-success-strong)', fontWeight: 600, flexShrink: 0 }}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ paddingTop: 8, borderTop: '1px solid rgba(78,57,168,0.2)' }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#4E39A8',
                marginBottom: 6,
              }}
            >
              Recommended action
            </div>
            <p style={{ fontSize: 12, color: '#4E39A8', marginBottom: 8, lineHeight: '16px', margin: '0 0 8px' }}>{action}</p>
            <div className="flex items-center" style={{ gap: 6 }}>
              <button
                onClick={() => setStatus('done')}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--lyra-color-fg-on-primary)',
                  background: 'var(--lyra-color-bg-primary)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '4px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: FONT,
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--lyra-color-state-bg-hover-primary)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--lyra-color-bg-primary)'
                }}
                onFocus={e => {
                  (e.currentTarget as HTMLButtonElement).style.outline = '2px solid var(--lyra-color-border-focus-default)'
                  ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px'
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLButtonElement).style.outline = 'none'
                }}
              >
                Approve
              </button>
              <button
                onClick={() => setStatus('dismissed')}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--lyra-color-fg-secondary)',
                  background: 'var(--lyra-color-bg-surface-base)',
                  border: '1px solid var(--lyra-color-border-soft)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: FONT,
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--lyra-color-state-bg-hover-opacity)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--lyra-color-fg-default)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--lyra-color-bg-surface-base)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--lyra-color-fg-secondary)'
                }}
                onFocus={e => {
                  (e.currentTarget as HTMLButtonElement).style.outline = '2px solid var(--lyra-color-border-focus-default)'
                  ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px'
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLButtonElement).style.outline = 'none'
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
