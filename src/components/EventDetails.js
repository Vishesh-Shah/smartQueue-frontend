import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Failed to fetch event', error);
      navigate('/home');
    }
  };

  const bookTicket = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/tickets/book/${id}`);
      setTicketCode(response.data.ticketCode);
      setBookingSuccess(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book ticket');
    }
    setLoading(false);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-3xl text-white">🎫</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">Ticket Booked!</h2>
          <p className="text-gray-300 mb-6">Your ticket has been successfully booked</p>
          <div className="space-y-4">
            <Link to={`/ticket/${ticketCode}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl"
              >
                View Ticket
              </motion.button>
            </Link>
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 glass text-white font-semibold rounded-xl"
              >
                Back to Events
              </motion.button>
            </Link>
          </div>
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
        <div className="container mx-auto px-6 py-4 flex items-center">
          <Link to="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mr-4 p-2 glass text-white rounded-lg hover:bg-white/20 transition-all"
            >
              ← Back
            </motion.button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Event Details</h1>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl overflow-hidden">
            {/* Event Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-3xl">🎪</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{event.eventName}</h1>
                    <p className="text-purple-100">Premium Event Experience</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Event Details */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Event Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">🎫</span>
                      <div>
                        <p className="font-semibold">Max Tickets</p>
                        <p>{event.maxTokens}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">👥</span>
                      <div>
                        <p className="font-semibold">Current Queue</p>
                        <p>{event.currentTokenCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">⏱️</span>
                      <div>
                        <p className="font-semibold">Avg Service Time</p>
                        <p>{event.averageServiceMinutes} minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="mr-3 text-lg">✅</span>
                      <div>
                        <p className="font-semibold">Status</p>
                        <p className={event.isActive ? 'text-green-400' : 'text-red-400'}>
                          {event.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">Queue management system for {event.eventName}. Join the queue and get your ticket!</p>
                  
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={bookTicket}
                      disabled={loading || !event.isActive}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-purple-500/25"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Booking Ticket...</span>
                        </div>
                      ) : !event.isActive ? (
                        'Event Closed'
                      ) : (
                        'Book Your Ticket Now'
                      )}
                    </motion.button>

                    {event.currentTokenCount >= event.maxTokens * 0.8 && event.isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-orange-400 text-sm bg-orange-500/10 p-3 rounded-lg"
                      >
                        ⚠️ Queue is getting full! Current: {event.currentTokenCount}/{event.maxTokens}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;