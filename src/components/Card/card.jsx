import React from "react";
import "./card.css";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // This might also need to be updated based on your version
import { Pagination } from "swiper/modules";
import { Navigation } from "swiper/modules"; // Updated Navigation import

const Card = ({ card }) => {
    return (
        <div className="cards-container">
            <Swiper
                slidesPerView={1}
                spaceBetween={15}
                loop={true}
                mousewheel={true}
                cssMode={true}
                pagination
                modules={[Pagination, Navigation]} // Ensure both are imported correctly
                className="swiper-wrapper"
            >
                {card.imgSrc.map((src, i) => (
                    <SwiperSlide key={i}>
                        <img src={src} className="card-image" alt={`slide ${i}`} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="card-details">
                <div>
                    <h3 className="card-heading">{card.heading}</h3>
                    <p className="discription">{card.description}</p>
                    <h3 className="card-heading">{card.isSold}</h3>
                </div>
            </div>
        </div>
    );
};

export default Card;
