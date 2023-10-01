import { Button, Modal, Spin, notification, Typography, Form } from 'antd'
import React, {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import IconHapus from '@rootDir/public/static/icons/trash.svg'
import CallAPI from '@rootDir/src/services/CallAPI'
import { useMutation } from 'react-query'
import { RefUboxModal } from '../UboxModal/UboxModal'

const { Text } = Typography

export interface DeleteModalData {
  id: string
  title: string
  url: string
}

export type RefDeleteModalForm = {
  toggle: (pl?: DeleteModalData) => void
}

type IProps = {
  onSuccess: () => void
}
const DeleteModal = forwardRef(
  (props: IProps, ref: RefObject<RefDeleteModalForm>) => {
    // const [form] = Form.useForm<any>()
    const refUboxModal = useRef<RefUboxModal>(null)
    const { onSuccess } = props
    const [currentData, setCurrentData] = React.useState<DeleteModalData>(null)
    const isEditMode = !!currentData

    const [openModal, setOpenModal] = React.useState(false)

    function toggle() {
      setOpenModal(!openModal)
    }

    useImperativeHandle(ref, () => ({
      toggle(passedData) {
        toggle()
        refUboxModal.current?.toggle()

        if (!passedData && isEditMode) {
          // form.resetFields()
          setCurrentData(null)
        }

        if (passedData) {
          setCurrentData((prev) => ({
            ...prev,
            ...passedData,
          }))

          // form.setFieldsValue({
          //   id: passedStaff.id,
          //   fullName: passedStaff.fullName,
          //   email: passedStaff.email,
          //   phone: passedStaff.phone,
          // })
        }
      },
    }))

    const submitDelete = useMutation(
      () => CallAPI.admin.delete(`${currentData.url}`),
      {
        onSuccess() {
          notification.success({ message: 'Data berhasil dihapus' })
          // form.resetFields()
          refUboxModal.current?.toggle()
          onSuccess()
          toggle()
        },
      },
    )

    return (
      <Form>
        <Modal
          open={openModal}
          bodyStyle={{ padding: 0 }}
          centered
          width={700}
          onCancel={() => {
            toggle()
          }}
          footer={[
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button
                key="cancel"
                type="primary"
                size="large"
                block
                onClick={() => {
                  submitDelete.mutateAsync()
                }}
                disabled={submitDelete.isLoading}
                style={{
                  width: 'auto',
                }}
              >
                Kirim
              </Button>
            </div>,
          ]}
        >
          <div className="rounded-[20px 20px 0 0] relative h-[125px] bg-[url('/static/images/ellipse.svg')] bg-cover bg-center bg-no-repeat">
            {submitDelete.isLoading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  zIndex: 100000,
                }}
              >
                <Spin
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            )}
            <div
              style={{
                position: 'relative',
                width: '168px',
                minWidth: '168px',
                height: '168px',
                minHeight: '168px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                left: '50%',
                top: '56px',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '149px',
                  minWidth: '149px',
                  height: '149px',
                  minHeight: '149px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  top: '7px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="relative left-1/2 top-[8px] z-10 h-[131px] min-h-[131px] w-[131px] min-w-[131px] -translate-x-1/2 rounded-[50%] bg-[#D83A56] shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
                  <IconHapus className="relative left-1/2 top-[23px] z-10 h-auto w-[74px] translate-x-[-50%] transform text-white" />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '120px',
              marginBottom: '50px',
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <div
              style={{
                textAlign: 'center',
                width: '100%',
              }}
            >
              <Text className="text-[20px] font-bold md:text-[30px]">
                Modal Hapus
              </Text>
              <div>
                <Text className="text-[18px] font-medium text-zinc-500 md:text-[24px]">
                  Apakah anda yakin ingin menghapus{' '}
                  <Text className="text-[18px] font-bold md:text-[24px]">
                    {currentData?.title}
                  </Text>
                  ?
                </Text>
              </div>
            </div>
          </div>
        </Modal>
      </Form>
    )
  },
)

export default DeleteModal
