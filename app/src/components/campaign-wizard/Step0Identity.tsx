import React from 'react'
import type { WizardCampaign } from '../../lib/campaignWizard'
import { ALL_TEAMS, ALL_SKILLS, DIGITAL_CHANNELS } from '../../lib/campaignWizard'
import { Toggle, FiDatePicker, FiTimePicker, SurveyingDays, MultiSelectField, ErrorMsg, FieldLabel } from './WizardPrimitives'
import { ChevronDown } from 'lucide-react'

interface Props {
  c: WizardCampaign
  set: (k: keyof WizardCampaign, v: unknown) => void
  showErr: boolean
}

function TimeSelect({ value, onChange, error }: { value?: string; onChange: (v: string) => void; error?: boolean }) {
  const slots: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const p = h < 12 ? 'AM' : 'PM'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      slots.push(`${String(h12).padStart(2,'0')}:${m === 0 ? '00' : '30'} ${p}`)
    }
  }
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '6px 32px 6px 12px',
          font: '400 14px/24px var(--font-sans)', color: value ? 'var(--lyra-color-fg-default)' : 'var(--lyra-color-fg-disabled)',
          background: 'var(--lyra-color-bg-field)', border: `1px solid ${error ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-border-soft)'}`,
          borderRadius: 'var(--radius-sm)', outline: 'none', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none',
        }}
      >
        <option value="" disabled>HH:MM AM/PM</option>
        {slots.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--lyra-slate-500)', pointerEvents: 'none' }} />
    </div>
  )
}

const SECTION_STYLE: React.CSSProperties = {
  padding: '24px 0',
  borderBottom: '1px solid var(--lyra-color-border-subtle)',
}
const SECTION_HEAD: React.CSSProperties = {
  font: '500 13px/18px var(--font-sans)',
  color: 'var(--lyra-color-fg-secondary)',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  marginBottom: 16,
}
const GRID2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
  gap: 20,
}

export function Step0Identity({ c, set, showErr }: Props) {
  const nameErr        = showErr && !c.name
  const startDateErr   = showErr && !c.startDate
  const endDateErr     = showErr && !c.ongoing && !c.endDate
  const startTimeErr   = showErr && !c.startTime
  const endTimeErr     = showErr && !c.endTime
  const surveyDaysErr  = showErr && !c.surveyDays.length
  const teamsErr       = showErr && c.agentMode === 'teams' && !c.queues.length
  const skillsErr      = showErr && c.agentMode === 'skills' && !c.skills.length
  const digitalChErr   = showErr && c.interactionChannel === 'digital' && !c.digitalChannel
  const sDigitalChErr  = showErr && c.surveyChannel === 'digital' && !c.surveyDigitalChannels.length

  const radioStyle = (active: boolean): React.CSSProperties => ({
    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
    border: `${active ? '5px' : '1.5px'} solid ${active ? 'var(--lyra-brand-600)' : 'var(--lyra-color-border-medium)'}`,
    cursor: 'pointer', transition: 'border 0.15s',
  })

  return (
    <div>
      {/* Campaign Name + Description */}
      <div style={{ ...SECTION_STYLE, paddingTop: 0 }}>
        <div style={GRID2}>
          <div>
            <FieldLabel required>Campaign Name</FieldLabel>
            <div style={{ position: 'relative' }}>
              <input
                maxLength={50}
                value={c.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Post Interaction CSAT"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '6px 12px',
                  font: '400 14px/24px var(--font-sans)',
                  border: `1px solid ${nameErr ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-border-soft)'}`,
                  borderRadius: 'var(--radius-sm)', background: 'var(--lyra-color-bg-field)',
                  color: 'var(--lyra-color-fg-default)', outline: 'none',
                }}
              />
              <span style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                font: '400 11px/16px var(--font-sans)',
                color: c.name.length >= 45 ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-fg-disabled)',
              }}>{c.name.length}/50</span>
            </div>
            {nameErr && <ErrorMsg>Campaign name is required</ErrorMsg>}
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <input
              maxLength={200}
              value={c.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Optional description"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '6px 12px',
                font: '400 14px/24px var(--font-sans)',
                border: '1px solid var(--lyra-color-border-soft)',
                borderRadius: 'var(--radius-sm)', background: 'var(--lyra-color-bg-field)',
                color: 'var(--lyra-color-fg-default)', outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Active Date Range + Start Time + Surveying Days */}
      <div style={SECTION_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={SECTION_HEAD}>Active Date Range</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)' }}>
            <Toggle checked={c.ongoing} onChange={v => set('ongoing', v)} />
            <span>Ongoing</span>
          </label>
        </div>
        <div style={GRID2}>
          <div>
            <FieldLabel required>Start Date</FieldLabel>
            <FiDatePicker value={c.startDate} onChange={v => set('startDate', v)} placeholder="Oct 30, 2025" error={startDateErr} />
            {startDateErr && <ErrorMsg>Start date is required</ErrorMsg>}
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, font: '500 14px/20px var(--font-sans)', color: c.ongoing ? 'var(--lyra-color-fg-disabled)' : 'var(--lyra-color-fg-default)', marginBottom: 6 }}>
              End Date{!c.ongoing && <span style={{ color: 'var(--lyra-color-status-critical-strong)', marginLeft: 2 }}>*</span>}
            </label>
            <FiDatePicker value={c.endDate} onChange={v => set('endDate', v)} disabled={c.ongoing} placeholder={c.ongoing ? 'Ongoing' : 'Oct 30, 2025'} error={endDateErr} />
            {endDateErr && <ErrorMsg>End date is required</ErrorMsg>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FieldLabel required>Start Time</FieldLabel>
            <TimeSelect value={c.startTime} onChange={v => set('startTime', v)} error={startTimeErr} />
            {startTimeErr && <ErrorMsg>Start time is required</ErrorMsg>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FieldLabel required>End Time</FieldLabel>
            <TimeSelect value={c.endTime} onChange={v => set('endTime', v)} error={endTimeErr} />
            {endTimeErr && <ErrorMsg>End time is required</ErrorMsg>}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <FieldLabel required>Select Surveying Days</FieldLabel>
          <SurveyingDays value={c.surveyDays} onChange={v => set('surveyDays', v)} />
          {surveyDaysErr && <ErrorMsg>Select at least one surveying day</ErrorMsg>}
        </div>
      </div>

      {/* Agents */}
      <div style={SECTION_STYLE}>
        <div style={SECTION_HEAD}>Agents</div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {([['teams', 'Teams / Groups'], ['skills', 'Skills']] as const).map(([val, label]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', font: '400 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>
              <span
                style={radioStyle(c.agentMode === val)}
                onClick={() => {
                  set('agentMode', val)
                  if (val === 'skills') { set('queues', []); set('teams', []) }
                  else { set('skills', []) }
                }}
              />
              <span onClick={() => {
                set('agentMode', val)
                if (val === 'skills') { set('queues', []); set('teams', []) }
                else { set('skills', []) }
              }}>{label}</span>
            </label>
          ))}
        </div>

        {c.agentMode === 'teams' && (
          <div style={GRID2}>
            <div>
              <FieldLabel required>Teams</FieldLabel>
              <MultiSelectField options={ALL_TEAMS} value={c.queues} onChange={v => set('queues', v)} placeholder="Select Teams" error={teamsErr} />
              {teamsErr && <ErrorMsg>Select at least one team</ErrorMsg>}
            </div>
            <div>
              <FieldLabel>Group</FieldLabel>
              <MultiSelectField options={['North America', 'EMEA', 'APAC']} value={c.teams} onChange={v => set('teams', v)} placeholder="Select Group" />
            </div>
          </div>
        )}

        {c.agentMode === 'skills' && (
          <div style={GRID2}>
            <div>
              <FieldLabel required>Skills</FieldLabel>
              <MultiSelectField options={ALL_SKILLS} value={c.skills} onChange={v => set('skills', v)} placeholder="Select skills" error={skillsErr} />
              {skillsErr && <ErrorMsg>Select at least one skill</ErrorMsg>}
            </div>
            <div />
          </div>
        )}
      </div>

      {/* Interaction Channel */}
      <div style={SECTION_STYLE}>
        <div style={SECTION_HEAD}>Select Interaction Channel</div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {([['voice', 'Voice'], ['digital', 'Digital']] as const).map(([val, label]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', font: '400 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>
              <span style={radioStyle(c.interactionChannel === val)} onClick={() => { set('interactionChannel', val); if (val === 'voice') set('digitalChannel', '') }} />
              <span onClick={() => { set('interactionChannel', val); if (val === 'voice') set('digitalChannel', '') }}>{label}</span>
            </label>
          ))}
        </div>
        {c.interactionChannel === 'digital' && (
          <div style={GRID2}>
            <div>
              <FieldLabel required>Digital Channel</FieldLabel>
              <div style={{ position: 'relative' }}>
                <select
                  value={c.digitalChannel}
                  onChange={e => set('digitalChannel', e.target.value)}
                  style={{
                    width: '100%', padding: '6px 36px 6px 12px', boxSizing: 'border-box',
                    font: '400 14px/24px var(--font-sans)', color: c.digitalChannel ? 'var(--lyra-color-fg-default)' : 'var(--lyra-color-fg-disabled)',
                    background: 'var(--lyra-color-bg-field)',
                    border: `1px solid ${digitalChErr ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-border-soft)'}`,
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    appearance: 'none', WebkitAppearance: 'none', outline: 'none',
                  }}
                >
                  <option value="" disabled>Select digital channel</option>
                  {DIGITAL_CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--lyra-slate-500)', pointerEvents: 'none' }} />
              </div>
              {digitalChErr && <ErrorMsg>Select a digital channel</ErrorMsg>}
            </div>
            <div />
          </div>
        )}
      </div>

      {/* Survey Channel */}
      <div style={{ ...SECTION_STYLE, borderBottom: 'none' }}>
        <div style={SECTION_HEAD}>Select Survey Channel</div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {([['voice', 'Voice'], ['digital', 'Digital']] as const).map(([val, label]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', font: '400 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>
              <span style={radioStyle(c.surveyChannel === val)} onClick={() => { set('surveyChannel', val); if (val === 'voice') set('surveyDigitalChannels', []) }} />
              <span onClick={() => { set('surveyChannel', val); if (val === 'voice') set('surveyDigitalChannels', []) }}>{label}</span>
            </label>
          ))}
        </div>
        {c.surveyChannel === 'digital' && (
          <div style={GRID2}>
            <div>
              <FieldLabel required>Digital Channel</FieldLabel>
              <MultiSelectField options={DIGITAL_CHANNELS} value={c.surveyDigitalChannels} onChange={v => set('surveyDigitalChannels', v)} placeholder="Select digital channels" error={sDigitalChErr} />
              {sDigitalChErr && <ErrorMsg>Select at least one survey channel</ErrorMsg>}
              {c.surveyDigitalChannels.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {c.surveyDigitalChannels.slice(0, 5).map(ch => (
                    <span key={ch} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px 2px 10px', borderRadius: 'var(--radius-full)',
                      background: 'var(--lyra-color-bg-active-subtle)',
                      border: '1px solid var(--lyra-color-border-active)',
                      font: '500 12px/20px var(--font-sans)', color: 'var(--lyra-color-fg-active-strong)',
                    }}>
                      {ch}
                      <button onClick={() => set('surveyDigitalChannels', c.surveyDigitalChannels.filter(d => d !== ch))}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'var(--lyra-color-fg-active-strong)', fontSize: 14 }}>×</button>
                    </span>
                  ))}
                  {c.surveyDigitalChannels.length > 5 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--lyra-slate-100)', font: '500 12px/20px var(--font-sans)', color: 'var(--lyra-slate-600)' }}>
                      +{c.surveyDigitalChannels.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <div />
          </div>
        )}
      </div>
    </div>
  )
}
