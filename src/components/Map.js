import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Icon } from 'leaflet';

// Custom component to handle zoom controls
function MapWithoutZoomControl() {
  const map = useMap();

  useEffect(() => {
    // Remove default zoom controls
    map.zoomControl.remove();

    // Optionally add custom zoom controls if needed
    const zoomControl = L.control.zoom({ position: 'topright' });
    zoomControl.addTo(map);
  }, [map]);

  return null;
}

function MyMap() {
  const [position, setPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  const markerIcon = new Icon({
    iconUrl: 'https://example.com/my-icon.png', // Replace with your icon URL
    iconSize: [25, 25],
  });

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={markerIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      <MapWithoutZoomControl />
    </MapContainer>
  );
}

export default MyMap;
