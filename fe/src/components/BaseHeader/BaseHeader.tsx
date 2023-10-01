import React, { ReactNode } from 'react'
import Content, { ContentProps } from '@components/Content/Content'
import { Row } from 'antd'
import { NextRouter, withRouter } from 'next/router'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import cssHeader from '@rootDir/src/layouts/containers/Public/Header/Header.module.scss'
import cx from 'classnames'
import classes from './BaseHeader.module.scss'

export interface BaseHeaderProps extends ContentProps {
  children?: ReactNode
  style?: CSSStyleDeclaration | any
  absolute?: boolean
  router?: NextRouter
}

function BaseHeader(props: BaseHeaderProps) {
  const {
    absolute,
    children,
    className,
    style,
    styleContainer,
    ...otherProps
  } = props

  const { md, lg } = useBreakpoint()

  return (
    <Content
      {...otherProps}
      component={(compProps) => (
        <header
          style={{
            boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.1)',
          }}
          {...compProps}
        />
      )}
      className={cx(cssHeader.container, className)}
      style={{
        background: '#fff',
        height: md || lg ? 90 : 80,
        ...style,
      }}
      styleContainer={{
        ...(absolute
          ? {
              position: 'fixed',
              top: 0,
              zIndex: 999,
              width: '100%',
            }
          : {}),
        ...styleContainer,
        background: '#fff',
        // paddingTop: '30px',
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        gutter={{ xs: 8, sm: 16, md: 16, lg: 20 }}
        className={classes.rowWrapper}
        wrap={false}
      >
        {children}
      </Row>
    </Content>
  )
}

export default withRouter<BaseHeaderProps & { router: NextRouter }>(BaseHeader)
