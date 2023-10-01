import UboxInput from '@rootDir/src/components/UboxInput'
import UboxModal from '@rootDir/src/components/UboxModal'
import { RefUboxModal } from '@rootDir/src/components/UboxModal/UboxModal'
import { Form, Radio, notification } from 'antd'
import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import IconSave from '@rootDir/public/static/icons/save.svg'
import IconEdit from '@rootDir/public/static/icons/edit.svg'
import { useMutation } from 'react-query'
import CallAPI from '@rootDir/src/services/CallAPI'
import UboxUpload from '@rootDir/src/components/UboxUpload'
import { RefUpload } from '@rootDir/src/components/UboxUpload/UboxUpload'
import { ProductValues } from './Products'

export type RefModalFormProduct = {
  toggle: (pl?: ProductValues) => void
}

type IProps = {
  onSuccess: () => void
}
const ModalFormUser = forwardRef(
  (props: IProps, ref: RefObject<RefModalFormProduct>) => {
    const [form] = Form.useForm<ProductValues>()
    const uploadedFiles = Form.useWatch('upload', form)
    const checkStatus = Form.useWatch('status', form)
    const refUboxModal = useRef<RefUboxModal>(null)
    const { onSuccess } = props
    const [currentProduct, setCurrentProduct] = useState<ProductValues>(null)
    const isEditMode = !!currentProduct

    const refUpload = useRef<RefUpload>(null)

    const submitProduct = useMutation(
      (payload: any) => CallAPI.submitProduct(payload),
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
      toggle(passedProduct) {
        refUboxModal.current?.toggle()

        if (!passedProduct && isEditMode) {
          form.resetFields()
          setCurrentProduct(null)
        }

        if (passedProduct) {
          const img = passedProduct.image?.startsWith('http')
            ? passedProduct.image
            : `/dashboard-api/${passedProduct.image}`

          setCurrentProduct((prev) => ({
            ...prev,
            ...passedProduct,
            image: img,
          }))
          form.setFieldsValue({
            id: passedProduct?.id,
            name: passedProduct.name,
            image: img,
            price: passedProduct.price,
            status: passedProduct.status,
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
        title={isEditMode ? 'Edit Produk' : 'Tambah Produk'}
        titleClassName="justify-center text-black"
        okIcon={
          isEditMode ? (
            <IconEdit width="13" height="13" />
          ) : (
            <IconSave width="12" height="12" />
          )
        }
        okText={isEditMode ? 'Edit' : 'Simpan'}
        okButtonProps={{ htmlType: 'submit' }}
        onOk={form.submit}
        onCancel={() => {
          refUpload.current?.setFileList([])
          refUboxModal.current?.toggle()
          setCurrentProduct(null)
          form.resetFields()
        }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            name: '',
            image: '',
            price: '',
            status: false,
          }}
          onFinish={(values) => {
            const formValues = new FormData()
            Object.keys(values).forEach((key) => {
              if (key !== 'image' && values[key] !== '' && values[key] !== null)
                formValues.append(key, values[key])
            })
            if (uploadedFiles.length > 0)
              formValues.append('image', uploadedFiles[0])

            if (currentProduct?.id) formValues.append('id', currentProduct.id)

            submitProduct.mutateAsync(formValues)
          }}
          className="max-w-600"
        >
          <Form.Item
            label="Nama Produk"
            rules={rules('Nama Produk')}
            name="name"
          >
            <UboxInput placeholder="Masukkan nama produk" />
          </Form.Item>
          <Form.Item label="Harga" rules={rules('harga')} name="price">
            <UboxInput placeholder="Masukkan harga produk" />
          </Form.Item>
          <Form.Item label="Status" rules={rules('status')} name="status">
            <Radio.Button
              value="true"
              checked={checkStatus}
              onChange={() => form.setFieldValue('status', true)}
            >
              Aktif
            </Radio.Button>
            <Radio.Button
              value="false"
              checked={!checkStatus}
              onChange={() => form.setFieldValue('status', false)}
            >
              Tidak Aktif
            </Radio.Button>
          </Form.Item>

          <Form.Item
            name="upload"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e
              return e?.fileList
            }}
            rules={[
              { required: !isEditMode, message: 'Gambar Banner wajib diisi!' },
            ]}
            className="m-0"
          >
            <UboxUpload
              accept="image/*"
              multiple={false}
              previewFiles={[currentProduct?.image]}
              ref={refUpload}
              onChange={() => {}}
            />
          </Form.Item>
        </Form>
      </UboxModal>
    )
  },
)

export default ModalFormUser
