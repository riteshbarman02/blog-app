import React from 'react'
import './styles/app.scss'
import Navbar from './components/navbar/Navbar'
import Home from './components/Home/Home'

const App = () => {
  return (
    <div className='main'>  
      <Navbar />
      <Home/>
    </div>
  )
}

export default App