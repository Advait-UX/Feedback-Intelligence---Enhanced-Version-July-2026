import { useState, useMemo, useEffect, useRef, createContext, useContext } from 'react'
import { Sparkles, Check, X, Pencil, ChevronDown, ArrowLeft } from 'lucide-react'
import type { Campaign, CampaignStatus } from '@/lib/campaigns'
import type { Topic } from '@/lib/topics'
import { getSurveysForCampaign } from '@/lib/surveys'
import { TopicsTable } from './TopicsTable'
import { SurveysList } from './SurveysList'

/* ── Lyra design token aliases (keep all color/font/radius in one place) ── */
const F = 'var(--lyra-font-sans)'
// Foreground
const FG         = 'var(--lyra-color-fg-default)'       // rgba(0,0,0,80%)
const FG_SEC     = 'var(--lyra-color-fg-secondary)'     // rgba(0,0,0,60%)
const FG_DIS     = 'var(--lyra-color-fg-disabled)'      // rgba(0,0,0,30%)
const FG_LINK    = 'var(--lyra-color-fg-link)'          // #185BA4
const FG_ACTIVE  = 'var(--lyra-color-fg-active-strong)' // #185BA4
// Background
const BG_BASE    = 'var(--lyra-color-bg-surface-base)'  // #FFF
const BG_SHELL   = 'var(--lyra-color-bg-surface-shell)' // #F5F7F9
const BG_HOVER   = 'var(--lyra-color-state-bg-hover-opacity)'
// Border
const BD_SOFT    = 'var(--lyra-color-border-soft)'
const BD_SUBTLE  = 'var(--lyra-color-border-subtle)'
const BD_FOCUS   = 'var(--lyra-color-border-focus-default)'
// Status
const S_SUC_BG   = 'var(--lyra-color-status-success-subtle)'
const S_SUC_FG   = 'var(--lyra-color-status-success-strong)'
const S_WARN_BG  = 'var(--lyra-color-status-warning-subtle)'
const S_WARN_FG  = 'var(--lyra-color-status-warning-strong)'
const S_CRIT_BG  = 'var(--lyra-color-status-critical-subtle)'
const S_CRIT_FG  = 'var(--lyra-color-status-critical-strong)'
// Brand
const BRAND_600  = 'var(--lyra-brand-600)'  // #166CCA — interactive accent
const BRAND_700  = 'var(--lyra-brand-700)'  // #185BA4
// AI (Lyra spec: purple-700 = #4E39A8)
const AI_BG      = 'var(--lyra-color-bg-ai)'  // rgba(143,115,227,4%)
const AI_COLOR   = '#4E39A8'                   // --lyra-purple-700
const AI_BORDER  = 'rgba(78,57,168,0.18)'
// Radius
const R_SM  = 'var(--radius-sm)'
const R_MD  = 'var(--radius-md)'
const R_LG  = 'var(--radius-lg)'
const R_XL  = 'var(--radius-xl)'
const R_FULL = 'var(--radius-full)'
// Shadows
const SH_SM = 'var(--sol-effect-shadowsm)'
const SH_MD = 'var(--sol-effect-shadowmd)'
const SH_LG = 'var(--sol-effect-shadowlg)'

/* ── CSAT badge — ≥70 blue · 50–69 orange · <50 red · black text ── */
function CsatBadge({ value }: { value: number | string | null | undefined }) {
  if (value == null || value === '—') return <span style={{ color: FG_SEC, fontSize: 14, fontFamily: F }}>—</span>
  const num = typeof value === 'string' ? parseInt(value, 10) : value
  const bg = num >= 70
    ? 'var(--lyra-color-status-info-subtle)'
    : num >= 50
    ? 'var(--lyra-color-status-warning-subtle)'
    : 'var(--lyra-color-status-critical-subtle)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: R_SM, minWidth: 36, padding: '3px 8px',
      fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontFamily: F,
      backgroundColor: bg, color: FG, letterSpacing: '-0.01em',
    }}>
      {value}
    </span>
  )
}

/* Shared visibility flag for all AI insight / recommendation blocks.
   Default false = dashboard shows data only. A transparent top-right
   toggle flips it to reveal every insight at once. */
const InsightsVisibleContext = createContext(false)

/* ============================================================
 * Feedback Intelligence Dashboard — pixel-matched to reference
 *
 * When a `campaign` prop is supplied the dashboard renders a
 * campaign-context strip at the top with back / operations links.
 * Data inside the panels is unchanged for the prototype — the
 * scoping is visual only.
 * ============================================================ */
export function FeedbackIntelligenceDashboard({
  campaign,
  onBackToPortfolio,
  onViewOperations,
  onOpenSurvey,
}: {
  campaign?: Campaign
  onBackToPortfolio?: () => void
  onViewOperations?: () => void
  onOpenSurvey?: (surveyId: string) => void
} = {}) {
  const [showInsights, setShowInsights] = useState(false)

  // Staggered entry — cards first, then the chart card, then the chart
  // line draws inside (handled in ResponseRateChart), then the bottom row.
  const enter = (delayMs: number): React.CSSProperties => ({
    animation: 'fadeUp 0.5s ease both',
    animationDelay: `${delayMs}ms`,
  })

  return (
    <InsightsVisibleContext.Provider value={showInsights}>
      <div className="relative space-y-8">
        {/* Filter row appears with the cards (no delay) */}
        <div style={enter(0)}>
          <FilterRow />
        </div>

        {/* Aggregated KPI tiles — sourced from campaign + topic data */}
        <div style={enter(100)}>
          <CampaignKpiTiles campaign={campaign} />
        </div>

        {/* Top Topics — full-width rich table with inline drill-down */}
        <div style={enter(300)}>
          <TopTopicsSection campaign={campaign} />
        </div>

        {/* Recent surveys — individual survey records for this campaign */}
        <div style={enter(400)}>
          <RecentSurveysSection campaign={campaign} onOpenSurvey={onOpenSurvey} />
        </div>
      </div>
    </InsightsVisibleContext.Provider>
  )
}

function BottomInsightsRow() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => () => setOpenIndex(openIndex === i ? null : i)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, alignItems: 'stretch' }}>
      <ByCustomerTypePanel expanded={openIndex === 0} onToggle={toggle(0)} />
      <ByChannelPanel      expanded={openIndex === 1} onToggle={toggle(1)} />
    </div>
  )
}

/* ---------- Campaign-level KPI tile strip ---------- */
function CampaignKpiTiles({ campaign }: { campaign?: Campaign }) {
  if (!campaign) return null

  const sentSeries = aggregateTopicSeries(campaign, t => t.surveysSentSeries)
  const respSeries = aggregateTopicSeries(campaign, t => t.responsesSeries)
  const respRateSeries = campaign.sparkline ?? []
  const csatSeries = campaign.csatSeries ?? []

  const responseRateLatest = respRateSeries.length ? respRateSeries[respRateSeries.length - 1] : 67
  const responseRateFirst  = respRateSeries.length ? respRateSeries[0] : 61
  const rrDelta = responseRateLatest - responseRateFirst

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <CampaignKpiTile title="Surveys Sent" data={sentSeries} displayValue="sum" />
      <CampaignKpiTile title="Responses Received" data={respSeries} displayValue="sum" />
      <ResponseRateKpiTile value={responseRateLatest} target={60} delta={rrDelta} />
      <CampaignKpiTile title="CSAT" data={csatSeries} displayValue="latest" />
    </div>
  )
}

function aggregateTopicSeries(
  campaign: Campaign,
  getter: (t: Topic) => number[]
): number[] {
  const topics = campaign.topics
  if (!topics.length) return []
  const days = getter(topics[0]).length
  return Array.from({ length: days }, (_, i) =>
    topics.reduce((sum, t) => sum + (getter(t)[i] ?? 0), 0)
  )
}

/* Response Rate card — mirrors CampaignKpiTile structure exactly, replaces sparkline with progress bar */
function ResponseRateKpiTile({ value, target, delta }: { value: number; target: number; delta: number }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])
  const [tooltip, setTooltip] = useState<{ x: number } | null>(null)

  const pct = mounted ? Math.min(value, 100) : 0
  const gap = Math.abs(value - target)
  // >60 blue · 30–60 orange · <30 red — matches campaign table ResponseRateCell
  const barColor = value > 60 ? S_SUC_FG : value >= 30 ? S_WARN_FG : S_CRIT_FG
  const valueColor = value > 60 ? S_SUC_FG : value >= 30 ? S_WARN_FG : S_CRIT_FG
  const deltaColor = delta > 0 ? S_SUC_FG : delta < 0 ? S_CRIT_FG : FG_SEC

  return (
    <div style={{ background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_MD, padding: 12, fontFamily: F }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: FG_SEC, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: F }}>Response Rate</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: deltaColor, fontVariantNumeric: 'tabular-nums', fontFamily: F }}>
          {delta > 0 ? '+' : ''}{delta}pp
        </span>
      </div>
      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: valueColor, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: F }}>{value}</span>
        <span style={{ fontSize: 14, fontWeight: 400, color: valueColor, lineHeight: 1, fontFamily: F, opacity: 0.75 }}>%</span>
      </div>
      {/* Chart zone */}
      <div style={{ height: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        {/* Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: FG_SEC, fontFamily: F }}>0%</span>
          <span style={{ position: 'absolute', left: `${target}%`, transform: 'translateX(-50%)', fontSize: 11, color: FG_SEC, whiteSpace: 'nowrap', fontFamily: F }}>
            Target {target}%
          </span>
          <span style={{ fontSize: 11, color: FG_SEC, fontFamily: F }}>100%</span>
        </div>
        {/* Track */}
        <div
          style={{ position: 'relative', width: '100%', height: 12, borderRadius: R_FULL, background: BD_SUBTLE, cursor: 'default' }}
          onMouseMove={e => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setTooltip({ x: e.clientX - r.left }) }}
          onMouseLeave={() => setTooltip(null)}
        >
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
            borderRadius: R_FULL, background: barColor,
            transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
          }} />
          <div style={{
            position: 'absolute', top: -2, bottom: -2, left: `${target}%`, transform: 'translateX(-50%)',
            width: 2, borderRadius: 2, background: FG, opacity: 0.35,
          }} />
        </div>
        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'absolute', bottom: 20, left: tooltip.x, transform: 'translateX(-50%)',
            background: 'var(--lyra-color-bg-surface-inverse)', color: 'var(--lyra-color-fg-inverse)',
            fontSize: 12, fontWeight: 500, fontFamily: F,
            padding: '4px 8px', borderRadius: R_SM,
            whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 100,
            boxShadow: SH_LG, lineHeight: 1.5,
          }}>
            <div style={{ fontWeight: 600 }}>{value}% current</div>
            <div style={{ opacity: 0.7, fontSize: 11 }}>
              Target {target}% · {value >= target ? `${gap}pp above` : `${gap.toFixed(1)}pp to go`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Trend palette shared across chart components
const CHART_UP_LINE   = '#185BA4'  // brand-700
const CHART_UP_GRAD   = '#4896EC'  // brand-400
const CHART_DOWN_LINE = '#DC2626'
const CHART_DOWN_GRAD = '#EF4444'
const CHART_FLAT_LINE = '#82959E'  // slate-500
const CHART_FLAT_GRAD = '#A8B3BB'  // slate-400

function chartTrendColors(first: number, last: number) {
  const pct = Math.abs(first) > 0 ? (last - first) / Math.abs(first) : 0
  if (pct > 0.01)  return { line: CHART_UP_LINE,   grad: CHART_UP_GRAD }
  if (pct < -0.01) return { line: CHART_DOWN_LINE, grad: CHART_DOWN_GRAD }
  return { line: CHART_FLAT_LINE, grad: CHART_FLAT_GRAD }
}

function CampaignKpiTile({
  title,
  data,
  displayValue,
  unit = '',
}: {
  title: string
  data: number[]
  displayValue: 'sum' | 'latest'
  unit?: string
}) {
  if (!data.length) {
    return (
      <div style={{ background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_MD, padding: 12, fontFamily: F }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: FG_SEC, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8, fontFamily: F }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: FG_SEC, fontFamily: F }}>No data</div>
      </div>
    )
  }

  const width = 320
  const height = 110
  const padding = { top: 16, right: 10, bottom: 22, left: 28 }
  const cw = width - padding.left - padding.right
  const ch = height - padding.top - padding.bottom

  const min = Math.max(
    0,
    Math.min(...data) - Math.max(2, (Math.max(...data) - Math.min(...data)) * 0.2)
  )
  const max = Math.max(...data) + Math.max(2, (Math.max(...data) - Math.min(...data)) * 0.2)
  const range = max - min || 1
  const xs = (i: number) => padding.left + (i / (data.length - 1)) * cw
  const ys = (v: number) => padding.top + ch - ((v - min) / range) * ch

  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ')
  const areaPath = `${path} L ${xs(data.length - 1)} ${padding.top + ch} L ${xs(0)} ${padding.top + ch} Z`

  const latest = data[data.length - 1]
  const first = data[0]
  const total = data.reduce((s, v) => s + v, 0)
  const headline = displayValue === 'sum' ? total : latest
  const delta = latest - first
  const deltaPct = first !== 0 ? Math.round((delta / first) * 100) : 0
  const deltaColor = delta > 0 ? S_SUC_FG : delta < 0 ? S_CRIT_FG : FG_SEC

  const { line: lineColor, grad: gradColor } = chartTrendColors(first, latest)
  const gradId = `ck-${title.replace(/\W/g, '').toLowerCase()}`

  return (
    <div style={{ background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_MD, padding: 12, fontFamily: F }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: FG_SEC, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: F }}>
          {title}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: deltaColor, fontVariantNumeric: 'tabular-nums', fontFamily: F }}>
          {delta > 0 ? '+' : ''}{deltaPct}%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: FG, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: F }}>
          {displayValue === 'sum' ? headline.toLocaleString() : headline}
        </span>
        {unit && <span style={{ fontSize: 14, fontWeight: 400, color: FG_SEC, lineHeight: 1, fontFamily: F }}>{unit}</span>}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 90 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={gradColor} stopOpacity="0.38" />
            <stop offset="40%"  stopColor={lineColor}  stopOpacity="0.14" />
            <stop offset="100%" stopColor={lineColor}  stopOpacity="0" />
          </linearGradient>
        </defs>
        <text x={padding.left - 4} y={padding.top + 4} textAnchor="end" fill="#c8d0d8" fontSize="10">
          {Math.round(max)}
        </text>
        <text x={padding.left - 4} y={padding.top + ch} textAnchor="end" fill="#c8d0d8" fontSize="10">
          {Math.round(min)}
        </text>
        <text x={padding.left} y={height - 6} textAnchor="start" fill="#a8b3bb" fontSize="10">
          Day 1
        </text>
        <text x={width - padding.right} y={height - 6} textAnchor="end" fill="#a8b3bb" fontSize="10">
          Today
        </text>
        <line
          x1={padding.left} y1={padding.top + ch}
          x2={width - padding.right} y2={padding.top + ch}
          stroke="rgba(0,0,0,0.06)" strokeWidth="1"
        />
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={path} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
        {/* Glow halo behind endpoint */}
        <circle cx={xs(data.length - 1)} cy={ys(latest)} r="6" fill={lineColor} opacity="0.15" />
        <circle cx={xs(data.length - 1)} cy={ys(latest)} r="3" fill={lineColor} />
      </svg>
    </div>
  )
}

/* ---------- Top Topics section (campaign-scoped) ---------- */
function TopTopicsSection({ campaign }: { campaign?: Campaign }) {
  const topics = campaign?.topics ?? []
  return (
    <section style={{ fontFamily: F }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: FG, letterSpacing: '-0.01em', fontFamily: F, margin: 0 }}>
          Top intents in this campaign
        </h2>
        <span style={{ fontSize: 12, fontWeight: 400, color: FG_SEC, fontFamily: F }}>
          Click a row for 14-day trend breakdown
        </span>
      </div>
      <TopicsTable topics={topics} />
    </section>
  )
}

/* ---------- Recent surveys section (campaign-scoped) ---------- */
function RecentSurveysSection({
  campaign,
  onOpenSurvey,
}: {
  campaign?: Campaign
  onOpenSurvey?: (surveyId: string) => void
}) {
  const surveys = (campaign ? getSurveysForCampaign(campaign.id) : [])
    .slice()
    .sort((a, b) => new Date(b.interaction.date).getTime() - new Date(a.interaction.date).getTime())
  return (
    <SurveysList
      surveys={surveys}
      onOpenSurvey={(id) => onOpenSurvey?.(id)}
    />
  )
}

/* ---------- Reusable AI insight sub-card ---------- */
type InsightStatus = 'pending' | 'done' | 'dismissed'
const TODAY = 'May 14'

function AIInsight({
  children,
  size = 'sm',
  action,
  header,
}: {
  children: React.ReactNode
  size?: 'xs' | 'sm'
  action?: string
  header?: string
}) {
  const [status, setStatus] = useState<InsightStatus>('pending')
  const [actionText, setActionText] = useState(action ?? '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(actionText)
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const textSize = size === 'xs' ? 12 : 12
  const iconSize = size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'

  /* -------- COLLAPSED: Done -------- */
  if (status === 'done') {
    return (
      <div className="group" style={{ borderRadius: R_MD, background: S_SUC_BG, border: `1px solid rgba(35,114,45,0.2)`, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: F }}>
        <div style={{ width: 14, height: 14, flexShrink: 0, borderRadius: R_FULL, background: S_SUC_FG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check className="h-2.5 w-2.5" style={{ color: 'var(--lyra-color-fg-inverse)' }} strokeWidth={3} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: S_SUC_FG, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, fontFamily: F }}>Done · {TODAY}</span>
        <span style={{ fontSize: 12, fontWeight: 400, color: S_SUC_FG, lineHeight: 1.3, fontFamily: F, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {actionText}</span>
        <button
          onClick={() => setStatus('pending')}
          style={{ fontSize: 12, fontWeight: 500, color: S_SUC_FG, fontFamily: F, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          className="hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
          title="Undo"
        >
          Undo
        </button>
      </div>
    )
  }

  /* -------- COLLAPSED: Dismissed -------- */
  if (status === 'dismissed') {
    return (
      <div className="group" style={{ borderRadius: R_MD, background: BG_SHELL, border: `1px solid ${BD_SOFT}`, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: F }}>
        <div style={{ width: 14, height: 14, flexShrink: 0, borderRadius: R_FULL, background: FG_DIS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X className="h-2.5 w-2.5" style={{ color: 'var(--lyra-color-fg-inverse)' }} strokeWidth={3} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: FG_SEC, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, fontFamily: F, flex: 1 }}>Dismissed · {TODAY}</span>
        <button
          onClick={() => setStatus('pending')}
          style={{ fontSize: 12, fontWeight: 500, color: FG_SEC, fontFamily: F, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          className="hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
          title="Undo"
        >
          Undo
        </button>
      </div>
    )
  }

  /* -------- PENDING -------- */
  const startEdit = () => {
    setDraft(actionText)
    setEditing(true)
  }
  const saveEdit = () => {
    setActionText(draft.trim() || actionText)
    setEditing(false)
  }
  const cancelEdit = () => setEditing(false)

  return (
    <div style={{ borderRadius: R_MD, background: AI_BG, border: `1px solid ${AI_BORDER}`, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: F }}>
      {/* Body */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <Sparkles className={iconSize} style={{ color: AI_COLOR, flexShrink: 0, marginTop: 1 }} fill={AI_COLOR} />
        <p style={{ fontSize: textSize, color: FG, lineHeight: 1.45, fontFamily: F, flex: 1, minWidth: 0, margin: 0 }}>
          {header && <strong style={{ fontWeight: 600, color: AI_COLOR }}>{header} · </strong>}
          {children}
        </p>
      </div>

      {/* Accordion: Recommended action */}
      {action && (
        <div style={{ paddingTop: 6, borderTop: `1px solid ${AI_BORDER}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ChevronDown
              className="h-3 w-3"
              style={{ color: AI_COLOR, flexShrink: 0, transition: 'transform 0.2s', transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
              strokeWidth={2.5}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: AI_COLOR, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1, fontFamily: F }}>
              Recommended action
            </span>
          </button>

          {expanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 16, fontFamily: F }}>
              {editing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    style={{ fontSize: 12, color: FG, fontFamily: F, flex: 1, minWidth: 0, background: BG_BASE, border: `1px solid ${AI_BORDER}`, borderRadius: R_SM, padding: '4px 6px', outline: 'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = BD_FOCUS; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(78,57,168,0.15)` }}
                    onBlur={e => { e.currentTarget.style.borderColor = AI_BORDER; e.currentTarget.style.boxShadow = '' }}
                  />
                  <button onClick={saveEdit} title="Save" aria-label="Save" style={{ width: 20, height: 20, flexShrink: 0, borderRadius: R_SM, background: AI_COLOR, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Check className="h-2.5 w-2.5" style={{ color: 'var(--lyra-color-fg-inverse)' }} strokeWidth={3} />
                  </button>
                  <button onClick={cancelEdit} title="Cancel" aria-label="Cancel" style={{ width: 20, height: 20, flexShrink: 0, borderRadius: R_SM, background: BG_BASE, border: `1px solid ${AI_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X className="h-2.5 w-2.5" style={{ color: FG_SEC }} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <p style={{ fontSize: 12, color: FG, lineHeight: 1.4, fontFamily: F, flex: 1, margin: 0 }}>{actionText}</p>
                  <button onClick={startEdit} title="Edit action" aria-label="Edit action" style={{ background: 'none', border: 'none', cursor: 'pointer', color: AI_COLOR, flexShrink: 0, marginTop: 1, padding: 0 }}>
                    <Pencil className="h-2.5 w-2.5" />
                  </button>
                </div>
              )}

              {!editing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => setStatus('done')}
                    style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: 'var(--lyra-color-fg-inverse)', background: AI_COLOR, border: 'none', borderRadius: R_SM, padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setStatus('dismissed')}
                    style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: FG_SEC, background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_SM, padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------- 1. Filter row ---------- */
const CHEVRON_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2382959e' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`

function FilterRow() {
  const filters = ['Last 60 days', 'All Intents', 'All Customer Types', 'All Channels']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {filters.map(label => (
          <select
            key={label}
            style={{
              height: 32, paddingLeft: 12, paddingRight: 32,
              background: `${BG_BASE} ${CHEVRON_SVG} no-repeat right 10px center`,
              border: `1px solid ${BD_SOFT}`,
              borderRadius: R_MD,
              fontSize: 14, fontWeight: 500, color: FG,
              fontFamily: F,
              appearance: 'none', cursor: 'pointer', outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = BD_FOCUS; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(24,91,164,0.15)` }}
            onBlur={e => { e.currentTarget.style.borderColor = BD_SOFT; e.currentTarget.style.boxShadow = '' }}
          >
            <option>{label}</option>
          </select>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 400, color: FG_SEC, fontFamily: F }}>May 14, 2026 · 09:14</div>
    </div>
  )
}

/* ---------- 2. KPI cards ---------- */
type KpiKind = 'positive' | 'negative' | 'highlight' | 'default'
type Kpi = {
  label: string
  value: string
  delta?: { arrow?: '↑' | '↓'; text: string; suffix?: string }
  subtitle?: string
  /** Small muted note rendered below the value row (replaces subtitle when both apply). */
  note?: string
  /** Optional secondary metric shown inline with the value (e.g. CSAT trend). */
  csat?: { current: string; target: string }
  headline: React.ReactNode
  insightBullets: string[]
  expectedImpact: string[]
  action: string
  kind: KpiKind
}

const KPIS: Kpi[] = [
  {
    label: 'Overall Response Rate',
    value: '55.4%',
    delta: { arrow: '↑', text: '+3.2pp', suffix: 'vs. prior period' },
    headline: '44.6% of travelers not responding — A/B test opportunity',
    insightBullets: [
      '44.6% of travelers are not responding after their journey',
      'Group A: survey immediately post-call · Group B: 24hrs later via SMS',
      'Alert fires if daily response rate drops below 48%',
    ],
    expectedImpact: [
      '+6–10pp projected lift in response rate within 30 days',
      'Early alert catches delivery failures before they affect weekly averages',
    ],
    action: 'Launch A/B test · Set response rate alert',
    kind: 'default',
  },
  {
    label: 'Surveys Sent',
    value: '18,420',
    delta: { arrow: '↑', text: '+1,240', suffix: 'vs. prior period' },
    headline: '3 agents with 0% send rate detected',
    insightBullets: [
      '3 agents had 0% survey send rate last period',
      'Silently pulling the team average down week over week',
      'Agent-level alert notifies you same day',
      '0 surveys handed off to AI Agent — the AI Agent handoff is not firing. This is likely a broken step in the campaign setup, not an agent behavior issue',
    ],
    expectedImpact: [
      'Recover an estimated 300–400 missing surveys per month',
      'Closes blind spots in agent performance coverage',
      'Fixing the AI Agent handoff in campaign setup could immediately restore automated survey delivery across all eligible interactions',
    ],
    action: 'Go to Admin → Campaign Setup → inspect AI Agent handoff step · verify trigger and handoff settings · Set agent send-rate alert',
    kind: 'default',
  },
  {
    label: 'Outliers Detected',
    value: '3',
    csat: { current: '87', target: '60' },
    note: 'driven by 2 SLA breaches · billing queue routing failure',
    headline: (
      <>
        2 SLA breaches · 1 campaign spike to replicate
        <span style={{ color: FG_SEC, margin: '0 4px' }}>|</span>
        <span style={{ color: FG_SEC }}>CSAT </span>
        <span style={{ color: BRAND_600, fontWeight: 600 }}>87</span>
        <span style={{ color: FG_SEC }}> → </span>
        <span style={{ color: AI_COLOR, fontWeight: 600 }}>60</span>
      </>
    ),
    insightBullets: [
      '2 response rate drops linked to billing queue routing failure — SLA breached on both',
      'Apr 22 spike tied to post-disruption campaign — pattern is repeatable',
      'Each SLA breach correlates with a 5–8 point CSAT drop within 24 hours',
    ],
    expectedImpact: [
      'Resolving routing failure projected to recover CSAT from 60 → 80+ within 2 weeks',
      'A/B test on campaign A4542 could replicate the Apr 22 87% response spike',
    ],
    action: 'Fix billing queue routing · A/B test Apr 22 campaign',
    kind: 'default',
  },
  {
    label: 'Top Intent Response Rate',
    value: '81%',
    subtitle: 'Flight Disruption',
    headline: 'Flight Disruption is your richest feedback cohort',
    insightBullets: [
      'Flight Disruption generates the highest response rate at 81%',
      'Personalized survey sent within 2hrs of resolution',
      'A/B test: SMS delivery vs. email to find the top channel',
    ],
    expectedImpact: [
      'Disruption campaign could add 400+ high-quality responses per month',
      'Channel winner from A/B test applies across all future disruption surveys',
    ],
    action: 'Launch disruption campaign · A/B test SMS vs. email',
    kind: 'positive',
  },
]

function KpiCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {KPIS.map((k, i) => (
        <KpiCard
          key={k.label}
          kpi={k}
          expanded={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}

function KpiCard({ kpi, expanded, onToggle }: { kpi: Kpi; expanded: boolean; onToggle: () => void }) {
  const insightsVisible = useContext(InsightsVisibleContext)
  const valueColor =
    kpi.kind === 'negative' ? AI_COLOR :
    kpi.kind === 'positive' ? BRAND_600 :
    FG

  const subtitleColor =
    kpi.kind === 'negative' ? AI_COLOR :
    FG

  return (
    <div style={{ background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_LG, padding: 16, fontFamily: F }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: FG_SEC, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8, lineHeight: 1, fontFamily: F }}>
        {kpi.label}
      </div>

      {/* Value row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em', color: valueColor, fontFamily: F }}>
          {kpi.value}
        </div>
        {kpi.csat && (
          <>
            <div style={{ width: 1, height: 28, background: BD_SOFT }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 400, color: FG_SEC, fontFamily: F }}>CSAT</span>
              <CsatBadge value={kpi.csat.current} />
              <span style={{ color: FG_SEC, fontSize: 14, fontFamily: F }}>→</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: AI_COLOR, fontFamily: F, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} />
                {kpi.csat.target}
              </span>
            </div>
          </>
        )}
      </div>

      {kpi.delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, lineHeight: 1, fontSize: 12, fontWeight: 600, color: S_SUC_FG, fontFamily: F }}>
          {kpi.delta.arrow && <span>{kpi.delta.arrow}</span>}
          <span>{kpi.delta.text}</span>
          {kpi.delta.suffix && <span style={{ fontWeight: 400, color: FG_SEC }}>{kpi.delta.suffix}</span>}
        </div>
      )}
      {kpi.subtitle && (
        <div style={{ marginBottom: 8, lineHeight: 1, fontSize: 12, fontWeight: 600, color: subtitleColor, fontFamily: F }}>
          {kpi.subtitle}
        </div>
      )}
      {kpi.note && (
        <div style={{ marginBottom: 8, lineHeight: 1.4, fontSize: 12, fontWeight: 400, color: FG_SEC, fontFamily: F }}>
          {kpi.note}
        </div>
      )}

      {/* AI insight accordion */}
      {insightsVisible && (
        <div style={{ borderRadius: R_MD, background: AI_BG, border: `1px solid ${AI_BORDER}`, overflow: 'hidden' }}>
          <button
            onClick={onToggle}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 6, width: '100%', padding: '8px 10px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(78,57,168,0.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
          >
            <Sparkles className="h-3 w-3" style={{ color: AI_COLOR, flexShrink: 0, marginTop: 2 }} fill={AI_COLOR} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: FG, lineHeight: 1.4, fontFamily: F, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{kpi.headline}</p>
              <span style={{ fontSize: 12, fontWeight: 500, color: AI_COLOR, fontFamily: F }}>
                {expanded ? '▾ Hide insight & action' : '▸ See insight & action'}
              </span>
            </div>
          </button>

          <div
            style={{ overflow: 'hidden', transition: 'max-height 0.2s ease, opacity 0.2s ease', maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
          >
            <div style={{ padding: '4px 10px 8px', borderTop: `1px solid ${AI_BORDER}` }}>
              <KpiInsightBody
                insightBullets={kpi.insightBullets}
                expectedImpact={kpi.expectedImpact}
                action={kpi.action}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Body shown inside the expanded KPI accordion.
   Uses the full Recommend → Approve/Dismiss machinery from AIInsight,
   but inlined (and starts with the recommended-action block open). */
function KpiInsightBody({
  insightBullets,
  expectedImpact,
  action,
}: {
  insightBullets: string[]
  expectedImpact: string[]
  action: string
}) {
  const [status, setStatus] = useState<InsightStatus>('pending')
  const [actionText, setActionText] = useState(action)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(actionText)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  if (status === 'done') {
    return (
      <div className="group" style={{ borderRadius: R_SM, background: S_SUC_BG, border: `1px solid rgba(35,114,45,0.2)`, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: F }}>
        <div style={{ width: 14, height: 14, flexShrink: 0, borderRadius: R_FULL, background: S_SUC_FG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check className="h-2.5 w-2.5" style={{ color: 'var(--lyra-color-fg-inverse)' }} strokeWidth={3} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: S_SUC_FG, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, fontFamily: F }}>Done · {TODAY}</span>
        <span style={{ fontSize: 12, fontWeight: 400, color: S_SUC_FG, lineHeight: 1.3, fontFamily: F, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {actionText}</span>
        <button onClick={() => setStatus('pending')} style={{ fontSize: 12, fontWeight: 500, color: S_SUC_FG, fontFamily: F, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }} className="hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Undo</button>
      </div>
    )
  }
  if (status === 'dismissed') {
    return (
      <div className="group" style={{ borderRadius: R_SM, background: BG_SHELL, border: `1px solid ${BD_SOFT}`, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: F }}>
        <div style={{ width: 14, height: 14, flexShrink: 0, borderRadius: R_FULL, background: FG_DIS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X className="h-2.5 w-2.5" style={{ color: 'var(--lyra-color-fg-inverse)' }} strokeWidth={3} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: FG_SEC, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, fontFamily: F, flex: 1 }}>Dismissed · {TODAY}</span>
        <button onClick={() => setStatus('pending')} style={{ fontSize: 12, fontWeight: 500, color: FG_SEC, fontFamily: F, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }} className="hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Undo</button>
      </div>
    )
  }

  const startEdit = () => { setDraft(actionText); setEditing(true) }
  const saveEdit = () => { setActionText(draft.trim() || actionText); setEditing(false) }
  const cancelEdit = () => setEditing(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: F }}>
      {/* Insight bullets */}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
        {insightBullets.map((bullet, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.45, fontSize: 12, color: FG, fontFamily: F }}>
            <span style={{ color: AI_COLOR, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>•</span>
            <span style={{ flex: 1, minWidth: 0 }}>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Expected Impact */}
      <div style={{ paddingTop: 6, borderTop: `1px solid ${AI_BORDER}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: FG_SEC, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1, fontFamily: F }}>Expected Impact</span>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
          {expectedImpact.map((bullet, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.45, fontSize: 12, color: FG, fontFamily: F }}>
              <span style={{ color: S_SUC_FG, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ flex: 1, minWidth: 0 }}>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ paddingTop: 6, borderTop: `1px solid ${AI_BORDER}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: AI_COLOR, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1, fontFamily: F }}>Recommended action</span>

        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') cancelEdit()
              }}
              style={{ fontSize: 12, color: FG, fontFamily: F, flex: 1, minWidth: 0, background: BG_BASE, border: `1px solid ${AI_BORDER}`, borderRadius: R_SM, padding: '4px 6px', outline: 'none' }}
              onFocus={e => { e.currentTarget.style.borderColor = BD_FOCUS; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(78,57,168,0.15)` }}
              onBlur={e => { e.currentTarget.style.borderColor = AI_BORDER; e.currentTarget.style.boxShadow = '' }}
            />
            <button onClick={saveEdit} title="Save" aria-label="Save" style={{ width: 20, height: 20, flexShrink: 0, borderRadius: R_SM, background: AI_COLOR, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Check className="h-2.5 w-2.5" style={{ color: 'var(--lyra-color-fg-inverse)' }} strokeWidth={3} />
            </button>
            <button onClick={cancelEdit} title="Cancel" aria-label="Cancel" style={{ width: 20, height: 20, flexShrink: 0, borderRadius: R_SM, background: BG_BASE, border: `1px solid ${BD_SOFT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X className="h-2.5 w-2.5" style={{ color: FG_SEC }} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <p style={{ fontSize: 12, color: FG, lineHeight: 1.4, fontFamily: F, flex: 1, margin: 0 }}>{actionText}</p>
            <button onClick={startEdit} title="Edit action" aria-label="Edit action" style={{ background: 'none', border: 'none', cursor: 'pointer', color: AI_COLOR, flexShrink: 0, marginTop: 1, padding: 0 }}>
              <Pencil className="h-2.5 w-2.5" />
            </button>
          </div>
        )}

        {!editing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setStatus('done')} style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: 'var(--lyra-color-fg-inverse)', background: AI_COLOR, border: 'none', borderRadius: R_SM, padding: '4px 8px', cursor: 'pointer' }}>
              Approve
            </button>
            <button onClick={() => setStatus('dismissed')} style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: FG_SEC, background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_SM, padding: '4px 8px', cursor: 'pointer' }}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- 3. Response-Rate-Over-Time card ---------- */
function ResponseRateOverTimeCard() {
  return (
    <div style={{ background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_XL, boxShadow: SH_MD, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BD_SUBTLE}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: FG, marginBottom: 2, lineHeight: 1.2, fontFamily: F, margin: '0 0 2px 0' }}>
              Response Rate Over Time
            </h3>
            <p style={{ fontSize: 12, color: FG_SEC, lineHeight: 1.2, fontFamily: F, margin: 0 }}>
              Mar 15 – May 14, 2026 · Weekends shaded · Outliers flagged
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 10px 4px 10px', borderRadius: R_FULL, background: BG_SHELL, border: `1px solid ${BD_SUBTLE}` }}>
            <LegendDot label="Weekend" swatch={<span style={{ width: 12, height: 12, background: BG_SHELL, border: `1px solid ${BD_SUBTLE}`, borderRadius: 2, display: 'inline-block' }} />} />
            <span style={{ width: 1, height: 12, background: BD_SUBTLE, display: 'inline-block' }} />
            <LegendDot label="Low outlier" swatch={<span style={{ width: 8, height: 8, background: AI_COLOR, borderRadius: '50%', display: 'inline-block' }} />} />
            <span style={{ width: 1, height: 12, background: BD_SUBTLE, display: 'inline-block' }} />
            <LegendDot label="Spike" swatch={<span style={{ width: 8, height: 8, background: BRAND_600, borderRadius: '50%', display: 'inline-block' }} />} />
          </div>
        </div>
      </div>

      {/* 3 outlier annotation accordions */}
      <OutlierAnnotationRail />

      {/* Chart */}
      <div style={{ padding: '12px 16px' }}>
        <ResponseRateChart />
      </div>
    </div>
  )
}

function LegendDot({ label, swatch }: { label: string; swatch: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {swatch}
      <span style={{ fontSize: 12, color: FG_SEC, fontFamily: F }}>{label}</span>
    </div>
  )
}

/* ---------- Shared panel insight accordion ---------- */
function PanelInsightAccordion({
  collapsed,
  insightBullets,
  expectedImpact,
  action,
  expanded,
  onToggle,
}: {
  collapsed: React.ReactNode
  insightBullets: string[]
  expectedImpact: string[]
  action: string
  expanded: boolean
  onToggle: () => void
}) {
  const insightsVisible = useContext(InsightsVisibleContext)
  if (!insightsVisible) return null
  return (
    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BD_SUBTLE}` }}>
      <div style={{ borderRadius: R_MD, background: AI_BG, border: `1px solid ${AI_BORDER}`, overflow: 'hidden' }}>
        <button
          onClick={onToggle}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 6, width: '100%', padding: '8px 10px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(78,57,168,0.06)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
        >
          <Sparkles className="h-3 w-3" style={{ color: AI_COLOR, flexShrink: 0, marginTop: 2 }} fill={AI_COLOR} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <p style={{ fontSize: 12, color: FG, lineHeight: 1.45, fontFamily: F, margin: 0 }}>{collapsed}</p>
            <span style={{ fontSize: 12, fontWeight: 500, color: AI_COLOR, fontFamily: F }}>
              {expanded ? '▾ Hide insight & action' : '▸ See insight & action'}
            </span>
          </div>
        </button>

        <div
          style={{ overflow: 'hidden', transition: 'max-height 0.2s ease, opacity 0.2s ease', maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
        >
          <div style={{ padding: '4px 10px 8px', borderTop: `1px solid ${AI_BORDER}` }}>
            <KpiInsightBody
              insightBullets={insightBullets}
              expectedImpact={expectedImpact}
              action={action}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Outlier annotation accordion (mirrors KPI accordion pattern) ---------- */
type OutlierAnnotation = {
  id: string
  date: string
  summary: string
  insightBullets: string[]
  expectedImpact: string[]
  action: string
}

const OUTLIER_ANNOTATIONS: OutlierAnnotation[] = [
  {
    id: 'apr-12',
    date: 'Apr 12 — 19%',
    summary: 'Storm-related mass cancellation (6 hrs). 2,100 surveys undelivered.',
    insightBullets: [
      'Storm-related mass cancellation caused a 6-hour survey delivery failure',
      '2,100 surveys went undelivered with no ops alert triggered',
      'SLA was breached with no notification until manual review',
    ],
    expectedImpact: [
      'Alert rule reduces breach detection from hours to under 1 hour',
      'Prevents future silent delivery failures from distorting monthly averages',
    ],
    action: 'Set SLA alert — trigger ops notification if response rate falls below 30% within 1 hour',
  },
  {
    id: 'apr-22',
    date: 'Apr 22 — 87%',
    summary: 'Post-disruption recovery campaign drove 3× engagement. Flight disruption cohort over-represented.',
    insightBullets: [
      'Post-disruption recovery campaign drove 3× the normal engagement',
      'Flight disruption cohort was over-represented — signal is strong but skewed',
      'This campaign pattern has not been tested against standard outreach',
    ],
    expectedImpact: [
      'A/B test on campaign A4542 could make the 87% spike repeatable',
      'Isolating the cohort removes the skew and gives a clean performance read',
    ],
    action: 'Launch A/B test in campaign A4542',
  },
  {
    id: 'may-7',
    date: 'May 7 — 22%',
    summary: 'Survey link broken in Web Widget after app update. Resolved in 4 hrs. Ticket CXQM-55892.',
    insightBullets: [
      'Survey link broken in Web Widget after an app update',
      'Issue went undetected for 4 hours before manual escalation',
      'Ticket CXQM-55892 resolved but no automated prevention in place',
    ],
    expectedImpact: [
      'Health alert catches Web Widget failures within 1 hour of deployment',
      'Prevents future app updates from silently breaking survey delivery',
    ],
    action: 'Set Web Widget health alert — notify within 1 hour of delivery failure',
  },
]

function OutlierAnnotationRail() {
  const insightsVisible = useContext(InsightsVisibleContext)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (!insightsVisible) return null
  return (
    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BD_SUBTLE}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, alignItems: 'stretch' }}>
        {OUTLIER_ANNOTATIONS.map((ann, i) => (
          <OutlierAnnotationCard
            key={ann.id}
            ann={ann}
            expanded={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}

function OutlierAnnotationCard({ ann, expanded, onToggle }: { ann: OutlierAnnotation; expanded: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderRadius: R_MD, background: AI_BG, border: `1px solid ${AI_BORDER}`, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 6, width: '100%', padding: '8px 10px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(78,57,168,0.06)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
      >
        <Sparkles className="h-3 w-3" style={{ color: AI_COLOR, flexShrink: 0, marginTop: 2 }} fill={AI_COLOR} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 12, color: FG, lineHeight: 1.4, fontFamily: F, margin: 0 }}>
            <strong style={{ fontWeight: 600 }}>{ann.date}</strong> · {ann.summary}
          </p>
          <span style={{ fontSize: 12, fontWeight: 500, color: AI_COLOR, fontFamily: F }}>
            {expanded ? '▾ Hide insight & action' : '▸ See insight & action'}
          </span>
        </div>
      </button>

      <div
        style={{ overflow: 'hidden', transition: 'max-height 0.2s ease, opacity 0.2s ease', maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div style={{ padding: '4px 10px 8px', borderTop: `1px solid ${AI_BORDER}` }}>
          <KpiInsightBody
            insightBullets={ann.insightBullets}
            expectedImpact={ann.expectedImpact}
            action={ann.action}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------- 3a. Chart (SVG) ---------- */
type ChartPoint = {
  i: number
  y: number
  date: string         // "Mar 15"
  fullDate: string     // "Sun, March 15"
  isWeekend: boolean
  outlier?: 'low' | 'high'
}

// Hand-tuned values to mirror the reference line
const CHART_VALUES: number[] = [
  32, 58, 60, 63, 67, 58, 30, 33, 58, 62, 68, 70, 62, 30, 28,
  55, 58, 62, 64, 58, 38, 42, 55, 58, 62, 70, 55, 33, 19, 50,
  58, 62, 65, 60, 38, 40, 55, 60, 87, 70, 62, 40, 38, 55, 58,
  62, 61, 58, 38, 42, 58, 65, 72, 22, 40, 30, 32, 55, 60, 53,
]

const OUTLIERS: Record<number, 'low' | 'high'> = {
  28: 'low',  // Apr 12
  38: 'high', // Apr 22
  53: 'low',  // May 7
}

function ResponseRateChart() {
  const [hovered, setHovered] = useState<number | null>(null)

  const data = useMemo<ChartPoint[]>(() => {
    const start = new Date('2026-03-15T00:00:00')
    return CHART_VALUES.map((v, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const day = d.getDay()
      return {
        i,
        y: v,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }),
        isWeekend: day === 0 || day === 6,
        outlier: OUTLIERS[i],
      }
    })
  }, [])

  // Geometry — wider viewBox keeps the chart short when stretched to 100%
  const width = 1200
  const height = 240
  const padding = { top: 20, right: 20, bottom: 32, left: 44 }
  const cw = width - padding.left - padding.right
  const ch = height - padding.top - padding.bottom
  const xs = (i: number) => padding.left + (i / (CHART_VALUES.length - 1)) * cw
  const ys = (y: number) => padding.top + ch - (y / 100) * ch

  // Smooth catmull-rom spline
  const linePath = useMemo(() => {
    const pts = data.map(p => ({ x: xs(p.i), y: ys(p.y) }))
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
  }, [data])

  // Area path (line + close to baseline) for gradient fill
  const areaPath = useMemo(
    () => `${linePath} L ${xs(data.length - 1)} ${ys(0)} L ${xs(0)} ${ys(0)} Z`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linePath]
  )

  const bandWidth = cw / (data.length - 1)
  const yTicks = [0, 25, 50, 75, 100] // sparser, modern

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          {/* Area gradient — brand blue fading down */}
          <linearGradient id="fi-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#166CCA" stopOpacity="0.22" />
            <stop offset="55%"  stopColor="#166CCA" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#166CCA" stopOpacity="0" />
          </linearGradient>

          {/* Line gradient — brand-600 → brand-400 */}
          <linearGradient id="fi-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#185BA4" />
            <stop offset="50%"  stopColor="#166CCA" />
            <stop offset="100%" stopColor="#4896EC" />
          </linearGradient>

          {/* Soft glow under the line for depth */}
          <filter id="fi-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Weekend bands — nearly invisible */}
        {data.map(d => d.isWeekend && (
          <rect
            key={`wk-${d.i}`}
            x={xs(d.i) - bandWidth / 2}
            y={padding.top}
            width={bandWidth}
            height={ch}
            fill="rgba(0,0,0,0.025)"
            opacity={1}
          />
        ))}

        {/* Y grid (dashed) + labels */}
        {yTicks.map(t => (
          <g key={t}>
            <line
              x1={padding.left}
              y1={ys(t)}
              x2={width - padding.right}
              y2={ys(t)}
              stroke="rgba(0,0,0,0.06)"
              strokeDasharray="3 5"
              strokeWidth="1"
            />
            <text
              x={padding.left - 12}
              y={ys(t) + 4}
              textAnchor="end"
              fill="rgba(0,0,0,0.25)"
              fontSize="10"
              fontWeight="500"
              letterSpacing="0.5"
            >
              {t}%
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#fi-area)" />

        {/* Line + soft glow (animated draw on mount) */}
        <path
          d={linePath}
          pathLength={1}
          fill="none"
          stroke="url(#fi-line)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1,
            animation: 'drawLine 1.2s ease-out 0.4s both',
          }}
        />

        {/* Outliers — AI purple for low, brand blue for spike */}
        {data.map(d => {
          if (!d.outlier) return null
          const color = d.outlier === 'low' ? AI_COLOR : '#166CCA'
          return (
            <g key={`out-${d.i}`}>
              <circle cx={xs(d.i)} cy={ys(d.y)} r={12} fill={color} opacity={0.12} />
              <circle cx={xs(d.i)} cy={ys(d.y)} r={6} fill="white" stroke={color} strokeWidth={2.5} />
              <circle cx={xs(d.i)} cy={ys(d.y)} r={2.5} fill={color} />
            </g>
          )
        })}

        {/* Hover hitboxes */}
        {data.map(d => (
          <rect
            key={`h-${d.i}`}
            x={xs(d.i) - bandWidth / 2}
            y={padding.top}
            width={bandWidth}
            height={ch}
            fill="transparent"
            onMouseEnter={() => setHovered(d.i)}
            style={{ cursor: 'crosshair' }}
          />
        ))}

        {/* Hover indicator — dashed crosshair + ringed marker */}
        {hovered !== null && (
          <g>
            <line
              x1={xs(hovered)} y1={padding.top}
              x2={xs(hovered)} y2={padding.top + ch}
              stroke="#166CCA" strokeOpacity={0.35} strokeDasharray="3 4"
            />
            <circle cx={xs(hovered)} cy={ys(data[hovered].y)} r={9} fill="#166CCA" opacity={0.15} />
            <circle cx={xs(hovered)} cy={ys(data[hovered].y)} r={5} fill="white" stroke="#166CCA" strokeWidth={2.5} />
          </g>
        )}

        {/* X labels — every 6 days */}
        {data.filter((_, i) => i % 6 === 0).map(d => (
          <text
            key={`xl-${d.i}`}
            x={xs(d.i)}
            y={height - 14}
            textAnchor="middle"
            fill="rgba(0,0,0,0.35)"
            fontSize="11"
            fontWeight="500"
            letterSpacing="0.3"
          >
            {d.date}
          </text>
        ))}
      </svg>

      {/* Tooltip — glass card, modern */}
      {hovered !== null && (
        <div
          className="absolute pointer-events-none z-10 transition-opacity duration-150"
          style={{
            left: `${(xs(hovered) / width) * 100}%`,
            top: `${(ys(data[hovered].y) / height) * 100}%`,
            transform: 'translate(-50%, -140%)',
          }}
        >
          <div
            style={{
              borderRadius: R_LG, padding: '10px 14px', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)',
              background: 'var(--lyra-color-bg-surface-inverse)',
              boxShadow: SH_LG,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)', lineHeight: 1, fontFamily: F }}>
              {data[hovered].fullDate}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--lyra-color-fg-inverse)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', fontFamily: F }}>{data[hovered].y}%</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: F }}>response rate</span>
            </div>
            {data[hovered].outlier && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: data[hovered].outlier === 'low' ? AI_COLOR : '#166CCA' }}
                />
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.75)' }}>
                  {data[hovered].outlier === 'low' ? 'Low outlier' : 'Spike detected'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- 4. By Customer Type panel ---------- */
type CustomerRow = { name: string; pct: number; vs: string; trend: '↑' | '→' | '↓'; tone: 'up' | 'flat' | 'down' }

const CUSTOMER_ROWS: CustomerRow[] = [
  { name: 'Business Frequent Flyer', pct: 73, vs: '+18pp', trend: '↑', tone: 'up' },
  { name: 'Leisure Repeat Traveler', pct: 61, vs: '+6pp',  trend: '→', tone: 'flat' },
  { name: 'First-Time Traveler',     pct: 47, vs: '-8pp',  trend: '↓', tone: 'down' },
  { name: 'Group Booking',           pct: 31, vs: '-24pp', trend: '→', tone: 'down' },
]

function ByCustomerTypePanel({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_LG, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BD_SUBTLE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: FG, marginBottom: 2, lineHeight: 1.2, fontFamily: F, margin: '0 0 2px 0' }}>By Customer Type</h3>
          <p style={{ fontSize: 12, color: FG_SEC, lineHeight: 1.2, fontFamily: F, margin: 0 }}>Segment response rate vs. 55.4% baseline</p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: AI_BG, border: `1px solid ${AI_BORDER}`, borderRadius: R_FULL, fontSize: 12, fontWeight: 600, color: AI_COLOR, fontFamily: F, whiteSpace: 'nowrap' }}>
          <Sparkles className="h-3 w-3" style={{ color: AI_COLOR }} fill={AI_COLOR} />
          AI segment pattern
        </div>
      </div>

      <PanelInsightAccordion
        expanded={expanded}
        onToggle={onToggle}
        collapsed="Business Frequent Flyers lead — Group Bookings are a structural outlier"
        insightBullets={[
          'Business Frequent Flyers respond 18pp above baseline — consistent across all weeks and channels',
          'Group Bookings are a structural outlier — survey reaches the organizer, not the individual traveler',
          'First-Time Travelers at 47% — one bad experience determines their entire brand perception',
        ]}
        expectedImpact={[
          'Redirecting Group Booking surveys to individual travelers could recover 8pp response rate',
          'Targeted re-engagement campaign for First-Time Travelers within 24hrs of journey could lift retention',
        ]}
        action="Fix Group Booking survey routing · A/B test First-Time Traveler re-engagement campaign"
      />

      <div style={{ padding: 16, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CUSTOMER_ROWS.map(r => <CustomerTypeRow key={r.name} row={r} />)}
        </div>
      </div>
    </div>
  )
}

function CustomerTypeRow({ row }: { row: CustomerRow }) {
  const dotColor = row.tone === 'up' ? AI_COLOR : row.tone === 'flat' ? BRAND_600 : FG_SEC
  const deltaColor = row.tone === 'up' ? S_SUC_FG : row.tone === 'flat' ? FG_SEC : S_CRIT_FG

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: dotColor }} />
      <div style={{ flex: 1, fontSize: 14, color: FG, fontWeight: 500, lineHeight: 1, fontFamily: F }}>{row.name}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: FG, lineHeight: 1, fontFamily: F }}>{row.pct}%</div>
      <div style={{ width: 42, textAlign: 'right', fontSize: 12, fontWeight: 600, lineHeight: 1, color: deltaColor, fontFamily: F }}>
        {row.vs}
      </div>
      <div style={{ width: 20, textAlign: 'center', fontSize: 16, lineHeight: 1, color: deltaColor, fontFamily: F }}>
        {row.trend}
      </div>
    </div>
  )
}

/* ---------- 6. By Channel panel ---------- */
type ChannelRow = { name: string; pct: number; delta: string; tone: 'up' | 'flat' | 'down' }

const CHANNEL_ROWS: ChannelRow[] = [
  { name: 'SMS',        pct: 71, delta: '+16pp', tone: 'up' },
  { name: 'WhatsApp',   pct: 68, delta: '+13pp', tone: 'up' },
  { name: 'Email',      pct: 64, delta: '+9pp',  tone: 'up' },
  { name: 'Voice IVR',  pct: 52, delta: '-3pp',  tone: 'flat' },
  { name: 'Web Widget', pct: 45, delta: '-10pp', tone: 'down' },
]

function ByChannelPanel({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: BG_BASE, border: `1px solid ${BD_SOFT}`, borderRadius: R_LG, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BD_SUBTLE}` }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: FG, marginBottom: 2, lineHeight: 1.2, fontFamily: F, margin: '0 0 2px 0' }}>By Channel</h3>
        <p style={{ fontSize: 12, color: FG_SEC, lineHeight: 1.2, fontFamily: F, margin: 0 }}>Response rate per survey delivery method</p>
      </div>

      <PanelInsightAccordion
        expanded={expanded}
        onToggle={onToggle}
        collapsed="SMS leads weekdays · WhatsApp wins on Sundays"
        insightBullets={[
          'SMS leads at 71% but drops to 28% on Sundays — leisure travel day',
          'Web Widget is the lowest performer across every day of the week',
          'WhatsApp at 68% shows strong potential and no weekend drop pattern',
        ]}
        expectedImpact={[
          'Shifting Sunday surveys from SMS to WhatsApp could recover 30–40pp on weekend response rate',
          'Removing Web Widget as a primary survey channel reduces delivery failure risk',
        ]}
        action="A/B test WhatsApp vs. SMS on Sundays · Deprioritize Web Widget survey delivery"
      />

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CHANNEL_ROWS.map(r => <ChannelRowItem key={r.name} row={r} />)}
        </div>
      </div>
    </div>
  )
}

function ChannelRowItem({ row }: { row: ChannelRow }) {
  const barColor = row.tone === 'up' ? BRAND_600 : row.tone === 'flat' ? FG_SEC : S_CRIT_FG
  const deltaColor = row.tone === 'up' ? S_SUC_FG : row.tone === 'flat' ? FG_SEC : S_CRIT_FG

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 14, color: FG, fontWeight: 500, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F }}>{row.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: FG, lineHeight: 1, fontFamily: F }}>{row.pct}%</span>
          <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1, color: deltaColor, fontFamily: F }}>{row.delta}</span>
        </div>
      </div>
      <div style={{ height: 6, background: BD_SUBTLE, borderRadius: R_FULL, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: R_FULL, transition: 'width 0.3s ease', width: `${row.pct}%`, background: barColor }} />
      </div>
    </div>
  )
}

/* ---------- Campaign context strip ---------- */
const CTX_STATUS_STYLES: Record<CampaignStatus, { bg: string; text: string; label: string }> = {
  active: { bg: S_SUC_BG,  text: S_SUC_FG,  label: 'Active' },
  paused: { bg: S_WARN_BG, text: S_WARN_FG, label: 'Paused' },
  draft:  { bg: BG_SHELL,  text: FG_SEC,    label: 'Draft'  },
  ended:  { bg: BG_SHELL,  text: FG_DIS,    label: 'Ended'  },
}

function CampaignContextStrip({
  campaign,
  onBackToPortfolio,
  onViewOperations,
}: {
  campaign: Campaign
  onBackToPortfolio?: () => void
  onViewOperations?: () => void
}) {
  const s = CTX_STATUS_STYLES[campaign.status]
  return (
    <div style={{ borderRadius: R_LG, background: BG_BASE, border: `1px solid ${BD_SOFT}`, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, fontFamily: F }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {onBackToPortfolio && (
          <button
            onClick={onBackToPortfolio}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: FG_LINK, marginBottom: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: F }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = FG }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = FG_LINK }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all campaigns
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: FG, fontFamily: F }}>{campaign.name}</span>
          <span style={{ fontSize: 13, color: FG_SEC, fontWeight: 500, fontFamily: F }}>{campaign.version}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: R_FULL, padding: '2px 8px', fontSize: 12, fontWeight: 600, background: s.bg, color: s.text, fontFamily: F }}>
            {s.label}
          </span>
          {campaign.daysRunning !== null && (
            <>
              <span style={{ fontSize: 12, color: FG_SEC, fontFamily: F }}>·</span>
              <span style={{ fontSize: 12, color: FG_SEC, fontFamily: F }}>{campaign.daysRunning} days running</span>
            </>
          )}
          <span style={{ fontSize: 12, color: FG_SEC, fontFamily: F }}>·</span>
          <span style={{ fontSize: 12, color: FG_SEC, fontFamily: F }}>{campaign.channels.join(' · ')}</span>
        </div>
        <p style={{ fontSize: 12, color: FG_SEC, marginTop: 4, lineHeight: 1.4, fontFamily: F, margin: '4px 0 0 0' }}>
          Trigger: {campaign.trigger}
        </p>
      </div>
      {onViewOperations && (
        <button
          onClick={onViewOperations}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: R_MD, border: `1px solid ${AI_BORDER}`, background: AI_BG, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: AI_COLOR, cursor: 'pointer', flexShrink: 0, fontFamily: F }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(78,57,168,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = AI_BG }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: AI_COLOR }} fill={AI_COLOR} />
          View Campaign Insight
        </button>
      )}
    </div>
  )
}
