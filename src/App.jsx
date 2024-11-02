import './App.css'
import Navbar from './components/Navbar/navbar'
import Footer from './components/footer/footer.jsx'
import Filter from './components/filters/filter';
import { list, list2 } from "./components/Card/cardlist.js";
import Cards from './components/Card/Cards.jsx';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import homePage from './pages/home.jsx';
import loginPage from './pages/login.jsx';
import layout from './layout.jsx';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<layout/>}>
        <Route index element={<homePage />}/> 
        <Route path='/login' element={<loginPage />}/>
        </Route>
        
      </Routes>

      <Navbar/>
      <Filter/>
      {/* <Cards list={list}/> */}
      {/* <h1 className='experiences-heading'>Past experiences</h1> */}
      <Cards list={list2}/>
      <div><Footer/></div>
    </>
  )
}

export default App


