import React from 'react';
import './Navbar.css'; // Assuming you'll use CSS for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src="logo.png" alt="Airbnb Logo" className="logo" />
      </div>
      <div className="navbar__links">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/experiences">Experiences</a></li>
          <li><a href="/online-experiences">Online Experiences</a></li>
        </ul>
      </div>
      <div className="navbar__user-menu">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Signup</button>
      </div>
    </nav>
  );
};

export default Navbar;
