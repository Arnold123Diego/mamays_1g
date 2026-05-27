import React from "react";
import "./Collection.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import collection1 from "../../assets/images/collection1.webp";
import collection2 from "../../assets/images/collection2.webp";
import collection3 from "../../assets/images/collection3.webp";
import collection4 from "../../assets/images/collection4.webp";

const Collection = () => {
  return (
    <div className="collection">
      <h1>Colecciones</h1>
      <div className="collectionText">
        <p>
          Explora nuestras selecciones de comida saludable, opciones caseras y
          los mejores planes nutricionales de la ciudad.
        </p>
        <span>
          Ver todas las colecciones <ArrowRightIcon />
        </span>
      </div>
      <div className="collectionCard">
        <div className="collectionImg">
          <img src={collection1} alt="img" />
          <h3>Top 10 Platos Saludables</h3>
          <span>
            10 Opciones <ArrowRightIcon />
          </span>
        </div>
        <div className="collectionImg">
          <img src={collection2} alt="img2" />
          <h3>Menús del Día Caseros</h3>
          <span>
            15 Lugares <ArrowRightIcon />
          </span>
        </div>
        <div className="collectionImg">
          <img src={collection3} alt="img4" />
          <h3>Desayunos Nutritivos</h3>
          <span>
            8 Opciones <ArrowRightIcon />
          </span>
        </div>
        <div className="collectionImg">
          <img src={collection4} alt="img4" />
          <h3>Cenas Ligeras y Rápidas</h3>
          <span>
            12 Opciones <ArrowRightIcon />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Collection;
