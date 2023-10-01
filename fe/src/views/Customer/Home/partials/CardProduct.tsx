import React from 'react'
import { Card, Image, Typography } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { FALLBACK_IMAGE } from '@rootDir/src/constant'
import cx from '@rootDir/src/shortcuts/cx'

function CardProduct(props: { product: any; className?: string }) {
  const { product, className } = props
  return (
    <Card
      className={cx('w-[240px] rounded-xl border-none shadow-md', className)}
      cover={
        <Image
          alt="example"
          src={
            product.image.startsWith('http')
              ? product.image
              : `/dashboard-api/${product.image}`
          }
          fallback={FALLBACK_IMAGE}
          className="h-[240px] rounded-xl object-cover"
        />
      }
    >
      <Meta
        title={product?.name ?? '-'}
        description={
          <Typography.Paragraph
            ellipsis={{ rows: 2 }}
            className="mb-0 text-lg text-sm font-bold text-[var(--primary-color)]"
          >
            Rp. {product?.price.toLocaleString('id-ID')}
          </Typography.Paragraph>
        }
      />
    </Card>
  )
}

export default CardProduct
