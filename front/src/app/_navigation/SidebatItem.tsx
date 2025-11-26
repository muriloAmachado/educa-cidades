'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarConfigItem } from './types'

type Props = {
  item: SidebarConfigItem
}

export default function SiderbarItem({ item }: Props) {
  const pathname = usePathname()

  const isParentCurrentPath = item.root ? pathname === item.route : item.route && pathname.startsWith(item.route)

  const isAnySubItemCurrentPath = item.subItems?.some(subItem => subItem.route && pathname.startsWith(subItem.route))

  const isItemActive = isParentCurrentPath || isAnySubItemCurrentPath
  const hasSubItems = item.subItems && item.subItems.length > 0

  const sidebarMenuButtonContent = (
    <>
      {item.icon && item.icon}
      <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
      {hasSubItems && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
    </>
  )

  const sidebarMenuButton = (
    <SidebarMenuButton size="lg" isActive={isItemActive} tooltip={item.title} asChild={!!item.route} className='group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center'>
      {item.route ? (
        <Link href={item.route} onClick={() => {}}>
          {sidebarMenuButtonContent}
        </Link>
      ) : (
        sidebarMenuButtonContent
      )}
    </SidebarMenuButton>
  )

  if (!hasSubItems) {
    return <SidebarMenuItem key={item.title}>{sidebarMenuButton}</SidebarMenuItem>
  }

  return (
    <Collapsible key={item.title} asChild defaultOpen={isItemActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>{sidebarMenuButton}</CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems?.map(subItem => {
              const isSubItemActive = (subItem.route && pathname.startsWith(subItem.route)) ?? false

              const buttonContent = (
                <>
                  {subItem.icon && subItem.icon}
                  <span>{subItem.title}</span>
                </>
              )
              const handleSubItemClick = () => {}
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton size="md" isActive={isSubItemActive != '' ? isSubItemActive : false} asChild>
                    {subItem.route ? (
                      <Link href={subItem.route} onClick={handleSubItemClick}>
                        {buttonContent}
                      </Link>
                    ) : (
                      buttonContent
                    )}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
