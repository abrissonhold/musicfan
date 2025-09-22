import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './pages/Index/Index.tsx'
import './style.css'
import { Search } from './pages/Search/Search.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ArtistDetails } from './pages/ArtistDetails/ArtistDetails.tsx'
import { TrackDetails } from './pages/TrackDetails/TrackDetails.tsx'
import { AlbumDetails } from './pages/AlbumDetails/AlbumDetails.tsx'
import { History } from './pages/History/History.tsx'
import { Landing } from './pages/Landing/Landing.tsx'
import { SeeMoreSearch } from './pages/SeeMoreSearch/SeeMoreSearch.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Landing />},
  { path: '/search', element: <Search />},
  { path: '/artist', element: <ArtistDetails />},
  { path: '/track', element: <TrackDetails />},
  { path: '/album', element: <AlbumDetails />},
  { path: '/history', element: <History /> },
  { path: '/index', element: <Index /> },
  { path: '/seeMore', element: <SeeMoreSearch /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
