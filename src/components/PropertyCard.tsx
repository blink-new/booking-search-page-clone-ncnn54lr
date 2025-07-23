import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Star, Heart, MapPin, Wifi, Car, Coffee, Dumbbell, Waves } from 'lucide-react'

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

interface PropertyCardProps {
  property: Property
}

const amenityIcons: { [key: string]: any } = {
  'Free WiFi': Wifi,
  'Parking': Car,
  'Restaurant': Coffee,
  'Fitness center': Dumbbell,
  'Swimming pool': Waves,
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const discount = Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)

  return (
    <Card className="property-card overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery */}
        <div className="relative lg:w-80 h-64 lg:h-auto">
          <img
            src={property.images[currentImageIndex]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Dots */}
          {property.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Heart Icon */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Property Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: property.starRating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{property.propertyType}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer mb-1">
                {property.name}
              </h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {property.location}
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                {property.distance}
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities.slice(0, 4).map((amenity) => {
                  const Icon = amenityIcons[amenity]
                  return (
                    <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                      {Icon && <Icon className="w-3 h-3" />}
                      <span>{amenity}</span>
                    </div>
                  )
                })}
                {property.amenities.length > 4 && (
                  <span className="text-xs text-gray-500">+{property.amenities.length - 4} more</span>
                )}
              </div>

              {/* Special Offers */}
              <div className="flex flex-wrap gap-2 mb-4">
                {property.freeCancellation && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Free cancellation
                  </Badge>
                )}
                {property.breakfastIncluded && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Breakfast included
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating and Price */}
            <div className="text-right ml-6">
              <div className="flex items-center justify-end mb-2">
                <div className="text-right mr-2">
                  <div className="text-sm font-medium">Excellent</div>
                  <div className="text-xs text-gray-600">{property.reviewCount} reviews</div>
                </div>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                  {property.rating}
                </div>
              </div>

              <div className="text-right">
                {property.originalPrice > property.price && (
                  <div className="text-sm text-gray-500 line-through">
                    ${property.originalPrice}
                  </div>
                )}
                <div className="text-2xl font-bold price-highlight">
                  ${property.price}
                </div>
                <div className="text-sm text-gray-600 mb-3">per night</div>
                
                <Button className="bg-booking-accent hover:bg-blue-700 w-full">
                  See availability
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}