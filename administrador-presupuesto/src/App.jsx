import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './componentes/Pages/Register';
import Login from './componentes/Pages/Login';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login />} />
        {/* otras rutas si querés */}
      </Routes>
    </Router>
  )
}

export default App
