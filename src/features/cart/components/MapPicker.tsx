import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapPin, X } from 'lucide-react'

// Leaflet referencia sus iconos por defecto con URLs relativas que no
// resuelven bien con el bundler de Vite — hay que apuntarlos manualmente
// a los assets ya importados (patrón estándar al usar leaflet sin
// react-leaflet en un proyecto Vite).
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Centro por defecto: Ciudad de México. Es solo el punto de partida del
// mapa antes de que el usuario haga clic o se use su geolocalización —
// no se usa para nada si el usuario no interactúa.
const DEFAULT_CENTER: [number, number] = [19.4326, -99.1332]
const DEFAULT_ZOOM = 12
const PIN_ZOOM = 16

export interface MapCoords {
  lat: number
  lon: number
}

interface MapPickerProps {
  value: MapCoords | null
  onChange: (coords: MapCoords | null) => void
  disabled?: boolean
}

/**
 * Selector de ubicación en mapa (Web Services de Terceros — frontend):
 * usa Leaflet + tiles de OpenStreetMap, ambos gratuitos y sin API key,
 * consistente con el geocoder de Nominatim (también OSM) que ya usa el
 * backend al crear el pedido.
 *
 * Es opcional: la dirección escrita en el formulario sigue siendo el
 * campo obligatorio que se manda a WhatsApp. Si el usuario fija un pin
 * aquí, mandamos esas coordenadas exactas junto con el pedido; si no,
 * el backend intenta geocodificar el texto de la dirección como respaldo.
 */
export function MapPicker({ value, onChange, disabled = false }: MapPickerProps) {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const onChangeRef = useRef(onChange)

  // Mantiene la ref al día con la última `onChange` sin volver a montar el
  // mapa (por eso no está en las dependencias del efecto de abajo).
  // Escribir la ref en un efecto (no durante el render) es lo que exige
  // eslint-plugin-react-hooks v7 (regla react-hooks/refs).
  useEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    if (!expanded || !containerRef.current || mapRef.current) return

    const initialCenter: [number, number] = value ? [value.lat, value.lon] : DEFAULT_CENTER
    const map = L.map(containerRef.current).setView(initialCenter, value ? PIN_ZOOM : DEFAULT_ZOOM)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const placeMarker = (lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng], { icon: defaultIcon, draggable: !disabled }).addTo(map)
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng()
          onChangeRef.current({ lat: pos.lat, lon: pos.lng })
        })
      }
      onChangeRef.current({ lat, lon: lng })
    }

    if (value) {
      placeMarker(value.lat, value.lon)
    }

    if (!disabled) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        placeMarker(e.latlng.lat, e.latlng.lng)
      })
    }

    // Si el navegador da permiso, centramos en la ubicación real del
    // usuario para ahorrarle tener que buscar su calle manualmente. Si
    // el usuario ya había fijado un pin, no lo movemos.
    if (!value && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mapRef.current) return
          const { latitude, longitude } = position.coords
          mapRef.current.setView([latitude, longitude], PIN_ZOOM)
        },
        () => {
          // Permiso denegado o no disponible: nos quedamos con el centro
          // por defecto, no es un error que deba interrumpir el flujo.
        },
        { timeout: 5000 },
      )
    }

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // Deliberadamente solo depende de `expanded`/`disabled`: `value` se lee
    // una sola vez al abrir el mapa (posición inicial del pin, si ya
    // existía). Los clics/arrastres actualizan el marcador de forma
    // imperativa vía Leaflet — si `value` estuviera en las dependencias,
    // cada cambio de coordenadas destruiría y recrearía el mapa entero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, disabled])

  const clearPin = () => {
    onChange(null)
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        disabled={disabled}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MapPin size={16} />
        Fijar mi ubicación exacta en el mapa (opcional)
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-beige/80 flex items-center gap-1.5">
          <MapPin size={14} /> Toca el mapa para fijar tu ubicación
        </span>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-beige/50 hover:text-beige transition-colors"
          aria-label="Cerrar mapa"
        >
          <X size={16} />
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-64 rounded-btn overflow-hidden border border-dark-border"
      />

      <div className="flex items-center justify-between text-xs text-beige/60">
        {value ? (
          <>
            <span>
              Ubicación fijada: {value.lat.toFixed(5)}, {value.lon.toFixed(5)}
            </span>
            <button
              type="button"
              onClick={clearPin}
              className="text-red-400/80 hover:text-red-400 transition-colors"
            >
              Quitar pin
            </button>
          </>
        ) : (
          <span>Ningún pin fijado — se usará solo la dirección escrita arriba.</span>
        )}
      </div>
    </div>
  )
}
