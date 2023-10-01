import { Avatar, Dropdown, Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { useRouter } from 'next/router'
import React from 'react'
import useAuthStore from '@rootDir/src/store/auth'
import { AUTH_TOKEN_KEY } from '@rootDir/src/constant'

function AdminHeader() {
  const router = useRouter()
  const { user } = useAuthStore() as any

  const DropdownMenu = (
    <Menu
      items={[
        {
          label: 'Logout',
          key: 'logout',
          onClick() {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            router.push('/')
          },
        },
      ]}
    />
  )

  return (
    <Header className="flex h-auto justify-end border-b border-solid border-[#EEEEEE] bg-slate-50 px-10 py-7">
      <Dropdown overlay={DropdownMenu}>
        <div className="flex items-center">
          <p className="m-0 text-sm font-bold text-black">
            Hi, {user?.fullName}
          </p>
          <Avatar shape="circle" size="large" className="ml-3 bg-[#006B8A]">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <img
            src="/static/icons/chevron-down.svg"
            alt="chevron-down"
            className="ml-3"
          />
        </div>
      </Dropdown>
    </Header>
  )
}

export default AdminHeader
