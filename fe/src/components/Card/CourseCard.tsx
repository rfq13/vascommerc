import { Card, Rate, Space, Tooltip } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import classNames from 'classnames'
import BadgeLevel from '@components/BadgeLevel/BadgeLevel'
import Paragraph from '@components/Typography/Paragraph'
import Text from '@components/Typography/Text'
import Link from 'next/link'
import router from 'next/router'
import React, { CSSProperties } from 'react'
import { CourseLevel } from '@rootDir/src/views/Customer/Home/constants'
import classes from './CourseCard.module.scss'

interface CourseCardProps {
  title: string
  desc?: string
  styles?: CSSProperties
  poster?: string
  href?: string
  coveredIcon?: boolean
  covered?: boolean
  footerElement?: JSX.Element
  customIcon?: JSX.Element
  categoryType?: string
  level?: Array<{
    CourseId: string
    level: CourseLevel
    id: string
    levelId: number
  }>

  hideCover?: boolean
  cmeCredit?: number
  creditNumber: number
  jpl: number
  type?: string
  rating?: number
  bordered?: boolean
  shadow?: boolean
  className?: string
}

const CourseCard: React.FC<CourseCardProps> = (props: CourseCardProps) => {
  const { md } = useBreakpoint()
  const {
    title,
    desc,
    poster,
    covered,
    styles,
    coveredIcon,
    footerElement,
    href,
    categoryType,
    level,
    customIcon,
    hideCover,
    cmeCredit,
    creditNumber = 0,
    jpl = 0,
    type,
    rating = 0,
    bordered = false,
    shadow = true,
    className,
  } = props

  return (
    <Card
      className={classNames(classes.courseCard, className)}
      onClick={() => router.push(href || '#!')}
      bordered={bordered}
      bodyStyle={{ padding: 0, height: '100%' }}
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: shadow ? '0px 8px 40px rgba(0, 0, 0, 0.1)' : 'none',
        ...styles,
      }}
      cover={
        <div
          style={{
            position: 'relative',
            borderRadius: md ? 10 : 7,
            overflow: 'hidden',
          }}
        >
          {!covered && (
            <div style={{ padding: coveredIcon ? '24px 0 0 24px' : 'inherit' }}>
              {customIcon}
            </div>
          )}
          {covered && (
            <div
              style={{
                padding: coveredIcon ? '24px 0 0 24px' : 'inherit',
                width: '100%',
              }}
            >
              {!coveredIcon && (
                <img
                  alt={title as string}
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  src={
                    hideCover || !poster
                      ? '/static/card-poster/default-card-poster.webp'
                      : poster
                  }
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src =
                      '/static/card-poster/default-card-poster.webp'
                  }}
                />
              )}

              {coveredIcon && (
                <Avatar
                  size={80}
                  src={
                    <img
                      alt="Avatar"
                      style={{ borderRadius: '50%', maxHeight: '80px' }}
                      src={poster || '/static/icons/default-ic.svg'}
                    />
                  }
                />
              )}
            </div>
          )}
          {level?.length > 0 && <BadgeLevel level={level} />}
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div className="course-content-wrapper">
          <Space
            size="small"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span className="course-category">{categoryType}</span>
          </Space>
          <div>
            <Link href={href || '#!'}>
              <span className="course-title">
                {title.length > 50 ? (
                  <Tooltip placement="top" title={title}>
                    {title}
                  </Tooltip>
                ) : (
                  title
                )}
              </span>
            </Link>

            <Paragraph className="course-description" ellipsis={{ rows: 2 }}>
              {desc}
            </Paragraph>
          </div>

          <div className="course-includes">
            {jpl > 0 && (
              <div className="include-wrapper">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fill="inherit"
                    d="M20 8.94a1.307 1.307 0 0 0-.06-.27v-.09a1.07 1.07 0 0 0-.19-.28l-6-6a1.071 1.071 0 0 0-.28-.19.32.32 0 0 0-.09 0 .88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1V5.41ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v9Zm-3.71-6.71L11 15.59l-1.29-1.3a1.004 1.004 0 1 0-1.42 1.42l2 2a1.002 1.002 0 0 0 1.42 0l4-4a1.004 1.004 0 1 0-1.42-1.42Z"
                  />
                </svg>
                <span>{`${jpl} JPL`}</span>
              </div>
            )}
            {creditNumber > 0 && (
              <div className="include-wrapper">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fill="inherit"
                    d="M20 8.94a1.307 1.307 0 0 0-.06-.27v-.09a1.07 1.07 0 0 0-.19-.28l-6-6a1.071 1.071 0 0 0-.28-.19.32.32 0 0 0-.09 0 .88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1V5.41ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v9Zm-3.71-6.71L11 15.59l-1.29-1.3a1.004 1.004 0 1 0-1.42 1.42l2 2a1.002 1.002 0 0 0 1.42 0l4-4a1.004 1.004 0 1 0-1.42-1.42Z"
                  />
                </svg>
                <span>{`${creditNumber} Angka Kredit`}</span>
              </div>
            )}
            {cmeCredit > 0 && (
              <div className="include-wrapper">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fill="inherit"
                    d="M20 8.94a1.307 1.307 0 0 0-.06-.27v-.09a1.07 1.07 0 0 0-.19-.28l-6-6a1.071 1.071 0 0 0-.28-.19.32.32 0 0 0-.09 0 .88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1V5.41ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v9Zm-3.71-6.71L11 15.59l-1.29-1.3a1.004 1.004 0 1 0-1.42 1.42l2 2a1.002 1.002 0 0 0 1.42 0l4-4a1.004 1.004 0 1 0-1.42-1.42Z"
                  />
                </svg>
                <span>{`${cmeCredit} SKP`}</span>
              </div>
            )}
          </div>
        </div>

        <Space direction="vertical" size="middle">
          <Space
            wrap
            align="center"
            style={{
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Space align="center">
              <Text fontFamily="medium" size="body1" color="honey-yellow">
                {rating}
              </Text>
              <Rate
                disabled
                allowHalf
                value={rating}
                className={classes.rating}
              />
            </Space>
            <span className="course-type">{type}</span>
          </Space>
          {footerElement}
        </Space>
      </div>
    </Card>
  )
}

export default CourseCard
