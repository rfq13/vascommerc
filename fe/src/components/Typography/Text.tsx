import React, { CSSProperties } from 'react'
import { Typography } from 'antd'
import { TextProps } from 'antd/lib/typography/Text'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'

const { Text: CurText } = Typography
export type TextAlignProperty =
  | '-moz-initial'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'unset'
  | 'center'
  | 'end'
  | 'justify'
  | 'left'
  | 'match-parent'
  | 'right'
  | 'start'
export const mapColor = {
  default: '#404040',
  primary: '#16b3ac',
  'primary-dark': '#0b5956',
  'primary-medium': '#12958f',
  'primary-mid': '#d0f0ee',
  'primary-light': '#ebf7f7',
  'primary-minor': '#d6df22',
  white: '#ffffff',
  black: '#404040',
  'dark-black': '#404040',
  'mid-black': '#9E9E9E',
  'light-black': '#e0e0e0',
  'honey-yellow': '#fbd13d',
  'popsicle-blue': '#47bdf9',
  apple: '#ff6262',
  'mint-green': '#00c064',
  'grape-purple': '#a77fe9',
  honey: '#fb8c00',
  'text-color': '#484C57',
  'text-inactive': '#969CA9',
}

export const mapFontWeight = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
}

export interface IText extends TextProps {
  className?: string
  size?: 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'overline' | any
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
    | 'text-inactive'
    | 'text-color'
    | string
  bold?: boolean
  align?: TextAlignProperty
  style?: CSSProperties
  fontFamily?: 'bold' | 'regular' | 'semiBold' | 'medium'
  block?: boolean
  children?: React.ReactNode | React.ReactNode[]
}

function Text(props: IText) {
  const { xs } = useBreakpoint()

  const mapFontSize = {
    subtitle1: xs ? 16 : 20,
    subtitle2: 18,
    body1: xs ? 14 : 16,
    body2: xs ? 12 : 14,
    overline: 12,
  }

  const {
    size = 'body1',
    color = undefined,
    align,
    block,
    style,
    fontFamily = 'regular',
    ...cProps
  } = props

  return (
    <CurText
      style={{
        fontWeight: mapFontWeight[fontFamily],
        color: mapColor[color] || color,
        fontSize: mapFontSize[size] || size,
        ...(align ? { textAlign: align, display: 'block' } : {}),
        ...(block ? { width: '100%', display: 'block' } : {}),
        ...style,
      }}
      {...cProps}
    />
  )
}

export default Text
