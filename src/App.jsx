import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import Winners from './components/Winners';
import Admin from './components/Admin';
import { UserProvider } from './UserContext';

export default function App(){
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/winners" element={<Winners />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}
