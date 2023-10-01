import { CSSProperties } from 'react'
import { Typography } from 'antd'
import { TitleProps } from 'antd/lib/typography/Title'
import { mapFontWeight, mapColor, TextAlignProperty } from './Text'

const { Title: CurTitle } = Typography

interface CustomTitleProps extends TitleProps {
  className?: string
  color?:
    | 'default'
    | 'primary'
    | 'white'
    | 'black'
    | 'dark-black'
    | 'mid-black'
    | 'light-black'
    | 'honey-yellow'
    | 'popsicle-blue'
    | 'apple'
    | 'mint-green'
    | 'grape-purple'
    | 'honey'
    | string
  size?: number
  noMargin?: boolean
  align?: TextAlignProperty
  style?: CSSProperties
  fontFamily?: 'bold' | 'regular' | 'semiBold' | 'medium' | any
}

function Title(props: CustomTitleProps) {
  const {
    noMargin,
    color,
    style,
    align,
    fontFamily = 'regular',
    ...otherProps
  } = props

  return (
    <CurTitle
      style={{
        fontWeight: mapFontWeight[fontFamily],
        color: mapColor[color] || color || mapColor.default,
        ...(noMargin ? { marginBottom: 0 } : {}),
        ...(align ? { textAlign: align } : {}),
        ...style,
      }}
      {...otherProps}
    />
  )
}

export default Title
