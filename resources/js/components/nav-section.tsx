import { useState } from 'react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { resolveUrl } from '@/lib/utils'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

export function NavSection({ items }: { items: NavItem[] }) {
  const page = usePage()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <SidebarMenu>
      {items.map((item) => {
        const hasChildren = !!item.items?.length
        const isOpen = open === item.title
        const isActive = page.url.startsWith(resolveUrl(item.href))

        return (
          <SidebarMenuItem key={item.title}>
            {/* Parent */}
            <SidebarMenuButton
              isActive={isActive}
              tooltip={{ children: item.title }}
              onClick={() =>
                hasChildren ? setOpen(isOpen ? null : item.title) : null
              }
              asChild={!hasChildren}
              className="flex justify-between"
            >
              {hasChildren ? (
                <div className="flex items-center gap-2 w-full cursor-pointer">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronDown
                    className={clsx(
                      'ml-auto h-4 w-4 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </div>
              ) : (
                <Link href={item.href} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>

            {/* Children */}
            {hasChildren && isOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {item.items!.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href}
                    className={clsx(
                      'block rounded px-2 py-1 text-sm hover:bg-muted',
                      page.url.startsWith(resolveUrl(child.href)) &&
                        'bg-muted font-medium'
                    )}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
