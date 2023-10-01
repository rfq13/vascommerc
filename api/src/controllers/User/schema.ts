import * as yup from 'yup'

const createPassword = yup
  .object({
    password: yup.string().min(8, 'Password minimal 8 karakter'),
  })
  .required()

// make phoneNumber validation like Joi validation on above
const phoneNumberValidation = yup
  .string()
  .matches(/^62[0-9]*$/, 'Nomor handphone harus diawali dengan 62')
  .min(11, 'Nomor handphone minimal 11 angka')
  .max(16, 'Nomor handphone maksimal 16 angka')

const create = yup.object({
  ...createPassword.fields,
  fullName: yup.string().required('Nama Lengkap wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  phone: phoneNumberValidation.required('Nomor handphone wajib diisi'), // yup.string().required('phone number wajib diisi'), //yup.string().nullable(),
  RoleId: yup.string().nullable(),
  tokenVerify: yup.string().nullable(),
})
const update = yup.object({
  password: yup.string().optional(),
  old_password: yup
    .string()
    .when('password', {
      is: (val: any) => {
        return val && val.length >= 8
      },
      then: yup.string().required('Password lama wajib diisi'),
    })
    .nullable(),
  fullName: yup.string().optional(),
  email: yup.string().optional(),
  phone: phoneNumberValidation.nullable(),
  RoleId: yup.string().nullable(),
  tokenVerify: yup.string().nullable(),
})

const register = yup
  .object({
    ...createPassword.fields,
    ...create.fields,
  })
  .required()

const login = yup
  .object({
    email: yup.string().email('Email tidak valid'),
    phone: phoneNumberValidation,
    password: yup.string().required('Password wajib diisi'),
  })
  .required()

const setPassword = yup
  .object({
    password: yup.string().min(8, 'Password minimal 8 karakter').required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Password tidak sama')
      .required('Konfirmasi password wajib diisi'),
  })
  .required()

const forgotPassword = yup
  .object({
    email: yup.string().email('Email tidak valid').optional(),
    phone: phoneNumberValidation.optional(),
  })
  .required()

const verifyTokenForgotPassword = yup
  .object({
    token: yup.string().required('Kode Verifikasi wajib diisi'),
    email: yup.string().email('Email tidak valid'),
    phone: phoneNumberValidation,
  })
  .required()

const resetPassword = yup
  .object({
    token: yup.string().required('Kode Verifikasi wajib diisi'),
    email: yup.string().email('Email tidak valid'),
    phone: phoneNumberValidation,
    password: yup.string().min(8, 'Password minimal 8 karakter').required(),
  })
  .required()

const forgotPin = yup
  .object({
    password: yup.string().min(8, 'Password minimal 8 karakter').required(),
  })
  .required()

const token = yup
  .object({
    token: yup.string().required('Kode Verifikasi wajib diisi'),
  })
  .required()

const refreshToken = yup.object({
  refreshToken: yup.string().required('Kode Refresh API wajib diisi'),
  oldToken: yup.string().required('Kode API lama wajib diisi'),
})

const sendotp = yup.object({
  email: yup.string().email('Email tidak valid').nullable(),
  fullName: yup.string().optional(),
  phone: phoneNumberValidation.optional().nullable(),
  randCode: yup.number().optional(),
})

const verifyotp = yup.object({
  token: yup.string().required('Kode Verifikasi wajib diisi'),
  otp: yup.string().required('Kode OTP wajib diisi'),
})

const socialLogin = yup.object({
  id: yup.string().required('id is required'),
  displayName: yup.string().required('display name is required'),
  _json: yup.object({
    email: yup.string().email('invalid email').required('email is required'),
    email_verified: yup.boolean().required('email verified is required'),
    picture: yup.string().required('picture is required'),
    locale: yup.string().required('locale is required'),
  }),
})

const userSchema = {
  createPassword,
  create,
  register,
  login,
  forgotPassword,
  verifyTokenForgotPassword,
  resetPassword,
  token,
  refreshToken,
  update,
  sendotp,
  verifyotp,
  setPassword,
  forgotPin,
  socialLogin,
}

export default userSchema
