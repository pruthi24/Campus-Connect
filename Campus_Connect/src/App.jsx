import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainApp from './MainApp';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPanel from './components/AdminPanel';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-app, #F8FAFC)',
      color: 'var(--text-heading, #0F172A)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #E2E8F0',
        borderTop: '3px solid #7A1A22',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: '16px'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: '15px', fontWeight: '600' }}>Loading Campus Connect...</div>
    </div>
  );
}

function ProtectedRoute({ children, requireAdmin }) {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (requireAdmin && userRole !== 'admin') return <Navigate to="/" replace />;
  
  return children;
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (currentUser) return <Navigate to="/" replace />;
  
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
