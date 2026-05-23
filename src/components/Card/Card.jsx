import React from "react";
import "./Card.scss";
import Dine from "../../assets/images/Dine-Out.png";
import Night from "../../assets/images/Night-Life.png";
import Online from "../../assets/images/Online-Food.png";

const Card = () => {
  return (
    <div className="card">
      <div className="cardImg">
        <img src={Online} alt="onlineImg" />
        <h1>Alimentación Saludable</h1>
        <span>Comida nutritiva y balanceada a tu puerta</span>
      </div>
      <div className="cardImg">
        <img src={Dine} alt="dineImg" />
        <h1>Comida Casera</h1>
        <span>El sabor de mamá, listo para disfrutar</span>
      </div>
      <div className="cardImg">
        <img src={Night} alt="nightImg" />
        <h1>Planes Nutricionales</h1>
        <span>Suscripciones adaptadas a tus necesidades</span>
      </div>
    </div>
  );
};

export default Card;
