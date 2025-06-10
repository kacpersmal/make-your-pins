import { useEffect } from 'react'

export function usePageTitle(
  title: string | undefined,
  isLoading = false,
  isError = false,
) {
  useEffect(() => {
    const baseTitle = 'Pins'

    if (isLoading) {
      document.title = `Loading... | ${baseTitle}`
    } else if (isError) {
      document.title = `Error | ${baseTitle}`
    } else if (title) {
      document.title = `${title} | ${baseTitle}`
    } else {
      document.title = baseTitle
    }

    return () => {
      document.title = baseTitle
    }
  }, [title, isLoading, isError])
}
