import React from 'react'
import './index.css'
import Banner from './Components/Banner.jsx'
import Preloader from './Components/Preloading.jsx'
import Ads from './Components/Ads.jsx'
import Footer from './Components/Footer.jsx'

function App() {
  return (
    <>
      <Preloader />
      <div>
        <Banner />
        <Ads />
        <Footer />
      </div>
    </>
  );
}

export default App
