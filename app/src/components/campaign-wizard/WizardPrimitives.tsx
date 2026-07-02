import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Clock, Calendar, Search, Check, X } from 'lucide-react'

/* ── Toggle ── */
export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        display: 'inline-flex', alignItems: 'center',
        width: 44, height: 24, borderRadius: 9999, border: 'none', cursor: 'pointer',
        background: checked ? 'var(--lyra-brand-600)' : 'var(--lyra-slate-300)',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
        padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked ? (
          <Check size={12} strokeWidth={2.5} color="var(--lyra-brand-600)" />
        ) : (
          <span style={{ width: 10, height: 2, borderRadius: 1, background: 'var(--lyra-slate-400)' }} />
        )}
      </span>
    </button>
  )
}

/* ── FiDatePicker ── */
export function FiDatePicker({
  value, onChange, disabled, placeholder, error
}: {
  value: string; onChange: (v: string) => void
  disabled?: boolean; placeholder?: string; error?: boolean
}) {
  const hiddenRef = useRef<HTMLInputElement>(null)

  function fmt(iso: string) {
    if (!iso) return ''
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        readOnly
        value={fmt(value)}
        placeholder={placeholder || 'Select date'}
        disabled={disabled}
        onClick={() => !disabled && hiddenRef.current?.showPicker?.()}
        style={{
          width: '100%', boxSizing: 'border-box',
          font: '400 14px/24px var(--font-sans)',
          color: disabled ? 'var(--lyra-color-fg-disabled)' : 'var(--lyra-color-fg-default)',
          background: disabled ? 'var(--lyra-color-bg-disabled)' : 'var(--lyra-color-bg-field)',
          border: `1px solid ${error ? 'var(--lyra-color-status-critical-strong)' : 'var(--lyra-color-border-soft)'}`,
          borderRadius: 'var(--radius-sm)', padding: '6px 36px 6px 12px',
          cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none',
        }}
      />
      <Calendar size={14} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: disabled ? 'var(--lyra-slate-300)' : 'var(--lyra-slate-500)', pointerEvents: 'none',
      }} />
      <input
        ref={hiddenRef} type="date" value={value}
        onChange={e => onChange(e.target.value)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, top: 0, left: 0 }}
      />
    </div>
  )
}

/* ── FiTimePicker ── */
export function FiTimePicker({
  value, onChange, disabled, error
}: {
  value: string; onChange: (v: string) => void
  disabled?: boolean; error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [inputVal, setInputVal] = useState(value || '')
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const slots = useMemo(() => {
    const out: string[] = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const period = h < 12 ? 'AM' : 'PM'
        const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
        out.push(`${String(hour12).padStart(2, '0')}:${m === 0 ? '00' : '30'} ${period}`)
      }
    }
    return out
  }, [])

  const filtered = inputVal
    ? slots.filter(s => s.toLowerCase().startsWith(inputVal.toLowerCase()))
    : slots

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open && listRef.current && value) {
      const idx = slots.indexOf(value)
      if (idx >= 0) listRef.current.children[idx]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open])

  function select(slot: string) {
    setInputVal(slot); onChange(slot); setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          className="fi-input"
          type="text"
          placeholder="HH:MM AM/PM"
          value={inputVal}
          disabled={disabled}
          onChange={e => { setInputVal(e.target.value); setOpen(true); if (!e.target.value) onChange('') }}
          onFocus={() => !disabled && setOpen(true)}
          style={{
            paddingRight: 36, cursor: disabled ? 'not-allowed' : 'text',
            borderColor: error ? 'var(--lyra-color-status-critical-strong)' : undefined,
          }}
        />
        <Clock size={14} style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          color: disabled ? 'var(--lyra-slate-300)' : 'var(--lyra-slate-500)', pointerEvents: 'none',
        }} />
      </div>
      {open && !disabled && filtered.length > 0 && (
        <div ref={listRef} style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
          background: 'var(--lyra-color-bg-surface-overlay)',
          border: '1px solid var(--lyra-color-border-soft)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--sol-effect-shadowlg)',
          maxHeight: 200, overflowY: 'auto',
        }}>
          {filtered.map(slot => (
            <div
              key={slot}
              onMouseDown={() => select(slot)}
              style={{
                padding: '8px 12px', cursor: 'pointer',
                font: '400 14px/20px var(--font-sans)',
                color: slot === value ? 'var(--lyra-color-fg-active-strong)' : 'var(--lyra-color-fg-default)',
                background: slot === value ? 'var(--lyra-color-bg-active-subtle)' : 'transparent',
              }}
              onMouseEnter={e => { if (slot !== value) (e.currentTarget as HTMLElement).style.background = 'var(--lyra-color-state-bg-hover-opacity)' }}
              onMouseLeave={e => { if (slot !== value) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {slot}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── SurveyingDays ── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_LABELS: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
}
export function SurveyingDays({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  function toggle(day: string) {
    onChange(value.includes(day) ? value.filter(d => d !== day) : [...value, day])
  }
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {DAYS.map(day => {
        const active = value.includes(day)
        return (
          <button
            key={day}
            onClick={() => toggle(day)}
            style={{
              height: 36, padding: '0 12px', borderRadius: 'var(--radius-sm)',
              border: `1.5px solid ${active ? 'var(--lyra-brand-600)' : 'var(--lyra-color-border-soft)'}`,
              background: active ? 'var(--lyra-color-bg-active-subtle)' : 'var(--lyra-color-bg-surface-base)',
              color: active ? 'var(--lyra-color-fg-active-strong)' : 'var(--lyra-color-fg-secondary)',
              font: `${active ? '500' : '400'} 13px/20px var(--font-sans)`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {DAY_LABELS[day]}
          </button>
        )
      })}
    </div>
  )
}

/* ── MultiSelectField ── */
export function MultiSelectField({
  options, value, onChange, placeholder, error
}: {
  options: string[]; value: string[]; onChange: (v: string[]) => void
  placeholder?: string; error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch('') }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])
  }

  const label = value.length === 0
    ? (placeholder || 'Select…')
    : value.length === 1 ? value[0] : `${value[0]} +${value.length - 1} more`

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '6px 36px 6px 12px',
          font: '400 14px/24px var(--font-sans)',
          color: value.length === 0 ? 'var(--lyra-color-fg-disabled)' : 'var(--lyra-color-fg-default)',
          background: 'var(--lyra-color-bg-field)',
          border: `1px solid ${error ? 'var(--lyra-color-status-critical-strong)' : open ? 'var(--lyra-color-border-active)' : 'var(--lyra-color-border-soft)'}`,
          borderRadius: 'var(--radius-sm)', cursor: 'pointer', outline: 'none',
          boxSizing: 'border-box',
        }}
      >
        {label}
      </button>
      <ChevronDown size={14} style={{
        position: 'absolute', right: 10, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
        color: 'var(--lyra-slate-500)', pointerEvents: 'none', transition: 'transform 0.15s',
      }} />
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
          background: 'var(--lyra-color-bg-surface-overlay)',
          border: '1px solid var(--lyra-color-border-soft)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--sol-effect-shadowlg)',
        }}>
          <div style={{ padding: '8px 8px 4px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--lyra-slate-400)' }} />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '5px 8px 5px 26px',
                  font: '400 13px/20px var(--font-sans)', border: '1px solid var(--lyra-color-border-soft)',
                  borderRadius: 'var(--radius-xs)', background: 'var(--lyra-color-bg-field)',
                  outline: 'none', color: 'var(--lyra-color-fg-default)',
                }}
              />
            </div>
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto', padding: '4px 0' }}>
            {filtered.length === 0
              ? <div style={{ padding: '8px 12px', font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)' }}>No results</div>
              : filtered.map(opt => {
                const selected = value.includes(opt)
                return (
                  <div
                    key={opt}
                    onMouseDown={() => toggle(opt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 12px', cursor: 'pointer',
                      background: selected ? 'var(--lyra-color-bg-active-subtle)' : 'transparent',
                      font: '400 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)',
                    }}
                    onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'var(--lyra-color-state-bg-hover-opacity)' }}
                    onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `1.5px solid ${selected ? 'var(--lyra-brand-600)' : 'var(--lyra-color-border-medium)'}`,
                      background: selected ? 'var(--lyra-brand-600)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selected && <Check size={10} stroke="#fff" strokeWidth={2.5} />}
                    </span>
                    {opt}
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── ErrorMsg ── */
export function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, font: '400 12px/16px var(--font-sans)', color: 'var(--lyra-color-status-critical-strong)' }}>
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></svg>
      {children}
    </div>
  )
}

/* ── FieldLabel ── */
export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 4, font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)', marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: 'var(--lyra-color-status-critical-strong)', marginLeft: 2 }}>*</span>}
    </label>
  )
}

/* ── SurveyPickerDrawer ── */
import { SURVEY_DESIGNS } from '../../lib/campaignWizard'

export function SurveyPickerDrawer({
  currentId, onClose, onSelect
}: {
  currentId: string; onClose: () => void; onSelect: (id: string) => void
}) {
  const [search, setSearch] = useState('')
  const [localId, setLocalId] = useState(currentId)

  const filtered = SURVEY_DESIGNS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.24)', zIndex: 400 }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: 'var(--lyra-color-bg-surface-base)',
        borderLeft: '1px solid var(--lyra-color-border-soft)',
        boxShadow: 'var(--sol-effect-shadowlg)',
        zIndex: 401, display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--lyra-color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: '600 16px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>Choose Survey Template</div>
            <div style={{ font: '400 13px/20px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)', marginTop: 2 }}>Select the survey design for this campaign</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'var(--lyra-color-fg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--lyra-color-border-subtle)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--lyra-slate-400)' }} />
            <input
              autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search templates…"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '7px 12px 7px 32px',
                font: '400 14px/20px var(--font-sans)', border: '1px solid var(--lyra-color-border-soft)',
                borderRadius: 'var(--radius-sm)', background: 'var(--lyra-color-bg-field)',
                outline: 'none', color: 'var(--lyra-color-fg-default)',
              }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filtered.map(s => {
            const selected = s.id === localId
            return (
              <div
                key={s.id}
                onClick={() => setLocalId(s.id)}
                style={{
                  padding: '12px 24px', cursor: 'pointer',
                  background: selected ? 'var(--lyra-color-bg-active-subtle)' : 'transparent',
                  borderLeft: selected ? '2px solid var(--lyra-brand-600)' : '2px solid transparent',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'var(--lyra-color-state-bg-hover-opacity)' }}
                onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    border: `${selected ? '5px' : '1.5px'} solid ${selected ? 'var(--lyra-brand-600)' : 'var(--lyra-color-border-medium)'}`,
                  }} />
                  <div>
                    <div style={{ font: '500 14px/20px var(--font-sans)', color: 'var(--lyra-color-fg-default)' }}>{s.name}</div>
                    <div style={{ font: '400 12px/18px var(--font-sans)', color: 'var(--lyra-color-fg-secondary)', marginTop: 2 }}>{s.why}</div>
                    <span style={{
                      display: 'inline-block', marginTop: 6, padding: '2px 8px',
                      borderRadius: 'var(--radius-full)', font: '500 11px/16px var(--font-sans)',
                      background: 'var(--lyra-slate-100)', color: 'var(--lyra-slate-600)',
                    }}>{s.category}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--lyra-color-border-subtle)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--lyra-color-border-soft)', background: 'var(--lyra-color-bg-surface-base)', font: '500 14px/20px var(--font-sans)', cursor: 'pointer', color: 'var(--lyra-color-fg-default)' }}>Cancel</button>
          <button
            onClick={() => { if (localId) { onSelect(localId); onClose() } }}
            disabled={!localId}
            style={{ padding: '7px 16px', borderRadius: 'var(--radius-md)', border: 'none', background: localId ? 'var(--lyra-color-bg-primary)' : 'var(--lyra-color-bg-disabled)', font: '500 14px/20px var(--font-sans)', cursor: localId ? 'pointer' : 'not-allowed', color: localId ? 'var(--lyra-color-fg-on-primary)' : 'var(--lyra-color-fg-disabled)' }}
          >
            Apply Selection
          </button>
        </div>
      </div>
    </>
  )
}
