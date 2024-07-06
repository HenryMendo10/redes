// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Asegúrate de importar Routes y Route correctamente

import 'bootstrap/dist/css/bootstrap.min.css'

import Inicio from './components/rutas/Inicio';
import LivePrice from './components/rutas/LivePrice';
import Portafolio from './components/rutas/Portafolio';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/portafolio" element={<Portafolio />} />
        <Route path="/liveprice" element={<LivePrice />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
