import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UploadForm } from '@/components/uploadProcess/upload-form'

export function CreateAssetButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start focus:bg-sidebar-accent hover:bg-sidebar-accent/50"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Create New Asset</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl p-0" showCloseButton={false}>
        <UploadForm handler={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
