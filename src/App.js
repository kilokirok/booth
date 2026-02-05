import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Registration from './components/Registration';
import Scanner from './src/components/Scanner';
import Admin from './components/Admin';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '10px' }}>
        <Link to="/">Home</Link>
        <Link to="/scan">Booth Scan</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;