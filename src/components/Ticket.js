import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import api from '../services/api';

const Ticket = () => {
  const { code } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    fetchTicket();
    checkNotification();
    const ticketInterval = setInterval(fetchTicket, 5000);
    const notificationInterval = setInterval(checkNotification, 3000);
    return () => {
      clearInterval(ticketInterval);
      clearInterval(notificationInterval);
    };
  }, [code]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/api/tickets/${code}`);
      setTicket(response.data);
    } catch (error) {
      console.error('Failed to fetch ticket', error);
    }
    setLoading(false);
  };

  const checkNotification = async () => {
    try {
      const response = await api.get(`/api/tickets/${code}/notification`);
      setNotification(response.data);
      
      if (response.data.isYourTurn && !hasNotified) {
        setHasNotified(true);
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('SmartQueue - Your Turn!', {
            body: "It's your turn! Please proceed to the counter.",
            icon: '/favicon.ico'
          });
        }
        // Show alert
        alert("🔔 It's your turn! Please proceed to the counter.");
      }
    } catch (error) {
      console.error('Failed to check notification', error);
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'waiting': return 'text-yellow-400 bg-yellow-500/10';
      case 'called': return 'text-green-400 bg-green-500/10';
      case 'served': return 'text-blue-400 bg-blue-500/10';
      case 'cancelled': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'waiting': return '⏳';
      case 'called': return '🔔';
      case 'served': return '✅';
      case 'cancelled': return '❌';
      default: return '🎫';
    }
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
          <p className="text-white text-lg">Loading your ticket...</p>
        </motion.div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Ticket Not Found</h2>
          <p className="text-gray-300 mb-6">The ticket code you're looking for doesn't exist.</p>
          <Link to="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl"
            >
              Back to Events
            </motion.button>
          </Link>
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
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-2 glass text-white rounded-lg hover:bg-white/20 transition-all"
              >
                ← Back
              </motion.button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Your Ticket</h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-300"
          >
            Auto-refreshing...
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Ticket Card */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">{ticket.event?.name}</h2>
                  <p className="text-purple-100">Digital Queue Ticket</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black">{ticket.ticketCode}</div>
                  <div className="text-sm opacity-75">Ticket Code</div>
                </div>
              </motion.div>
              
              {/* Decorative circles */}
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-full"></div>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-full"></div>
            </div>

            {/* Ticket Body */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Details */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  {/* Status */}
                  <div className="text-center">
                    <motion.div
                      key={ticket.status}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`inline-flex items-center px-6 py-3 rounded-full font-semibold ${getStatusColor(ticket.status)}`}
                    >
                      <span className="mr-2 text-lg">{getStatusIcon(ticket.status)}</span>
                      {ticket.status?.toUpperCase() || 'WAITING'}
                    </motion.div>
                  </div>

                  {/* Queue Position */}
                  <div className="text-center">
                    <motion.div
                      key={ticket.queuePosition}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-6xl font-black text-white mb-2"
                    >
                      #{ticket.queuePosition || 0}
                    </motion.div>
                    <p className="text-gray-300">Queue Position</p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">📅</span>
                      <div>
                        <p className="font-semibold text-white">Date</p>
                        <p>{new Date(ticket.event?.eventDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">⏰</span>
                      <div>
                        <p className="font-semibold text-white">Time</p>
                        <p>{ticket.event?.eventTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">📍</span>
                      <div>
                        <p className="font-semibold text-white">Location</p>
                        <p>{ticket.event?.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">🕐</span>
                      <div>
                        <p className="font-semibold text-white">Booked</p>
                        <p>{new Date(ticket.bookingTime).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - QR Code */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-lg mb-4">
                    <QRCode
                      value={`${window.location.origin}/ticket/${ticket.ticketCode}`}
                      size={180}
                      level="M"
                    />
                  </div>
                  <p className="text-gray-300 text-sm text-center">
                    Scan this QR code for quick access
                  </p>
                </motion.div>
              </div>

              {/* Notification Banner */}
              {notification?.isYourTurn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white text-center animate-pulse"
                >
                  <div className="text-2xl mb-2">🔔</div>
                  <p className="font-bold text-lg">IT'S YOUR TURN!</p>
                  <p className="text-sm">Please proceed to the counter immediately</p>
                </motion.div>
              )}

              {/* Status Messages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 p-4 glass-dark rounded-xl"
              >
                {ticket.status?.toLowerCase() === 'waiting' && (
                  <div className="text-center text-yellow-300">
                    <p className="font-semibold mb-1">Please wait for your turn</p>
                    <p className="text-sm">You'll be notified when it's your time</p>
                  </div>
                )}
                {(ticket.status?.toLowerCase() === 'in_progress' || notification?.isYourTurn) && (
                  <div className="text-center text-green-300 animate-pulse">
                    <p className="font-semibold mb-1">🔔 You're being called!</p>
                    <p className="text-sm">Please proceed to the service counter</p>
                  </div>
                )}
                {ticket.status?.toLowerCase() === 'done' && (
                  <div className="text-center text-blue-300">
                    <p className="font-semibold mb-1">✅ Service completed</p>
                    <p className="text-sm">Thank you for using SmartQueue!</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8 flex gap-4"
          >
            <Link to="/home" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 glass text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                Back to Events
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Refresh
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ticket;