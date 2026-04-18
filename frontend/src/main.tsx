//% frontend/src/main.tsx
//? Rendu de l'application sur le DOM - index.html via id="root"

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router.tsx'

import { AppProvider } from './context/AppContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </AppProvider>
)
