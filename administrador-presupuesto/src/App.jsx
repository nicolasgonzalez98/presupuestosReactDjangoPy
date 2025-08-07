import { Routes, Route } from 'react-router-dom';
import Register from './componentes/Pages/Register';
import Login from './componentes/Pages/Login';
import Home from './componentes/Pages/Home';
import Navbar from './componentes/NavBar';

function App() {

  return (
    (
    <>

      <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* otras rutas si querés */}
        </Routes>
    </>
    )
  )
}

export default App
