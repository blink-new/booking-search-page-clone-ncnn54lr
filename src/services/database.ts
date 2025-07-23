import { blink } from '../blink/client'
import type { Hotel, Room, Reservation, Review, Manager } from '../types/models'

// Hotel operations
export const hotelService = {
  async getAll(): Promise<Hotel[]> {
    return await blink.db.hotels.list({
      orderBy: { created_at: 'desc' }
    })
  },

  async getById(id: string): Promise<Hotel | null> {
    const hotels = await blink.db.hotels.list({
      where: { id },
      limit: 1
    })
    return hotels[0] || null
  },

  async create(hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>): Promise<Hotel> {
    return await blink.db.hotels.create({
      ...hotel,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  async update(id: string, updates: Partial<Hotel>): Promise<void> {
    await blink.db.hotels.update(id, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  },

  async delete(id: string): Promise<void> {
    await blink.db.hotels.delete(id)
  }
}

// Room operations
export const roomService = {
  async getAll(): Promise<Room[]> {
    return await blink.db.rooms.list({
      orderBy: { created_at: 'desc' }
    })
  },

  async getByHotelId(hotelId: string): Promise<Room[]> {
    return await blink.db.rooms.list({
      where: { hotel_id: hotelId },
      orderBy: { price_per_night: 'asc' }
    })
  },

  async create(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> {
    return await blink.db.rooms.create({
      ...room,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  async update(id: string, updates: Partial<Room>): Promise<void> {
    await blink.db.rooms.update(id, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  },

  async delete(id: string): Promise<void> {
    await blink.db.rooms.delete(id)
  }
}

// Reservation operations
export const reservationService = {
  async getAll(): Promise<Reservation[]> {
    return await blink.db.reservations.list({
      orderBy: { created_at: 'desc' }
    })
  },

  async getByUserId(userId: string): Promise<Reservation[]> {
    return await blink.db.reservations.list({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })
  },

  async create(reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>): Promise<Reservation> {
    return await blink.db.reservations.create({
      ...reservation,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  async update(id: string, updates: Partial<Reservation>): Promise<void> {
    await blink.db.reservations.update(id, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  },

  async delete(id: string): Promise<void> {
    await blink.db.reservations.delete(id)
  }
}

// Review operations
export const reviewService = {
  async getAll(): Promise<Review[]> {
    return await blink.db.reviews.list({
      orderBy: { created_at: 'desc' }
    })
  },

  async getByHotelId(hotelId: string): Promise<Review[]> {
    return await blink.db.reviews.list({
      where: { hotel_id: hotelId },
      orderBy: { created_at: 'desc' }
    })
  },

  async create(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    return await blink.db.reviews.create({
      ...review,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  async update(id: string, updates: Partial<Review>): Promise<void> {
    await blink.db.reviews.update(id, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  },

  async delete(id: string): Promise<void> {
    await blink.db.reviews.delete(id)
  }
}

// Manager operations
export const managerService = {
  async getAll(): Promise<Manager[]> {
    return await blink.db.managers.list({
      orderBy: { created_at: 'desc' }
    })
  },

  async getByHotelId(hotelId: string): Promise<Manager[]> {
    return await blink.db.managers.list({
      where: { hotel_id: hotelId }
    })
  },

  async create(manager: Omit<Manager, 'id' | 'created_at' | 'updated_at'>): Promise<Manager> {
    return await blink.db.managers.create({
      ...manager,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  },

  async update(id: string, updates: Partial<Manager>): Promise<void> {
    await blink.db.managers.update(id, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  },

  async delete(id: string): Promise<void> {
    await blink.db.managers.delete(id)
  }
}