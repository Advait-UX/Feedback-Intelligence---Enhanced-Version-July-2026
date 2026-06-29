import { useState, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'
import { CAMPAIGNS, portfolioSummary, type Campaign, type CampaignStatus } from '@/lib/campaigns'

const FONT = 'var(--lyra-font-sans)'
const CARD_SHADOW = 'var(--sol-effect-shadowsm)'
const CARD_BORDER = '1px solid var(--lyra-color-border-subtle)'

/* ============================================================
 * Feedback Campaign Monitor — Level 1 portfolio dashboard
 * ============================================================ */
export function SurveyCampaignMonitoringPage({
  onSelectCampaign,
  onCreateCampaign,
}: {
  onSelectCampaign: (campaignId: string) => void
  onBackToAdmin: () => void
  onCreateCampaign?: () => void
}) {
  const summary = portfolioSummary()

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--lyra-color-bg-surface-base)', fontFamily: FONT }}>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-auto">
        <div style={{ padding: 'var(--space-6) var(--space-7) var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>

          {/* ── Floating filter bar ── */}
          <div style={{
            background: 'var(--lyra-color-bg-surface-shell)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
          }}>
            <FilterRow />
          </div>

          {/* KPI section */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 600,
                color: 'var(--lyra-color-fg-secondary)', letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                Campaign Performance
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>
                <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 8, height: 8, flexShrink: 0 }}>
                  <span className="alert-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--lyra-color-status-success-medium)' }} />
                  <span className="alert-core" style={{ position: 'relative', width: 6, height: 6, borderRadius: '50%', background: 'var(--lyra-color-status-success-strong)' }} />
                </span>
                Live across active campaigns · last 30 days
              </span>
            </div>
            <KpiRow summary={summary} />
          </section>

          {/* Table section */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <SectionHeader
                title="Campaigns"
                badge={CAMPAIGNS.filter(c => c.status === 'active').length}
              />
              {onCreateCampaign && (
                <button
                  onClick={onCreateCampaign}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 16px', borderRadius: 'var(--radius-md)',
                    border: 'none', background: 'var(--lyra-color-bg-primary)',
                    font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-on-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  Create Campaign
                </button>
              )}
            </div>
            <CampaignTable onSelectCampaign={onSelectCampaign} />
          </section>

        </div>
      </div>
    </div>
  )
}

/* ── Alert dot — red pulse for campaigns with critically low response rate (< 40%) ── */
const LIVE_DOT_CSS = `
@keyframes alert-ping {
  0%, 100% { transform: scale(1);   opacity: 0.5; }
  50%       { transform: scale(2.4); opacity: 0; }
}
@keyframes alert-core {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.65; }
}
.alert-ping { animation: alert-ping 2.2s ease-in-out infinite; }
.alert-core { animation: alert-core 2.2s ease-in-out infinite; }
`

function LiveDot() {
  return (
    <>
      <style>{LIVE_DOT_CSS}</style>
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 8, height: 8, flexShrink: 0 }}>
        <span className="alert-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--lyra-color-status-critical-medium)' }} />
        <span className="alert-core" style={{ position: 'relative', width: 6, height: 6, borderRadius: '50%', background: 'var(--lyra-color-status-critical-strong)' }} />
      </span>
    </>
  )
}

/* ── Section header with extending rule ── */
function SectionHeader({ title, right, badge }: { title: string; right?: React.ReactNode; badge?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 600,
          color: 'var(--lyra-color-fg-secondary)', letterSpacing: '0.07em',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
        {badge !== undefined && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 20, height: 20, paddingLeft: 6, paddingRight: 6,
            borderRadius: 'var(--radius-full)',
            background: 'var(--lyra-slate-200)',
            color: 'var(--lyra-slate-600)',
            fontSize: 11, fontWeight: 600, fontFamily: FONT,
            fontVariantNumeric: 'tabular-nums', letterSpacing: 0,
          }}>
            {badge}
          </span>
        )}
      </div>
      {right}
    </div>
  )
}

/* ── Filter row ── */
const CHEVRON = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%2382959e' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`

function FilterRow() {
  const filters = ['Last 30 days', 'All Campaigns', 'All Channels', 'All Categories']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            width: 14, height: 14, color: 'var(--lyra-color-fg-disabled)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search campaigns"
            style={{
              height: 32, width: 200, paddingLeft: 32, paddingRight: 10,
              background: 'var(--lyra-color-bg-field)', border: '1px solid var(--lyra-color-border-soft)',
              borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--lyra-color-fg-default)',
              fontFamily: FONT, outline: 'none',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--lyra-color-border-focus-default)'
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24,91,164,0.15)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--lyra-color-border-soft)'
              e.currentTarget.style.boxShadow = ''
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'var(--lyra-color-border-soft)', flexShrink: 0 }} />

        {/* Selects */}
        {filters.map(label => (
          <select
            key={label}
            style={{
              height: 32, paddingLeft: 12, paddingRight: 32,
              background: `var(--lyra-color-bg-field) ${CHEVRON} no-repeat right 10px center`,
              border: '1px solid var(--lyra-color-border-soft)', borderRadius: 'var(--radius-md)',
              fontSize: 14, fontWeight: 500, color: 'var(--lyra-color-fg-default)', fontFamily: FONT,
              appearance: 'none', cursor: 'pointer', outline: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--lyra-color-border-medium)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--lyra-color-border-soft)' }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--lyra-color-border-focus-default)'
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24,91,164,0.15)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--lyra-color-border-soft)'
              e.currentTarget.style.boxShadow = ''
            }}
          >
            <option>{label}</option>
          </select>
        ))}
      </div>
      <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>Jun 2, 2026 · 09:14</span>
    </div>
  )
}

/* ── Shared tooltip style — Lyra overlay surface, WCAG AA ── */
const TOOLTIP_SHELL: React.CSSProperties = {
  background: 'var(--lyra-color-bg-surface-overlay)',
  border: '1px solid var(--lyra-color-border-soft)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--sol-effect-shadowlg)',
  padding: '6px 10px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 9999,
  fontFamily: FONT,
  lineHeight: 1.5,
}
const TOOLTIP_LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 400, color: 'var(--lyra-color-fg-secondary)',
}
const TOOLTIP_VALUE: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: 'var(--lyra-color-fg-default)',
}

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={e => { setVisible(true); setPos({ x: e.clientX, y: e.clientY }) }}
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span style={{
          ...TOOLTIP_SHELL,
          position: 'fixed',
          left: pos.x,
          top: pos.y - 44,
          transform: 'translateX(-50%)',
        }}>
          <span style={TOOLTIP_VALUE}>{text}</span>
        </span>
      )}
    </span>
  )
}

/* ── Sparkline ── */
const SPARK_DATA = [
  [1, 1, 2, 2, 3, 3, 3, 3, 4, 4],
  [48.0, 49.2, 48.8, 50.1, 50.5, 51.0, 51.8, 52.1, 52.3, 52.5],
  [2400, 2550, 2680, 2750, 2820, 2900, 2970, 3040, 3090, 3136],
  [68, 70, 69, 71, 71, 72, 72, 73, 73, 74],
]

// Week labels for sparkline tooltips (most recent = last)
const SPARK_WEEKS = ['Apr 7', 'Apr 14', 'Apr 21', 'Apr 28', 'May 5', 'May 12', 'May 19', 'May 26', 'Jun 2', 'Jun 9']

// Trend-based palette: blue for up, red for down, slate for flat
const TREND_UP_LINE   = '#185BA4'  // brand-700
const TREND_UP_GRAD   = '#4896EC'  // brand-400 — lighter for gradient top
const TREND_DOWN_LINE = '#DC2626'  // red-600
const TREND_DOWN_GRAD = '#EF4444'  // red-500 (lighter for gradient top)
const TREND_FLAT_LINE = 'var(--lyra-slate-500)'

function sparkTrend(data: number[]): 'up' | 'down' | 'flat' {
  if (data.length < 2) return 'flat'
  const first = data[0], last = data[data.length - 1]
  const pctChange = Math.abs(first) > 0 ? (last - first) / Math.abs(first) : 0
  if (pctChange > 0.01) return 'up'
  if (pctChange < -0.01) return 'down'
  return 'flat'
}

function Sparkline({ data, color: _accentColor, width = 160, height = 52, tooltipLabel = '' }: {
  data: number[]; color: string; width?: number; height?: number; tooltipLabel?: string
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const trend = sparkTrend(data)
  const lineColor = trend === 'up' ? TREND_UP_LINE : trend === 'down' ? TREND_DOWN_LINE : TREND_FLAT_LINE
  const gradTop   = trend === 'up' ? TREND_UP_GRAD : trend === 'down' ? TREND_DOWN_GRAD : TREND_FLAT_LINE

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padY = 8
  const padX = 6  // keeps first/last point away from edges so dot isn't clipped

  const pts = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (width - padX * 2),
    y: (height - padY * 2) - ((v - min) / range) * (height - padY * 2) + padY,
  }))

  const line = pts.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1]
    const cpx = (prev.x + p.x) / 2
    return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }).join(' ')

  const fill = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`
  const last = pts[pts.length - 1]
  const gradId = `sg-${trend}-${width}`
  const lineId = `sl-${trend}-${width}`

  const activeIdx = hoverIdx ?? data.length - 1
  const activePt = pts[activeIdx]

  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      <svg
        width="100%" height={height} viewBox={`0 0 ${width} ${height}`} fill="none"
        preserveAspectRatio="none"
        style={{ overflow: 'visible', cursor: 'crosshair', display: 'block' }}
        onMouseMove={e => {
          const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
          const scaleX = width / rect.width
          const mx = (e.clientX - rect.left) * scaleX
          let closest = 0, minDist = Infinity
          pts.forEach((p, i) => {
            const d = Math.abs(p.x - mx)
            if (d < minDist) { minDist = d; closest = i }
          })
          setHoverIdx(closest)
          // store viewport coords for fixed positioning
          setTooltipPos({ x: e.clientX, y: e.clientY })
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={gradTop}   stopOpacity="0.38" />
            <stop offset="40%"  stopColor={lineColor}  stopOpacity="0.14" />
            <stop offset="100%" stopColor={lineColor}  stopOpacity="0" />
          </linearGradient>
          <clipPath id={lineId}>
            <rect x="0" y="0" width={width} height={height}>
              <animate attributeName="width" from="0" to={width} dur="1s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
            </rect>
          </clipPath>
        </defs>
        <path d={fill} fill={`url(#${gradId})`} clipPath={`url(#${lineId})`} />
        <path d={line} stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${lineId})`} />
        {/* Hover vertical rule */}
        {hoverIdx !== null && (
          <line x1={activePt.x} y1={0} x2={activePt.x} y2={height}
            stroke={lineColor} strokeWidth="1" strokeDasharray="3 2" opacity={0.4} />
        )}
        {/* Hover dot */}
        {hoverIdx !== null && (
          <>
            <circle cx={activePt.x} cy={activePt.y} r="5" fill={lineColor} opacity="0.15" />
            <circle cx={activePt.x} cy={activePt.y} r="3" fill={lineColor} />
          </>
        )}
        {/* Live endpoint dot — pulse ring + solid core */}
        {hoverIdx === null && (
          <>
            <circle cx={last.x} cy={last.y} r="3" fill={lineColor} opacity="0.18">
              <animate attributeName="r" values="3;9;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.18;0;0.18" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={last.x} cy={last.y} r="3.5" fill="white" />
            <circle cx={last.x} cy={last.y} r="2.5" fill={lineColor} />
          </>
        )}
      </svg>
      {/* Tooltip */}
      {hoverIdx !== null && (
        <div style={{ ...TOOLTIP_SHELL, position: 'fixed', left: tooltipPos.x, top: tooltipPos.y - 60, transform: 'translateX(-50%)' }}>
          <div style={{ ...TOOLTIP_LABEL, marginBottom: 2 }}>{SPARK_WEEKS[hoverIdx]}</div>
          <div style={TOOLTIP_VALUE}>{tooltipLabel}{data[hoverIdx].toLocaleString()}</div>
        </div>
      )}
    </div>
  )
}


/* ─────────────────────────────────────────────
   KPI Card system
   Structure: accent bar · label · [value | visual] · footer
   Middle row height is fixed by the visual (donut=64px, sparkline=52px+padding=60px)
   No flex:1 on any zone — height is purely content-driven, all cards equal.
   ───────────────────────────────────────────── */

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--lyra-color-fg-secondary)',
  textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT,
  marginBottom: 12,
}

const BIG_NUM: React.CSSProperties = {
  fontSize: 36, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.025em',
  color: 'var(--lyra-color-fg-default)', fontFamily: FONT, fontVariantNumeric: 'tabular-nums',
}

function KpiShell({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--lyra-color-bg-surface-base)',
      borderRadius: 14,
      border: '1px solid var(--lyra-color-border-subtle)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: accent, flexShrink: 0 }} />
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

/* ── Delta badge ── */
function DeltaBadge({ text, suffix, tone }: { text: string; suffix?: string; tone: 'up' | 'down' | 'flat' }) {
  const color = tone === 'up' ? 'var(--lyra-color-status-success-strong)' : tone === 'down' ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-fg-secondary)'
  const bg    = tone === 'up' ? 'var(--lyra-color-status-success-subtle)' : tone === 'down' ? 'var(--lyra-color-status-critical-subtle)' : 'var(--lyra-color-bg-disabled)'
  const arrow = tone === 'up' ? '↑' : tone === 'down' ? '↓' : ''
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        background: bg, color, borderRadius: 9999,
        padding: '3px 8px', fontSize: 12, fontWeight: 600, fontFamily: FONT,
      }}>
        {arrow} {text}
      </span>
      {suffix && <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>{suffix}</span>}
    </div>
  )
}

/* ── Card 1: Active Campaigns — stacked bar ── */
function ActiveCampaignsTile({ accent, total, activeCount, breakdown }: {
  accent: string; total: number; activeCount: number
  breakdown: { active: number; inactive: number; expired: number }
}) {
  const [mounted, setMounted] = useState(false)
  const [hoveredSeg, setHoveredSeg] = useState<{ label: string; count: number; pct: number; x: number; y: number } | null>(null)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])

  const segments = [
    { label: 'Active',   count: breakdown.active,   color: '#64B96F' },
    { label: 'Inactive', count: breakdown.inactive,  color: '#FACB33' },
    { label: 'Expired',  count: breakdown.expired,   color: '#C8D0D5' },
  ]

  return (
    <KpiShell accent={accent}>
      <div style={LABEL_STYLE}>Active campaigns</div>

      {/* Value — full row, mirrors KpiTile layout */}
      <div style={{ marginBottom: 10 }}>
        <span style={{ ...BIG_NUM }}>{activeCount}</span>
        <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT, marginLeft: 8 }}>
          of {total} total
        </span>
      </div>

      {/* Stacked bar — same width and container height as sparklines in other cards */}
      <div style={{ width: '100%', height: 48, display: 'flex', alignItems: 'flex-end', marginBottom: 14, position: 'relative' }}>
        <div style={{
          display: 'flex', width: '100%', height: 12,
          borderRadius: 6, overflow: 'hidden',
          background: 'var(--lyra-color-bg-disabled)',
        }}>
          {segments.map((seg, i) => {
            const pct = mounted ? (seg.count / total) * 100 : 0
            const isFirst = i === 0
            const isLast = i === segments.length - 1
            return (
              <div
                key={seg.label}
                style={{
                  width: `${pct}%`,
                  background: seg.color,
                  borderRadius: isFirst ? '6px 0 0 6px' : isLast ? '0 6px 6px 0' : 0,
                  transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                  flexShrink: 0, cursor: 'default',
                }}
                onMouseEnter={e => {
                  setHoveredSeg({ label: seg.label, count: seg.count, pct: Math.round((seg.count / total) * 100), x: e.clientX, y: e.clientY })
                }}
                onMouseMove={e => {
                  setHoveredSeg(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)
                }}
                onMouseLeave={() => setHoveredSeg(null)}
              />
            )
          })}
        </div>
        {/* Stacked bar tooltip */}
        {hoveredSeg && (
          <div style={{ ...TOOLTIP_SHELL, position: 'fixed', left: hoveredSeg.x, top: hoveredSeg.y - 52, transform: 'translateX(-50%)' }}>
            <div style={TOOLTIP_VALUE}>{hoveredSeg.label}</div>
            <div style={{ ...TOOLTIP_LABEL, marginTop: 2 }}>{hoveredSeg.count} campaigns · {hoveredSeg.pct}%</div>
          </div>
        )}
      </div>

      {/* Spacer pushes legend to card bottom */}
      <div style={{ flex: 1 }} />

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontFamily: FONT, color: 'var(--lyra-color-fg-secondary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--lyra-color-fg-default)', fontVariantNumeric: 'tabular-nums' }}>{s.count}</span>
              {' '}{s.label}
            </span>
          </div>
        ))}
      </div>
    </KpiShell>
  )
}

/* ── Card 2: Avg Response Rate — progress bar with target marker ── */
function ResponseRateTile({ accent, value, target = 60, delta }: {
  accent: string; value: number; target?: number
  delta?: { text: string; suffix?: string }
}) {
  const [mounted, setMounted] = useState(false)
  const [barTooltip, setBarTooltip] = useState<{ x: number; y: number } | null>(null)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])

  const pct = mounted ? Math.min(value, 100) : 0
  const targetPct = target
  const gap = Math.abs(value - target)
  const barColor = value >= target
    ? 'var(--lyra-color-status-success-strong)'
    : value >= 40
    ? 'var(--lyra-color-status-warning-strong)'
    : 'var(--lyra-color-status-critical-strong)'

  return (
    <KpiShell accent={accent}>
      <div style={LABEL_STYLE}>Avg response rate</div>

      <div style={{ marginBottom: 10 }}>
        <span style={{ ...BIG_NUM }}>{value}%</span>
      </div>

      {/* Progress bar with target marker — 48px zone, vertically centered */}
      <div style={{ width: '100%', height: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, marginBottom: 14, position: 'relative' }}>
        {/* Labels row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <span style={{ fontSize: 11, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>0%</span>
          <span style={{
            position: 'absolute', left: `${targetPct}%`, transform: 'translateX(-50%)',
            fontSize: 11, fontWeight: 500, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT,
            whiteSpace: 'nowrap',
          }}>Target {target}%</span>
          <span style={{ fontSize: 11, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>100%</span>
        </div>

        {/* Track + fill + target tick */}
        <div
          style={{ position: 'relative', width: '100%', height: 12, borderRadius: 9999, background: 'var(--lyra-color-bg-disabled)', cursor: 'default' }}
          onMouseMove={e => setBarTooltip({ x: e.clientX, y: e.clientY })}
          onMouseLeave={() => setBarTooltip(null)}
        >
          {/* Fill */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${pct}%`,
            borderRadius: 9999,
            background: barColor,
            transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
          }} />
          {/* Target marker tick */}
          <div style={{
            position: 'absolute', top: -2, bottom: -2,
            left: `${targetPct}%`, transform: 'translateX(-50%)',
            width: 2, borderRadius: 2,
            background: 'var(--lyra-color-fg-default)',
            opacity: 0.45,
          }} />
        </div>

        {/* Progress bar tooltip */}
        {barTooltip && (
          <div style={{ ...TOOLTIP_SHELL, position: 'fixed', left: barTooltip.x, top: barTooltip.y - 52, transform: 'translateX(-50%)' }}>
            <div style={TOOLTIP_VALUE}>{value}% current</div>
            <div style={{ ...TOOLTIP_LABEL, marginTop: 2 }}>Target {target}% · {value >= target ? `${gap}pp above` : `${gap.toFixed(1)}pp to go`}</div>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />
      {delta && <DeltaBadge text={delta.text} suffix={delta.suffix} tone="up" />}
    </KpiShell>
  )
}

/* ── Cards 2–4: sparkline tiles — stacked layout guarantees equal chart widths ── */
function KpiTile({ label, value, delta, tone = 'up', accent, sparkData, sparkTooltipLabel = '' }: {
  label: string; value: string; accent: string
  sparkData?: number[]; sparkTooltipLabel?: string
  delta?: { text: string; suffix?: string }; tone?: 'up' | 'down' | 'flat'
}) {
  return (
    <KpiShell accent={accent}>
      <div style={LABEL_STYLE}>{label}</div>

      {/* Value — full row */}
      <div style={{ marginBottom: 10 }}>
        <span style={{ ...BIG_NUM }}>{value}</span>
      </div>

      {sparkData && (
        <div style={{ width: '100%', marginBottom: 14 }}>
          <Sparkline data={sparkData} color={accent} width={240} height={48} tooltipLabel={sparkTooltipLabel} />
        </div>
      )}

      {/* Spacer pushes badge to card bottom */}
      <div style={{ flex: 1 }} />

      {/* Delta badge */}
      {delta && <DeltaBadge text={delta.text} suffix={delta.suffix} tone={tone} />}
    </KpiShell>
  )
}

/* ── KPI grid ── */
const KPI_ACCENTS = [
  'var(--lyra-brand-700)',
  'var(--lyra-teal-500)',
  'var(--lyra-slate-600)',
  'var(--lyra-brand-500)',
]

function KpiRow({ summary }: { summary: ReturnType<typeof portfolioSummary> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
      <ActiveCampaignsTile
        accent={KPI_ACCENTS[0]}
        total={summary.totalCampaigns}
        activeCount={summary.activeCount}
        breakdown={summary.statusBreakdown}
      />
      <ResponseRateTile
        accent={KPI_ACCENTS[1]}
        value={summary.avgResponse}
        target={60}
        delta={{ text: '+3.2pp', suffix: 'vs. prior period' }}
      />
      <KpiTile label="Total responses" value={summary.totalResponses.toLocaleString()}
        accent={KPI_ACCENTS[2]} sparkData={SPARK_DATA[2]}
        delta={{ text: '+240', suffix: 'last 30 days' }} tone="up" />
      <KpiTile label="Avg CSAT score" value={`${summary.avgCsat}`}
        accent={KPI_ACCENTS[3]} sparkData={SPARK_DATA[3]}
        delta={{ text: '+4', suffix: 'vs. prior period' }} tone="up" />
    </div>
  )
}

/* ── CSAT badge ── */
function CsatBadge({ value }: { value: number | null | undefined }) {
  if (value == null) return <span style={{ color: 'var(--lyra-color-fg-secondary)', fontSize: 14 }}>—</span>
  // ≥70 light blue · 50–69 light orange · <50 light red
  const bg = value >= 70
    ? 'var(--lyra-color-status-info-subtle)'
    : value >= 50
    ? 'var(--lyra-color-status-warning-subtle)'
    : 'var(--lyra-color-status-critical-subtle)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      minWidth: 36, padding: '3px 8px',
      fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontFamily: FONT,
      backgroundColor: bg,
      color: 'var(--lyra-color-fg-default)',
      letterSpacing: '-0.01em',
    }}>
      {value}
    </span>
  )
}

/* ── Campaign table ── */
const STATUS_ORDER: Record<string, number> = { active: 0, paused: 1, draft: 2, ended: 3 }

function CampaignTable({ onSelectCampaign }: { onSelectCampaign: (id: string) => void }) {
  const sorted = CAMPAIGNS.filter(c => c.status === 'active')
    .sort((a, b) => (a.responseRate ?? 100) - (b.responseRate ?? 100))

  const cols = [
    { label: 'Campaign',       align: 'left'  },
    { label: 'Status',         align: 'left'  },
    { label: 'Response Rate',  align: 'left',  width: 200 },
    { label: 'Responses',      align: 'right' },
    { label: 'CSAT',           align: 'right' },
    { label: 'Emerging Topic', align: 'left'  },
    { label: 'Channel',        align: 'left'  },
    { label: 'Category',       align: 'left'  },
    { label: '',               align: 'right', width: 40 },
  ]

  return (
    <div style={{ background: 'var(--lyra-color-bg-surface-base)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--sol-effect-shadowmd)', border: '1px solid var(--lyra-color-border-soft)', overflow: 'hidden' }}>
      {/* Sticky header + scrollable body */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT, fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--lyra-color-bg-surface-base)' }}>
              {cols.map(col => (
                <th
                  key={col.label}
                  style={{
                    padding: 'var(--space-4) var(--space-5)',
                    textAlign: col.align as any,
                    fontSize: 12, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: 'var(--lyra-color-fg-secondary)',
                    width: col.width,
                    background: 'transparent',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => (
              <CampaignRow
                key={c.id}
                campaign={c}
                isLast={i === sorted.length - 1}
                onSelect={() => onSelectCampaign(c.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CampaignRow({ campaign, onSelect, isLast }: { campaign: Campaign; onSelect: () => void; isLast: boolean }) {
  const topTopic       = campaign.topIntents[0] ?? '—'
  const primaryChannel = campaign.channels[0]  ?? '—'
  const responses      = Math.round(((campaign.sent ?? 0) * (campaign.responseRate ?? 0)) / 100)

  return (
    <tr
      onClick={onSelect}
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'background 0.1s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--lyra-color-state-bg-hover-opacity)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}
    >
      <td style={{ padding: 'var(--space-4) var(--space-5)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--lyra-color-fg-default)' }}>{campaign.name}</span>
          {campaign.status === 'active' && (campaign.responseRate ?? 100) < 30 && <LiveDot />}
        </span>
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)' }}>
        <StatusPill status={campaign.status} />
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)' }}>
        <ResponseRateCell rate={campaign.responseRate ?? 0} />
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)', textAlign: 'right', color: 'var(--lyra-color-fg-secondary)', fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
        {responses.toLocaleString()}
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)', textAlign: 'right' }}>
        <CsatBadge value={campaign.csat} />
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)', color: 'var(--lyra-color-fg-secondary)', fontSize: 14 }}>{topTopic}</td>
      <td style={{ padding: 'var(--space-4) var(--space-5)' }}>
        <ChannelChip channel={primaryChannel} />
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)', color: 'var(--lyra-color-fg-secondary)', fontSize: 14 }}>{campaign.category}</td>
      <td style={{ padding: 'var(--space-4) 16px var(--space-4) 0', textAlign: 'right', width: 40 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', color: 'var(--lyra-color-fg-secondary)', opacity: 0.5 }}>
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </td>
    </tr>
  )
}

/* ── Response rate cell ── */
function ResponseRateCell({ rate }: { rate: number }) {
  const [animWidth, setAnimWidth] = useState(0)
  const [hovered, setHovered] = useState(false)
  const TARGET = 60
  const color = rate > 60
    ? 'var(--lyra-color-status-success-strong)'
    : rate >= 30
    ? 'var(--lyra-color-status-warning-strong)'
    : 'var(--lyra-color-status-critical-strong)'

  useEffect(() => {
    const t = setTimeout(() => setAnimWidth(rate), 60)
    return () => clearTimeout(t)
  }, [rate])

  const gap = TARGET - rate
  const tooltipText = gap > 0
    ? `${rate}% · ${gap}pp below ${TARGET}% target`
    : `${rate}% · ${Math.abs(gap)}pp above ${TARGET}% target`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color, minWidth: 38 }}>
        {rate}%
      </span>
      <div
        style={{ flex: 1, height: 4, background: 'var(--lyra-color-border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'visible', position: 'relative', cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          height: '100%',
          width: `${animWidth}%`,
          background: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
        }} />
        {/* Target tick at 60% */}
        <div style={{
          position: 'absolute', top: -3, bottom: -3,
          left: `${TARGET}%`, width: 2,
          background: 'var(--lyra-color-fg-secondary)',
          borderRadius: 1, opacity: 0.4,
          transform: 'translateX(-50%)',
        }} />
        {hovered && (
          <div style={{ ...TOOLTIP_SHELL, position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={TOOLTIP_VALUE}>{tooltipText}</div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Channel chip ── */
function ChannelChip({ channel }: { channel: string }) {
  return (
    <span style={{
      fontSize: 14, fontWeight: 400, color: 'var(--lyra-color-fg-default)', fontFamily: FONT,
    }}>
      {channel}
    </span>
  )
}

/* ── Status pill ── */
const STATUS_CFG: Record<CampaignStatus, { bg: string; color: string; border: string; label: string }> = {
  active: { bg: 'var(--lyra-color-status-success-subtle)', color: 'var(--lyra-color-status-success-strong)', border: 'rgba(35,114,45,0.18)',   label: 'Active' },
  paused: { bg: 'var(--lyra-color-status-warning-subtle)', color: 'var(--lyra-color-status-warning-strong)', border: 'rgba(142,104,0,0.18)',  label: 'Paused' },
  draft:  { bg: 'var(--lyra-slate-100)',                   color: 'var(--lyra-slate-600)',                   border: 'rgba(0,0,0,0.10)',       label: 'Draft'  },
  ended:  { bg: 'var(--lyra-slate-200)',                   color: 'var(--lyra-slate-500)',                   border: 'rgba(0,0,0,0.10)',       label: 'Ended'  },
}

function StatusPill({ status }: { status: CampaignStatus }) {
  const s = STATUS_CFG[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      borderRadius: 'var(--radius-full)', padding: '2px 8px',
      fontSize: 12, fontWeight: 500, lineHeight: '16px', letterSpacing: '0.01em',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: FONT, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {s.label}
    </span>
  )
}
