import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './pages/Index/Index.tsx'
import './style.css'
import { Search } from './pages/Search/Search.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ArtistDetails } from './pages/ArtistDetails/ArtistDetails.tsx'
import { TrackDetails } from './pages/TrackDetails/TrackDetails.tsx'
import { AlbumDetails } from './pages/AlbumDetails/AlbumDetails.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Index />},
  { path: '/search', element: <Search />},
  { path: '/artist', element: <ArtistDetails />},
  { path: '/track', element: <TrackDetails />},
  { path: '/album', element: <AlbumDetails />},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
