import React from 'react'
import Filter from '../components/filters/filter';
import { list, list2 } from "../components/Card/cardlist";
import Footer from "../components/footer/footer";
import Cards from "../components/Card/Cards.jsx";
import Navbar from "../components/Navbar/navbar";
const HomePage = () => {
  return (
    <div className='flex flex-col'>
        <Navbar/>
        <Filter/>
        <Cards list={list2}/>
        <div><Footer/></div>
    </div>
  )
}

export default HomePage;
