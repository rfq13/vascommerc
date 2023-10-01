import React, { useState } from 'react'
import { Button, Drawer, Input, List, SelectProps, Tooltip } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import Text, { mapColor } from '@components/Typography/Text'
import {
  CloseOutlined,
  SearchOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import UboxSelect from '@rootDir/src/components/UboxSelect'
import classes from './SearchBar.module.scss'

const searchResult = (data: any[]) => {
  return data?.map((prd: any) => {
    return {
      value: prd?.name,
      label: (
        <Button
          type="link"
          style={{ display: 'inline-flex', overflow: 'hidden' }}
        >
          <SearchOutlined />
          <Text
            size={14}
            fontFamily="regular"
            style={{ fontWeight: 600, marginLeft: '18px' }}
            color="primary"
            ellipsis
          >
            {prd?.name.length > 50 ? (
              <Tooltip placement="top" title={prd?.name}>
                {prd?.name}
              </Tooltip>
            ) : (
              prd?.name
            )}
          </Text>
        </Button>
      ),
    }
  })
}

function SearchBar() {
  const { md } = useBreakpoint()
  const [openSearchMobile, setOpenSearchMobile] = useState(false)
  const [options, setOptions] = useState<SelectProps<object>['options']>([])
  const [loading, setLoading] = useState<boolean>(false)

  let timer = null
  function toggleSearch() {
    setOpenSearchMobile((prev) => !prev)
  }
  const handleSearch = async (value: string) => {
    clearTimeout(timer)

    timer = setTimeout(async () => {
      setLoading(true)

      try {
        setOptions(searchResult([]))

        setLoading(false)
      } catch (error) {
        console.log(error?.response?.data?.message)
      }
    }, 1000)
  }

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      console.log('Enter', event.target.value)
    }
  }

  const filterOption = (
    input: string,
    option: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <>
      {!md && (
        <>
          <Button
            type="text"
            size="small"
            shape="circle"
            onClick={() => toggleSearch()}
          >
            <SearchOutlined style={{ fontSize: 18, color: mapColor.primary }} />
          </Button>
          <Drawer
            open={openSearchMobile}
            placement="top"
            height="100vh"
            onClose={() => toggleSearch()}
            closable={false}
            bodyStyle={{ padding: 0 }}
            autoFocus
          >
            <div className={classes.searchBoxContainer}>
              <Input
                autoFocus
                prefix={<SearchOutlined style={{ marginRight: '12px' }} />}
                suffix={loading ? <LoadingOutlined /> : null}
                placeholder="Cari parfum..."
                type="text"
                className={classes.searchBarInputMobile}
                onChange={(event) => handleSearch(event.target.value)}
                onKeyUp={handleKeyUp}
              />
              <Button type="text">
                <CloseOutlined onClick={() => toggleSearch()} />
              </Button>
            </div>
            {options.length > 0 && (
              <List
                dataSource={options}
                split={false}
                renderItem={(item) => {
                  return (
                    <List.Item style={{ overflow: 'hidden' }}>
                      {item.label}
                    </List.Item>
                  )
                }}
              />
            )}
          </Drawer>
        </>
      )}
      {md && (
        <>
          <UboxSelect
            optionFilterProp="children"
            bordered={false}
            placeholder="Cari parfum..."
            isHeaderSearch
            showSearch
            filterOption={filterOption}
            suffixIcon={
              loading ? (
                <LoadingOutlined className="text-xl" />
              ) : (
                <SearchOutlined className="text-xl" />
              )
            }
            className={`${classes.HeaderSearch} w-full`}
            options={[
              { value: 'Semua Kategori', label: 'Semua Kategori' },
              { value: 'Kategori 1', label: 'Kategori 1' },
              { value: 'Kategori 2', label: 'Kategori 2' },
              { value: 'Kategori 3', label: 'Kategori 3' },
            ]}
            dropdownMatchSelectWidth={252}
            dropdownStyle={{
              borderRadius: '6px',
              border: '1px solid var(--primary-tight)',
            }}
          />
        </>
      )}
    </>
  )
}

export default SearchBar
