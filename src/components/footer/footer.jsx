import React from 'react';
import './footer.css'; // Assuming you'll use CSS for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section-1">
            <section class="hosting-section">
                <h3>Support</h3>
                <ul>
                    <li><a href="/Abdullah">Airbnb your home</a></li>
                    <li><a href="/Abdullah">AirCover for Hosts</a></li>
                    <li><a href="/Abdullah">Hosting resources</a></li>
                    <li><a href="/Abdullah">Community forum</a></li>
                    <li><a href="/Abdullah">Hosting responsibly</a></li>
                    <li><a href="/Abdullah">Airbnb-friendly apartments</a></li>
                    <li><a href="/Abdullah">Join a free Hosting class</a></li>
                    <li><a href="/Abdullah">Explore co-hosting</a></li>
                </ul>
            </section>

            <section class="hosting-section">
                <h3 class="section-title">Hosting</h3>
                <ul class="link-list">
                    <li><a href="/host/homes?from_footer=1">Airbnb your home</a></li>
                    <li><a href="/aircover-for-hosts">AirCover for Hosts</a></li>
                    <li><a href="/resources">Hosting resources</a></li>
                    <li><a href="/help/community?s=footer">Community forum</a></li>
                    <li><a href="/help/responsible-hosting">Hosting responsibly</a></li>
                    <li><a href="/airbnb-friendly">Airbnb-friendly apartments</a></li>
                    <li><a href="/ambassadors/joinaclass">Join a free Hosting class</a></li>
                    <li><a href="/host/co-hosts">Find a co-host</a></li>
                </ul>
            </section>

            <section class="hosting-section">
                <h3>Airbnb</h3>
                <ul class="link-list">
                    <li><a href="/press/news">Newsroom</a></li>
                    <li><a href="/release">New features</a></li>
                    <li><a href="/careers">Careers</a></li>
                    <li><a href="https://investors.airbnb.com">Investors</a></li>
                    <li><a href="/giftcards">Gift cards</a></li>
                    <li><a href="https://www.airbnb.org?locale=en">Airbnb.org emergency stays</a></li>
                </ul>
            </section>
            </div>
            <hr/>
            <section className='footer-section-2'>
                Abdullah
            </section>
        </footer>
    );
};

export default Footer;





