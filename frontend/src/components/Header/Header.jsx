import React, { useState } from "react";
import "./Header.scss";
import Logo from "../../assets/images/logo_nuevo2.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import blackLogo from "../../assets/images/logo_nuevo2.png";
import { Divider } from "@mui/material";

const Header = ({ onProfileClick, onHomeClick, onPublishClick, onDinersClick, onLogout, onLoginClick, currentView, user }) => {
  const [open, setOpen] = useState(false);
  const isHome = currentView === 'home';
  const userRole = user?.rol;

  return (
    <div className={`header ${!isHome ? 'header-compact' : ''}`}>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        {open ? <CloseIcon style={{ color: isHome ? "white" : "black" }} /> : <MenuIcon style={{ color: isHome ? "white" : "black" }} />}
      </div>
      
      <nav>
        <div className="left">
          {!isHome && (
            <img 
              src={Logo} 
              alt="logo" 
              onClick={onHomeClick} 
              style={{ 
                cursor: 'pointer', 
                height: '40px', 
                verticalAlign: 'middle'
              }} 
            />
          )}
        </div>
        <div className="right">
          {user ? (
            <>
              <span style={{ cursor: 'pointer' }} onClick={onDinersClick}>
                {userRole === 'cook' ? 'Mis Comensales' : 'Mis Mamays'}
              </span>
              {userRole === 'cook' && (
                <span style={{ cursor: 'pointer' }} onClick={onPublishClick}>
                  + Publicar Plato
                </span>
              )}
              <span style={{ cursor: 'pointer' }} onClick={onProfileClick}>Mi Perfil</span>
              <span style={{ cursor: 'pointer' }} onClick={onLogout}>Cerrar sesión</span>
            </>
          ) : (
            <span 
              style={{ 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                backgroundColor: isHome ? 'rgba(255,255,255,0.2)' : '#e83a3a',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px'
              }} 
              onClick={onLoginClick}
            >
              Registrarse / Iniciar Sesión
            </span>
          )}
        </div>
      </nav>
      
      {open && (
        <div className="sideMenu">
          <img src={blackLogo} alt="logo" onClick={() => { onHomeClick(); setOpen(false); }} style={{ cursor: 'pointer' }} />
          <div className="innerMenu">
            <span onClick={() => { onHomeClick(); setOpen(false); }}>Inicio</span>
            {user ? (
              <>
                <span>Ganancias</span>
                <span>Tips</span>
                <span>Puntos</span>
                <Divider sx={{ my: 1 }} />
                <span onClick={() => { onDinersClick(); setOpen(false); }}>
                  {userRole === 'cook' ? 'Mis Comensales' : 'Mis Mamays'}
                </span>
                {userRole === 'cook' && (
                  <span onClick={() => { onPublishClick(); setOpen(false); }}>Publicar Plato</span>
                )}
                <span onClick={() => { onProfileClick(); setOpen(false); }}>Mi Perfil</span>
                <span onClick={() => { onLogout(); setOpen(false); }}>Cerrar Sesión</span>
              </>
            ) : (
              <span 
                onClick={() => { onLoginClick(); setOpen(false); }} 
                style={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  backgroundColor: '#e83a3a',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  textAlign: 'center',
                  marginTop: '10px'
                }}
              >
                Registrarse / Iniciar Sesión
              </span>
            )}
          </div>
        </div>
      )}
      
      {isHome && (
        <div className="headerContent">
          <img src={Logo} alt="logo" onClick={onHomeClick} style={{ cursor: 'pointer' }} />
          <h3>Disfruta el sabor de casa, estés donde estés</h3>
          <div className="input">
            <input
              type="text"
              placeholder="Busca cocinas, platos saludables o menús caseros"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
