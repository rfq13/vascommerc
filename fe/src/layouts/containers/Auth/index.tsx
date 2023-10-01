import React, { useEffect, useState } from 'react'
import Header from '@vscommerce/layouts/containers/Auth/Header'
import Footer from '@vscommerce/layouts/containers/Auth/Footer'
import { useRouter } from 'next/router'
import { Spin } from 'antd'

interface IProps {
  Component: any
  pageProps: any
}

function AuthContainer(props: IProps) {
  const { Component, pageProps } = props
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Validate existing token
  useEffect(() => {
    if (localStorage.getItem('apiToken')) {
      router.push('/dashboard')
    } else {
      setMounted(true)
    }
  }, [])

  if (mounted) {
    return (
      <>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </>
    )
  }
  // TODO: create a loading component (use spinner from antd in the center of the screen)

  return (
    <div
      className="
    flex h-screen w-screen flex-col items-center justify-center bg-gray-100"
    >
      {/* <div className="text-2xl font-bold text-gray-700">Loading...</div> */}
      <Spin size="large" />
    </div>
  )
}

export default AuthContainer
