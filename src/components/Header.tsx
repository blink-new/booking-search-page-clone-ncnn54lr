import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { User, Settings, LogOut, Shield } from 'lucide-react'
import { blink } from '../blink/client'

interface HeaderProps {
  onAdminClick: () => void
}

export function Header({ onAdminClick }: HeaderProps) {
  const [user, setUser] = useState<any>(null)
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
    <header className="bg-booking-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">
              Booking.com
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-blue-200 transition-colors">Stays</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Flights</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Car rentals</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Attractions</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Airport taxis</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="text-sm">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* User Info Display */}
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium">
                    Welcome, {user.displayName || user.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-blue-200">
                    {user.email}
                  </div>
                </div>

                {/* Admin Dashboard Button */}
                <Button
                  onClick={onAdminClick}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-booking-primary"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-booking-primary"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <div className="font-medium">{user.displayName || 'User'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {user.id?.slice(0, 8)}...
                      </div>
                    </div>
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleSignIn}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-booking-primary"
                >
                  Sign in
                </Button>
                <Button
                  onClick={handleSignIn}
                  size="sm"
                  className="bg-white text-booking-primary hover:bg-gray-100"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Currency and Language */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <button className="hover:text-blue-200 transition-colors">USD</button>
              <span className="text-blue-300">|</span>
              <button className="hover:text-blue-200 transition-colors">EN</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}