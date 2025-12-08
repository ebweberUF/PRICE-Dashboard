import { uniqueId } from 'lodash'

export interface ChildItem {
  id?: number | string
  name?: string
  icon?: any
  children?: ChildItem[]
  item?: any
  url?: any
  color?: string
  disabled?: boolean
  subtitle?: string
  badge?: boolean
  badgeType?: string
  isPro?: boolean
}

export interface MenuItem {
  heading?: string
  name?: string
  icon?: any
  id?: number
  to?: string
  items?: MenuItem[]
  children?: ChildItem[]
  url?: any
  disabled?: boolean
  subtitle?: string
  badgeType?: string
  badge?: boolean
  isPro?: boolean
}

const SidebarContent: MenuItem[] = [
  {
    heading: 'Main',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-2-linear',
        id: uniqueId(),
        url: '/',
      },
    ],
  },
  {
    heading: 'Research',
    children: [
      {
        name: 'Labs',
        icon: 'solar:test-tube-linear',
        id: uniqueId(),
        url: '/labs',
      },
      {
        name: 'Studies',
        icon: 'solar:clipboard-list-linear',
        id: uniqueId(),
        url: '/studies',
      },
      {
        name: 'Participants',
        icon: 'solar:users-group-rounded-linear',
        id: uniqueId(),
        url: '/participants',
      },
    ],
  },
  {
    heading: 'Data',
    children: [
      {
        name: 'Data Quality',
        icon: 'solar:chart-square-linear',
        id: uniqueId(),
        url: '/data-quality',
      },
      {
        name: 'Reports',
        icon: 'solar:document-text-linear',
        id: uniqueId(),
        url: '/reports',
      },
    ],
  },
  {
    heading: 'Integrations',
    children: [
      {
        name: 'REDCap',
        icon: 'solar:database-linear',
        id: uniqueId(),
        url: '/integrations/redcap',
      },
      {
        name: 'eLab',
        icon: 'solar:flask-linear',
        id: uniqueId(),
        url: '/integrations/elab',
      },
    ],
  },
  {
    heading: 'Settings',
    children: [
      {
        name: 'User Profile',
        icon: 'solar:user-circle-linear',
        id: uniqueId(),
        url: '/user-profile',
      },
    ],
  },
]

export default SidebarContent
