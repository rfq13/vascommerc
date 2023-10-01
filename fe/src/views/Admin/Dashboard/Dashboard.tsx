import { PieChartOutlined } from '@ant-design/icons'

import React from 'react'

import useReport from '@rootDir/src/data/useReport'
import useProducts from '@rootDir/src/data/useProduct'
import Header from './components/Header'
import DashboardTable from './components/Table'

function Dashboard() {
  const report = useReport()

  const newProducts = useProducts({
    query: {
      defaultValue: {
        page: 1,
        pageSize: 10,
        sorted: JSON.stringify([{ id: 'createdAt', desc: true }]),
      },
    },
  })

  const data = [
    {
      title: 'Jumlah User',
      value: report.data.total_user,
    },
    {
      title: 'Jumlah User Aktif',
      value: report.data.total_user_active,
    },
    {
      title: 'Jumlah Produk',
      value: report.data.total_product,
    },
    {
      title: 'Jumlah Produk Aktif',
      value: report.data.total_product_active,
    },
  ]

  return (
    <div>
      <Header
        icon={<PieChartOutlined style={{ fontSize: '18px' }} />}
        label="Dashboard"
        className="my-4 text-primary-700"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {data.map((v) => (
          <div className="relative rounded-[10px] rounded-[10px] bg-transparent bg-[url('/static/images/bg-card-dashboard.png')] bg-cover bg-center pt-10">
            <p className="text-center text-2xl font-semibold text-zinc-600">
              {v.title}
            </p>
            <p className="text-center text-5xl font-semibold">{v.value}</p>
          </div>
        ))}
      </div>

      {/* buat table yang bordernya tidak berwarna, dan hanya 1 baris headernya berwarna biru */}
      <div className="mt-10 w-1/2 overflow-x-auto rounded-[12px] bg-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-dark-slate-900 text-2xl font-semibold">
            Produk Terbaru
          </h1>
        </div>
        <div className="mt-4 ">
          <DashboardTable
            data={newProducts?.data}
            columns={[
              {
                title: 'Nama Produk',
                key: 'name',
                render: (v: any) => {
                  return (
                    <div className="flex items-center">
                      <p className="ml-4 font-medium font-semibold">{v.name}</p>
                    </div>
                  )
                },
              },
              {
                title: 'Tanggal Dibuat',
                key: 'createdAt',
                render: (v: any) => {
                  const date = new Date(v.createdAt)
                  const month = date.toLocaleString('id-ID', {
                    month: 'long',
                  })

                  const tgl = `${date.getDate()} ${month} ${date.getFullYear()}`

                  return (
                    <div className="flex items-center">
                      <p className="ml-4 font-semibold text-zinc-400">{tgl}</p>
                    </div>
                  )
                },
              },
              {
                title: 'Harga',
                key: 'price',
                render: (v: any) => {
                  return `Rp ${v.price.toLocaleString('id-ID')}`
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
