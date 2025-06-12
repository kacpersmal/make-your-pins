import UploadForm from '../uploadProcess/upload-form'
import type { Dispatch, SetStateAction } from 'react'
export default function UploadModal({
  handler,
}: {
  handler: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-sm`}>
      <UploadForm handler={handler} />
    </div>
  )
}
