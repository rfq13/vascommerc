import UboxInput from '@rootDir/src/components/UboxInput'
import UboxModal from '@rootDir/src/components/UboxModal'
import { RefUboxModal } from '@rootDir/src/components/UboxModal/UboxModal'
import { Form, notification } from 'antd'
import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useMutation } from 'react-query'
import CallAPI from '@rootDir/src/services/CallAPI'
import { CreateAdminFieldValues } from './Users'

export type RefModalFormUser = {
  toggle: (pl?: CreateAdminFieldValues) => void
}

type IProps = {
  onSuccess: () => void
}
const ModalFormUser = forwardRef(
  (props: IProps, ref: RefObject<RefModalFormUser>) => {
    const [form] = Form.useForm<CreateAdminFieldValues>()
    const refUboxModal = useRef<RefUboxModal>(null)

    const { onSuccess } = props
    const [currentUser, setCurrentUser] = useState<CreateAdminFieldValues>(null)
    const isEditMode = !!currentUser

    const submitUser = useMutation(
      (payload: any) => CallAPI.submitUser(payload),
      {
        onSuccess() {
          notification.success({ message: 'Data berhasil disimpan' })
          form.resetFields()
          refUboxModal.current?.toggle()
          onSuccess()
        },
      },
    )

    useImperativeHandle(ref, () => ({
      toggle(passedStaff) {
        console.log('passedStaff', passedStaff)
        refUboxModal.current?.toggle()

        if (!passedStaff && isEditMode) {
          form.resetFields()
          setCurrentUser(null)
        }

        if (passedStaff) {
          setCurrentUser((prev) => ({
            ...prev,
            ...passedStaff,
          }))

          form.setFieldsValue({
            id: passedStaff.id,
            fullName: passedStaff.fullName,
            email: passedStaff.email,
            phone: passedStaff.phone,
          })
        }
      },
    }))

    const rules = (field: string) => [
      {
        required: true,
        message: `Mohon isi ${field}`,
      },
    ]

    return (
      <UboxModal
        ref={refUboxModal}
        title={isEditMode ? 'Edit User' : 'Tambah User'}
        titleClassName="justify-center text-black"
        okText={isEditMode ? 'Edit' : 'Simpan'}
        okButtonProps={{ htmlType: 'submit' }}
        onOk={form.submit}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            fullName: '',
            email: '',
            phone: '',
          }}
          onFinish={(values) => {
            submitUser.mutate({
              id: currentUser?.id,
              ...values,
            })
          }}
          className="max-w-600"
        >
          <Form.Item
            label="Nama Lengkap"
            rules={rules('Nama Lengkap')}
            name="fullName"
          >
            <UboxInput placeholder="Masukkan nama pengguna" />
          </Form.Item>
          <Form.Item label="Email" rules={rules('email')} name="email">
            <UboxInput placeholder="Masukkan email pengguna" />
          </Form.Item>
          <Form.Item
            label="No Handphone"
            rules={rules('No Handphone')}
            name="phone"
          >
            <UboxInput placeholder="Masukkan no handphone pengguna" />
          </Form.Item>
        </Form>
      </UboxModal>
    )
  },
)

export default ModalFormUser
