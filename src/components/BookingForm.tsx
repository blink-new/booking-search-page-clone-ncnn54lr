import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Room, Hotel } from '../types/models'
import { DatabaseService } from '../services/database'
import { blink } from '../blink/client'

interface BookingFormProps {
  room: Room
  hotel: Hotel
  onClose: () => void
  onSuccess: () => void
}

export function BookingForm({ room, hotel, onClose, onSuccess }: BookingFormProps) {
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guests, setGuests] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [loading, setLoading] = useState(false)

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    return nights * room.price_per_night
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkInDate || !checkOutDate || !guestName || !guestEmail) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      await DatabaseService.createReservation({
        room_id: room.id,
        user_id: user.id,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        guests: guests,
        total_price: calculateTotal(),
        special_requests: specialRequests,
        status: 'pending'
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert('Failed to create reservation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
        <div className="text-sm text-gray-600">
          <p className="font-medium">{hotel.name}</p>
          <p>{room.room_type}</p>
          <p className="text-lg font-bold text-blue-600">${room.price_per_night}/night</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="check-in">Check-in Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="check-out">Check-out Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date <= (checkInDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={room.max_guests}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">Maximum {room.max_guests} guests</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guest-name">Full Name *</Label>
              <Input
                id="guest-name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="guest-email">Email *</Label>
              <Input
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="guest-phone">Phone Number</Label>
            <Input
              id="guest-phone"
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="special-requests">Special Requests</Label>
            <Textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests or preferences..."
              rows={3}
            />
          </div>

          {checkInDate && checkOutDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{format(checkInDate, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{format(checkOutDate, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate per night:</span>
                  <span>${room.price_per_night}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !checkInDate || !checkOutDate || !guestName || !guestEmail}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Booking...' : `Book Now - $${calculateTotal()}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}