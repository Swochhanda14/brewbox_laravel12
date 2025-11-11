import React from 'react'
import Navbar from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import {motion} from 'motion/react'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer'

const App = () => {
  const location=useLocation();
  return (
    <>
    <Navbar />
    <div>
    <motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1}}>
      <Outlet />
      </motion.div> 
    </div>
    <ToastContainer />
    <Footer />
    </>
  )
}

export default App
