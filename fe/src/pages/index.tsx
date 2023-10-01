import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query
  if (token) {
    context.res.setHeader(
      'Set-Cookie',
      `token=${token}; path=/; HttpOnly; SameSite=Strict`,
    )
  }
  return {
    props: {
      token: token ?? null,
    },
  }
}

export { default } from '@vscommerce/views/Customer/Home'
