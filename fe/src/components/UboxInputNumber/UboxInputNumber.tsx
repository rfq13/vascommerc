import { InputNumber, InputNumberProps } from 'antd'
import classNames from 'classnames'
import React from 'react'
import styles from './UboxInputNumber.module.scss'

export type UboxInputNumberProps = InputNumberProps

function UboxInputNumber(props: UboxInputNumberProps) {
  const { className, ...restProps } = props
  return (
    <InputNumber
      className={classNames(styles.uboxInputNumber, className)}
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      {...restProps}
    />
  )
}

export default UboxInputNumber
