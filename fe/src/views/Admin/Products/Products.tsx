import React, { useRef } from 'react'
import { Button, Row, Col, Image, TableProps, Typography } from 'antd'

import UsersAlt from '@rootDir/public/static/icons/users-alt.svg'
import InputSearch from '@rootDir/src/components/InputSearch'
import UboxTable from '@rootDir/src/components/UboxTable'
import useProduct from '@vscommerce/data/useProduct'
import IconEye from '@rootDir/public/static/icons/eye.svg'
import IconEdit from '@rootDir/public/static/icons/edit.svg'
import IconHapus from '@rootDir/public/static/icons/trash.svg'
import IconAddUser from '@rootDir/public/static/icons/plus.svg'
import { FALLBACK_IMAGE } from '@rootDir/src/constant'
import DeleteModal, {
  RefDeleteModalForm,
} from '@rootDir/src/components/DeleteModal/DeleteModal'
import ModalFormProduct, { RefModalFormProduct } from './ModalFormProduct'

export type ProductValues = {
  id?: string
  name: string
  image: string
  price: string
  status?: boolean
}

function Products() {
  const refModalFormProduct = useRef<RefModalFormProduct>(null)
  const refDeleteModal = useRef<RefDeleteModalForm>(null)
  const [sortir, setSortir] = React.useState<any>({})

  const qProducts = useProduct({
    filtered: {
      defaultValue: {},
    },
  })

  React.useEffect(() => {
    const sorted = Object.keys(sortir).map((key) => {
      return {
        id: key,
        desc: sortir[key],
      }
    })

    qProducts.helper.setQuery('sorted', JSON.stringify(sorted))
  }, [sortir])

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      render: (text, record, idx) =>
        (qProducts.pagination.page - 1) * qProducts.pagination.pageSize +
        idx +
        1,
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 2,
      },
    },
    {
      title: 'Gambar',
      dataIndex: 'image',
      render: (text) => {
        if (text.startsWith('http')) {
          return (
            <Image
              src={text}
              alt=""
              fallback={FALLBACK_IMAGE}
              preview={false}
              width="100"
              height="100"
            />
          )
        }

        return (
          <div className="flex w-full items-center justify-center">
            <Image
              src={`/dashboard-api/${text}`}
              alt=""
              fallback={FALLBACK_IMAGE}
              preview={false}
              className="mx-auto w-full max-w-[100px] justify-center object-cover text-center"
            />
          </div>
        )
      },
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      sorter: {
        compare: (a, b) => a.price - b.price,
        multiple: 1,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => {
        return text ? (
          <div className="flex items-center">
            <div className="w-20 rounded-full bg-[#479F77] text-center font-semibold text-white">
              Aktif
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-20 rounded-full bg-red-500 text-center font-semibold text-white">
              Tidak Aktif
            </div>
          </div>
        )
      },
      sorter: {
        compare: (a, b) => a.isActive - b.isActive,
        multiple: 1,
      },
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      render: (text, product) => (
        <div className="flex items-center">
          <Button
            onClick={() => {
              refModalFormProduct.current?.toggle(product)
            }}
            className="border-none bg-transparent"
          >
            <div className="flex items-center">
              <div className="rounded-full bg-[#479F77] text-center font-semibold text-white">
                <IconEye className="mx-1.5 my-1.5 fill-current stroke-transparent" />
              </div>
            </div>
          </Button>
          <Button
            onClick={() => {
              refModalFormProduct.current?.toggle(product)
            }}
            className="border-none bg-transparent"
          >
            <div className="flex items-center">
              <div className="rounded-full bg-[#EC9024] text-center font-semibold text-white">
                <IconEdit className="mx-1.5 my-1.5 fill-transparent stroke-current" />
              </div>
            </div>
          </Button>
          <Button
            onClick={() => {
              refDeleteModal.current?.toggle({
                id: product.id,
                title: product.name,
                url: `/product/soft-delete/${product.id}`,
              })
            }}
            className="border-none bg-transparent"
          >
            <div className="flex items-center">
              <div className="rounded-full bg-[#D83A56] text-center font-semibold text-white">
                <IconHapus className="mx-1.5 my-1.5 fill-current stroke-transparent" />
              </div>
            </div>
          </Button>
        </div>
      ),
    },
  ]

  const onChange: TableProps<any>['onChange'] = (pagination, filters, srt) => {
    const sorter = { ...srt } as any
    if (sorter.field && sorter.field !== 'no') {
      setSortir({
        [sorter.field]: sorter.order === 'descend',
      })
    } else {
      setSortir({})
    }
  }

  return (
    <>
      <div className="flex items-center text-primary">
        <UsersAlt width="35" height="27" />
        <p className="m-0 ml-3 text-3xl font-semibold">Produk</p>
      </div>
      <Row className="mt-5">
        <Col>
          <InputSearch
            className="-"
            onChange={(value) => {
              qProducts.helper.setFiltered('name', value)
            }}
          />
        </Col>
        <Col className="ml-auto">
          <Button
            type="primary"
            size="large"
            className="flex h-12 items-center rounded-lg px-4 pb-3 pt-[10px]"
            onClick={() => refModalFormProduct.current?.toggle()}
          >
            <IconAddUser />
            <Typography.Text className="ml-2 text-white">
              Tambah Produk
            </Typography.Text>
          </Button>
        </Col>
      </Row>

      <UboxTable
        columns={columns}
        dataSource={qProducts.data}
        rowKey="id"
        className="mt-5"
        loading={qProducts.isFetching}
        onChange={onChange}
        pagination={{
          total: qProducts.total,
          onChange: qProducts.handlePaginationChange,
        }}
        scroll={{ x: 'max-content' }}
      />
      <ModalFormProduct
        ref={refModalFormProduct}
        onSuccess={() => qProducts.refetch()}
      />
      <DeleteModal ref={refDeleteModal} onSuccess={() => qProducts.refetch()} />
    </>
  )
}

export default Products
