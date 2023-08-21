import { Navigate, Route, Routes } from 'react-router-dom'

import Config from './pages/Config'
import Home from './pages/Home'
import useAuthStore from './store/authStore'

export default function App() {
  const { token } = useAuthStore((store) => store.store)

  return (
    <Routes>
      <Route
        path="/config"
        element={token ? <Config /> : <Navigate to="/" />}
      />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
