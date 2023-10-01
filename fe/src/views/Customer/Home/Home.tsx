import React, { useEffect, useState } from 'react'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import { Card, Carousel, Col, Divider, Image, Row, Space } from 'antd'
import useProduct from '@rootDir/src/data/useProduct'
import Meta from 'antd/lib/card/Meta'
import { FALLBACK_IMAGE } from '@rootDir/src/constant'
import Typography from 'antd/lib/typography/Typography'
import Title from 'antd/lib/typography/Title'
import BannerList from './partials/BannerList'
import CarouselChunkedProduct from './partials/CarouselChunkedProduct'
import CardProduct from './partials/CardProduct'

function Home() {
  const { md } = useBreakpoint()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const qNewProducts = useProduct({
    query: {
      defaultValue: {
        page: 1,
        pageSize: 10,
        sorted: JSON.stringify([{ id: 'createdAt', desc: true }]),
      },
    },
  })

  const chunkedNewProducts = React.useMemo(() => {
    const chunked = []

    if (!qNewProducts?.data?.length) return chunked
    const chunkSize = 5
    for (let i = 0; i < qNewProducts?.data?.length; i += chunkSize) {
      chunked.push(qNewProducts?.data?.slice(i, i + chunkSize))
    }

    return chunked
  }, [qNewProducts?.data])

  const qAvailableProducts = useProduct({
    query: {
      defaultValue: {
        page: 1,
        pageSize: 10,
      },
    },
  })

  const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' }

  return (
    <div style={{ background: '#fff' }}>
      <BannerList
        images={[
          'https://picsum.photos/1200/160',
          'https://picsum.photos/1200/160',
        ]}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Space
          direction="vertical"
          size={20}
          style={{
            justifyContent: 'center',
          }}
        >
          <Title
            level={3}
            style={{
              textAlign: 'left',
              marginTop: 30,
              padding: '0 17%',
            }}
          >
            Terbaru
          </Title>
          <CarouselChunkedProduct chunkedData={chunkedNewProducts} />
        </Space>
        {/* grid menyamping */}
      </div>
      <Title
        level={3}
        style={{
          textAlign: 'left',
          marginTop: '12rem',
          padding: '0 17%',
        }}
      >
        Produk Tersedia
      </Title>
      <Row
        className="ml-[15rem] mt-5 flex w-[100rem] text-center"
        gutter={[20, 20]}
      >
        {qAvailableProducts?.data?.map((product) => (
          <Col span={4}>
            <CardProduct key={product.id} product={product} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home
