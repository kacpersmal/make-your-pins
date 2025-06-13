import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { Button } from '../ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function AssetsPageControll({
  page,
  lastPage,
  onPageChange,
}: {
  page: number
  lastPage: number | undefined
  onPageChange: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <div className="">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              disabled={page === 0}
              variant={'ghost'}
              onClick={() => {
                onPageChange((p) => p - 1)
              }}
            >
              <div>
                <ArrowLeft></ArrowLeft>
              </div>
            </Button>
          </PaginationItem>

          {/* <PaginationItem>
            <Button variant={'ghost'}>1</Button>
          </PaginationItem> */}
          {/*<PaginationItem>
            <Button variant={'ghost'}>1</Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant={'ghost'}>1</Button>
          </PaginationItem> */}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <Button
              disabled={page >= (lastPage ?? 1) - 1}
              variant={'ghost'}
              onClick={() => {
                onPageChange((p) => p + 1)
              }}
            >
              <div>
                <ArrowRight />
              </div>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
