import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchEvents();
    fetchUserProfile();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
    setLoading(false);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/customer/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading events...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-dark border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-white"
          >
            SmartQueue
          </motion.h1>
          <div className="flex items-center space-x-4">
            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white"
              >
                Welcome, {user.name}
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-4 py-2 glass text-white rounded-lg hover:bg-white/20 transition-all"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Available Events</h2>
          <p className="text-gray-300 text-lg">Choose an event to book your ticket</p>
        </motion.div>

        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Events Available</h3>
            <p className="text-gray-300">Check back later for new events!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🎪</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{event.eventName}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">Queue Management Event</p>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-300 text-sm">
                    <span className="mr-2">🎫</span>
                    {event.maxTokens} max tickets
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <span className="mr-2">👥</span>
                    {event.currentTokenCount} current queue
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <span className="mr-2">⏱️</span>
                    ~{event.averageServiceMinutes} min avg service
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <span className="mr-2">✅</span>
                    {event.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <Link to={`/event/${event.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    disabled={!event.isActive}
                  >
                    {!event.isActive ? 'Event Closed' : 'Book Ticket'}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.reload()}
          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center"
        >
          <span className="text-xl">🔄</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;