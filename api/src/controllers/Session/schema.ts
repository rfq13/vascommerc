import * as yup from 'yup'

export default {
  create: yup
    .object({
      UserId: yup.string().required('user id is required'),
      token: yup.string().required('token is required'),
      ipAddress: yup.string().required('ip address is required'),
      device: yup.string().required('device is required'),
      platform: yup.string().required('platform is required'),
      otp: yup.string().nullable().optional(),
    })
    .required(),

  update: yup
    .object({
      UserId: yup.string().nullable().optional(),
      token: yup.string().nullable().optional(),
      ipAddress: yup.string().nullable().optional(),
      device: yup.string().nullable().optional(),
      platform: yup.string().nullable().optional(),
      otp: yup.string().nullable().optional(),
    })
    .notRequired(),
}
