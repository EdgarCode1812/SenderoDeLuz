import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage'
import Noticias from './pages/Noticias'
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import { LocalStorageService } from './services/LocalStorageService';
import Home from './pages/Home';

function App() {

  useEffect(() => {
    // Verificar la expiración del token al cargar la aplicación
    const isTokenExpired = LocalStorageService.isTokenExpired();
    
    if (isTokenExpired) {
      LocalStorageService.signOut(); // Borra los datos de la sesión
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/Login' element={<LoginPage />} />
          <Route path='/Noticias' element={<Noticias />} />
          <Route path='/' element={<Home />} />
          <Route element={<ProtectedRoute redirection='/Login'/>}>
            <Route path='/PanelDeControl' element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
