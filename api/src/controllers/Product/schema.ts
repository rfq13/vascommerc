import * as yup from 'yup'

const create = yup
  .object({
    name: yup.string().required('name is required'),
    image: yup.string().required('image is required'),
    price: yup.number().required('price is required'),
    status: yup.boolean().required('status is required'),
    description: yup.string(),
  })
  .required()

const update = yup.object({
  ...create.fields,
  image: yup.string(),
})

const roleSchema = { create, update }

export default roleSchema
