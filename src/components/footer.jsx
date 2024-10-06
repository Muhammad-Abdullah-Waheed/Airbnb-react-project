import React from 'react';
import './Footer.css'; // Assuming you'll use CSS for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <h2>Inspiration for future getaways</h2>
                <div className="footer-links">
                    <h3>Popular</h3>
                    <ul>
                        <li>Arts & culture</li>
                        <li>Outdoors</li>
                        <li>Mountains</li>
                        <li>Beach</li>
                        <li>Unique stays</li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h3>Categories</h3>
                    <ul>
                        <li>Things to do</li>
                        <li>Travel tips & inspiration</li>
                        <li>Airbnb-friendly apartments</li>
                        <li>Canmore</li>
                        <li>Chalet rentals</li>
                        <li>Benalmádena</li>
                        <li>House rentals</li>
                        <li>Marbella</li>
                        <li>Apartment rentals</li>
                        <li>Mijas</li>
                        <li>Apartment rentals</li>
                        <li>Prescott</li>
                        <li>Cabin rentals</li>
                        <li>Scottsdale</li>
                        <li>Rentals with pools</li>
                        <li>Tucson</li>
                        <li>Apartment rentals</li>
                        <li>Jasper</li>
                        <li>Cabin rentals</li>
                        <li>Mountain View</li>
                        <li>Family-friendly rentals</li>
                        <li>Devonport</li>
                        <li>Cottage rentals</li>
                        <li>Mallacoota</li>
                        <li>Beach house rentals</li>
                        <li>Ibiza</li>
                        <li>Vacation rentals</li>
                        <li>Anaheim</li>
                        <li>Apartment rentals</li>
                        <li>Monterey</li>
                        <li>Condo rentals</li>
                        <li>Paso Robles</li>
                        <li>House rentals</li>
                        <li>Santa Barbara</li>
                        <li>House rentals</li>
                        <li>Sonoma</li>
                        <li>House rentals</li>
                    </ul>
                    <button className="show-more">Show more</button>
                </div>
            </div>

            <div className="footer-section">
                <h2>Site Footer</h2>
                <div className="footer-links">
                    <h3>Support</h3>
                    <ul>
                        <li>Help Center</li>
                        <li>AirCover</li>
                        <li>Anti-discrimination</li>
                        <li>Disability support</li>
                        <li>Cancellation options</li>
                        <li>Report neighborhood concern</li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h3>Hosting</h3>
                    <ul>
                        <li>Airbnb your home</li>
                        <li>AirCover for Hosts</li>
                        <li>Hosting resources</li>
                        <li>Community forum</li>
                        <li>Hosting responsibly</li>
                        <li>Airbnb-friendly apartments</li>
                        <li>Join a free Hosting class</li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h3>Airbnb</h3>
                    <ul>
                        <li>Newsroom</li>
                        <li>New features</li>
                        <li>Careers</li>
                        <li>Investors</li>
                        <li>Gift cards</li>
                        <li>Airbnb.org emergency stays</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2024 Airbnb, Inc. · Terms · Sitemap · Privacy · Your Privacy Choices</p>
                <div className="language-currency">
                    <select>
                        <option>Choose a language</option>
                        <option>English (US)</option>
                    </select>
                    <select>
                        <option>Choose a currency</option>
                        <option>$ USD</option>
                    </select>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
