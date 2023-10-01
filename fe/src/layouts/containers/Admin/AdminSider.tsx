import { Menu } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import jwtDecode from 'jwt-decode'

import IconHome from '@rootDir/public/static/icons/Home.svg'
import IconUser from '@rootDir/public/static/icons/User.svg'
import IconNotebook from '@rootDir/public/static/icons/notebook.svg'
import useGetCurrentUser from '@rootDir/src/data/useGetCurrentUser'
import { AUTH_TOKEN_KEY } from '@rootDir/src/constant'

function AdminSider() {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const qCurrentUser = useGetCurrentUser({})

  const auth = React.useMemo(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      return { isSuper: false }
    }

    const decoded = jwtDecode(token)
    return decoded
  }, []) as { isSuper: boolean }

  const checkAllowed = ({ method, path }) => {
    return auth.isSuper
      ? true
      : qCurrentUser.data?.Role.RolePermissions?.find(
          ({ Permission: item }) =>
            item.method === method && item.path === path,
        )
  }

  function createMenu(
    label,
    key,
    iconUrl?,
    children?: any[],
    link?: any,
  ): ItemType {
    return {
      key,
      label,
      icon:
        typeof iconUrl === 'string' ? (
          <img src={iconUrl} alt="icon" />
        ) : (
          iconUrl
        ),
      className: 'text-base',
      children,
      onClick() {
        if (link) {
          router.push(link)
        }
      },
    }
  }

  const SIDE_MENU = [
    createMenu(
      'Dashboad',
      'a',
      <IconHome width="22" height="22" />,
      null,
      '/dashboard',
    ),
    checkAllowed({ path: '/user', method: 'GET' })
      ? createMenu(
          'Manajemen User',
          'b',
          <IconUser width="22" height="22" />,
          null,
          '/user',
        )
      : undefined,

    checkAllowed({ path: '/product', method: 'GET' })
      ? createMenu(
          'Manajemen Produk',
          'c',
          <IconNotebook width="22" height="22" />,
          null,
          '/product',
        )
      : undefined,
  ]

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
      // className="overflow-y-auto bg-[#004457]"
      // buat gradaasi warni dari primary-color ke putih
      className="overflow-y-auto bg-slate-50"
    >
      {collapsed ? (
        <img
          src="/static/images/icon.png"
          alt="vscommerce-icon"
          className="mx-auto mb-16 mt-8 w-[50px]"
        />
      ) : (
        <img
          src="/static/images/icon.png"
          alt="vscommerce-icon"
          width={70}
          className="mx-auto mb-16 mt-8 w-[150px]"
          style={{ color: '#fff' }}
        />
      )}

      <Menu
        id="admin-sider-menu"
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={SIDE_MENU}
        className="text-dark-slate-900 rounded-lg bg-slate-50 pb-14"
      />

      <style global jsx>
        {`
          #admin-sider-menu .ant-menu-item,
          #admin-sider-menu .ant-menu-submenu-title {
            height: auto !important;
            padding: 12px 24px !important;
            line-height: 1 !important;
            margin 20px 0 !important;
          }

          #admin-sider-menu .ant-menu-submenu-title, #admin-sider-menu .ant-menu-sub li:last-child {
            margin-bottom: 0 !important;
          }

          #admin-sider-menu.ant-menu-inline-collapsed .ant-menu-item,
          #admin-sider-menu.ant-menu-inline-collapsed .ant-menu-submenu-title {
            padding: 12px calc(50% - 20px / 2) !important;
          }

          ul[id^='admin-sider-menu-'] {
            background-color: #004457 !important;
            margin-left: 2px;
            padding-right: 4px !important;
            padding-left: 4px !important;
          }

          ul[id^='admin-sider-menu-'] li {
            display: flex;
            align-items: center;
            height: auto;
            padding: 12px 24px !important;
          }

          ul[id^='admin-sider-menu-'] li.ant-menu-item-selected {
            background-color: red !important;
            border-radius: 8px;
          }

          #admin-sider-menu > li .ant-menu-title-content {
            color: #000;
          }
          #admin-sider-menu > li.ant-menu-item-selected .ant-menu-title-content {
            color: white;
          }
          #admin-sider-menu > li.ant-menu-item-active .ant-menu-title-content {
            
          }
        `}
      </style>
    </Sider>
  )
}

export default AdminSider
