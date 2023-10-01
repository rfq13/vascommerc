import { Table, TableProps } from 'antd'
import classNames from 'classnames'
import React from 'react'
import styles from './UboxTable.module.scss'

type IProps = TableProps<any>

function UboxTable(props: IProps) {
  const { className, ...restProps } = props

  return (
    <Table className={classNames(styles.uboxTable, className)} {...restProps} />
  )
}

export default UboxTable
