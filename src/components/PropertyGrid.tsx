import { PropertyCard } from './PropertyCard'
import { MapView } from './MapView'

interface PropertyGridProps {
  filters: any
  sortBy: string
  showMap: boolean
}

// Mock property data
const mockProperties = [
  {
    id: 1,
    name: "The Plaza Hotel",
    location: "Midtown Manhattan, New York",
    rating: 4.5,
    reviewCount: 2847,
    price: 450,
    originalPrice: 520,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop"
    ],
    amenities: ["Free WiFi", "Parking", "Restaurant", "Fitness center"],
    freeCancellation: true,
    breakfastIncluded: false,
    starRating: 5,
    propertyType: "Hotels",
    distance: "0.2 km from center"
  },
  {
    id: 2,
    name: "Modern Downtown Apartment",
    location: "Financial District, New York",
    rating: 4.2,
    reviewCount: 1523,
    price: 180,
    originalPrice: 220,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"
    ],
    amenities: ["Free WiFi", "Kitchen", "Washing machine"],
    freeCancellation: true,
    breakfastIncluded: false,
    starRating: 4,
    propertyType: "Apartments",
    distance: "1.2 km from center"
  },
  {
    id: 3,
    name: "Luxury Resort & Spa",
    location: "Upper East Side, New York",
    rating: 4.8,
    reviewCount: 3241,
    price: 680,
    originalPrice: 780,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop"
    ],
    amenities: ["Free WiFi", "Swimming pool", "Spa", "Restaurant", "Fitness center"],
    freeCancellation: false,
    breakfastIncluded: true,
    starRating: 5,
    propertyType: "Resorts",
    distance: "2.1 km from center"
  },
  {
    id: 4,
    name: "Boutique Hotel Brooklyn",
    location: "Brooklyn Heights, New York",
    rating: 4.3,
    reviewCount: 892,
    price: 220,
    originalPrice: 280,
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=300&fit=crop"
    ],
    amenities: ["Free WiFi", "Restaurant", "Bar"],
    freeCancellation: true,
    breakfastIncluded: true,
    starRating: 4,
    propertyType: "Hotels",
    distance: "3.5 km from center"
  },
  {
    id: 5,
    name: "Cozy B&B Manhattan",
    location: "Greenwich Village, New York",
    rating: 4.0,
    reviewCount: 456,
    price: 120,
    originalPrice: 150,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop"
    ],
    amenities: ["Free WiFi", "Breakfast included"],
    freeCancellation: true,
    breakfastIncluded: true,
    starRating: 3,
    propertyType: "B&Bs",
    distance: "1.8 km from center"
  },
  {
    id: 6,
    name: "Times Square Hostel",
    location: "Times Square, New York",
    rating: 3.8,
    reviewCount: 1247,
    price: 45,
    originalPrice: 60,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop"
    ],
    amenities: ["Free WiFi", "Shared kitchen", "Common area"],
    freeCancellation: false,
    breakfastIncluded: false,
    starRating: 2,
    propertyType: "Hostels",
    distance: "0.8 km from center"
  }
]

export function PropertyGrid({ filters, sortBy, showMap }: PropertyGridProps) {
  // Filter properties based on filters
  const filteredProperties = mockProperties.filter(property => {
    // Price filter
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
      return false
    }

    // Star rating filter
    if (filters.starRating.length > 0 && !filters.starRating.includes(property.starRating.toString())) {
      return false
    }

    // Property type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) {
      return false
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity: string) =>
        property.amenities.includes(amenity)
      )
      if (!hasAllAmenities) return false
    }

    // Free cancellation filter
    if (filters.freeCancellation && !property.freeCancellation) {
      return false
    }

    // Breakfast included filter
    if (filters.breakfastIncluded && !property.breakfastIncluded) {
      return false
    }

    return true
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance)
      default:
        return 0
    }
  })

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