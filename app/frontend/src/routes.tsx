import { createBrowserRouter } from 'react-router-dom'

import Config from './pages/Config'
import Home from './pages/Home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/config',
    element: <Config />,
  },
])
