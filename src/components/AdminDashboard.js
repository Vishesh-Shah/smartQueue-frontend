import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    maxTokens: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchEvents();
    fetchTickets();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/admin/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await api.get('/api/admin/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/admin/events', newEvent);
      setNewEvent({ eventName: '', maxTokens: '' });
      fetchEvents();
      alert('Event created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create event');
    }
    setLoading(false);
  };

  const callNext = async (eventId) => {
    try {
      await api.post(`/api/admin/call-next/${eventId}`);
      fetchTickets();
      alert('Next customer called!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to call next');
    }
  };

  const markDone = async (ticketId) => {
    try {
      await api.post(`/api/admin/mark-done/${ticketId}`);
      fetchTickets();
      alert('Ticket marked as done!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark done');
    }
  };

  const skipTicket = async (ticketId) => {
    try {
      await api.post(`/api/admin/skip/${ticketId}`);
      fetchTickets();
      alert('Ticket skipped!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to skip ticket');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/admin');
  };

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
            className="text-2xl font-bold text-white flex items-center"
          >
            <span className="mr-2">⚙️</span>
            Admin Dashboard
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="px-4 py-2 glass text-white rounded-lg hover:bg-white/20 transition-all"
          >
            Logout
          </motion.button>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-4 mb-8"
        >
          {['events', 'tickets', 'create'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                  : 'glass text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Create Event Tab */}
        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">➕</span>
                Create New Event
              </h2>
              <form onSubmit={createEvent} className="space-y-6">
                <input
                  type="text"
                  placeholder="Event Name"
                  value={newEvent.eventName}
                  onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="number"
                  placeholder="How many tickets do you want to give?"
                  value={newEvent.maxTokens}
                  onChange={(e) => setNewEvent({ ...newEvent, maxTokens: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  min="1"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">🎪</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{event.eventName}</h3>
                    <p className="text-gray-300 text-sm">Queue Event</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-300 text-sm">
                    🎫 {event.maxTokens} max tickets
                  </p>
                  <p className="text-gray-300 text-sm">
                    👥 {event.currentTokenCount} in queue
                  </p>
                  <p className="text-gray-300 text-sm">
                    ⏱️ ~{event.averageServiceMinutes} min avg
                  </p>
                </div>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => callNext(event.id)}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    Call Next
                  </motion.button>
                  <Link to={`/display/${event.id}`} target="_blank">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 glass text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                    >
                      View Display
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-2">🎫</span>
                Queue Management
              </h2>
            </div>
            <div className="p-6">
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎫</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Active Tickets</h3>
                  <p className="text-gray-300">All customers have been served!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-dark rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">{ticket.queuePosition}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{ticket.ticketCode}</h4>
                          <p className="text-gray-300 text-sm">{ticket.customerName || 'Walk-in'}</p>
                          <p className="text-gray-400 text-xs">{ticket.event?.name}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => markDone(ticket.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm"
                        >
                          Done
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => skipTicket(ticket.id)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm"
                        >
                          Skip
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;