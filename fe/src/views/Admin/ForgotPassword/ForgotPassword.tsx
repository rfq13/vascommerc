import Router from 'next/router'
import antd, { Form } from 'antd'
import CallAPI from '@vscommerce/services/CallAPI'
import { omit } from 'lodash'
import { useMutation } from 'react-query'
import { useState, useEffect } from 'react'

type ForgotPasswordFieldValues = {
  email: string
}

function ForgotPassword() {
  const [form] = Form.useForm<ForgotPasswordFieldValues>()
  const [emailSended, setEmailSended] = useState(false)
  const requestForgotPassword = useMutation(
    (fieldValues: any) => CallAPI.forgotPassword(fieldValues),
    {
      onSuccess(res) {
        localStorage.setItem('tempEmail', form.getFieldValue('email'))
        Router.push('/verify-forgot-password')
      },
    },
  )

  return (
    <div className="mx-auto flex min-h-screen w-11/12 max-w-[1280px] bg-slate-50 p-6">
      <antd.Form
        form={form}
        initialValues={{ email: '' }}
        className="relative flex w-full max-w-[420px] flex-1 flex-col justify-center"
        onFinish={(fieldValues) => requestForgotPassword.mutate(fieldValues)}
      >
        <img
          src="/static/images/icon.png"
          alt="Logo"
          className="absolute left-0 top-6"
          style={{ width: '30%' }}
        />

        <p className="m-0 text-3xl text-black">Lupa Password</p>
        <p className="mb-0 mt-3">Silahkan Masukkan Email terdaftar Anda</p>

        <p className="mb-0 mt-9 font-bold text-black">Email</p>
        <antd.Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
          className="mb-0"
        >
          <antd.Input
            placeholder="Masukan Email Anda"
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
            loading={requestForgotPassword.isLoading}
            disabled={requestForgotPassword.isLoading}
          >
            Lupa Password
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

export default ForgotPassword
