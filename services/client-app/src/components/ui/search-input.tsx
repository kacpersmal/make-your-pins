import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
export function SearchInput() {
  return (
    <div className="fixed top-3 w-96">
      <div className="flex w-full items-center gap-2 ">
        <Input type="email" placeholder="Search something cool..." />
        <Button variant="outline">
          <Search />
        </Button>
      </div>
    </div>
  )
}
