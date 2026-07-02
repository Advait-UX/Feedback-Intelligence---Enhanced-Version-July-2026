import React, { useState } from 'react'
import { Clock, Calendar } from 'lucide-react'
import './CampaignWizard.css'
import type { WizardCampaign } from '../../lib/campaignWizard'
import { DEFAULT_WIZARD_CAMPAIGN } from '../../lib/campaignWizard'
import { Step0Identity } from './Step0Identity'
import { Step1Suppression } from './Step1Suppression'
import { Step2Template } from './Step2Template'
import { Step3Review } from './Step3Review'
import { DAY_LABELS } from './WizardPrimitives'

interface Props {
  editCampaign?: Partial<WizardCampaign> & { name: string }
  onCancel: () => void
  onSave: (campaign: WizardCampaign & { status: 'draft' | 'active' }) => void
}

const STEPS = [
  { label: 'Campaign, Identity & Scope', desc: 'Name the campaign, set dates, teams and channels.' },
  { label: 'Suppression Rules',          desc: 'Define when not to send surveys.' },
  { label: 'Survey Template',            desc: 'Choose the survey design for this campaign.' },
  { label: 'Summary & Review',           desc: 'Review all settings before activating.' },
]

function fmt(iso: string) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CampaignWizard({ editCampaign, onCancel, onSave }: Props) {
  const isEditing = !!editCampaign
  const [c, setC] = useState<WizardCampaign>({ ...DEFAULT_WIZARD_CAMPAIGN, ...editCampaign })
  const [activeStep, setActiveStep] = useState(0)
  const [triedSteps, setTriedSteps] = useState<Set<number>>(new Set())
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]))

  function set(k: keyof WizardCampaign, v: unknown) {
    setC(prev => ({ ...prev, [k]: v }))
  }

  // Validation
  const agentValid = c.agentMode === 'skills' ? !!c.skills.length : !!c.queues.length
  const step0Valid = isEditing || !!(c.name && c.startDate && (c.ongoing || c.endDate) && agentValid && c.startTime && c.endTime && c.surveyDays.length)
  const step2Valid = isEditing || !!c.surveyDesignId

  function stepState(n: number): 'active' | 'done' | 'error' | 'idle' {
    if (n === activeStep) return 'active'
    if (triedSteps.has(n)) {
      if (n === 0 && !step0Valid) return 'error'
      if (n === 2 && !step2Valid) return 'error'
      if (visitedSteps.has(n)) return 'done'
    }
    if (visitedSteps.has(n) && n !== activeStep) return 'done'
    return 'idle'
  }

  function goNext() {
    setTriedSteps(prev => new Set([...prev, activeStep]))
    if (activeStep === 0 && !step0Valid) return
    if (activeStep === 2 && !step2Valid) return
    const next = Math.min(activeStep + 1, 3)
    setVisitedSteps(prev => new Set([...prev, next]))
    setActiveStep(next)
  }

  function goBack() {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  function goToStep(n: number) {
    if (visitedSteps.has(n) || n < activeStep) {
      setVisitedSteps(prev => new Set([...prev, n]))
      setActiveStep(n)
    }
  }

  // Summary rail data
  const dateRange = c.startDate
    ? (c.ongoing ? `Ongoing from ${fmt(c.startDate)}` : c.endDate ? `${fmt(c.startDate)} — ${fmt(c.endDate)}` : `${fmt(c.startDate)} — No end date`)
    : 'Not set'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--lyra-color-bg-surface-canvas)' }}>
      {/* Wizard bar */}
      <div className="wz-bar">
        {STEPS.map((step, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="wz-connector" />}
            <div
              className={`wz-step ${stepState(i)}`}
              onClick={() => goToStep(i)}
            >
              <div className="wz-step-num">{i + 1}</div>
              <div className="wz-step-label">{step.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Body */}
      <div className="wz-layout">
        {/* Form area */}
        <div className="wz-form-area">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div className="wz-step-title">{STEPS[activeStep].label}</div>
            <div className="wz-step-desc">{STEPS[activeStep].desc}</div>

            {activeStep === 0 && (
              <Step0Identity c={c} set={set} showErr={triedSteps.has(0)} />
            )}
            {activeStep === 1 && (
              <Step1Suppression c={c} set={set} />
            )}
            {activeStep === 2 && (
              <Step2Template c={c} set={set} showErr={triedSteps.has(2)} />
            )}
            {activeStep === 3 && (
              <Step3Review c={c} isEditing={isEditing} onGoToStep={goToStep} />
            )}
          </div>
        </div>

        {/* Right rail summary */}
        <aside className="wz-rail">
          <div className="wz-summary-card">
            <div className="wz-summary-card-head">Campaign Summary</div>
            <div className="wz-summary-row">
              <div className="wz-summary-icon"><Calendar size={14} /></div>
              <div>
                <div className="wz-summary-row-label">Active Date Range</div>
                <div className="wz-summary-row-value">{dateRange}</div>
              </div>
            </div>
            <div className="wz-summary-row">
              <div className="wz-summary-icon"><Clock size={14} /></div>
              <div>
                <div className="wz-summary-row-label">Survey Hours</div>
                <div className="wz-summary-row-value">
                  {c.startTime && c.endTime ? `${c.startTime} – ${c.endTime}` : c.startTime || c.endTime || 'Not set'}
                </div>
              </div>
            </div>
            <div className="wz-summary-row">
              <div className="wz-summary-icon">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="5" y1="1.5" x2="5" y2="4.5"/><line x1="11" y1="1.5" x2="11" y2="4.5"/><line x1="2" y1="7" x2="14" y2="7"/>
                  <circle cx="5" cy="10" r=".6" fill="currentColor"/><circle cx="8" cy="10" r=".6" fill="currentColor"/><circle cx="11" cy="10" r=".6" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div className="wz-summary-row-label">Surveying Days</div>
                <div className="wz-summary-row-value">{c.surveyDays.length ? c.surveyDays.map(d => DAY_LABELS[d]).join(', ') : 'Not set'}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <div className="wz-footer">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{ padding: '7px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lyra-color-border-soft)', background: 'var(--lyra-color-bg-surface-base)', font: '500 14px/20px var(--font-sans)', cursor: 'pointer', color: 'var(--lyra-color-fg-default)' }}
          >
            Cancel
          </button>
          {activeStep > 0 && (
            <button
              onClick={goBack}
              style={{ padding: '7px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lyra-color-border-soft)', background: 'var(--lyra-color-bg-surface-base)', font: '500 14px/20px var(--font-sans)', cursor: 'pointer', color: 'var(--lyra-color-fg-default)' }}
            >
              ← Back
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeStep < 3 ? (
            <button
              onClick={goNext}
              style={{ padding: '7px 20px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--lyra-color-bg-primary)', font: '500 14px/20px var(--font-sans)', cursor: 'pointer', color: 'var(--lyra-color-fg-on-primary)' }}
            >
              Next →
            </button>
          ) : (
            <>
              <button
                onClick={() => onSave({ ...c, status: 'draft' })}
                style={{ padding: '7px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lyra-color-border-soft)', background: 'var(--lyra-color-bg-surface-base)', font: '500 14px/20px var(--font-sans)', cursor: 'pointer', color: 'var(--lyra-color-fg-default)' }}
              >
                Save as Draft
              </button>
              <button
                onClick={() => onSave({ ...c, status: 'active' })}
                style={{ padding: '7px 20px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--lyra-color-bg-primary)', font: '500 14px/20px var(--font-sans)', cursor: 'pointer', color: 'var(--lyra-color-fg-on-primary)' }}
              >
                Activate Campaign →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
