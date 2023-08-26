import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './app.tsx'
import './index.css'
import Providers from './providers/Providers.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
)
