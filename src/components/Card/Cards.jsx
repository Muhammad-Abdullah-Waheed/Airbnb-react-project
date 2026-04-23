import React from "react";
import Card from "./card";
import "./card.css";

const Cards = ({ list, showbuttons = false}) => {
  return (
    <div className="cards-flex">
      {list.map((card, i) => (
        <Card card={card} showButtons={showbuttons} key={i} />
      ))}
    </div>
  );
};

export default Cards;
