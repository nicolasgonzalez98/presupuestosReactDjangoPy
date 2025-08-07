import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';                // Estilos de componentes
import 'primeicons/primeicons.css';                              // Iconos
import './index.css';                                            // Tailwind (si lo usás ahí)
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { MovimientosProvider } from './hooks/useMovimientos.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MovimientosProvider>
          <App />
        </MovimientosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
