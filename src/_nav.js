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
  cilPen,
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
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Ingresar persona',
    to: '/person/insert',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Administrador',
    to: '/admin',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Usuarios',
        to: '/admin/users',
      },
      
      {
        component: CNavItem,
        name: 'Cargos',
        to: '/admin/cargos',
      }
    ],
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
]

export default _nav
