import React, { RefObject, forwardRef } from 'react'
import IconHapus from '@rootDir/public/static/icons/upload.svg'
import type { UploadProps } from 'antd'
import { Image, Upload } from 'antd'
import { RcFile, UploadFile } from 'antd/lib/upload'
import { FALLBACK_IMAGE } from '@rootDir/src/constant'

const { Dragger } = Upload
interface IMainProps {
  multiple: boolean
  accept: string
  onChange: (files: RcFile[]) => void
  previewFiles?: string[]
}

export type RefUpload = {
  setFileList: (uf?: UploadFile[]) => void
}

const UboxUpload = forwardRef(
  (mainProps: IMainProps, ref: RefObject<RefUpload>) => {
    const { multiple, accept, onChange, previewFiles } = mainProps
    const [fileList, setFileList] = React.useState<UploadFile[]>([])

    const handleUpload = async () => {
      await onChange(fileList as RcFile[])
    }

    React.useImperativeHandle(ref, () => ({
      setFileList(passedFileList) {
        setFileList(passedFileList)
      },
    }))

    const props: UploadProps = {
      accept,
      onRemove: (file) => {
        const index = fileList.indexOf(file)
        const newFileList = fileList.slice()
        newFileList.splice(index, 1)
        setFileList(newFileList)
      },
      beforeUpload: (file) => {
        if (!multiple) {
          setFileList([file])
        } else {
          setFileList([...fileList, file])
        }

        return false
      },
      fileList,
    }

    React.useEffect(() => {
      handleUpload()
    }, [fileList])

    return (
      <Dragger {...props} multiple={multiple}>
        {fileList.length === 0 && previewFiles?.length === 0 && (
          <>
            <p className="ant-upload-drag-icon">
              <div className="flex items-center">
                <div className="mx-auto rounded-full text-center font-semibold text-white">
                  <IconHapus className="mx-1.5 fill-current stroke-black text-[62px]" />
                </div>
              </div>
            </p>
            <p className="ant-upload-hint">Pilih gambar dengan ratio 9:16</p>
          </>
        )}

        {(fileList.length > 0 || previewFiles?.length > 0) && (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              {fileList.length === 0 &&
                previewFiles.map((file) => (
                  <Image
                    src={file}
                    alt="preview"
                    className="object-cover"
                    preview={false}
                    fallback={FALLBACK_IMAGE}
                  />
                ))}
              {fileList.map((file) => (
                <Image
                  src={URL.createObjectURL(file as any)}
                  alt="preview"
                  className="object-cover"
                  preview={false}
                />
              ))}
            </div>
          </div>
        )}
      </Dragger>
    )
  },
)

export default UboxUpload
