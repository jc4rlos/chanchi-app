import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@boilerplate/ui'
import { useAuthStore } from '@/stores/auth-store'
import { resolveIcon } from '@/lib/icon-map'
import { useLayout } from '@/context/layout-provider'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { type NavGroup as NavGroupType, type NavItem } from './types'

function useDynamicNavGroup(): NavGroupType | null {
  const menuItems = useAuthStore((s) => s.auth.menuItems)
  if (!menuItems.length) return null

  const topLevel = menuItems.filter((i) => i.parentId === null)
  const childrenOf = (id: number) => menuItems.filter((i) => i.parentId === id)

  const items: NavItem[] = topLevel.map((item) => {
    const children = childrenOf(item.id)
    const Icon = resolveIcon(item.icon)
    if (children.length) {
      return {
        title: item.label,
        icon: Icon,
        items: children.map((child) => ({
          title: child.label,
          url: child.path as never,
          icon: resolveIcon(child.icon),
        })),
      }
    }
    return { title: item.label, url: item.path as never, icon: Icon }
  })

  return { title: 'Menú', items }
}

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const dynamicGroup = useDynamicNavGroup()
  const { auth } = useAuthStore()
  const email = auth.user?.email ?? ''
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {dynamicGroup && <NavGroup {...dynamicGroup} />}
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: auth.user?.role ?? 'Usuario',
            email: email,
            avatar: initials,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
