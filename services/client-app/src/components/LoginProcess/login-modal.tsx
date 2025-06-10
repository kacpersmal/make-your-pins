import UploadForm from '../uploadProcess/upload-form'
export default function LoginModal({ className }: { className: string }) {
  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-sm ${className}`}>
      <UploadForm></UploadForm>
    </div>
  )
}
