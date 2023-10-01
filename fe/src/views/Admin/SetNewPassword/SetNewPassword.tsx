import Router from 'next/router'
import antd, { Form } from 'antd'
import CallAPI from '@vscommerce/services/CallAPI'
import { omit } from 'lodash'
import { useMutation } from 'react-query'
import { useState, useEffect } from 'react'

type ForgotPasswordFieldValues = {
  email: string
  token: string
}

function SetNewPassword(props) {
  const [form] = Form.useForm<ForgotPasswordFieldValues>()
  const [email, setEmail] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const email = localStorage.getItem('tempEmail')
    const token = localStorage.getItem('tempToken')
    if (email) {
      setEmail(email)
      localStorage.removeItem('tempEmail')
    } else {
      Router.push('/forgot-password')
    }
    if (token) {
      setToken(token)
      localStorage.removeItem('tempToken')
    } else {
      Router.push('/forgot-password')
    }
  }, [])

  const requestSetNewPassword = useMutation(
    (fieldValues: any) => CallAPI.setNewPassword(fieldValues),
    {
      onSuccess(res) {
        Router.push('/')
      },
    },
  )

  return (
    <div className="mx-auto flex min-h-screen w-11/12 max-w-[1280px] bg-slate-50 p-6">
      <antd.Form
        form={form}
        initialValues={{ email: '' }}
        className="relative flex w-full max-w-[420px] flex-1 flex-col justify-center"
        onFinish={(fieldValues) => {
          fieldValues.email = email
          fieldValues.token = token
          requestSetNewPassword.mutate(fieldValues)
        }}
      >
        <img
          src="/static/images/icon.png"
          alt="Logo"
          className="absolute left-0 top-6"
          style={{ width: '30%' }}
        />

        <p className="m-0 text-3xl text-black">Atur Ulang Password</p>
        <p className="mb-0 mt-3">Silahkan Masukkan Password Baru</p>

        <p className="mb-0 mt-9 font-bold text-black">Password</p>
        <antd.Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input password!' }]}
          className="mb-0"
        >
          <antd.Input
            placeholder="Masukan Password Baru Anda"
            size="large"
            className="mt-3 h-12 rounded-lg px-4 pb-3 pt-[9px]"
          />
        </antd.Form.Item>

        <antd.Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: 'Please input confirm Password!' },
          ]}
          className="mb-0"
        >
          <antd.Input
            placeholder="konfirmasi Password Baru Anda"
            size="large"
            className="mt-3 h-12 rounded-lg px-4 pb-3 pt-[9px]"
          />
        </antd.Form.Item>

        <antd.Form.Item className="mt-10">
          <antd.Button
            type="primary"
            htmlType="submit"
            size="large"
            className="flex h-14 w-full items-center justify-center text-xl"
            loading={requestSetNewPassword.isLoading}
            disabled={requestSetNewPassword.isLoading}
          >
            Simpan
          </antd.Button>
        </antd.Form.Item>
      </antd.Form>

      <div className="relative ml-[120px] flex h-full min-h-[780px] w-full max-w-[640px] items-center justify-center rounded-xl bg-[#0093BD]">
        <img
          src="/static/icons/login-ellipse.svg"
          alt="login-ellipse"
          className="absolute left-6 top-6"
        />

        <div className="w-2/3">
          <img
            src="/static/images/login-illustration.svg"
            alt="login-illustration"
          />
        </div>

        <img
          src="/static/icons/login-ellipse.svg"
          alt="login-ellipse"
          className="absolute bottom-6 right-6 rotate-180"
        />
      </div>
    </div>
  )
}

export default SetNewPassword
