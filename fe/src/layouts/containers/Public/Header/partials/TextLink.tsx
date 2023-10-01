import Text from '@components/Typography/Text'
import Link from 'next/link'
import React, { useState, JSX } from 'react'

function TextLink({ text, to }): JSX.Element {
  const [textColor, setTextColor] = useState('black')

  return (
    <Link
      href={to}
      onMouseEnter={() => setTextColor('#e21d26')}
      onMouseLeave={() => setTextColor('black')}
    >
      <Text
        style={{ fontSize: '14px', color: textColor }}
        color="primary"
        size={15}
        fontFamily="regular"
      >
        {text as string}
      </Text>
    </Link>
  )
}

export default TextLink
