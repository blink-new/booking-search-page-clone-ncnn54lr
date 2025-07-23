import { Card } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { Star, Wifi, Car, Coffee, Dumbbell, Waves } from 'lucide-react'

interface FilterSidebarProps {
  filters: any
  setFilters: (filters: any) => void
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value]
    updateFilter(key, updated)
  }

  return (
    <div className="space-y-6">
      {/* Filter by Price */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Filter by:</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Your budget (per night)</h4>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value)}
                max={500}
                min={0}
                step={10}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}+</span>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="filter-section pb-4">
            <h4 className="font-medium mb-3">Star rating</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <label key={stars} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.starRating.includes(stars)}
                    onCheckedChange={() => toggleArrayFilter('starRating', stars.toString())}
                  />
                  <div className="flex items-center">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="filter-section pb-4">
            <h4 className="font-medium mb-3">Property type</h4>
            <div className="space-y-2">
              {['Hotels', 'Apartments', 'Resorts', 'Villas', 'Hostels', 'B&Bs'].map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.propertyType.includes(type)}
                    onCheckedChange={() => toggleArrayFilter('propertyType', type)}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="filter-section pb-4">
            <h4 className="font-medium mb-3">Facilities</h4>
            <div className="space-y-2">
              {[
                { name: 'Free WiFi', icon: Wifi },
                { name: 'Parking', icon: Car },
                { name: 'Restaurant', icon: Coffee },
                { name: 'Fitness center', icon: Dumbbell },
                { name: 'Swimming pool', icon: Waves }
              ].map(({ name, icon: Icon }) => (
                <label key={name} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.amenities.includes(name)}
                    onCheckedChange={() => toggleArrayFilter('amenities', name)}
                  />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Offers */}
          <div className="filter-section pb-4">
            <h4 className="font-medium mb-3">Special offers</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={filters.freeCancellation}
                  onCheckedChange={(checked) => updateFilter('freeCancellation', checked)}
                />
                <span className="text-sm">Free cancellation</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={filters.breakfastIncluded}
                  onCheckedChange={(checked) => updateFilter('breakfastIncluded', checked)}
                />
                <span className="text-sm">Breakfast included</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setFilters({
          priceRange: [0, 500],
          starRating: [],
          amenities: [],
          propertyType: [],
          guestRating: 0,
          freeCancellation: false,
          breakfastIncluded: false
        })}
      >
        Clear all filters
      </Button>
    </div>
  )
}