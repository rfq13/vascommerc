import * as yup from 'yup'

const create = yup.object({
  permissions: yup
    .array()
    .of(yup.string().required('Permissions is required'))
    .required('Permissions is required'),
})

const bulkCreate = yup.array().of(
  yup.object({
    name: yup.string().required('Name is required'),
    method: yup.string().required('Method is required'),
    path: yup.string().required('Path is required'),
  })
)

const permissionSchema = { create, bulkCreate }

export default permissionSchema
