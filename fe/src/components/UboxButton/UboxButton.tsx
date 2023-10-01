import { Button, ButtonProps } from 'antd'
import classNames from 'classnames'
import React from 'react'

export type UboxButtonProps = ButtonProps

function UboxButton(props: UboxButtonProps) {
  const { className, ...restProps } = props

  const isPrimary = restProps.type === 'primary'

  return (
    <Button
      className={classNames(
        className,
        isPrimary
          ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-sm font-medium'
          : null,
      )}
      {...restProps}
    />
  )
}

export default UboxButton
