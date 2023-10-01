'use client'

import { Badge, Popover, Space } from 'antd'
import { mapColor } from '@components/Typography/Text'

import cx from '@rootDir/src/shortcuts/cx'
import { CourseLevel } from '@rootDir/src/views/Customer/Home/constants'
import classes from './BadgeLevel.module.scss'

export interface BadgeLevelProps {
  level: Array<{
    CourseId: string
    level: CourseLevel
    id: string
    levelId: number
  }>
}

export const levelColor = {
  Pemula: mapColor['popsicle-blue'],
  Menengah: mapColor['primary-minor'],
  Lanjut: mapColor.primary,
  'Level 1': mapColor.apple,
  'Level 2': mapColor['honey-yellow'],
  'Level 3': mapColor['grape-purple'],
  'Level 4': mapColor.honey,
  'Level 5': mapColor['mint-green'],
}

function BadgeLevel({ level }: BadgeLevelProps) {
  const splitStringlevel = level.map((courseLevel) => courseLevel.level)
  return (
    <div className={cx(classes.badgeWrapper, 'course-level-wrapper')}>
      <div
        className={cx(classes.badgeLevel, 'course-level')}
        style={{
          background: levelColor[`${splitStringlevel[0]}`],
        }}
      >
        {splitStringlevel[0]}
      </div>
      {splitStringlevel.length > 1 && (
        <Popover
          title="Level"
          content={
            <Space direction="vertical" size="small">
              {splitStringlevel.map((level) => (
                <Badge
                  key={level}
                  color={levelColor[`${level}`]}
                  text={<span style={{ fontSize: 14 }}>{level}</span>}
                />
              ))}
            </Space>
          }
        >
          <div
            className={cx(
              classes.badgeLevel,
              'course-level',
              classes.badgeLevelExtra,
            )}
          >
            {`${splitStringlevel.length - 1}+`}
          </div>
        </Popover>
      )}
    </div>
  )
}

export default BadgeLevel
