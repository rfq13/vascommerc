import { Input, InputProps } from 'antd'
import classNames from 'classnames'
import React from 'react'

export type UboxInputProps = InputProps

function UboxInput(props: UboxInputProps) {
  const { className, ...restProps } = props
  return (
    <Input
      className={classNames('h-12 rounded-lg px-4 pb-3 pt-[10px]', className)}
      {...restProps}
    />
  )
}

export default UboxInput
