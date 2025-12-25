import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import { NavSection } from './nav-section'
import { NavGroup } from '@/types'

export function NavMain({ groups }: { groups: NavGroup[] }) {
    return (
        <>
        {groups.map((group) => (
            <SidebarGroup key={group.label} className="px-2 py-0">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <NavSection items={group.items} />
            </SidebarGroup>
        ))}
        </>
    )
}
