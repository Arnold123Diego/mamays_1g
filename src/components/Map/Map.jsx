import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir iconos de Leaflet (problema común en React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  // Posición inicial centrada en Puno
  const position = [-15.8402, -70.0219];

  // Datos de prueba (luego vendrán del backend)
  const kitchens = [
    { id: 1, name: "Sabor de Mamá María", pos: [-15.8420, -70.0250], dish: "Chairo Puneño" },
    { id: 2, name: "Cocina de Doña Juana", pos: [-15.8380, -70.0180], dish: "Trucha Frita" }
  ];

  return (
    <div style={{ height: '400px', width: '100%', padding: '20px 200px', backgroundColor: '#e83a3a' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Mapa de Sabores en Puno</h2>
      <MapContainer center={position} zoom={14} scrollWheelZoom={false} style={{ height: '100%', borderRadius: '15px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {kitchens.map(k => (
          <Marker key={k.id} position={k.pos}>
            <Popup>
              <strong>{k.name}</strong> <br /> 
              Hoy: {k.dish}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
