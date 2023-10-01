import React from 'react'

interface EmptyDataProps {
  title?: string
  size?: number
}

function EmptyData(props: EmptyDataProps) {
  const { title, size } = props

  return (
    <div style={{ textAlign: 'center' }}>
      <figure>
        <img
          style={{
            maxWidth: '100%',
            minHeight: '200px',
          }}
          src="/static/images/nodata.svg"
          alt="not found"
        />
      </figure>
      {/* {title && <Title size={size}>{title}</Title>} */}
    </div>
  )
}

export default EmptyData
