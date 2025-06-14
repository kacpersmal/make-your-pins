import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { useDebounce } from '@/hooks/use-debounce'

interface TagSuggestionsProps {
  currentTags: Array<string>
  searchQuery?: string
  onAddTag: (tag: string) => void
  maxSuggestions?: number
}

export function TagSuggestions({
  currentTags,
  searchQuery = '',
  onAddTag,
  maxSuggestions = 5,
}: TagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<
    Array<{ value: string; count: number }>
  >([])
  const [loading, setLoading] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300) // 300ms debounce

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)

        let response

        // If we have a search query, search for tags by prefix
        if (debouncedSearchQuery.trim()) {
          response = await apiClient.get('/tags/search', {
            prefix: debouncedSearchQuery.trim(),
            limit: maxSuggestions,
          })
        } else {
          // Otherwise, get suggestions based on existing tags
          response = await apiClient.get('/tags/suggestions', {
            existingTags: currentTags,
            limit: maxSuggestions,
          })
        }

        // Filter out tags that are already selected
        const filteredSuggestions = response.filter(
          (tag: { value: string }) =>
            !currentTags.includes(tag.value.toLowerCase()),
        )

        setSuggestions(filteredSuggestions)
      } catch (error) {
        console.error('Error fetching tag suggestions:', error)
        // If API fails, provide some default suggestions as fallback
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedSearchQuery, currentTags, maxSuggestions])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-xs text-muted-foreground">
          Loading suggestions...
        </span>
      </div>
    )
  }

  if (!suggestions.length) {
    return null
  }

  return (
    <div className="mt-2">
      <p className="text-xs text-muted-foreground mb-1">
        {debouncedSearchQuery.trim() ? 'Matching tags:' : 'Suggested tags:'}
      </p>
      <div className="flex flex-wrap gap-1">
        {suggestions.map((tag) => (
          <Button
            key={tag.value}
            variant="outline"
            size="sm"
            className="text-xs py-0 h-6"
            onClick={() => onAddTag(tag.value)}
          >
            {tag.value}
            {tag.count > 0 && (
              <span className="ml-1 text-muted-foreground">({tag.count})</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
