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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Hotel, Room, Reservation, Review } from '../types/models'
import { hotelService, roomService, reservationService, reviewService } from '../services/database'
import { blink } from '../blink/client'

export function AdminDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // Edit states
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

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
    longitude: 0,
    phone: '',
    email: ''
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

  const resetHotelForm = () => {
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
      longitude: 0,
      phone: '',
      email: ''
    })
    setEditingHotel(null)
  }

  const resetRoomForm = () => {
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
    setEditingRoom(null)
  }

  const handleCreateOrUpdateHotel = async () => {
    try {
      const hotelData = {
        ...newHotel,
        amenities: newHotel.amenities.split(',').map(a => a.trim()).filter(a => a),
        images: newHotel.images.split(',').map(i => i.trim()).filter(i => i),
        check_in_time: '15:00',
        check_out_time: '11:00',
        policies: 'Standard hotel policies apply'
      }

      if (editingHotel) {
        await hotelService.update(editingHotel.id, hotelData)
      } else {
        await hotelService.create(hotelData)
      }
      
      resetHotelForm()
      loadData()
    } catch (error) {
      console.error('Error saving hotel:', error)
    }
  }

  const handleCreateOrUpdateRoom = async () => {
    try {
      const roomData = {
        ...newRoom,
        amenities: newRoom.amenities.split(',').map(a => a.trim()).filter(a => a),
        images: newRoom.images.split(',').map(i => i.trim()).filter(i => i),
        max_occupancy: newRoom.max_guests,
        bed_type: 'King',
        room_size: 35,
        is_available: newRoom.available
      }

      if (editingRoom) {
        await roomService.update(editingRoom.id, roomData)
      } else {
        await roomService.create(roomData)
      }
      
      resetRoomForm()
      loadData()
    } catch (error) {
      console.error('Error saving room:', error)
    }
  }

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setNewHotel({
      name: hotel.name,
      description: hotel.description || '',
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      star_rating: hotel.star_rating,
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : hotel.amenities || '',
      images: Array.isArray(hotel.images) ? hotel.images.join(', ') : hotel.images || '',
      latitude: hotel.latitude || 0,
      longitude: hotel.longitude || 0,
      phone: hotel.phone || '',
      email: hotel.email || ''
    })
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setNewRoom({
      hotel_id: room.hotel_id,
      room_type: room.room_type,
      description: room.description || '',
      price_per_night: room.price_per_night,
      max_guests: room.max_occupancy || 2,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities || '',
      images: Array.isArray(room.images) ? room.images.join(', ') : room.images || '',
      available: Number(room.is_available) > 0
    })
  }

  const handleDeleteHotel = async (hotelId: string) => {
    try {
      await hotelService.delete(hotelId)
      loadData()
    } catch (error) {
      console.error('Error deleting hotel:', error)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await roomService.delete(roomId)
      loadData()
    } catch (error) {
      console.error('Error deleting room:', error)
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
          <TabsTrigger value="hotels">Hotels ({hotels.length})</TabsTrigger>
          <TabsTrigger value="rooms">Rooms ({rooms.length})</TabsTrigger>
          <TabsTrigger value="reservations">Reservations ({reservations.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hotels Management
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={resetHotelForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Hotel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingHotel ? 'Edit Hotel' : 'Create New Hotel'}
                      </DialogTitle>
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
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newHotel.phone}
                          onChange={(e) => setNewHotel({...newHotel, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newHotel.email}
                          onChange={(e) => setNewHotel({...newHotel, email: e.target.value})}
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
                          onChange={(e) => setNewHotel({...newHotel, latitude: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={newHotel.longitude}
                          onChange={(e) => setNewHotel({...newHotel, longitude: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleCreateOrUpdateHotel} className="flex-1">
                        {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                      </Button>
                      <Button variant="outline" onClick={resetHotelForm}>
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
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
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditHotel(hotel)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Hotel</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-hotel-name">Hotel Name</Label>
                                  <Input
                                    id="edit-hotel-name"
                                    value={newHotel.name}
                                    onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-star-rating">Star Rating</Label>
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
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={newHotel.description}
                                    onChange={(e) => setNewHotel({...newHotel, description: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-address">Address</Label>
                                  <Input
                                    id="edit-address"
                                    value={newHotel.address}
                                    onChange={(e) => setNewHotel({...newHotel, address: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-city">City</Label>
                                  <Input
                                    id="edit-city"
                                    value={newHotel.city}
                                    onChange={(e) => setNewHotel({...newHotel, city: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-country">Country</Label>
                                  <Input
                                    id="edit-country"
                                    value={newHotel.country}
                                    onChange={(e) => setNewHotel({...newHotel, country: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-amenities">Amenities (comma-separated)</Label>
                                  <Input
                                    id="edit-amenities"
                                    value={newHotel.amenities}
                                    onChange={(e) => setNewHotel({...newHotel, amenities: e.target.value})}
                                    placeholder="WiFi, Pool, Gym"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button onClick={handleCreateOrUpdateHotel} className="flex-1">
                                  Update Hotel
                                </Button>
                                <Button variant="outline" onClick={resetHotelForm}>
                                  Cancel
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{hotel.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteHotel(hotel.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
              <CardTitle className="flex items-center justify-between">
                Rooms Management
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={resetRoomForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingRoom ? 'Edit Room' : 'Create New Room'}
                      </DialogTitle>
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
                          onChange={(e) => setNewRoom({...newRoom, price_per_night: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-guests">Max Guests</Label>
                        <Input
                          id="max-guests"
                          type="number"
                          value={newRoom.max_guests}
                          onChange={(e) => setNewRoom({...newRoom, max_guests: parseInt(e.target.value) || 2})}
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
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleCreateOrUpdateRoom} className="flex-1">
                        {editingRoom ? 'Update Room' : 'Create Room'}
                      </Button>
                      <Button variant="outline" onClick={resetRoomForm}>
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditRoom(room)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Room</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-hotel-select">Hotel</Label>
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
                                    <Label htmlFor="edit-room-type">Room Type</Label>
                                    <Input
                                      id="edit-room-type"
                                      value={newRoom.room_type}
                                      onChange={(e) => setNewRoom({...newRoom, room_type: e.target.value})}
                                      placeholder="Deluxe Suite"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Label htmlFor="edit-room-description">Description</Label>
                                    <Textarea
                                      id="edit-room-description"
                                      value={newRoom.description}
                                      onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-price">Price per Night</Label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      value={newRoom.price_per_night}
                                      onChange={(e) => setNewRoom({...newRoom, price_per_night: parseFloat(e.target.value) || 0})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-max-guests">Max Guests</Label>
                                    <Input
                                      id="edit-max-guests"
                                      type="number"
                                      value={newRoom.max_guests}
                                      onChange={(e) => setNewRoom({...newRoom, max_guests: parseInt(e.target.value) || 2})}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button onClick={handleCreateOrUpdateRoom} className="flex-1">
                                    Update Room
                                  </Button>
                                  <Button variant="outline" onClick={resetRoomForm}>
                                    Cancel
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Room</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this {room.room_type}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteRoom(room.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
                              disabled={reservation.status === 'confirmed'}
                            >
                              Confirm
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                              disabled={reservation.status === 'cancelled'}
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
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={review.comment}>
                            {review.comment}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
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