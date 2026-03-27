import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix para el icono del marcador en Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
const LocationMarker = ({ position, onPositionChange }) => {
  const mapEvents = useMapEvents({
    click(e) {
      onPositionChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    },
  });

  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = marker.getLatLng();
          onPositionChange({
            lat: newPos.lat,
            lng: newPos.lng
          });
        },
      }}
    />
  ) : null;
};

const MapPicker = ({ initialPosition, onLocationChange, height = '400px' }) => {
  // Posición por defecto (Ciudad de México)
  const defaultPosition = {
    lat: 19.4326,
    lng: -99.1332
  };

  const [position, setPosition] = useState(initialPosition || defaultPosition);
  const [loading, setLoading] = useState(false);

  // Actualizar posición cuando cambia el prop
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  // Función para actualizar posición y notificar al padre
  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    if (onLocationChange) {
      onLocationChange(newPosition);
    }
  };

  // Obtener ubicación actual del usuario
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setLoading(false);
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización');
    }
  };

  return (
    <div className="map-picker">
      <div className="map-picker-header">
        <h3>📍 Ubicación de la Mascota</h3>
        <button 
          type="button"
          className="current-location-btn"
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading ? '⏳ Obteniendo...' : '📍 Usar mi ubicación actual'}
        </button>
      </div>

      <div className="map-container" style={{ height }}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          <LocationMarker position={position} onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>

      <div className="map-info">
        <div className="coordinates">
          <strong>Coordenadas:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
        <div className="map-instructions">
          💡 <strong>Tip:</strong> Haz clic en el mapa o arrastra el pin para seleccionar la ubicación exacta
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
