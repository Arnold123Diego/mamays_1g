import React from "react";
import "./AccContainer.scss";
import Accordian from "../Accordian/Accordian";
import data from "../../data";

const AccContainer = () => {
  return (
    <div className="accContainer">
      <h2>Explora opciones cerca de mí</h2>
      {data.map((question) => (
        <Accordian question={question} key={question.id} />
      ))}
    </div>
  );
};

export default AccContainer;
