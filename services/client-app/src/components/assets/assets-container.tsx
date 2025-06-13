import { useState } from 'react'
import { SearchInput } from '../ui/search-input'
import AssetsPageControll from './assets-page-controll'
import AssetsGrid from './assets-grid'
import { useAssets } from '@/hooks/use-assets'

export default function AssetsContainer() {
  const [page, setPage] = useState<number>(0)
  const [tagSearch, setTagSearch] = useState<string>('')

  const { data } = useAssets({
    page,
    limit: 18,
    tag: tagSearch || undefined,
  })

  const handleSearch = (term: string) => {
    setTagSearch(term)
    // Reset to first page when searching
    setPage(0)
  }

  return (
    <>
      <div className="h-full w-full">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search by tags..."
          initialValue={tagSearch}
        />
        <AssetsGrid page={page} tagFilter={tagSearch} />
        <div className="">
          <AssetsPageControll
            page={page}
            lastPage={data?.pages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  )
}
