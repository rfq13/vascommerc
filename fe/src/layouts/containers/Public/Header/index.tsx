import { Divider, Space } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import classes from '@vscommerce/layouts/containers/Public/Header/Header.module.scss'
import Link from 'next/link'
import React, { useEffect } from 'react'
import cx from '@rootDir/src/shortcuts/cx'
import UboxButton from '@rootDir/src/components/UboxButton'
import SearchBar from './partials/SearchBar/SearchBar'

function Header() {
  const { md } = useBreakpoint()

  const onScrollEvent = () => {
    // setShowShadow(window.scrollY > 100)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScrollEvent)
    return () => {
      window.removeEventListener('scroll', onScrollEvent)
    }
  }, [])

  return (
    // <header className={cx(classes.Container, showShadow && classes.shadow)}>
    <header className={cx(classes.Container)}>
      <div className={classes.HeaderContainer}>
        <Link href="/" className={classes.HeaderLogo}>
          <div>
            <img
              className="w-25"
              height="auto"
              alt="logo"
              src="/static/images/icon.png"
            />
          </div>
        </Link>

        {!md ? null : (
          <>
            <SearchBar />
            <Divider type="vertical" className={classes.HeaderDivider} />
          </>
        )}
        {!md && <SearchBar />}
        {md && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Space size={20}>
              <Link href="/login">
                <UboxButton
                  size="large"
                  type="primary"
                  ghost
                  // className="color:white hover:color-[var(--primary-color)]"
                >
                  Masuk
                </UboxButton>
              </Link>
              <Link href="/">
                <UboxButton size="large" type="primary">
                  Daftar
                </UboxButton>
              </Link>
            </Space>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
