import { useState, useEffect } from 'react'
import { PropertyCard } from './PropertyCard'
import { MapView } from './MapView'
import { hotelService, roomService } from '../services/database'
import type { Hotel, Room } from '../types/models'

interface PropertyGridProps {
  filters: any
  sortBy: string
  showMap: boolean
}

interface PropertyWithRooms extends Hotel {
  rooms: Room[]
  minPrice: number
  maxPrice: number
}

export function PropertyGrid({ filters, sortBy, showMap }: PropertyGridProps) {
  const [properties, setProperties] = useState<PropertyWithRooms[]>([])
  const [loading, setLoading] = useState(true)

  const loadProperties = async () => {
    try {
      setLoading(true)
      const [hotels, rooms] = await Promise.all([
        hotelService.getAll(),
        roomService.getAll()
      ])

      // Combine hotels with their rooms and calculate price ranges
      const propertiesWithRooms: PropertyWithRooms[] = hotels.map(hotel => {
        const hotelRooms = rooms.filter(room => room.hotel_id === hotel.id)
        const prices = hotelRooms.map(room => room.price_per_night)
        
        return {
          ...hotel,
          rooms: hotelRooms,
          minPrice: prices.length > 0 ? Math.min(...prices) : 0,
          maxPrice: prices.length > 0 ? Math.max(...prices) : 0
        }
      })

      setProperties(propertiesWithRooms)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  // Filter properties based on filters
  const filteredProperties = properties.filter(property => {
    // Price filter - check if any room falls within the price range
    const hasRoomInPriceRange = property.rooms.some(room => 
      room.price_per_night >= filters.priceRange[0] && 
      room.price_per_night <= filters.priceRange[1]
    )
    if (!hasRoomInPriceRange && property.rooms.length > 0) {
      return false
    }

    // Star rating filter
    if (filters.starRating.length > 0 && !filters.starRating.includes(property.star_rating.toString())) {
      return false
    }

    // Property type filter (simplified - treating all as hotels for now)
    if (filters.propertyType.length > 0 && !filters.propertyType.includes('Hotels')) {
      return false
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : []
      const hasAllAmenities = filters.amenities.every((amenity: string) =>
        propertyAmenities.some(propAmenity => 
          propAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      )
      if (!hasAllAmenities) return false
    }

    // Free cancellation filter (assume all hotels have free cancellation for now)
    // This could be added as a hotel property in the future

    // Breakfast included filter (assume some hotels include breakfast)
    // This could be added as a hotel property in the future

    return true
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.minPrice - b.minPrice
      case 'price-high':
        return b.maxPrice - a.maxPrice
      case 'rating':
        return b.star_rating - a.star_rating
      case 'distance':
        // For now, sort by hotel name as we don't have distance calculation
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-64 h-48 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (showMap) {
    return <MapView properties={sortedProperties} />
  }

  return (
    <div className="space-y-4">
      {sortedProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties match your filters</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        sortedProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))
      )}
    </div>
  )
}