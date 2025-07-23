import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Star, Heart, MapPin, Wifi, Car, Coffee, Dumbbell, Waves } from 'lucide-react'
import { BookingForm } from './BookingForm'
import type { Hotel, Room } from '../types/models'

interface PropertyWithRooms extends Hotel {
  rooms: Room[]
  minPrice: number
  maxPrice: number
}

interface PropertyCardProps {
  property: PropertyWithRooms
}

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Free WiFi': Wifi,
  'Parking': Car,
  'Restaurant': Coffee,
  'Fitness center': Dumbbell,
  'Gym': Dumbbell,
  'Swimming pool': Waves,
  'Pool': Waves,
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Ensure images is an array
  const images = Array.isArray(property.images) ? property.images : 
    (typeof property.images === 'string' ? property.images.split(',').map(img => img.trim()) : [])
  
  // Fallback image if no images available
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
  ]

  // Ensure amenities is an array
  const amenities = Array.isArray(property.amenities) ? property.amenities :
    (typeof property.amenities === 'string' ? property.amenities.split(',').map(a => a.trim()) : [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  // Calculate average rating (for now use star_rating as base)
  const displayRating = property.star_rating * 2 // Convert 5-star to 10-point scale
  const reviewCount = Math.floor(Math.random() * 1000) + 100 // Mock review count

  // Calculate if there's a discount (mock for now)
  const originalPrice = Math.floor(property.minPrice * 1.2)
  const discount = Math.round(((originalPrice - property.minPrice) / originalPrice) * 100)

  return (
    <Card className="property-card overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery */}
        <div className="relative lg:w-80 h-64 lg:h-auto">
          <img
            src={displayImages[currentImageIndex]}
            alt={property.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a default image if the image fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
            }}
          />
          
          {/* Image Navigation */}
          {displayImages.length > 1 && (
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
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {displayImages.map((_, index) => (
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
                  {Array.from({ length: property.star_rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Hotel</span>
              </div>
              
              <h3 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer mb-1">
                {property.name}
              </h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {property.address}, {property.city}, {property.country}
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                {Math.random() > 0.5 ? '0.5' : '1.2'} km from center
              </div>

              {/* Description */}
              {property.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {property.description}
                </p>
              )}

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {amenities.slice(0, 4).map((amenity) => {
                  const Icon = amenityIcons[amenity] || Coffee
                  return (
                    <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                      <Icon className="w-3 h-3" />
                      <span>{amenity}</span>
                    </div>
                  )
                })}
                {amenities.length > 4 && (
                  <span className="text-xs text-gray-500">+{amenities.length - 4} more</span>
                )}
              </div>

              {/* Special Offers */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Free cancellation
                </Badge>
                {Math.random() > 0.5 && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Breakfast included
                  </Badge>
                )}
              </div>

              {/* Available Rooms */}
              {property.rooms.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  {property.rooms.length} room type{property.rooms.length > 1 ? 's' : ''} available
                </div>
              )}
            </div>

            {/* Rating and Price */}
            <div className="text-right ml-6">
              <div className="flex items-center justify-end mb-2">
                <div className="text-right mr-2">
                  <div className="text-sm font-medium">
                    {displayRating >= 8 ? 'Excellent' : displayRating >= 7 ? 'Very Good' : 'Good'}
                  </div>
                  <div className="text-xs text-gray-600">{reviewCount} reviews</div>
                </div>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                  {displayRating.toFixed(1)}
                </div>
              </div>

              <div className="text-right">
                {discount > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    ${originalPrice}
                  </div>
                )}
                <div className="text-2xl font-bold price-highlight">
                  ${property.minPrice}
                </div>
                {property.maxPrice > property.minPrice && (
                  <div className="text-sm text-gray-600">
                    from ${property.minPrice} - ${property.maxPrice}
                  </div>
                )}
                <div className="text-sm text-gray-600 mb-3">per night</div>
                
                <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-booking-accent hover:bg-blue-700 w-full">
                      See availability
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Book {property.name}</DialogTitle>
                    </DialogHeader>
                    <BookingForm 
                      hotel={property} 
                      onClose={() => setShowBookingForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}