import React from "react";
import "./card.css";

const Card = ({ card }) => {
    return (
        <div className="card-container">
            <div className="card-image-container">
                {card.imgSrc.map((src, i) => (
                    <img key={i} src={src} className="card-image" alt={`slide ${i}`} />
                ))}
            </div>
            <div className="card-details">
                {/* <h5 className="card-heading">{card.heading}</h5> */}
                <h5 className="card-heading">Abdullah</h5>

                <p className="card-description">Abdullah</p>
                {card.isSold && <h4 className="card-status">Sold</h4>}
            </div>
        </div>
    );
};

export default Card;
