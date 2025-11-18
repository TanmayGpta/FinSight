import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Forecast from './pages/Forecast.jsx'; 
import Client from './pages/Client.jsx';
import Login from './pages/Login.jsx';
import Branches from './pages/Branches.jsx';
import RegionalMapPage from './pages/Regions.jsx';
import Chatbot from './pages/chatbot.jsx';
function App() {
  return (
    <Routes>
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/forecast" element={<Forecast />} />
      <Route path="/clients" element={<Client />} />
      <Route path="/" element={<Login />} />
      <Route path="/Branches" element={<Branches />} />
      <Route path="/region" element={<RegionalMapPage />} />
      <Route path="/chatbot" element={<Chatbot />} />
    </Routes>
  );
}

export default App;
