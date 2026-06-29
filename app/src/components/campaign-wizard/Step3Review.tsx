import React from 'react'
import type { WizardCampaign } from '../../lib/campaignWizard'
import { SURVEY_DESIGNS } from '../../lib/campaignWizard'
import { Edit2 } from 'lucide-react'

interface Props {
  c: WizardCampaign
  isEditing: boolean
  onGoToStep: (n: number) => void
}

function SRSection({ title, num, onEdit, children }: { title: string; num: number; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--lyra-color-border-soft)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'var(--lyra-slate-50)', borderBottom: '1px solid var(--lyra-color-border-subtle)' }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--lyra-brand-600)', color: '#fff', font: '600 11px/22px var(--font-sans)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 10 }}>{num}</span>
        <span style={{ font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)', flex: 1 }}>{title}</span>
        <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-fg-action)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
          <Edit2 size={12} /> Edit
        </button>
      </div>
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  )
}

function SRRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', padding: '8px 16px', borderBottom: '1px solid var(--lyra-color-border-subtle)' }}>
      <div style={{ width: 200, flexShrink: 0, font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)' }}>{label}</div>
      <div style={{ flex: 1, font: '400 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>{children || <span style={{ color: 'var(--lyra-color-fg-disabled)' }}>—</span>}</div>
    </div>
  )
}

const Req = () => <span style={{ color: 'var(--lyra-color-status-critical-strong)' }}>Required</span>

function truncateList(arr: string[], max = 3) {
  if (!arr?.length) return ''
  if (arr.length <= max) return arr.join(', ')
  return arr.slice(0, max).join(', ') + ` +${arr.length - max} more`
}

function fmt(iso: string) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function Step3Review({ c, isEditing, onGoToStep }: Props) {
  const agentValid = c.agentMode === 'skills' ? !!c.skills.length : !!c.queues.length
  const missingRequired = !isEditing && (!c.name || !agentValid || !c.startDate || (!c.ongoing && !c.endDate) || !c.startTime || !c.surveyDays.length || !c.surveyDesignId)
  const survey = SURVEY_DESIGNS.find(s => s.id === c.surveyDesignId)

  const dateRange = c.startDate
    ? (c.ongoing ? `Ongoing from ${fmt(c.startDate)}` : c.endDate ? `${fmt(c.startDate)} — ${fmt(c.endDate)}` : <Req />)
    : <Req />

  return (
    <div>
      {missingRequired && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--lyra-color-status-critical-subtle)', border: '1px solid var(--lyra-color-status-critical-medium)', borderRadius: 'var(--radius-md)', marginBottom: 16, font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-status-critical-strong)' }}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
          Some required fields are incomplete. Return to the relevant steps to fill them in before activating.
        </div>
      )}

      <SRSection title="Campaign, Identity & Scope" num={1} onEdit={() => onGoToStep(0)}>
        <SRRow label="Campaign Name">{c.name || <Req />}</SRRow>
        {c.description && <SRRow label="Description">{c.description}</SRRow>}
        <SRRow label="Active Date Range">{dateRange}</SRRow>
        <SRRow label="Start Time">{c.startTime || <Req />}</SRRow>
        <SRRow label="Surveying Days">{c.surveyDays.length ? c.surveyDays.join(', ') : <Req />}</SRRow>
        <SRRow label="Agent Selection">{c.agentMode === 'skills' ? 'By skills' : 'By teams / groups'}</SRRow>
        {c.agentMode === 'teams' && <>
          <SRRow label="Teams">{c.queues.length ? truncateList(c.queues) : <Req />}</SRRow>
          <SRRow label="Groups">{truncateList(c.teams) || 'All groups'}</SRRow>
        </>}
        {c.agentMode === 'skills' && (
          <SRRow label="Skills">{c.skills.length ? truncateList(c.skills) : <Req />}</SRRow>
        )}
        <SRRow label="Interaction Channel">{c.interactionChannel === 'digital' ? 'Digital' : 'Voice'}</SRRow>
        {c.interactionChannel === 'digital' && <SRRow label="Digital Channel">{c.digitalChannel || <span style={{ color: 'var(--lyra-color-fg-secondary)' }}>Not set</span>}</SRRow>}
        <SRRow label="Survey Channel">{c.surveyChannel === 'digital' ? 'Digital' : 'Voice'}</SRRow>
        {c.surveyChannel === 'digital' && <SRRow label="Survey Digital Channels">{c.surveyDigitalChannels.length ? c.surveyDigitalChannels.join(', ') : <span style={{ color: 'var(--lyra-color-fg-secondary)' }}>Not set</span>}</SRRow>}
        <SRRow label="Language">English (Default)</SRRow>
        <SRRow label="Interaction Length">Minimum {c.interactionLength} mins</SRRow>
      </SRSection>

      <SRSection title="Suppression Rules" num={2} onEdit={() => onGoToStep(1)}>
        <SRRow label="Opt-Out Tag">{c.suppressOptOut ? 'Enabled' : 'Disabled'}</SRRow>
        <SRRow label="Recency Window">{c.suppressRecent ? `Enabled · ${c.recentDays} days` : 'Disabled'}</SRRow>
      </SRSection>

      <SRSection title="Survey Template" num={3} onEdit={() => onGoToStep(2)}>
        <SRRow label="Survey Template">{survey ? survey.name : isEditing ? <span style={{ color: 'var(--lyra-color-fg-secondary)' }}>Not configured</span> : <Req />}</SRRow>
      </SRSection>
    </div>
  )
}
