import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import StorePage from './components/StorePage';
import AdminPage from './components/AdminPage';
import CartPage from './components/CartPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import AnimatedPage from './components/AnimatedPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/store/:storeId" element={<AnimatedPage><StorePage /></AnimatedPage>} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AnimatedPage><AdminPage /></AnimatedPage>
              </ProtectedRoute>
            } 
          />
          <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <AnimatedPage><OrderHistoryPage /></AnimatedPage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;