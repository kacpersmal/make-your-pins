import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { SearchInput } from '../ui/search-input'
import AssetsPageControll from './assets-page-controll'
import AssetsGrid from './assets-grid'
import { useAssets } from '@/hooks/use-assets'

export default function AssetsContainer() {
  const [page, setPage] = useState<number>(0)
  const [tagSearch, setTagSearch] = useState<string>('')
  const search = useSearch({ from: '/' })
  const navigate = useNavigate()

  // Sync with URL parameters
  useEffect(() => {
    if (search.tag && search.tag !== tagSearch) {
      setTagSearch(search.tag)
      setPage(0) // Reset to first page when tag changes
    }
  }, [search.tag])

  const { data, isLoading, isError, error } = useAssets({
    page,
    limit: 10,
    tag: tagSearch || undefined,
  })

  const handleSearch = (term: string) => {
    setTagSearch(term)
    setPage(0) // Reset to first page when searching

    // Update URL to reflect the search
    navigate({
      to: '/',
      search: { tag: term || undefined },
    })
  }

  return (
    <>
      <div className="h-full w-full">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search by tags..."
          initialValue={tagSearch}
        />
        <AssetsGrid
          page={page}
          tagFilter={tagSearch}
          data={data}
          isLoading={isLoading}
          isError={isError}
          error={error ? error : undefined}
        />
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
