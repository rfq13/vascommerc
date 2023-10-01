/* eslint-disable react/no-array-index-key */
import { Col, List, Row, Space } from 'antd'
import Text from '@components/Typography/Text'
import React from 'react'
import IconFb from '@rootDir/public/static/icons/facebook.svg'
import IconTwitter from '@rootDir/public/static/icons/twitter.svg'
import IconIg from '@rootDir/public/static/icons/instagram.svg'
import Title from 'antd/lib/typography/Title'
import classes from './Footer.module.scss'

function Footer() {
  return (
    <footer className="mt-12 border-t-2 bg-white">
      <div className={classes.FooterContainer}>
        <Row gutter={[16, 16]} wrap className="w-full">
          <Col span={8} className="justify-center text-center">
            <img
              className="w-25 mx-auto mb-10"
              height="auto"
              alt="logo"
              src="/static/images/icon.png"
            />
            <Text
              size={14}
              fontFamily="regular"
              className=" text-center text-[#1F1C17]"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              commodo in vestibulum, sed dapibus tristique nullam.
            </Text>
            <br />
            <Space
              style={{
                marginTop: '18px',
              }}
            >
              <IconFb className="text-xl" />
              <IconTwitter className="text-xl" />
              <IconIg className="text-xl" />
            </Space>
          </Col>
          <Col span={4} className="ml-12 justify-center text-center">
            <Title className="font-serif" level={4}>
              Layanan
            </Title>
            <List
              dataSource={[
                {
                  title: 'Bantuan',
                },
                {
                  title: 'Tanya Jawab',
                },
                {
                  title: 'Hubungi Kami',
                },
                {
                  title: 'Cara Berjualan',
                },
              ]}
              className="mx-auto justify-center text-center"
              renderItem={(item) => (
                <List.Item className="border-none p-0 py-2">
                  <Text
                    size={14}
                    fontFamily="regular"
                    className="tracking-spacer font-sans font-semibold tracking-[0.2rem] text-[#000000]"
                  >
                    {item.title.toUpperCase()}
                  </Text>
                </List.Item>
              )}
            />
          </Col>
          <Col span={4} className="ml-12 justify-center text-center">
            <Title className="font-serif" level={4}>
              Tentang Kami
            </Title>
            <List
              dataSource={[
                {
                  title: 'About US',
                },
                {
                  title: 'Karir',
                },
                {
                  title: 'Blog',
                },
                {
                  title: 'Kebijakan Privasi',
                },
                {
                  title: 'Syarat Dan Ketentuan',
                },
              ]}
              className="mx-auto justify-center text-center"
              renderItem={(item) => (
                <List.Item className="border-none p-0 py-2">
                  <Text
                    size={14}
                    fontFamily="regular"
                    className="tracking-spacer text-left font-sans font-semibold tracking-[0.2rem] text-[#000000]"
                  >
                    {item.title.toUpperCase()}
                  </Text>
                </List.Item>
              )}
            />
          </Col>
          <Col span={4} className="ml-12 justify-center text-center">
            <Title className="font-serif" level={4}>
              Mitra
            </Title>
            <List
              dataSource={[
                {
                  title: 'Supplier',
                },
              ]}
              className="mx-auto justify-center text-center"
              renderItem={(item) => (
                <List.Item className="border-none p-0 py-2">
                  <Text
                    size={14}
                    fontFamily="regular"
                    className="tracking-spacer font-sans font-semibold tracking-[0.2rem] text-[#000000]"
                  >
                    {item.title.toUpperCase()}
                  </Text>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    </footer>
  )
}

export default Footer
