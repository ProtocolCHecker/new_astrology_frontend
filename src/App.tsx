import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BirthChart from './pages/BirthChart';
import Compatibility from './pages/Compatibility';
import Predictions from './pages/Predictions';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="birth-chart" element={<BirthChart />} />
            <Route path="compatibility" element={<Compatibility />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="blog" element={<Blog />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;