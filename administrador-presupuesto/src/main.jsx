import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';                // Estilos de componentes
import 'primeicons/primeicons.css';                              // Iconos
import './index.css';                                            // Tailwind (si lo usás ahí)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
