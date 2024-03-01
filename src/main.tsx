import './global.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="305531398488-tanqn5os6nurkrst828gpeh2poio1jl4.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>;
  </React.StrictMode>,
)
