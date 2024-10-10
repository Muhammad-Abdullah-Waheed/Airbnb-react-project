import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/navbar'
import Footer from './components/footer'
import Filter from './components/filters/filter';
import { list, list2 } from "./components/Card/cardlist.js";
import Cards from './components/Card/Cards.jsx';

function App() {

  return (
    <>
      <Navbar/>
      <Filter/>
      {/* <Cards list={list}/> */}
      {/* <h1 className='experiences-heading'>Past experiences</h1> */}
      <Cards list={list2}/>
      {/* <div><Footer/></div> */}
    </>
  )
}

export default App
