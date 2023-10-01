import publicRoutes from '@vscommerce/layouts/routes/public'
import adminRoutes from '@vscommerce/layouts/routes/admin'

const globalRoutes = [...publicRoutes, ...adminRoutes]

export default globalRoutes
