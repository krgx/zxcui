import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'MVP CATALOG',
  },
  {
    component: CNavGroup,
    name: 'КОЛЛЕКЦИИ',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      // Здесь будут динамические коллекции из API
    ],
  },
  {
    component: CNavGroup,
    name: 'Типы товаров',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      // Здесь будут динамические типы товаров из API
    ],
  },
]

export default _nav
