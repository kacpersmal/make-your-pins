// import { SearchInput } from '../ui/search-input'
// import { ErrorBoundary } from '../error-boundary'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useAssets } from '@/hooks/use-assets'
import { Card } from '../ui/card'

export default function AssetsContainer() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error } = useAssets({
    page,
    limit: 30,
  })
  //
  const [infiniteData, setInfiniteData] = useState<any[]>([])
  const lastLoadedPage = useRef(-1)
  const parentRef = useRef<HTMLDivElement>(null)
  const itemCount = infiniteData?.length ?? 0
  const rowCount = Math.ceil(itemCount / 4)
  //
  //
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 390, // height of each card in px
  })
  const vitualRow = rowVirtualizer.getVirtualItems()
  //
  //
  useEffect(() => {
    if (!data) return
    if (lastLoadedPage.current === page) return // already loaded this page

    if (page === 0) {
      setInfiniteData(data.items)
    } else if (data.items.length > 0) {
      setInfiniteData((prev) => [...prev, ...data.items])
      console.log(infiniteData)
    }
    lastLoadedPage.current = page
  }, [data, page])

  //
  //
  useEffect(() => {
    if (!data) return
    const virtualRows = rowVirtualizer.getVirtualItems()
    const [lastItem] = [...virtualRows].reverse()
    console.log('virtualRows:', virtualRows)
    console.log('lastItem:', lastItem)
    console.log(
      'itemCount:',
      itemCount,
      'page:',
      page,
      'data.pages:',
      data.pages,
    )
    if (lastItem && lastItem.index >= rowCount - 1 && page < data.pages - 1) {
      setPage((p) => p + 1)
    }
  }, [rowVirtualizer.getVirtualItems(), itemCount, page, data?.pages])
  //
  //

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error?.message}</div>
  return (
    <div
      className=" h-[87vh] w-full p-4 rounded-2xl overflow-auto"
      ref={parentRef}
    >
      <div
        className="relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {vitualRow?.map(({ index, key }) => {
          const startIndex = index * 4
          const cardRow = infiniteData?.slice(startIndex, startIndex + 4)

          return (
            <div
              className="grid gap-4 my-6"
              key={key}
              data-index={index}
              ref={rowVirtualizer.measureElement}
              style={{
                gridTemplateColumns: `repeat(${4}, minmax(0, 1fr))`,
              }}
            >
              {cardRow?.map((card, cardIndex) => {
                return (
                  <div key={startIndex + cardIndex}>
                    <div className="h-96 bg-black/10 rounded-2xl">
                      CardIdex:{cardIndex}
                      <br />
                      Index:{index}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
