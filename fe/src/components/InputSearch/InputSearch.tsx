import { Input, InputProps } from 'antd'
import classNames from 'classnames'
import React, { useEffect } from 'react'
import IconSearch from '@rootDir/public/static/icons/search.svg'
import styles from './InputSearch.module.scss'

type IProps = Omit<InputProps, 'onChange'> & {
  onChange?: (value: string) => void
}

function InputSearch(props: IProps) {
  const { placeholder, className, onChange, ...restProps } = props
  const [searchValue, setSearchValue] = React.useState('')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onChange?.(searchValue)
    }, 800)

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue])

  return (
    <Input
      prefix={
        <IconSearch width="16" height="16" style={{ color: '#0093BD' }} />
      }
      placeholder={placeholder || 'Search'}
      className={classNames(styles.inputSearch, className)}
      onChange={(e) => setSearchValue(e.target.value)}
      {...restProps}
    />
  )
}

export default InputSearch
