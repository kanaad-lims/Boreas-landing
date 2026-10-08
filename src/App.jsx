import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import DemoVideo from './components/DemoVideo'
import Features from './components/Features'
import Loop from './components/Loop'
import Install from './components/Install'
import Connect from './components/Connect'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="atmos" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <Nav />
      <main>
        <Hero />
        <Ticker />
        <DemoVideo />
        <Features />
        <Loop />
        <Install />
        <Connect />
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default App
