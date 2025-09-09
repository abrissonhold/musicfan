import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './pages/Index/Index.tsx'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)
