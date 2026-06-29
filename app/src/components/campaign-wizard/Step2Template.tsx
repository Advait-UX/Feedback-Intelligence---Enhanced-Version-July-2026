import React, { useState } from 'react'
import type { WizardCampaign } from '../../lib/campaignWizard'
import { SURVEY_DESIGNS } from '../../lib/campaignWizard'
import { SurveyPickerDrawer } from './WizardPrimitives'
import { FileText, X } from 'lucide-react'

interface Props {
  c: WizardCampaign
  set: (k: keyof WizardCampaign, v: unknown) => void
  showErr: boolean
}

export function Step2Template({ c, set, showErr }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const activeSurvey = SURVEY_DESIGNS.find(s => s.id === c.surveyDesignId)
  const surveyErr = showErr && !c.surveyDesignId

  return (
    <div>
      <div style={{
        border: `1px solid ${surveyErr ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-border-soft)'}`,
        borderRadius: 'var(--radius-md)',
        background: surveyErr ? 'var(--lyra-color-status-critical-subtle)' : 'var(--lyra-color-bg-surface-base)',
        padding: 20,
      }}>
        {!activeSurvey ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  background: 'var(--lyra-slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={16} color="var(--lyra-slate-500)" />
                </div>
                <div>
                  <div style={{ font: `500 14px/20px var(--font-sans)`, color: surveyErr ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-fg-default)' }}>Survey Template</div>
                  <div style={{ font: '400 12px/18px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)', marginTop: 2 }}>Pick the survey design that will be sent to customers</div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  padding: '7px 16px', borderRadius: 'var(--radius-md)',
                  border: 'none', background: 'var(--lyra-color-bg-primary)',
                  font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-on-primary)',
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                Choose Survey Template →
              </button>
            </div>
            {surveyErr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, font: '400 12px/16px var(--font-sans)', color: 'var(--lyra-color-status-critical-strong)' }}>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
                Select a survey template to continue
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
              background: 'var(--lyra-color-bg-active-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={16} color="var(--lyra-brand-600)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>{activeSurvey.name}</div>
              <div style={{ font: '400 12px/18px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)', marginTop: 2 }}>{activeSurvey.why}</div>
              <span style={{
                display: 'inline-block', marginTop: 6, padding: '2px 8px',
                borderRadius: 'var(--radius-full)', font: '500 11px/16px var(--font-sans)',
                background: 'var(--lyra-slate-100)', color: 'var(--lyra-slate-600)',
              }}>{activeSurvey.category}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => set('surveyDesignId', '')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6, borderRadius: 'var(--radius-sm)', color: 'var(--lyra-color-fg-secondary)' }}
                title="Remove"
              >
                <X size={16} />
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                style={{ padding: '7px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lyra-color-border-soft)', background: 'var(--lyra-color-bg-surface-base)', font: '500 14px/20px var(--font-sans)', cursor: 'pointer', color: 'var(--lyra-color-fg-default)' }}
              >
                Change
              </button>
            </div>
          </div>
        )}
      </div>

      {drawerOpen && (
        <SurveyPickerDrawer
          currentId={c.surveyDesignId}
          onClose={() => setDrawerOpen(false)}
          onSelect={id => { set('surveyDesignId', id); setDrawerOpen(false) }}
        />
      )}
    </div>
  )
}
