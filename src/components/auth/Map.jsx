// MapComponent.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Custom hook to set the map's style


const MapComponent = () => {
  const [position, setPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>Your current location</Popup>
        </Marker>

      </MapContainer>
    </div>
  );
};

export default MapComponent;
