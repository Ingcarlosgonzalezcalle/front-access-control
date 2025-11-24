import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilMap,
  cilAddressBook,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilUser,
  cilPenAlt,
  cilList,
  cilContact,
  cilSpeedometer,
  cilStar,
  cilShieldAlt,
  cilStorage,
  cilNoteAdd,
  cilInbox,
  cilMinus
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Ingresar persona',
    to: '/person/insert',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Usuarios',
     to: '/admin/users',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
  },
  
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
]

export default _nav
