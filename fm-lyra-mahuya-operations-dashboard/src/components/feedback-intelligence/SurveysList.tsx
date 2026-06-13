import { ChevronRight } from 'lucide-react'
import type { Survey, SurveyStatus } from '@/lib/surveys'

/* ============================================================
 * SurveysList — Recent surveys table shown inside the per-campaign
 * Level 2 FI Dashboard. Each row drills into the SurveyDetailPage.
 * ============================================================ */
export function SurveysList({
  surveys,
  onOpenSurvey,
}: {
  surveys: Survey[]
  onOpenSurvey: (id: string) => void
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[16px] font-semibold text-[#0f172a]">Recent surveys</h2>
        <span className="text-[11px] text-[#94a3b8]">
          {surveys.length} surveys · click a row to open the survey detail
        </span>
      </div>

      {surveys.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 text-center">
          <p className="text-[13px] text-[#94a3b8]">No surveys yet for this campaign.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  Phone
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  Agent
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  Interaction
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  CSAT
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#94a3b8]">
                  Top Topic
                </th>
                <th className="px-5 py-3 w-[36px]" />
              </tr>
            </thead>
            <tbody>
              {surveys.map(s => (
                <SurveyRow key={s.id} survey={s} onSelect={() => onOpenSurvey(s.id)} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function SurveyRow({ survey, onSelect }: { survey: Survey; onSelect: () => void }) {
  const topTopic = survey.interaction.topicsDetected[0] ?? '—'
  const interactionDate = formatShortDate(survey.interaction.date)
  return (
    <tr
      onClick={onSelect}
      className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] cursor-pointer transition-colors"
    >
      <td className="px-5 py-3.5">
        <div className="text-[13px] font-medium text-[#0f172a]">{survey.customer.name}</div>
      </td>
      <td className="px-5 py-3.5 text-[#475569] tabular-nums">{survey.customer.phone}</td>
      <td className="px-5 py-3.5 text-[#475569]">{survey.customer.email}</td>
      <td className="px-5 py-3.5 text-[#475569]">{survey.agent.name}</td>
      <td className="px-5 py-3.5">
        <div className="text-[12px] text-[#0f172a]">{interactionDate}</div>
        <div className="text-[11px] text-[#94a3b8]">{survey.interaction.channel}</div>
      </td>
      <td className="px-5 py-3.5">
        <SurveyStatusPill status={survey.status} />
      </td>
      <td className="px-5 py-3.5 text-right tabular-nums">
        {survey.csat !== null ? (
          <span className="text-[#0f172a] font-semibold">{survey.csat}</span>
        ) : (
          <span className="text-[#cbd5e1]">—</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-[#475569]">{topTopic}</td>
      <td className="px-5 py-3.5 text-right">
        <ChevronRight className="h-4 w-4 text-[#94a3b8]" />
      </td>
    </tr>
  )
}

/* ---------- Status pill ---------- */
const SURVEY_STATUS_STYLES: Record<SurveyStatus, { bg: string; color: string; border: string; label: string }> = {
  completed: { bg: 'var(--lyra-color-status-success-subtle)', color: 'var(--lyra-color-status-success-strong)', border: 'rgba(35,114,45,0.18)',  label: 'Completed' },
  partial:   { bg: 'var(--lyra-color-status-warning-subtle)', color: 'var(--lyra-color-status-warning-strong)', border: 'rgba(142,104,0,0.18)', label: 'Partial'   },
  abandoned: { bg: 'var(--lyra-slate-200)',                   color: 'var(--lyra-slate-500)',                   border: 'rgba(0,0,0,0.10)',      label: 'Abandoned' },
  pending:   { bg: 'var(--lyra-slate-100)',                   color: 'var(--lyra-slate-600)',                   border: 'rgba(0,0,0,0.10)',      label: 'Pending'   },
}

export function SurveyStatusPill({ status }: { status: SurveyStatus }) {
  const s = SURVEY_STATUS_STYLES[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      borderRadius: 'var(--radius-full)', padding: '2px 8px',
      fontSize: 12, fontWeight: 500, lineHeight: '16px', letterSpacing: '0.01em',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
