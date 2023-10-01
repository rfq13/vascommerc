import React, { useRef } from 'react'
import { Carousel, Image, Space } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
}

// eslint-disable-next-line react/function-component-definition
function App(props: { images: string[] }) {
  const [current, setCurrent] = React.useState(0)
  const { images } = props
  const slider = useRef()

  if (!images) return null

  return (
    <div
      style={{
        justifyContent: 'center',
        // padding: '0 3%',
        width: 'calc(1200px + 26%)',
        // margin: '0 auto',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <Carousel
        beforeChange={setCurrent}
        dots={false}
        autoplay
        ref={(ref) => {
          slider.current = ref
        }}
      >
        {images.map((img, index) => (
          <div key={`keys-${index}` as string}>
            <Image
              style={contentStyle}
              className="bg-cover bg-center"
              src={img}
            />
          </div>
        ))}
      </Carousel>

      <div className="justify-first ml-[15rem] mt-5 flex text-center">
        <Space>
          <LeftOutlined
            className="text-xl"
            onClick={() => {
              if (current > 0) {
                setCurrent(current - 1)

                slider.current.goTo(current - 1)
              }
            }}
          />

          {images.map((img, index) => (
            <div
              key={`keys-${index}` as string}
              className={`h-3 w-3 rounded-full ${
                index === current ? 'bg-gray-800' : 'bg-gray-400'
              }`}
            />
          ))}

          <RightOutlined
            className="text-xl"
            onClick={() => {
              if (current < images.length - 1) {
                setCurrent(current + 1)
                slider.current.goTo(current + 1)
              }
            }}
          />
        </Space>
      </div>
    </div>
  )
}

export default App
