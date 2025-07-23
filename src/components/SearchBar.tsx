import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Calendar, MapPin, Users, Search } from 'lucide-react'
import { Card } from './ui/card'

export function SearchBar() {
  const [destination, setDestination] = useState('New York')
  const [checkIn, setCheckIn] = useState('2024-01-15')
  const [checkOut, setCheckOut] = useState('2024-01-18')
  const [guests, setGuests] = useState('2 adults · 1 room')

  return (
    <div className="bg-booking-primary py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Find your next stay
          </h1>
          <p className="text-blue-100">
            Search low prices on hotels, homes and much more...
          </p>
        </div>

        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Destination */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Where are you going?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                  placeholder="Enter destination"
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="pl-10"
                  placeholder="2 adults · 1 room"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button className="bg-booking-accent hover:bg-blue-700 px-8 h-10">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}