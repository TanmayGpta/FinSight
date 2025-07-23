import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Forecast from './pages/Forecast.jsx'; 
import Client from './pages/Client.jsx';
import Login from './pages/Login.jsx';
import Branches
 from './pages/Branches.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/forecast" element={<Forecast />} />
      <Route path="/clients" element={<Client />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Branches" element={<Branches />} />
    </Routes>
  );
}

export default App;
