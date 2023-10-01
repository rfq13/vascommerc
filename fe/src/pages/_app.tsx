/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import getSiteLayout from '@vscommerce/layouts/core/DefaultLayout'
import Head from 'next/head'
import NProgress from 'nprogress'
import '@vscommerce/styles/global.css'
import '@vscommerce/styles/global.scss'
import '@vscommerce/styles/vars.scss'
import Loading from '@components/Loading/Loading'

import { Router } from 'next/router'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { ConfigProvider } from 'antd'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(dayjs.tz.guess())

const title = 'VSCommerce'
const description =
  'VSCommerce adalah aplikasi yang memudahkan pengiriman barang dari mitra pengiriman ke pelanggan'

const metaURL = 'vscommerce.com'
const metaImage = 'https://vscommerce.com/static/images/icon.png'

const webIconURL = '/static/favicon.ico'

NProgress.configure({ showSpinner: false })

const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <figure>
      <img
        style={{
          width: 180,
        }}
        src="/static/images/nodata.svg"
        alt="No Data"
      />
    </figure>
  </div>
)

function App(props: AppProps) {
  const siteLayout = getSiteLayout(props)

  useEffect(() => {
    const handleStartLoading = () => {
      NProgress.start()
    }
    const handleStopLoading = () => {
      NProgress.done()
    }

    Router.events.on('routeChangeStart', handleStartLoading)
    Router.events.on('routeChangeComplete', handleStopLoading)
    Router.events.on('routeChangeError', handleStopLoading)

    return () => {
      Router.events.off('routeChangeStart', handleStartLoading)
      Router.events.off('routeChangeComplete', handleStopLoading)
      Router.events.off('routeChangeError', handleStopLoading)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <link rel="shortcut icon" href={webIconURL} />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaURL} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={metaImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={metaURL} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={metaImage} />
      </Head>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        {this?.state?.firstMount && (
          <Loading
            ref={(ref) => {
              if (ref && !this?.refLoading?.current) {
                this.refLoading.current = ref
                this.refLoading.current.style.visibility = 'hidden'
                this.listenLoading(true, this.refLoading.current)
              }
            }}
            style={{
              display: 'none',
            }}
          />
        )}
        {siteLayout}
      </ConfigProvider>
    </>
  )
}

export default App
