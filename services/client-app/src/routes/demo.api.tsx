import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { useAssets } from '../hooks/use-assets'
import { ErrorBoundary } from '../components/error-boundary'

export const Route = createFileRoute('/demo/api')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = React.useState(0)
  const [filter, setFilter] = React.useState('')

  const { data, isLoading, isError, error } = useAssets({
    page,
    limit: 12,
    name: filter,
  })

  if (isLoading) {
    return <div>Loading assets...</div>
  }

  if (isError) {
    return <div>Error loading assets: {error.message}</div>
  }
  {
    console.log('data.items', data?.items)
  }
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter by name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.items.map((asset) => (
            <div key={asset.id} className="border rounded-md overflow-hidden">
              {asset.files[0]?.thumbnailPath && (
                <img
                  src={
                    import.meta.env.VITE_PUBLIC_BUCKET_URL +
                    asset.files[0].thumbnailPath
                  }
                  alt={asset.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{asset.name}</h3>
                <p className="text-gray-600 truncate">{asset.description}</p>
                <div className="flex mt-2">
                  {asset.tags?.map((tag) => (
                    <span
                      key={tag.value}
                      className="px-2 py-1 text-xs bg-gray-200 rounded-md mr-2"
                    >
                      {tag.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {data && (
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {data.pages}
            </span>
            <button
              disabled={page >= data.pages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
