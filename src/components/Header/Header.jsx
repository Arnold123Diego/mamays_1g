import React, { useState } from "react";
import "./Header.scss";
import Logo from "../../assets/images/mamays-logo-1.jpg";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import blackLogo from "../../assets/images/mamays-logo-2.jpg";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="header">
      <nav>
        <span>Descarga la App</span>
        <div className="right">
          <span>Relación con Inversores</span>
          <span>Suma tu cocina</span>
          <span>Iniciar sesión</span>
          <span>Registrarse</span>
        </div>
      </nav>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        {open ? <CloseIcon style={{ color: "black" }} /> : <MenuIcon />}
      </div>
      {open && (
        <div className="sideMenu">
          <img src={blackLogo} alt="logo" />
          <div className="innerMenu">
            <span>Relación con Inversores</span>
            <span>Suma tu cocina</span>
            <span>Iniciar Sesión</span>
            <span>Registrarse</span>
          </div>
        </div>
      )}
      <div className="headerContent">
        <img src={Logo} alt="logo" />
        <h3>Descubre la mejor comida casera y saludable</h3>
        <div className="input">
          <select name="" id="">
            <option value="Lima">Lima</option>
            <option value="Santiago">Santiago</option>
            <option value="Bogota">Bogotá</option>
            <option value="Mexico">Ciudad de México</option>
            <option value="BuenosAires">Buenos Aires</option>
          </select>
          |
          <input
            type="text"
            placeholder="Busca cocinas, platos saludables o menús caseros"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
