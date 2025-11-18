import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from './context/SocketContext.jsx'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId={clientId}>
  <AuthProvider>
  <SocketProvider>
    <App />
  </SocketProvider>
  </AuthProvider>
  </GoogleOAuthProvider>
  </BrowserRouter>
    
  
)
