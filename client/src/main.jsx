import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {FullscreenMap} from './Map.jsx'
import {RunsList} from './RunsList.jsx'
import './index.css'
import 'vite/modulepreload-polyfill'
import {
  createHashRouter,
  RouterProvider
} from 'react-router-dom';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <FullscreenMap />
      },
      {
        path: "/runs",
        element: <RunsList />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
