import React from "react";
import Card from "./card";
import "./card.css";

const  Cards = ({ list }) => {
  
  return (
    <div className="cards-flex mt-40" >
      {list.map((card, i) => (
        <Card card={card} key={i} />
      ))}
      
    </div>
  );
}

export default Cards;