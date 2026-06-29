import React from 'react'
import type { WizardCampaign } from '../../lib/campaignWizard'
import { Toggle } from './WizardPrimitives'

interface Props {
  c: WizardCampaign
  set: (k: keyof WizardCampaign, v: unknown) => void
}

const ROW: React.CSSProperties = {
  display: 'flex', alignItems: 'flex-start', gap: 16,
  padding: '20px 0',
  borderBottom: '1px solid var(--lyra-color-border-subtle)',
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.8" style={{ marginLeft: 4, color: 'var(--lyra-color-fg-secondary)', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2 2.2-2.5 3.2"/>
      <circle cx="12" cy="16.5" r=".6" fill="currentColor"/>
    </svg>
  )
}

export function Step1Suppression({ c, set }: Props) {
  return (
    <div>
      {/* Opt-out Tag */}
      <div style={ROW}>
        <Toggle checked={c.suppressOptOut} onChange={v => set('suppressOptOut', v)} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>
            Opt-Out Tag <InfoIcon />
          </div>
          <div style={{ font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)', marginTop: 4 }}>
            When enabled, customers who have opted out of surveys are automatically excluded from receiving this campaign.
          </div>
        </div>
      </div>

      {/* Recency Window */}
      <div style={{ ...ROW, borderBottom: 'none' }}>
        <Toggle checked={c.suppressRecent} onChange={v => set('suppressRecent', v)} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>
            Recency window <InfoIcon />
          </div>
          <div style={{ font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)', marginTop: 4 }}>
            Prevents a customer from receiving this survey if they were already surveyed within the defined number of days.
          </div>
          {c.suppressRecent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, maxWidth: 200 }}>
              <input
                type="number" min={1} max={365}
                value={c.recentDays}
                onChange={e => set('recentDays', parseInt(e.target.value) || 1)}
                style={{
                  width: 80, padding: '5px 10px', font: '400 14px/20px var(--font-sans)',
                  border: '1px solid var(--lyra-color-border-soft)', borderRadius: 'var(--radius-sm)',
                  background: 'var(--lyra-color-bg-field)', color: 'var(--lyra-color-fg-default)',
                  outline: 'none',
                }}
              />
              <span style={{ font: '400 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)' }}>Days</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
