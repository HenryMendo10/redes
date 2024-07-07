// Importa la biblioteca React
import React from 'react';
// Importa la biblioteca ReactDOM para manipular el DOM
import ReactDOM from 'react-dom';
// Importa componentes necesarios de react-router-dom para el enrutamiento
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

// Importa los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa los componentes de las rutas
import Inicio from './components/rutas/Inicio';
import LivePrice from './components/rutas/LivePrice';
import Portafolio from './components/rutas/Portafolio';

// Renderiza la aplicación en el elemento con id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  // Activa el modo estricto de React para ayudar a identificar problemas
  <React.StrictMode>
    {/* Configura el enrutador */}
    <Router>
      {/* Define las rutas de la aplicación */}
      <Routes>

        <Route path="/" element={<Inicio />} />

        <Route path="/portafolio" element={<Portafolio />} />
        <Route path="/liveprice" element={<LivePrice />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
