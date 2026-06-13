import { ArrowLeft, Star, Sparkles, Phone, Mail, User, Headset, Clock, Calendar, MessageCircle } from 'lucide-react'
import type { Campaign } from '@/lib/campaigns'
import type { Survey, SurveyQuestion, RatingQuestion, OpenQuestion } from '@/lib/surveys'
import { SurveyStatusPill } from '@/components/feedback-intelligence/SurveysList'

const F = 'var(--lyra-font-sans, var(--font-sans))'

export function SurveyDetailPage({
  survey,
  campaign,
  onBack,
}: {
  survey: Survey
  campaign?: Campaign
  onBack: () => void
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--lyra-color-bg-surface-canvas)', fontFamily: F, display: 'flex', flexDirection: 'column' }}>

      {/* ── Page header ── */}
      <header style={{
        background: 'var(--lyra-color-bg-surface-base)',
        borderBottom: '1px solid var(--lyra-color-border-subtle)',
        padding: '18px 40px 22px',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            font: '500 12px/16px ' + F,
            color: 'var(--lyra-color-fg-secondary)',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 6px', borderRadius: 6, marginBottom: 16, marginLeft: -6,
            transition: 'background 0.12s, color 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--lyra-color-state-bg-hover-opacity)'; e.currentTarget.style.color = 'var(--lyra-color-fg-default)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--lyra-color-fg-secondary)' }}
        >
          <ArrowLeft style={{ width: 13, height: 13 }} />
          Back to campaign dashboard
        </button>

        <div style={{ font: '500 11px/14px ' + F, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lyra-color-fg-active-strong)', marginBottom: 8 }}>
          Survey · {survey.id}
        </div>
        <h1 style={{ font: '600 22px/28px ' + F, letterSpacing: '-0.018em', color: 'var(--lyra-color-fg-default)', margin: '0 0 12px', display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          {campaign ? campaign.name : 'Survey'}
          {campaign?.version && <span style={{ font: '400 20px/28px ' + F, color: 'var(--lyra-color-fg-secondary)' }}>{campaign.version}</span>}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <SurveyStatusPill status={survey.status} />
          <Dot />
          <span style={{ font: '400 12px/16px ' + F, color: 'var(--lyra-color-fg-secondary)' }}>Sent {formatDateTime(survey.surveySentAt)}</span>
          {survey.surveyCompletedAt && <><Dot /><span style={{ font: '400 12px/16px ' + F, color: 'var(--lyra-color-fg-secondary)' }}>Completed {formatDateTime(survey.surveyCompletedAt)}</span></>}
          {survey.csat !== null && <><Dot /><span style={{ font: '400 12px/16px ' + F, color: 'var(--lyra-color-fg-secondary)' }}>CSAT <strong style={{ fontWeight: 600, color: 'var(--lyra-color-fg-default)' }}>{survey.csat}</strong></span></>}
          <Dot />
          <span style={{ font: '400 12px/16px ' + F, color: 'var(--lyra-color-fg-secondary)' }}>VU <strong style={{ fontWeight: 600, color: 'var(--lyra-color-fg-default)' }}>{survey.vu}</strong></span>
        </div>
      </header>

      {/* ── Two-column body ── */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Left: Q&A */}
        <main style={{ flex: 1, padding: '36px 40px 64px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Section label */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ font: '600 14px/20px ' + F, letterSpacing: '-0.01em', color: 'var(--lyra-color-fg-default)' }}>Survey responses</div>
            <div style={{ font: '400 12px/18px ' + F, color: 'var(--lyra-color-fg-secondary)', marginTop: 3 }}>
              3 questions · AI-generated based on interaction signals
            </div>
          </div>

          {/* Question cards stacked with generous gap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {survey.questions.map((q, i) => (
              <QuestionCard key={i} index={i + 1} question={q} />
            ))}
          </div>
        </main>

        {/* Right: context sidebar — wider, more padding */}
        <aside style={{
          width: 340, flexShrink: 0,
          borderLeft: '1px solid var(--lyra-color-border-subtle)',
          padding: '36px 32px 64px',
          display: 'flex', flexDirection: 'column', gap: 36,
          overflowY: 'auto',
        }}>
          <CustomerPanel survey={survey} />
          <Divider />
          <InteractionPanel survey={survey} />
          <Divider />
          <AgentPanel survey={survey} />
        </aside>

      </div>
    </div>
  )
}

/* ── Shared primitives ── */
function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--lyra-color-fg-disabled)', display: 'inline-block', flexShrink: 0 }} />
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--lyra-color-border-subtle)', margin: '0 -32px' }} />
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
      <span style={{ color: 'var(--lyra-color-fg-secondary)', display: 'flex' }}>{icon}</span>
      <span style={{ font: '500 10px/14px ' + F, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lyra-color-fg-secondary)' }}>
        {children}
      </span>
    </div>
  )
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
      <span style={{ color: 'var(--lyra-color-fg-secondary)', display: 'flex', marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <span style={{ font: '400 13px/20px ' + F, color: 'var(--lyra-color-fg-secondary)', minWidth: 0, flex: 1 }}>{children}</span>
    </div>
  )
}

function Chip({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: bg, color, borderRadius: 5,
      padding: '3px 9px', font: '500 11px/16px ' + F,
    }}>{children}</span>
  )
}

/* ── Sidebar panels ── */
function CustomerPanel({ survey }: { survey: Survey }) {
  return (
    <div>
      <SectionLabel icon={<User style={{ width: 13, height: 13 }} />}>Customer</SectionLabel>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: 'var(--lyra-brand-50)',
          color: 'var(--lyra-brand-700)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          font: '600 14px/1 ' + F,
        }}>
          {survey.customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        <div style={{ font: '600 15px/20px ' + F, color: 'var(--lyra-color-fg-default)' }}>
          {survey.customer.name}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <InfoRow icon={<Phone style={{ width: 13, height: 13 }} />}>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{survey.customer.phone}</span>
        </InfoRow>
        <InfoRow icon={<Mail style={{ width: 13, height: 13 }} />}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{survey.customer.email}</span>
        </InfoRow>
      </div>
    </div>
  )
}

function InteractionPanel({ survey }: { survey: Survey }) {
  const { interaction } = survey
  const pos = interaction.sentiment > 5
  const neg = interaction.sentiment < -5
  const sentBg   = pos ? 'var(--lyra-color-status-success-subtle)'  : neg ? 'var(--lyra-color-status-critical-subtle)'  : 'var(--lyra-slate-100)'
  const sentText = pos ? 'var(--lyra-color-status-success-strong)'  : neg ? 'var(--lyra-color-status-critical-strong)'  : 'var(--lyra-color-fg-secondary)'

  return (
    <div>
      <SectionLabel icon={<MessageCircle style={{ width: 13, height: 13 }} />}>Interaction</SectionLabel>

      {/* Date + duration */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <InfoRow icon={<Calendar style={{ width: 13, height: 13 }} />}>{formatDateTime(interaction.date)}</InfoRow>
        {interaction.durationMinutes > 0 && (
          <InfoRow icon={<Clock style={{ width: 13, height: 13 }} />}>{interaction.durationMinutes} minutes</InfoRow>
        )}
      </div>

      {/* Channel + Sentiment */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        <Chip bg="var(--lyra-color-status-info-subtle)" color="var(--lyra-color-status-info-strong)">{interaction.channel}</Chip>
        <Chip bg={sentBg} color={sentText}>
          Sentiment {interaction.sentiment > 0 ? '+' : ''}{interaction.sentiment}
        </Chip>
      </div>

      {/* Topics */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ font: '500 10px/14px ' + F, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--lyra-color-fg-secondary)', marginBottom: 8 }}>
          Topics detected
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {interaction.topicsDetected.map(t => (
            <Chip key={t} bg="var(--lyra-slate-100)" color="var(--lyra-color-fg-secondary)">{t}</Chip>
          ))}
        </div>
      </div>

      {/* Summary quote */}
      <p style={{
        font: '400 12px/20px ' + F,
        color: 'var(--lyra-color-fg-secondary)',
        fontStyle: 'italic', margin: 0,
        padding: '12px 14px',
        background: 'var(--lyra-slate-50)',
        borderRadius: 8,
        borderLeft: '3px solid var(--lyra-color-border-soft)',
      }}>
        "{interaction.summary}"
      </p>
    </div>
  )
}

function AgentPanel({ survey }: { survey: Survey }) {
  const initials = survey.agent.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
  return (
    <div>
      <SectionLabel icon={<Headset style={{ width: 13, height: 13 }} />}>Agent</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'var(--lyra-color-bg-active-moderate)',
          color: 'var(--lyra-color-fg-active-strong)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          font: '600 14px/1 ' + F, textTransform: 'uppercase',
        }}>{initials}</div>
        <div>
          <div style={{ font: '600 14px/20px ' + F, color: 'var(--lyra-color-fg-default)' }}>{survey.agent.name}</div>
          <div style={{ font: '400 12px/18px ' + F, color: 'var(--lyra-color-fg-secondary)', marginTop: 2 }}>{survey.agent.id}</div>
        </div>
      </div>
    </div>
  )
}

/* ── Question cards ── */
function QuestionCard({ index, question }: { index: number; question: SurveyQuestion }) {
  if (question.kind === 'rating') return <RatingQuestionCard index={index} question={question} />
  return <OpenQuestionCard index={index} question={question} />
}

const cardShell: React.CSSProperties = {
  background: 'var(--lyra-color-bg-surface-base)',
  border: '1px solid var(--lyra-color-border-subtle)',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
}

function QMeta({ index, kind, topic, isAI = false }: { index: number; kind: string; topic: string; isAI?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: 'var(--lyra-color-bg-active-moderate)',
        color: 'var(--lyra-color-fg-active-strong)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        font: '600 10px/1 ' + F,
      }}>Q{index}</span>

      <span style={{ font: '500 11px/14px ' + F, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--lyra-color-fg-secondary)' }}>{kind}</span>

      <span style={{ width: 1, height: 10, background: 'var(--lyra-color-border-soft)', display: 'inline-block', flexShrink: 0 }} />

      <span style={{
        background: 'var(--lyra-slate-100)', color: 'var(--lyra-color-fg-secondary)',
        borderRadius: 99, padding: '2px 9px', font: '500 11px/16px ' + F,
      }}>{topic}</span>

      {isAI && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'var(--lyra-color-bg-ai)',
          border: '1px solid rgba(77,58,122,0.16)',
          borderRadius: 99, padding: '2px 9px',
          font: '500 11px/16px ' + F, color: 'var(--lyra-purple-700)',
        }}>
          <Sparkles style={{ width: 10, height: 10, fill: 'currentColor', stroke: 'none' }} />
          AI-generated
        </span>
      )}
    </div>
  )
}

function RatingQuestionCard({ index, question }: { index: number; question: RatingQuestion }) {
  return (
    <div style={cardShell}>
      <div style={{ padding: '20px 24px 22px' }}>
        <div style={{ marginBottom: 16 }}><QMeta index={index} kind="Rating" topic={question.topic} /></div>
        <p style={{ font: '500 15px/24px ' + F, color: 'var(--lyra-color-fg-default)', margin: '0 0 20px' }}>
          {question.prompt}
        </p>
        <RatingDisplay rating={question.response} max={question.max} />
      </div>
    </div>
  )
}

function OpenQuestionCard({ index, question }: { index: number; question: OpenQuestion }) {
  const provenance =
    question.generatedFrom.source === 'interaction'
      ? `Generated from interaction sentiment (${formatSigned(question.generatedFrom.sentiment)}) on topic "${question.generatedFrom.topic ?? question.topic}"`
      : `Generated from your Q${index - 1} response sentiment (${formatSigned(question.generatedFrom.sentiment)})`

  return (
    <div style={cardShell}>
      <div style={{ padding: '20px 24px 22px' }}>
        <div style={{ marginBottom: 14 }}><QMeta index={index} kind="Open" topic={question.topic} isAI /></div>
        <p style={{ font: '400 11px/17px ' + F, color: 'var(--lyra-color-fg-secondary)', fontStyle: 'italic', margin: '0 0 12px' }}>
          {provenance}
        </p>
        <p style={{ font: '500 15px/24px ' + F, color: 'var(--lyra-color-fg-default)', margin: '0 0 16px' }}>
          {question.prompt}
        </p>
        {question.response ? (
          <div style={{
            background: 'var(--lyra-slate-50)',
            borderRadius: 8, padding: '16px 18px',
          }}>
            <p style={{ font: '400 14px/23px ' + F, color: 'var(--lyra-color-fg-default)', margin: '0 0 12px' }}>
              "{question.response}"
            </p>
            {question.responseSentiment !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ font: '500 10px/14px ' + F, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lyra-color-fg-secondary)' }}>
                  Response sentiment
                </span>
                <SentimentBadge value={question.responseSentiment} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: 'var(--lyra-slate-50)', border: '1px dashed var(--lyra-color-border-soft)', borderRadius: 8, padding: '14px 18px' }}>
            <p style={{ font: '400 12px/18px ' + F, color: 'var(--lyra-color-fg-secondary)', fontStyle: 'italic', margin: 0 }}>
              No response — customer did not answer.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function RatingDisplay({ rating, max }: { rating: number | null; max: number }) {
  if (rating === null) {
    return (
      <div style={{ background: 'var(--lyra-slate-50)', border: '1px dashed var(--lyra-color-border-soft)', borderRadius: 8, padding: '12px 16px' }}>
        <p style={{ font: '400 12px/18px ' + F, color: 'var(--lyra-color-fg-secondary)', fontStyle: 'italic', margin: 0 }}>No response — customer did not rate.</p>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} style={{ width: 24, height: 24 }}
            fill={i < rating ? '#f59e0b' : 'none'}
            stroke={i < rating ? '#f59e0b' : 'var(--lyra-slate-300)'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span style={{ font: '600 16px/20px ' + F, color: 'var(--lyra-color-fg-default)', fontVariantNumeric: 'tabular-nums' }}>{rating} / {max}</span>
    </div>
  )
}

function SentimentBadge({ value }: { value: number }) {
  const pos = value > 5, neg = value < -5
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: pos ? 'var(--lyra-color-status-success-subtle)' : neg ? 'var(--lyra-color-status-critical-subtle)' : 'var(--lyra-slate-100)',
      color: pos ? 'var(--lyra-color-status-success-strong)' : neg ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-fg-secondary)',
      borderRadius: 4, padding: '2px 8px',
      font: '600 11px/16px ' + F, fontVariantNumeric: 'tabular-nums',
    }}>{value > 0 ? `+${value}` : value}</span>
  )
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
function formatSigned(n: number): string { return n > 0 ? `+${n}` : `${n}` }
