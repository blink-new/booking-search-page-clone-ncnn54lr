import { Button } from './ui/button'
import { Globe, Menu, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              Booking.com
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Stays
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Flights
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Car rentals
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Attractions
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Airport taxis
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Globe className="w-4 h-4 mr-2" />
              USD
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              List your property
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Sign in
            </Button>
            <Button className="md:hidden" variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}