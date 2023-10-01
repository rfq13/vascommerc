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

function VerifyForgotPassword(props) {
  const [form] = Form.useForm<ForgotPasswordFieldValues>()
  const [email, setEmail] = useState(null)

  useEffect(() => {
    const email = localStorage.getItem('tempEmail')
    if (email) {
      setEmail(email)
    } else {
      Router.push('/forgot-password')
    }
  }, [])

  const requestVerifyForgotPassword = useMutation(
    (fieldValues: any) => CallAPI.verifyForgotPassword(fieldValues),
    {
      onSuccess(res) {
        localStorage.setItem('tempToken', form.getFieldValue('token'))
        Router.push('/reset-password')
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
          requestVerifyForgotPassword.mutate(fieldValues)
        }}
      >
        <img
          src="/static/images/icon.png"
          alt="Logo"
          className="absolute left-0 top-6"
          style={{ width: '30%' }}
        />

        <p className="m-0 text-3xl text-black">Lupa Password</p>
        <p className="mb-0 mt-3">Silahkan Periksa Email Anda</p>

        <p className="mb-0 mt-9 font-bold text-black">Kode Verifikasi</p>
        <antd.Form.Item
          name="token"
          rules={[
            { required: true, message: 'Please input your verification code!' },
          ]}
          className="mb-0"
        >
          <antd.Input
            placeholder="Masukan Kode Verifikasi Anda"
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
            loading={requestVerifyForgotPassword.isLoading}
            disabled={requestVerifyForgotPassword.isLoading}
          >
            Verifikasi
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

export default VerifyForgotPassword
