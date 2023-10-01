import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { FALLBACK_IMAGE } from '@rootDir/src/constant'
import { Card, Carousel, Space, Image, Col, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React, { useRef } from 'react'
import CardProduct from './CardProduct'

function CarouselChunkedProduct(props: { chunkedData: any[] }) {
  const { chunkedData } = props
  const [current, setCurrent] = React.useState(0)
  const slider = useRef()
  return (
    <Row
      style={{
        justifyContent: 'center',
        // padding: '0 3%',
        width: 'calc(1200px + 16%)',
        margin: '0 auto',
      }}
    >
      <Col span={1}>
        <LeftOutlined
          className="mt-[15rem] text-4xl"
          onClick={() => {
            const newCurrent = current - 1 < 0 ? 0 : current - 1
            setCurrent(newCurrent)
            slider.current.goTo(newCurrent)
          }}
        />
      </Col>
      <Col span={20}>
        <Carousel
          beforeChange={setCurrent}
          className="mb-5 mt-5 h-[240px] w-full"
          // autoplay
          ref={(ref) => {
            slider.current = ref
          }}
          dots={false}
        >
          {chunkedData.map((item, idx) => (
            <Space
              key={`asa-${idx}` as string}
              className="flex h-[25rem] justify-center"
            >
              {item.map((product) => (
                <CardProduct key={product.id} product={product} />
              ))}
            </Space>
          ))}
        </Carousel>
      </Col>
      <Col span={1}>
        <RightOutlined
          className="float-right mt-[15rem] justify-end text-right text-4xl"
          onClick={() => {
            if (current < chunkedData.length - 1) {
              setCurrent(current + 1)
              slider.current.goTo(current + 1)
            } else {
              setCurrent(0)
              slider.current.goTo(0)
            }
          }}
        />
      </Col>
    </Row>
  )
}

export default CarouselChunkedProduct
