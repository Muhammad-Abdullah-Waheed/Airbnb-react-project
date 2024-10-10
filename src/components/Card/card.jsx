import React from "react";
import "./card.css";
const Card = ({ card }) => {
    return (
        <div className="card-container">
            <div className="card-image-container">
                {card.imgSrc.map((src, i) => (
                    <img src={src} className="card-image" alt={`slide ${i}`} />
                ))}
            </div>

            <div className="card-details">
                <h5 className="card-heading">{card.heading}</h5>
                <p className="discription">{card.discription}</p>
                <h4 className="card-heading">{card.isSold}</h4>
            </div>
        </div>
    );
};

export default Card;
