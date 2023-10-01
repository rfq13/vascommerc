import { Layout } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AUTH_TOKEN_KEY } from '@rootDir/src/constant'
import styles from './AdminContainer.module.scss'
import AdminHeader from './AdminHeader'
import AdminSider from './AdminSider'

const { Content } = Layout

function AdminContainer(props: any) {
  const { Component } = props
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Validate existing token
  useEffect(() => {
    if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
      router.push('/')
    } else {
      setMounted(true)
    }
  }, [])

  const isDashboard = router.pathname.includes('dashboard')

  if (!mounted) {
    return null
  }

  return (
    <Layout id={styles.adminContainer} className="h-screen overflow-hidden">
      <AdminSider />
      <Layout>
        <AdminHeader />
        <Content className="overflow-y-auto">
          <div
            className={`m-9 min-h-[360px]${
              !isDashboard ? ' rounded-3xl bg-slate-50 p-9' : ''
            }`}
          >
            <Component {...props} />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminContainer
