import React from 'react';
import './Navbar.css'; // Import CSS for styling
import logo from '../../assets/logo.png'
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LanguageIcon from "@mui/icons-material/Language";
import Menu from './menu.jsx'
import BottomNavBar from '../Navbar/bottomnavbar.jsx';
// import searchBar from '../Navbar/searchbar.jsx';

const Navbar = () => {
    return (
        <div>
            <nav className="navbar">
            <img src={logo} alt="website logo" className='nav-left' />

            <div className='nav-mid'>
                <ul>
                    <li className='mid-nav-btn'>Any where</li>
                    <li className='mid-nav-btn'>Any week</li>
                    <li className='mid-nav-btn1'>Add guests</li>
                    <li>
                        <SearchRoundedIcon className="search-icon" />
                    </li>
                </ul>
            </div>

            <div className='nav-right'>
                <div className='nav-right-home'>Airbnb your home</div>
                <div className='nav-right-lang'> <LanguageIcon sx={{ fontSize: "1.4rem"}}/></div>
                <div className='nav-profile'>
                    <div>
                    <Menu/>
                    </div>
                </div>
            </div>
        </nav>
                {/* <div className='responsive-search-bar'>
                <SearchRoundedIcon sx={{fontSize:"4rem"}}/>

                </div> */}
                <div><BottomNavBar /></div>
        </div>
    );
};

export default Navbar;
