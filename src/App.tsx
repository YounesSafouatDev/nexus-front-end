// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Acceuil from './pages/Acceuil';
import Dashboard from './pages/Dashboard';
import SheetIn from './pages/SheetIn';

const App: React.FC = () => {
  return (
    <div className='h-screen bg-gray-100'>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/acceuil" element={<Acceuil />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sheet-in" element={<SheetIn />} />
        <Route path="*" element={<SignIn />} />
      </Routes>
    </div>
  );
};

export default App;
