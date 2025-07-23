import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Hotel, Room, Reservation, Review } from '../types/models'
import { hotelService, roomService, reservationService, reviewService } from '../services/database'
import { blink } from '../blink/client'

export function AdminDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newHotel, setNewHotel] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    star_rating: 3,
    amenities: '',
    images: '',
    latitude: 0,
    longitude: 0
  })

  const [newRoom, setNewRoom] = useState({
    hotel_id: '',
    room_type: '',
    description: '',
    price_per_night: 0,
    max_guests: 2,
    amenities: '',
    images: '',
    available: true
  })

  const loadData = async () => {
    try {
      const [hotelsData, roomsData, reservationsData, reviewsData] = await Promise.all([
        hotelService.getAll(),
        roomService.getAll(),
        reservationService.getAll(),
        reviewService.getAll()
      ])
      
      setHotels(hotelsData)
      setRooms(roomsData)
      setReservations(reservationsData)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateHotel = async () => {
    try {
      const user = await blink.auth.me()
      await hotelService.create({
        ...newHotel,
        amenities: newHotel.amenities.split(',').map(a => a.trim()),
        images: newHotel.images.split(',').map(i => i.trim()),
        phone: '',
        email: '',
        check_in_time: '15:00',
        check_out_time: '11:00',
        policies: 'Standard hotel policies apply'
      })
      
      setNewHotel({
        name: '',
        description: '',
        address: '',
        city: '',
        country: '',
        star_rating: 3,
        amenities: '',
        images: '',
        latitude: 0,
        longitude: 0
      })
      
      loadData()
    } catch (error) {
      console.error('Error creating hotel:', error)
    }
  }

  const handleCreateRoom = async () => {
    try {
      await roomService.create({
        ...newRoom,
        amenities: newRoom.amenities.split(',').map(a => a.trim()),
        images: newRoom.images.split(',').map(i => i.trim()),
        max_occupancy: newRoom.max_guests,
        bed_type: 'King',
        room_size: 35,
        is_available: newRoom.available
      })
      
      setNewRoom({
        hotel_id: '',
        room_type: '',
        description: '',
        price_per_night: 0,
        max_guests: 2,
        amenities: '',
        images: '',
        available: true
      })
      
      loadData()
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      await reservationService.update(reservationId, { status: status as any })
      loadData()
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hotels Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">Add New Hotel</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Hotel</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hotel-name">Hotel Name</Label>
                      <Input
                        id="hotel-name"
                        value={newHotel.name}
                        onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="star-rating">Star Rating</Label>
                      <Select value={newHotel.star_rating.toString()} onValueChange={(value) => setNewHotel({...newHotel, star_rating: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5].map(rating => (
                            <SelectItem key={rating} value={rating.toString()}>{rating} Star</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newHotel.description}
                        onChange={(e) => setNewHotel({...newHotel, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newHotel.address}
                        onChange={(e) => setNewHotel({...newHotel, address: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newHotel.city}
                        onChange={(e) => setNewHotel({...newHotel, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newHotel.country}
                        onChange={(e) => setNewHotel({...newHotel, country: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                      <Input
                        id="amenities"
                        value={newHotel.amenities}
                        onChange={(e) => setNewHotel({...newHotel, amenities: e.target.value})}
                        placeholder="WiFi, Pool, Gym"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="images">Image URLs (comma-separated)</Label>
                      <Input
                        id="images"
                        value={newHotel.images}
                        onChange={(e) => setNewHotel({...newHotel, images: e.target.value})}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={newHotel.latitude}
                        onChange={(e) => setNewHotel({...newHotel, latitude: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={newHotel.longitude}
                        onChange={(e) => setNewHotel({...newHotel, longitude: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateHotel} className="mt-4">Create Hotel</Button>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell className="font-medium">{hotel.name}</TableCell>
                      <TableCell>{hotel.city}, {hotel.country}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {Array.from({length: hotel.star_rating}).map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{rooms.filter(r => r.hotel_id === hotel.id).length}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rooms Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">Add New Room</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Room</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hotel-select">Hotel</Label>
                      <Select value={newRoom.hotel_id} onValueChange={(value) => setNewRoom({...newRoom, hotel_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Hotel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hotels.map(hotel => (
                            <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="room-type">Room Type</Label>
                      <Input
                        id="room-type"
                        value={newRoom.room_type}
                        onChange={(e) => setNewRoom({...newRoom, room_type: e.target.value})}
                        placeholder="Deluxe Suite"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="room-description">Description</Label>
                      <Textarea
                        id="room-description"
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price per Night</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newRoom.price_per_night}
                        onChange={(e) => setNewRoom({...newRoom, price_per_night: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-guests">Max Guests</Label>
                      <Input
                        id="max-guests"
                        type="number"
                        value={newRoom.max_guests}
                        onChange={(e) => setNewRoom({...newRoom, max_guests: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="room-amenities">Amenities (comma-separated)</Label>
                      <Input
                        id="room-amenities"
                        value={newRoom.amenities}
                        onChange={(e) => setNewRoom({...newRoom, amenities: e.target.value})}
                        placeholder="King Bed, City View, Mini Bar"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="room-images">Image URLs (comma-separated)</Label>
                      <Input
                        id="room-images"
                        value={newRoom.images}
                        onChange={(e) => setNewRoom({...newRoom, images: e.target.value})}
                        placeholder="https://example.com/room1.jpg, https://example.com/room2.jpg"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateRoom} className="mt-4">Create Room</Button>
                </DialogContent>
              </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Price/Night</TableHead>
                    <TableHead>Max Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => {
                    const hotel = hotels.find(h => h.id === room.hotel_id)
                    return (
                      <TableRow key={room.id}>
                        <TableCell>{hotel?.name || 'Unknown'}</TableCell>
                        <TableCell className="font-medium">{room.room_type}</TableCell>
                        <TableCell>${room.price_per_night}</TableCell>
                        <TableCell>{room.max_occupancy}</TableCell>
                        <TableCell>
                          <Badge variant={Number(room.is_available) > 0 ? "default" : "secondary"}>
                            {Number(room.is_available) > 0 ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reservations Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => {
                    const room = rooms.find(r => r.id === reservation.room_id)
                    const hotel = hotels.find(h => h.id === room?.hotel_id)
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.guest_name}</TableCell>
                        <TableCell>{hotel?.name || 'Unknown'}</TableCell>
                        <TableCell>{room?.room_type || 'Unknown'}</TableCell>
                        <TableCell>{new Date(reservation.check_in_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(reservation.check_out_date).toLocaleDateString()}</TableCell>
                        <TableCell>${reservation.total_price}</TableCell>
                        <TableCell>
                          <Badge variant={
                            reservation.status === 'confirmed' ? 'default' :
                            reservation.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => {
                    const hotel = hotels.find(h => h.id === review.hotel_id)
                    return (
                      <TableRow key={review.id}>
                        <TableCell>{hotel?.name || 'Unknown'}</TableCell>
                        <TableCell>{review.reviewer_name}</TableCell>
                        <TableCell>
                          <div className="flex">
                            {Array.from({length: review.rating}).map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                        <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Moderate</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}