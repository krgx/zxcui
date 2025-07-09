import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import axios from 'axios'

const API_URL = 'http://212.193.27.132/fastapi/api/v1'
const AUTH_HEADER = {
  headers: {
    'Authorization': 'Basic ' + btoa('catalog_mvp:tzlQQsKA')
  }
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [collections, setCollections] = useState([])
  const [categories, setCategories] = useState([])
  const [navItems, setNavItems] = useState(navigation)

  // Загрузка коллекций
  useEffect(() => {
    axios.get(`${API_URL}/collections`, {
      ...AUTH_HEADER,
      params: { sort_by: 'id', order: 'asc' }
    })
      .then(res => {
        console.log('collections from API:', res.data);
        setCollections(res.data)
      })
      .catch(() => setCollections([]))
  }, [])

  // Извлечение уникальных категорий из коллекций
  useEffect(() => {
    if (collections.length > 0) {
      const uniqueCategories = new Set()
      collections.forEach(collection => {
        if (collection.category) {
          uniqueCategories.add(JSON.stringify(collection.category))
        }
      })
      const categoriesArray = Array.from(uniqueCategories).map(cat => JSON.parse(cat))
      setCategories(categoriesArray)
    }
  }, [collections])

  useEffect(() => {
    const newNav = navigation.map(item => {
      if (item.name === 'КОЛЛЕКЦИИ' && item.items) {
        return {
          ...item,
          items: collections.map(col => ({
            component: 'CNavItem',
            name: col.label,
            to: `/collections/${col.id}`,
          })),
        }
      }
      if (item.name === 'Типы товаров' && item.items) {
        return {
          ...item,
          items: categories.map(category => ({
            component: 'CNavItem',
            name: category.label,
            to: `/categories/${category.id}`,
          })),
        }
      }
      return item
    })
    setNavItems(newNav)
  }, [collections, categories])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={48} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={48} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
