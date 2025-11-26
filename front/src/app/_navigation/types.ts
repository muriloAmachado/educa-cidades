import { ReactElement } from 'react'

export type SidebarConfigItem = {
  title: string
  icon: ReactElement
  root?: boolean
  route?: string
  subItems?: ModuleSidebarConfigSubItem[]
}

export type ModuleSidebarConfig = {
  moduleSidebarConfigItem: SidebarConfigItem[]
  returnConfigItem: SidebarConfigItem
}

export type ModuleSidebarConfigSubItem = Omit<SidebarConfigItem, 'root' | 'subItems'>
