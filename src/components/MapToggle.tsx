import { Button } from './ui/button'
import { Map, Grid } from 'lucide-react'

interface MapToggleProps {
  showMap: boolean
  setShowMap: (show: boolean) => void
}

export function MapToggle({ showMap, setShowMap }: MapToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={!showMap ? "default" : "outline"}
        size="sm"
        onClick={() => setShowMap(false)}
        className="flex items-center gap-2"
      >
        <Grid className="w-4 h-4" />
        List
      </Button>
      <Button
        variant={showMap ? "default" : "outline"}
        size="sm"
        onClick={() => setShowMap(true)}
        className="flex items-center gap-2"
      >
        <Map className="w-4 h-4" />
        Map
      </Button>
    </div>
  )
}