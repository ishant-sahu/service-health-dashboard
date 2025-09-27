import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ServiceHealthDashboard from './components/ServiceHealthDashboard';

export default function App(): React.JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ServiceHealthDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
