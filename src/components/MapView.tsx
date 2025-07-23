import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { MapPin } from 'lucide-react'

interface Property {
  id: number
  name: string
  location: string
  rating: number
  reviewCount: number
  price: number
  originalPrice: number
  images: string[]
  amenities: string[]
  freeCancellation: boolean
  breakfastIncluded: boolean
  starRating: number
  propertyType: string
  distance: string
}

interface MapViewProps {
  properties: Property[]
}

export function MapView({ properties }: MapViewProps) {
  return (
    <div className="h-[600px] bg-gray-100 rounded-lg relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Simplified map illustration */}
            <rect width="400" height="300" fill="#e5f3ff" />
            
            {/* Streets */}
            <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="100" y1="0" x2="100" y2="300" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="300" stroke="#cbd5e1" strokeWidth="2" />
            
            {/* Park area */}
            <rect x="50" y="50" width="100" height="80" fill="#86efac" opacity="0.6" rx="8" />
            <text x="100" y="95" textAnchor="middle" fontSize="10" fill="#166534">Central Park</text>
            
            {/* Water */}
            <path d="M320 50 Q350 70 380 50 Q350 90 320 70 Z" fill="#3b82f6" opacity="0.4" />
            <text x="350" y="75" textAnchor="middle" fontSize="8" fill="#1e40af">East River</text>
          </svg>
        </div>
      </div>

      {/* Property Markers */}
      <div className="absolute inset-0 p-4">
        {properties.slice(0, 8).map((property, index) => {
          // Generate random but consistent positions
          const x = 50 + (index * 40) % 300
          const y = 80 + (index * 60) % 180
          
          return (
            <div
              key={property.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {/* Price Marker */}
              <div className="bg-white border-2 border-blue-600 rounded-lg px-2 py-1 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                <div className="text-sm font-semibold text-blue-600">
                  ${property.price}
                </div>
              </div>

              {/* Property Card on Hover */}
              <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-xl">
                <div className="flex gap-3">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{property.name}</h4>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="bg-blue-600 text-white px-1 py-0.5 rounded text-xs">
                        {property.rating}
                      </div>
                      <span className="text-xs text-gray-600">
                        ({property.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        ${property.price}
                      </span>
                      <span className="text-xs text-gray-500">per night</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded shadow-md hover:shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="bg-white p-2 rounded shadow-md hover:shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="p-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Property locations</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Hover over markers for details
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="absolute top-4 left-4">
        <Badge className="bg-white text-gray-800 border border-gray-200">
          {properties.length} properties in this area
        </Badge>
      </div>
    </div>
  )
}