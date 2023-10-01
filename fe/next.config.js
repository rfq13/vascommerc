const withAntdLess = require('next-plugin-antd-less')
const withSVG = require('./webpack-extends/svgr')

const lessConfig = withAntdLess({
  lessVarsFilePath: './src/styles/variables.less',
  javascriptEnabled: true,
  webpack(config) {
    return config
  },
})

const svgConfig = withSVG(lessConfig)

module.exports = {
  ...svgConfig,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/dashboard-api/:path*{/}?',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ]
  },
}
