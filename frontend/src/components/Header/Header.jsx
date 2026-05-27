import React, { useState } from "react";
import "./Header.scss";
import Logo from "../../assets/images/logo_nuevo2.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import blackLogo from "../../assets/images/logo_nuevo2.png";
import { Divider } from "@mui/material";

const Header = ({ onProfileClick, onHomeClick, onPublishClick, onDinersClick, onLogout, currentView, userRole }) => {
  const [open, setOpen] = useState(false);
  const isHome = currentView === 'home';

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
          <span style={{ cursor: 'pointer' }} onClick={onDinersClick}>
            {userRole === 'cook' ? 'Mis Comensales' : 'Mis Mamays'}
          </span>          {userRole === 'cook' && (
            <span 
              style={{ cursor: 'pointer' }} 
              onClick={onPublishClick}
            >
              + Publicar Plato
            </span>
          )}
          <span style={{ cursor: 'pointer' }} onClick={onProfileClick}>Mi Perfil</span>
          <span style={{ cursor: 'pointer' }} onClick={onLogout}>Cerrar sesión</span>
        </div>
      </nav>
      
      {open && (
        <div className="sideMenu">
          <img src={blackLogo} alt="logo" onClick={() => { onHomeClick(); setOpen(false); }} style={{ cursor: 'pointer' }} />
          <div className="innerMenu">
            <span onClick={() => { onHomeClick(); setOpen(false); }}>Inicio</span>
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
