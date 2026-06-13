import { Search } from 'lucide-react'
import { CAMPAIGNS, portfolioSummary, type Campaign, type CampaignStatus } from '@/lib/campaigns'

const FONT = 'var(--lyra-font-sans)'
const CARD_SHADOW = 'var(--sol-effect-shadowsm)'
const CARD_BORDER = '1px solid var(--lyra-color-border-subtle)'

/* ============================================================
 * Feedback Campaign Monitor — Level 1 portfolio dashboard
 * ============================================================ */
export function SurveyCampaignMonitoringPage({
  onSelectCampaign,
}: {
  onSelectCampaign: (campaignId: string) => void
  onBackToAdmin: () => void
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
            <SectionHeader
              title="Campaign Performance"
              right={
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>
                  <LiveDot />
                  Live across active campaigns · last 30 days
                </span>
              }
            />
            <KpiRow summary={summary} />
          </section>

          {/* Table section */}
          <section>
            <SectionHeader title="Campaigns" />
            <CampaignTable onSelectCampaign={onSelectCampaign} />
          </section>

        </div>
      </div>
    </div>
  )
}

/* ── Live indicator dot ── */
function LiveDot() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7 }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 'var(--radius-full)',
        background: 'var(--lyra-color-status-success-strong)', opacity: 0.5,
        animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
      }} />
      <span style={{ position: 'relative', width: 7, height: 7, borderRadius: 'var(--radius-full)', background: 'var(--lyra-color-status-success-strong)' }} />
      <style>{`@keyframes ping{75%,100%{transform:scale(2);opacity:0}}`}</style>
    </span>
  )
}

/* ── Section header with extending rule ── */
function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
      <span style={{
        fontFamily: FONT, fontSize: 12, fontWeight: 600,
        color: 'var(--lyra-color-fg-secondary)', letterSpacing: '0.07em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        {title}
      </span>
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

/* ── Sparkline ── */
const SPARK_DATA = [
  [1, 1, 2, 2, 3, 3, 3, 3, 4, 4],
  [48.0, 49.2, 48.8, 50.1, 50.5, 51.0, 51.8, 52.1, 52.3, 52.5],
  [2400, 2550, 2680, 2750, 2820, 2900, 2970, 3040, 3090, 3136],
  [68, 70, 69, 71, 71, 72, 72, 73, 73, 74],
]

function Sparkline({ data, color, width = 96, height = 44 }: {
  data: number[]; color: string; width?: number; height?: number
}) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 4

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: (height - pad * 2) - ((v - min) / range) * (height - pad * 2) + pad,
  }))

  const line = pts.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1]
    const cpx = (prev.x + p.x) / 2
    return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }).join(' ')

  const fill = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`
  const last = pts[pts.length - 1]
  const gradId = `sg-${color.replace(/[^a-z0-9]/gi, '')}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`} />
      <path d={line} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Glow dot */}
      <circle cx={last.x} cy={last.y} r="4" fill={color} opacity="0.18" />
      <circle cx={last.x} cy={last.y} r="2.5" fill={color} />
    </svg>
  )
}

/* ── KPI tiles ── */
const KPI_ACCENTS = [
  'var(--lyra-brand-700)',
  'var(--lyra-teal-500)',
  'var(--lyra-slate-600)',
  'var(--lyra-brand-500)',
]

function KpiRow({ summary }: { summary: ReturnType<typeof portfolioSummary> }) {
  const tiles = [
    { label: 'Active campaigns',  value: `${summary.activeCount}`,                sub: '1 launched this week' },
    { label: 'Avg response rate', value: `${summary.avgResponse}%`,               delta: { text: '+3.2pp', suffix: 'vs. prior period' }, tone: 'up' as const },
    { label: 'Total responses',   value: summary.totalResponses.toLocaleString(), delta: { text: '+240',   suffix: 'last 30 days'     }, tone: 'up' as const },
    { label: 'Avg CSAT score',    value: `${summary.avgCsat}`,                    delta: { text: '+4',     suffix: 'vs. prior period' }, tone: 'up' as const },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
      {tiles.map((t, i) => (
        <KpiTile key={t.label} accent={KPI_ACCENTS[i]} sparkData={SPARK_DATA[i]} {...t} />
      ))}
    </div>
  )
}

function KpiTile({
  label, value, sub, delta, tone = 'flat', accent, sparkData,
}: {
  label: string; value: string; accent: string; sparkData?: number[]
  sub?: string
  delta?: { text: string; suffix?: string }
  tone?: 'up' | 'down' | 'flat'
}) {
  const deltaColor = tone === 'up' ? 'var(--lyra-color-status-success-strong)' : tone === 'down' ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-fg-disabled)'
  const deltaBg    = tone === 'up' ? 'var(--lyra-color-status-success-subtle)' : tone === 'down' ? 'var(--lyra-color-status-critical-subtle)' : 'var(--lyra-color-bg-disabled)'
  const arrow      = tone === 'up' ? '↑' : tone === 'down' ? '↓' : ''

  return (
    <div style={{
      background: 'var(--lyra-color-bg-surface-base)', borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--sol-effect-shadowmd)', border: '1px solid var(--lyra-color-border-soft)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Accent bar */}
      <div style={{ height: 4, background: accent, flexShrink: 0 }} />

      <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Label */}
        <div style={{
          fontSize: 12, fontWeight: 500, color: 'var(--lyra-color-fg-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FONT, marginBottom: 'var(--space-3)',
        }}>
          {label}
        </div>

        {/* Value + sparkline row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{
            fontSize: 28, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.03em',
            color: 'var(--lyra-color-fg-default)', fontFamily: FONT, fontVariantNumeric: 'tabular-nums',
          }}>
            {value}
          </div>
          {sparkData && (
            <div style={{ paddingBottom: 2, opacity: 0.92 }}>
              <Sparkline data={sparkData} color={accent} width={88} height={44} />
            </div>
          )}
        </div>

        {/* Delta or sub */}
        {delta && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              background: deltaBg, color: deltaColor,
              borderRadius: 'var(--radius-full)', padding: 'var(--space-1) var(--space-2)',
              fontSize: 12, fontWeight: 600, fontFamily: FONT,
            }}>
              {arrow} {delta.text}
            </span>
            {delta.suffix && (
              <span style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>{delta.suffix}</span>
            )}
          </div>
        )}
        {sub && !delta && (
          <div style={{ fontSize: 12, color: 'var(--lyra-color-fg-secondary)', fontFamily: FONT }}>{sub}</div>
        )}
      </div>
    </div>
  )
}

/* ── Campaign table ── */
function CampaignTable({ onSelectCampaign }: { onSelectCampaign: (id: string) => void }) {
  const cols = [
    { label: 'Campaign',       align: 'left'  },
    { label: 'Status',         align: 'left'  },
    { label: 'Response Rate',  align: 'left',  width: 200 },
    { label: 'Responses',      align: 'right' },
    { label: 'CSAT',           align: 'right' },
    { label: 'Emerging Topic', align: 'left'  },
    { label: 'Channel',        align: 'left'  },
    { label: 'Category',       align: 'left'  },
  ]

  return (
    <div style={{ background: 'var(--lyra-color-bg-surface-base)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--sol-effect-shadowmd)', border: '1px solid var(--lyra-color-border-soft)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT, fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
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
          {CAMPAIGNS.map((c, i) => (
            <CampaignRow
              key={c.id}
              campaign={c}
              isLast={i === CAMPAIGNS.length - 1}
              onSelect={() => onSelectCampaign(c.id)}
            />
          ))}
        </tbody>
      </table>
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
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--lyra-color-fg-default)' }}>{campaign.name}</span>
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
      <td style={{ padding: 'var(--space-4) var(--space-5)', textAlign: 'right', color: 'var(--lyra-color-fg-secondary)', fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
        {campaign.csat ?? '—'}
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)', color: 'var(--lyra-color-fg-secondary)', fontSize: 14 }}>{topTopic}</td>
      <td style={{ padding: 'var(--space-4) var(--space-5)' }}>
        <ChannelChip channel={primaryChannel} />
      </td>
      <td style={{ padding: 'var(--space-4) var(--space-5)', color: 'var(--lyra-color-fg-secondary)', fontSize: 14 }}>{campaign.category}</td>
    </tr>
  )
}

/* ── Response rate cell ── */
function ResponseRateCell({ rate }: { rate: number }) {
  const color = rate >= 60
    ? 'var(--lyra-color-status-success-strong)'
    : rate >= 40
    ? 'var(--lyra-color-status-warning-strong)'
    : 'var(--lyra-color-status-critical-strong)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color, minWidth: 34 }}>
        {rate}%
      </span>
      <div style={{ flex: 1, height: 4, background: 'var(--lyra-color-border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${rate}%`, background: color, borderRadius: 'var(--radius-full)' }} />
      </div>
    </div>
  )
}

/* ── Channel chip ── */
function ChannelChip({ channel }: { channel: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      borderRadius: 'var(--radius-sm)', padding: 'var(--space-1) var(--space-2)',
      fontSize: 12, fontWeight: 600, letterSpacing: '0.01em',
      background: 'var(--lyra-color-bg-active-subtle)', color: 'var(--lyra-color-fg-active-strong)', fontFamily: FONT,
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
