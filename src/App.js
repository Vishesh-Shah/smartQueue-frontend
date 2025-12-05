import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';

// Components
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import EventDetails from './components/EventDetails';
import Ticket from './components/Ticket';
import AdminLogin from './components/AdminLogin';
import AdminSignup from './components/AdminSignup';
import AdminDashboard from './components/AdminDashboard';
import DisplayScreen from './components/DisplayScreen';
import RequestAdminAccess from './components/RequestAdminAccess';
import SuperAdminPanel from './components/SuperAdminPanel';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -200,
    scale: 0.8,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: 200,
    scale: 1.2,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Wrapper component for page transitions
const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <PageWrapper>
                  <LandingPage />
                </PageWrapper>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PageWrapper>
                  <Signup />
                </PageWrapper>
              } 
            />
            <Route 
              path="/home" 
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              } 
            />
            <Route 
              path="/event/:id" 
              element={
                <PageWrapper>
                  <EventDetails />
                </PageWrapper>
              } 
            />
            <Route 
              path="/ticket/:code" 
              element={
                <PageWrapper>
                  <Ticket />
                </PageWrapper>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PageWrapper>
                  <AdminLogin />
                </PageWrapper>
              } 
            />
            <Route 
              path="/admin/signup" 
              element={
                <PageWrapper>
                  <AdminSignup />
                </PageWrapper>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <PageWrapper>
                  <AdminDashboard />
                </PageWrapper>
              } 
            />
            <Route 
              path="/display/:eventId" 
              element={
                <PageWrapper>
                  <DisplayScreen />
                </PageWrapper>
              } 
            />
            <Route 
              path="/request-admin-access" 
              element={
                <PageWrapper>
                  <RequestAdminAccess />
                </PageWrapper>
              } 
            />
            <Route 
              path="/super-admin" 
              element={
                <PageWrapper>
                  <SuperAdminPanel />
                </PageWrapper>
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;