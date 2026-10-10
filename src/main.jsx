import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'lenis/dist/lenis.css'
import App from './App.jsx'
import SmoothScroll from './SmoothScroll.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SmoothScroll />
    <App />
  </StrictMode>,
)
