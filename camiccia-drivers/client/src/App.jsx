import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import './App.css'
import Home from './components/Home/Home'
import LandingPage from './components/LandingPage/LandingPage'
import Detail from "./components/Detail/Detail"
import DriverCreate from "./components/FormCreate/DriverCreate"
import About from "./components/About/About"
import Escuderias from "./components/Escuderias/Escuderias"

function App() {
  return (    
      <div id="app">
        <Routes>
          <Route path='/' element={<LandingPage/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/detail/:id' element={<Detail/>}></Route>
          <Route path='/driver' element={<DriverCreate/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/teams' element={<Escuderias/>}></Route>
          
        </Routes>
      </div>
  )
}

export default App;
