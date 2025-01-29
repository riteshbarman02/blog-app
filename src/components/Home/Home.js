import React from 'react'
import './Home.scss'
import Three from '../threejs/Three'

const Home = () => {
  return (
    <div className='home'>
        <Three/>
        <div className='blur'></div>
    </div>
  )
}

export default Home