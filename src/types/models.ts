// Hotel model
export interface Hotel {
  id: string
  name: string
  description: string
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  star_rating: number
  amenities: string[] // JSON array of amenities
  images: string[] // JSON array of image URLs
  phone: string
  email: string
  website?: string
  check_in_time: string
  check_out_time: string
  policies: string
  created_at: string
  updated_at: string
}

// Room model
export interface Room {
  id: string
  hotel_id: string
  room_type: string
  description: string
  price_per_night: number
  max_occupancy: number
  bed_type: string
  room_size: number
  amenities: string[] // JSON array of room-specific amenities
  images: string[] // JSON array of room image URLs
  is_available: boolean
  created_at: string
  updated_at: string
}

// Reservation model
export interface Reservation {
  id: string
  user_id: string
  hotel_id: string
  room_id: string
  check_in_date: string
  check_out_date: string
  guest_count: number
  guest_name: string
  guest_email: string
  guest_phone: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  special_requests?: string
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

// Review model
export interface Review {
  id: string
  hotel_id: string
  user_id: string
  reservation_id?: string
  rating: number // 1-10 scale
  title: string
  comment: string
  reviewer_name: string
  reviewer_country?: string
  stay_date: string
  room_type?: string
  is_verified: boolean
  helpful_votes: number
  created_at: string
  updated_at: string
}

// Manager model
export interface Manager {
  id: string
  hotel_id: string
  user_id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'staff'
  permissions: string[] // JSON array of permissions
  created_at: string
  updated_at: string
}