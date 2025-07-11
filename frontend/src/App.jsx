import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Summary.jsx'; // your main dashboard
import Forecast from './pages/Forecast.jsx'; // your ML forecast page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/forecast" element={<Forecast />} />
    </Routes>
  );
}

export default App;
