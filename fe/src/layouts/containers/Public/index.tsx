/* eslint-disable no-use-before-define */
import { Spin } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import Layout from 'antd/lib/layout/layout'
import Footer from '@vscommerce/layouts/containers/Public/Footer'
import Header from '@vscommerce/layouts/containers/Public/Header'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactComponentLike } from 'prop-types'
import React, { useEffect, useState } from 'react'
import CallAPI from '@rootDir/src/services/CallAPI'
import useAuthStore from '@rootDir/src/store/auth'
import { useRouter } from 'next/router'
import { AUTH_TOKEN_KEY, ROLE_ADMIN } from '@rootDir/src/constant'
import jwtDecode from 'jwt-decode'

interface IProps {
  Component: ReactComponentLike
  pageProps?: any
}

const HEIGHT_HEADER = 90
const HEIGHT_FOOTER = 110

export const PublicContext = React.createContext<
  {
    stateLayoutLoading: [boolean, (loading: boolean) => void]
  } & any
>({
  stateLayoutLoading: [false, () => {}],
})

function PublicContainer(props: IProps) {
  const { Component, pageProps } = props
  const router = useRouter()
  const { setUser } = useAuthStore() as any

  const auth = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!token) {
        return { isSuper: false }
      }

      const decoded = jwtDecode(token)
      return decoded
    }

    return { isSuper: false }
  }, []) as { isSuper: boolean; role?: string }

  useEffect(() => {
    if (pageProps?.token) {
      CallAPI.getCurrentUser().then((res) => {
        const { data } = res
        if (data?.data) {
          setUser(data.data)
        }
        router.push('/')
      })
    }
  }, [])

  useEffect(() => {
    if (auth?.role && ROLE_ADMIN.includes(auth?.role)) {
      router.push('/dashboard')
    }
  }, [auth])

  const stateLayoutLoading = useState(false)
  const [isLayoutLoading] = stateLayoutLoading

  const { md } = useBreakpoint()

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <PublicContext.Provider value={{ stateLayoutLoading }}>
      <Layout
        style={{
          height: 'auto',
          minHeight: '100%',
        }}
        id="publicContainer"
      >
        <Spin spinning={isLayoutLoading} size="large" tip="Logging Out...">
          <Header />
          <div
            style={{
              minHeight: `calc(100vh - ${HEIGHT_HEADER + HEIGHT_FOOTER}px)`,
              marginTop: Number(md ? HEIGHT_HEADER : HEIGHT_HEADER - 10) + 10,
            }}
          >
            <Component {...props} />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 99,
            }}
          >
            <Footer />
          </div>
        </Spin>
      </Layout>
    </PublicContext.Provider>
  )
}

export default PublicContainer
