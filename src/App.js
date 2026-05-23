import React from "react";
import Header from "./components/Header/Header";
import "./app.scss";
import Footer from "./components/Footer/Footer";
import AccContainer from "./components/AccContainer/AccContainer";
import CTA from "./components/CTA/CTA";
import Cities from "./components/Cities/Cities";
import Collection from "./components/Collections/Collection";
import Card from "./components/Card/Card";
import Map from "./components/Map/Map";
import { useState } from "react";

function App() {
  const [userRole, setUserRole] = useState(null); // 'buyer', 'cook', 'admin'

  if (!userRole) {
    return (
      <div className="App" style={{ backgroundColor: '#e83a3a', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '40px' }}>Bienvenido a Mamays Puno</h1>
        <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>¿Cómo quieres participar hoy?</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => setUserRole('buyer')} style={{ padding: '20px 40px', fontSize: '1.2rem', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: 'white', color: '#e83a3a', fontWeight: 'bold' }}>Quiero Comer (Comprador)</button>
          <button onClick={() => setUserRole('cook')} style={{ padding: '20px 40px', fontSize: '1.2rem', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: 'white', color: '#e83a3a', fontWeight: 'bold' }}>Quiero Cocinar (Ama de Casa)</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <div style={{ padding: '10px', textAlign: 'center', backgroundColor: 'white', color: '#e83a3a' }}>
        <strong>Modo: {userRole === 'buyer' ? 'Buscando comida casera' : 'Gestionando mi cocina'}</strong>
        <button onClick={() => setUserRole(null)} style={{ marginLeft: '20px', background: 'none', border: '1px solid #e83a3a', cursor: 'pointer', borderRadius: '5px' }}>Cambiar</button>
      </div>
      <Card />
      <Map />
      <Collection />
      <Cities />
      <CTA />
      <AccContainer />
      <Footer />
    </div>
  );
}

export default App;
