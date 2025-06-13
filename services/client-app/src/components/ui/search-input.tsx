import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
  onSearch: (term: string) => void
  placeholder?: string
  initialValue?: string
}

export function SearchInput({
  onSearch,
  placeholder = 'Search by tags...',
  initialValue = '',
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <div className="fixed ml-5 top-6 w-96">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="outline">
          <Search />
        </Button>
      </form>
    </div>
  )
}
