/* eslint-disable import/no-extraneous-dependencies */
import DOMPurify from 'dompurify'

import React from 'react'

function SanitizeHtml({
  data,
  className = '',
  style = {},
  options = {},
}: {
  data: string
  className?: string
  style?: React.CSSProperties
  options?: any
}) {
  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(data, options),
      }}
    />
  )
}

export default SanitizeHtml
