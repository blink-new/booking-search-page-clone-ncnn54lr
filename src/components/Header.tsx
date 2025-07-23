import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Globe, Menu, User, Settings } from 'lucide-react'
import { blink } from '../blink/client'

interface User {
  id: string
  email: string
  displayName?: string
}

interface HeaderProps {
  onAdminClick?: () => void
}

export function Header({ onAdminClick }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleSignIn = () => {
    blink.auth.login()
  }

  const handleSignOut = () => {
    blink.auth.logout()
  }

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
            
            {loading ? (
              <Button variant="outline" size="sm" disabled>
                Loading...
              </Button>
            ) : user ? (
              <div className="flex items-center space-x-2">
                {onAdminClick && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onAdminClick}
                    className="hidden md:flex"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <User className="w-4 h-4 mr-2" />
                  {user.displayName || user.email} - Sign out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={handleSignIn}>
                <User className="w-4 h-4 mr-2" />
                Sign in
              </Button>
            )}
            
            <Button className="md:hidden" variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}