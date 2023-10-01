import { Popover, Tag } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import { mapColor } from '@components/Typography/Text'
import React from 'react'

function CourseCategory({ categories }: { categories: any[] }) {
  const { md } = useBreakpoint()
  return (
    <>
      {categories.length > 0 && (
        <>
          <Tag
            style={{
              padding: '2px 9px',
              borderRadius: '5px',
              background: 'white',
              color: '#16B3AC',
              border: '1px solid #16B3AC',
              fontSize: md ? 16 : 12,
              lineHeight: md ? '24px' : '19px',
            }}
          >
            {categories[0].name}
          </Tag>
          {categories.length > 1 && (
            <Popover
              placement="top"
              title="Daftar Kategori"
              content={
                <div>
                  {categories.map((category) => (
                    <div key={category.id}>{category.name}</div>
                  ))}
                </div>
              }
              trigger="hover"
            >
              <Tag
                style={{
                  padding: ' 2px 9px',
                  borderRadius: '5px',
                  background: mapColor['primary-light'],
                  color: '#16B3AC',
                  border: '1px solid #16B3AC',
                  fontSize: md ? 16 : 12,
                  lineHeight: md ? '24px' : '19px',
                }}
              >
                {`${categories.length - 1} +`}
              </Tag>
            </Popover>
          )}
        </>
      )}
    </>
  )
}

export default CourseCategory
