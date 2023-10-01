import dynamic from 'next/dynamic'

const AuthContainer = dynamic(() => import('@vscommerce/layouts/containers/Auth'))
const PublicContainer = dynamic(() => import('@vscommerce/layouts/containers/Public'))

const routes = [
  {
    path: '/',
    layout: PublicContainer,
    exact: true,
  },
  {
    path: '/admin-login',
    layout: AuthContainer,
    exact: true,
  },
  {
    path: '/forgot-password',
    layout: AuthContainer,
    exact: true,
  },
  {
    path: '/verify-forgot-password',
    layout: AuthContainer,
    exact: true,
  },
  {
    path: '/reset-password',
    layout: AuthContainer,
    exact: true,
  },
]

export default routes
