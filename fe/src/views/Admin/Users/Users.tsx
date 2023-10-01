import React, { useRef } from 'react'
import { Button, Row, Col, TableProps, Typography } from 'antd'

import UsersAlt from '@rootDir/public/static/icons/users-alt.svg'
import InputSearch from '@rootDir/src/components/InputSearch'
import UboxTable from '@rootDir/src/components/UboxTable'
import useUsers from '@vscommerce/data/useUsers'
import IconEye from '@rootDir/public/static/icons/eye.svg'
import IconEdit from '@rootDir/public/static/icons/edit.svg'
import IconHapus from '@rootDir/public/static/icons/trash.svg'
import IconAddUser from '@rootDir/public/static/icons/plus.svg'
import DeleteModal, {
  RefDeleteModalForm,
} from '@rootDir/src/components/DeleteModal/DeleteModal'
import ModalFormUser, { RefModalFormUser } from './ModalFormUser'

export type CreateAdminFieldValues = {
  id?: string
  fullName: string
  email: string
  phone: string
}

function Users() {
  const refModalFormUser = useRef<RefModalFormUser>(null)
  const refDeleteModal = useRef<RefDeleteModalForm>(null)
  const [sortir, setSortir] = React.useState<any>({})

  const qUsers = useUsers({
    filtered: {
      defaultValue: {
        'Role.name': 'User',
      },
    },
  })

  React.useEffect(() => {
    const sorted = Object.keys(sortir).map((key) => {
      return {
        id: key,
        desc: sortir[key],
      }
    })

    qUsers.helper.setQuery('sorted', JSON.stringify(sorted))
  }, [sortir])

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      render: (text, record, idx) =>
        (qUsers.pagination.page - 1) * qUsers.pagination.pageSize + idx + 1,
    },
    {
      title: 'Nama Lengkap',
      dataIndex: 'fullName',
      sorter: {
        compare: (a, b) => a.fullName - b.fullName,
        multiple: 3,
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: {
        compare: (a, b) => a.email - b.email,
        multiple: 2,
      },
    },
    {
      title: 'No Telepon',
      dataIndex: 'phone',
      render: (text) => text || '-',
      sorter: {
        compare: (a, b) => a.phone - b.phone,
        multiple: 1,
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
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
      render: (text, user) => (
        <div className="flex items-center">
          <Button
            onClick={() => {
              refModalFormUser.current?.toggle(user)
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
              refModalFormUser.current?.toggle(user)
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
                id: user.id,
                title: user.fullName,
                url: `/user/soft-delete/${user.id}`,
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
    if (sorter.field) {
      setSortir({
        [sorter.field]: sorter.order === 'descend',
      })
    }
  }

  return (
    <>
      <div className="flex items-center text-primary">
        <UsersAlt width="35" height="27" />
        <p className="m-0 ml-3 text-3xl font-semibold">User</p>
      </div>
      <Row className="mt-5">
        <Col>
          <InputSearch
            className="-"
            onChange={(value) => qUsers.helper.setFiltered('fullName', value)}
          />
        </Col>
        <Col className="ml-auto">
          <Button
            type="primary"
            size="large"
            className="flex h-12 items-center rounded-lg px-4 pb-3 pt-[10px]"
            onClick={() => refModalFormUser.current?.toggle()}
          >
            <IconAddUser />
            <Typography.Text className="ml-2 text-white">
              Tambah User
            </Typography.Text>
          </Button>
        </Col>
      </Row>

      <UboxTable
        columns={columns}
        dataSource={qUsers.data}
        rowKey="id"
        className="mt-5"
        loading={qUsers.isFetching}
        onChange={onChange}
        pagination={{
          total: qUsers.total,
          onChange: qUsers.handlePaginationChange,
        }}
        scroll={{ x: 'max-content' }}
      />
      <ModalFormUser
        ref={refModalFormUser}
        onSuccess={() => qUsers.refetch()}
      />
      <DeleteModal ref={refDeleteModal} onSuccess={() => qUsers.refetch()} />
    </>
  )
}

export default Users
