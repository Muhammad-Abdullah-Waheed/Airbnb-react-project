import React from 'react';
import './Footer.css'; // Assuming you'll use CSS for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section-1">
                <h2>Inspiration for future getaways</h2>
                <div className="footer-links">
                    <ul className="footer-section-1-ul">
                        <li>Popular</li>
                        <li>Arts & culture</li>
                        <li>Outdoors</li>
                        <li>Mountains</li>
                        <li>Beach</li>
                        <li>Unique stays</li>
                        <li>Things to do</li>
                        <li>Travel tips & inspiration</li>
                        <li>Airbnb-friendly apartments</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
