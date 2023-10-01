import { Select, SelectProps } from 'antd'
import classNames from 'classnames'
import React from 'react'
import styles from './UboxSelect.module.scss'

export type UboxSelectProps = {
  isHeaderSearch?: boolean
} & SelectProps

function UboxSelect(props: UboxSelectProps) {
  const { className, isHeaderSearch, ...restProps } = props
  return (
    <Select
      className={classNames(
        isHeaderSearch
          ? styles.uboxSelectHeaderSearchForDesktop
          : styles.uboxSelect,
        className,
      )}
      {...restProps}
    />
  )
}

export default UboxSelect
