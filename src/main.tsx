import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './pages/Index/Index.tsx'
import './style.css'
import { Search } from './pages/Search/Search.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <Index />},
  { path: '/search', element: <Search />}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
