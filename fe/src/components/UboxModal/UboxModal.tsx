import { Button, Divider, Modal, ModalProps } from 'antd'
import classNames from 'classnames'
import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useState,
} from 'react'
import styles from './UboxModal.module.scss'

export type RefUboxModal = {
  toggle: () => void
}

type IProps = ModalProps & {
  icon?: React.ReactNode
  okIcon?: React.ReactNode
  titleClassName?: string
}

const UboxModal = forwardRef((props: IProps, ref: RefObject<RefUboxModal>) => {
  const {
    children,
    title,
    icon,
    okText,
    okIcon,
    okButtonProps,
    cancelText,
    className,
    titleClassName,
    onOk,
    ...restProps
  } = props
  const [openModal, setOpenModal] = useState(false)

  function toggle() {
    setOpenModal(!openModal)
  }

  useImperativeHandle(ref, () => ({
    toggle,
  }))

  return (
    <Modal
      className={classNames(styles.uboxModal, className)}
      open={openModal}
      width={850}
      footer={null}
      closeIcon={<></>}
      onCancel={() => toggle()}
      {...restProps}
    >
      <div className="flex items-center justify-center text-black">
        {icon}
        <p className={`my-0 text-2xl font-bold${icon ? ' ml-3' : ''}`}>
          {title || 'Title'}
        </p>
      </div>
      <Divider className="my-7" />
      {children}
      <div className="mt-4 flex items-center justify-center">
        <Button
          size="large"
          type="primary"
          className={classNames(
            'flex h-auto w-full items-center justify-center px-10 py-4 text-center text-sm',
            okButtonProps.className,
          )}
          onClick={(e) => {
            onOk?.(e)
            okButtonProps?.onClick?.(e)
          }}
          {...okButtonProps}
        >
          <p className={`my-0 ${okIcon ? ' mr-2' : ''}`}>{okText || 'Ok'}</p>
          {okIcon}
        </Button>
      </div>
    </Modal>
  )
})

export default UboxModal
