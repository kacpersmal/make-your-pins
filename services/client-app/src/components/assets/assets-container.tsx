// import { SearchInput } from '../ui/search-input'
// import { ErrorBoundary } from '../error-boundary'
import { useState } from 'react'
import AssetsPageControll from './assets-page-controll'
import AssetsGrid from './assets-grid'
import { SearchInput } from '../ui/search-input'
import { useAssets } from '@/hooks/use-assets'
export default function AssetsContainer() {
  const [page, setPage] = useState<number>(0)
  const { data } = useAssets({
    page: 0,
    limit: 18,
  })
  return (
    <>
      <SearchInput />
      <AssetsGrid page={page} />
      <AssetsPageControll
        page={page}
        lastPage={data?.pages}
        onPageChange={setPage}
      />
    </>
  )
}
