import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/navbar'
import Footer from './components/footer'
import Filter from './components/filters/filter';

function App() {

  return (
    <>
      <Navbar/>
      <Filter/>
      {/* <div><Footer/></div> */}
    </>
  )
}

export default App
