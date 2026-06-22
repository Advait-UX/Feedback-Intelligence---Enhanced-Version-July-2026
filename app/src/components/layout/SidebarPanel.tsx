import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { LayoutGrid, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SidebarNavItem = { id: string; label: string; icon: LucideIcon; badge?: string }

const DEFAULT_NAV_ITEMS: SidebarNavItem[] = [
  { id: 'dashboard', label: 'Dashboard',        icon: LayoutGrid },
  { id: 'campaign',  label: 'Campaign Manager', icon: Megaphone },
]

interface SidebarPanelProps {
  open: boolean
  onToggle: () => void
  items?: SidebarNavItem[]
  activeKey?: string
  onSelect?: (id: string) => void
}

/*
  ─── Lyra sidebar nav tokens (MVP Prototype shell.css + Figma qyCq4jUOrpYcpHhpNCdgA5) ───

  Panel
    background       : rgb(243, 245, 246)                          [canvas surface — lyra-slate-200, same as app bg]
    border           : none                             [blends into canvas]
    border-radius    : none

  Nav scroll area padding
    top              : 8px   (--space-2)
    left/right       : 12px  (--space-3)
    bottom           : 20px  (--space-5)

  Nav item row
    height           : 36px                            [row-height/md]
    padding-x        : 10px                            [Lyra nav-item pl/pr]
    gap icon → label : 8px                             (--space-2)
    border-radius    : 8px                             [--radius-md]

  Active state
    background       : #d3e6fd                         [color-bg-active-moderate]
    text             : #185ba4                         [color-fg-active-strong = brand-700]
    icon             : #185ba4
    accent bar       : 2px solid #185ba4 at left:0, top:10px, bottom:10px

  Inactive state
    background       : transparent
    text             : rgba(0,0,0,0.80)                [color-fg-default]
    icon             : rgba(0,0,0,0.80)

  Hover state
    background       : rgba(0,0,0,0.04)                [color-state-bg-hover]

  Icon size          : 16px
  Font               : Inter (Lyra typography.fontFamily.sans)
  Font size          : 13px / line-height 16px         [unchanged per requirement]
  Font weight        : 400 inactive · 500 active
*/

export function SidebarPanel({ open, items, activeKey, onSelect }: SidebarPanelProps) {
  const navItems = items ?? DEFAULT_NAV_ITEMS
  const [internalSelected, setInternalSelected] = useState(navItems[0]?.id ?? '')
  const selected = activeKey ?? internalSelected

  // First item is the section "home" — visually separated from sub-pages by a divider
  const [sectionHome, ...subItems] = navItems

  return (
    <div
      className={cn(
        'flex flex-col flex-shrink-0 overflow-hidden transition-all duration-200 ease-in-out',
        open ? 'w-[256px]' : 'w-[60px]'
      )}
      style={{
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'rgb(243, 245, 246)',
      }}
    >
      {/* Top padding: 8px */}
      <div className="h-2 flex-shrink-0" />

      {/* Section home item (e.g. "Operations") */}
      {sectionHome && (
        <div className="px-3">
          <NavItem
            item={sectionHome}
            isSelected={selected === sectionHome.id}
            open={open}
            onSelect={(id) => { setInternalSelected(id); onSelect?.(id) }}
          />
        </div>
      )}

      {/* Divider */}
      {subItems.length > 0 && (
        <div
          className="mx-3 my-1 flex-shrink-0"
          style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }}
        />
      )}

      {/* Sub-page nav items */}
      <nav className="flex flex-col px-3 flex-1">
        {subItems.map(item => (
          <NavItem
            key={item.id}
            item={item}
            isSelected={selected === item.id}
            open={open}
            onSelect={(id) => { setInternalSelected(id); onSelect?.(id) }}
          />
        ))}
      </nav>

      {/* Bottom padding: 20px */}
      <div className="h-5 flex-shrink-0" />
    </div>
  )
}

/* ─── Shared nav item row ──────────────────────────────────────────────────── */

function NavItem({
  item,
  isSelected,
  open,
  onSelect,
}: {
  item: SidebarNavItem
  isSelected: boolean
  open: boolean
  onSelect: (id: string) => void
}) {
  const Icon = item.icon

  return (
    <button
      onClick={() => onSelect(item.id)}
      title={!open ? item.label : undefined}
      className={cn(
        'relative flex w-full items-center transition-colors duration-100 outline-none focus:outline-none rounded-lg',
        // Height 36px (row-height/md), px-10px
        open
          ? 'gap-2'
          : 'justify-center',
      )}
      style={{
        height: 36,
        padding: open ? '0 10px' : '0',
        width: open ? '100%' : 36,
        margin: open ? undefined : '0 auto',
        backgroundColor: isSelected
          ? '#d3e6fd'                  // color-bg-active-moderate
          : undefined,
      }}
      onMouseEnter={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.04)'
      }}
      onMouseLeave={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = ''
      }}
    >
      {/* 2px left accent bar — only on active items (Lyra spec) */}
      {isSelected && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            bottom: 10,
            width: 2,
            background: '#185ba4',      // color-fg-active-strong = brand-700
            borderRadius: 2,
          }}
        />
      )}
      <Icon
        className="flex-shrink-0"
        style={{
          width: 16,
          height: 16,
          color: isSelected
            ? '#185ba4'                 // color-fg-active-strong
            : 'rgba(0,0,0,0.80)',       // color-fg-default
        }}
      />
      {open && (
        <>
          <span
            className="flex-1 text-left truncate"
            style={{
              fontSize: 13,
              lineHeight: '16px',
              fontWeight: isSelected ? 500 : 400,
              color: isSelected
                ? '#185ba4'               // color-fg-active-strong
                : 'rgba(0,0,0,0.80)',     // color-fg-default
            }}
          >
            {item.label}
          </span>
          {item.badge && (
            <span style={{
              flexShrink: 0,
              font: '500 11px/14px Inter, sans-serif',
              color: '#8e6800',
              background: '#fff8d4',
              borderRadius: 999,
              padding: '1px 7px',
              whiteSpace: 'nowrap',
            }}>{item.badge}</span>
          )}
        </>
      )}
    </button>
  )
}
