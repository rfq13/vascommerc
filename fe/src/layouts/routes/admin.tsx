import dynamic from 'next/dynamic'

const AdminContainer = dynamic(
  () => import('@vscommerce/layouts/containers/Admin'),
)

const routes = [
  {
    path: '/dashboard',
    layout: AdminContainer,
  },
  {
    path: '/user',
    layout: AdminContainer,
  },
  {
    path: '/product',
    layout: AdminContainer,
  },
  {
    path: '/promotion',
    layout: AdminContainer,
  },
  {
    path: '/article',
    layout: AdminContainer,
  },
  {
    path: '/images',
    layout: AdminContainer,
  },
  {
    path: '/service',
    layout: AdminContainer,
  },
]

export default routes
