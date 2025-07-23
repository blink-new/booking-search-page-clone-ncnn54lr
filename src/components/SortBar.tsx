import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'

interface SortBarProps {
  sortBy: string
  setSortBy: (sort: string) => void
}

export function SortBar({ sortBy, setSortBy }: SortBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Our top picks</SelectItem>
            <SelectItem value="price-low">Price (lowest first)</SelectItem>
            <SelectItem value="price-high">Price (highest first)</SelectItem>
            <SelectItem value="rating">Guest rating</SelectItem>
            <SelectItem value="distance">Distance from center</SelectItem>
            <SelectItem value="newest">Newest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          324 properties found
        </Badge>
      </div>
    </div>
  )
}