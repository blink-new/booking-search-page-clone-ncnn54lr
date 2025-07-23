import { useState } from 'react'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { FilterSidebar } from './components/FilterSidebar'
import { PropertyGrid } from './components/PropertyGrid'
import { SortBar } from './components/SortBar'
import { MapToggle } from './components/MapToggle'

function App() {
  const [showMap, setShowMap] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    starRating: [],
    amenities: [],
    propertyType: [],
    guestRating: 0,
    freeCancellation: false,
    breakfastIncluded: false
  })
  const [sortBy, setSortBy] = useState('recommended')

  return (
    <div className="min-h-screen bg-booking-bg">
      <Header />
      <SearchBar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Map Toggle */}
            <div className="flex justify-between items-center mb-6">
              <SortBar sortBy={sortBy} setSortBy={setSortBy} />
              <MapToggle showMap={showMap} setShowMap={setShowMap} />
            </div>

            {/* Property Grid */}
            <PropertyGrid filters={filters} sortBy={sortBy} showMap={showMap} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App