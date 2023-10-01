import React from 'react'
import { Button, Divider, Form, Input, Tooltip, Typography } from 'antd'
import { GoogleCircleFilled } from '@ant-design/icons'
import getGoogleAuthUrl from '@rootDir/src/utils/getGoogleUrl'
import { useMutation } from 'react-query'
import CallAPI from '@rootDir/src/services/CallAPI'
import { useRouter } from 'next/router'
import { AUTH_TOKEN_KEY } from '@rootDir/src/constant'

type FieldType = {
  username?: string
  password?: string
  remember?: string
}
function App() {
  const route = useRouter()
  const submitLogin = useMutation((data: any) => CallAPI.login(data), {
    onSuccess: (res) => {
      localStorage.setItem(AUTH_TOKEN_KEY, res.data.data.accessToken)
      route.push('/dashboard')
    },
  })

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  function LoginForm() {
    return (
      <Form
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={(values) => submitLogin.mutateAsync(values)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email / Nomor Telpon"
          name="email"
          rules={[
            { required: true, message: 'Email / Nomor Telpon wajib diisi!' },
          ]}
        >
          <Input
            size="large"
            className="rounded-md"
            placeholder="contoh: admin@gmail.com"
            disabled={submitLogin.isLoading}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password wajib diisi!' }]}
        >
          <Input.Password
            size="large"
            className="rounded-md"
            disabled={submitLogin.isLoading}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full rounded-md"
            size="large"
            loading={submitLogin.isLoading}
          >
            Submit
          </Button>
        </Form.Item>
        <Divider>Or</Divider>
        {/* buat beberapa tombol untuk login social media */}
        <div className="flex flex-row justify-center space-x-2">
          <Tooltip title="Login with Google">
            <Button
              type="primary"
              icon={<GoogleCircleFilled />}
              size="large"
              onClick={() => {
                const gUrl = getGoogleAuthUrl()
                window.open(gUrl, '_blank')
              }}
            />
          </Tooltip>
        </div>
      </Form>
    )
  }

  return (
    <div className="flex flex-row">
      <div className="relative flex max-h-screen w-1/2 flex-col overflow-hidden bg-[url('/static/images/bg-login.png')] bg-cover bg-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <Typography
            // className="absolute bottom-0 left-0 text-4xl font-bold text-white"
            // posisi dibagian tengah vertikal dan horizontal
            className="-translate-y-1/2 transform text-4xl font-bold text-black"
          >
            VSCommerce
          </Typography>
          <Typography.Text className="text-sm font-normal text-black">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Typography.Text>
        </div>
      </div>
      <div className="flex w-1/2 flex-col">
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="w-full max-w-lg">
            <Typography.Text className="text-xl font-semibold text-black">
              Selamat Datang Admin
            </Typography.Text>
            <br />
            <br />
            <Typography.Text className="text-m font-normal text-black">
              Silahkan masukkan email atau nomor telepon dan password Anda untuk
              mulai menggunakan aplikasi
            </Typography.Text>
            <Divider className="mb-0 border-transparent text-transparent">
              Login
            </Divider>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
