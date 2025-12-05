import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SuperAdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const superToken = localStorage.getItem('superAdminToken');
    if (superToken) {
      setIsLoggedIn(true);
      fetchRequests();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/super-admin/login', loginForm);
      localStorage.setItem('superAdminToken', response.data.token);
      setIsLoggedIn(true);
      fetchRequests();
    } catch (error) {
      setError('Invalid super admin credentials');
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/super-admin/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/super-admin/requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
      });
      fetchRequests();
      alert('Request approved successfully!');
    } catch (error) {
      alert('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/api/super-admin/requests/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('superAdminToken')}` }
      });
      fetchRequests();
      alert('Request rejected');
    } catch (error) {
      alert('Failed to reject request');
    }
  };

  const logout = () => {
    localStorage.removeItem('superAdminToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/10';
      case 'APPROVED': return 'text-green-400 bg-green-500/10';
      case 'REJECTED': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🔒</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Super Admin</h2>
            <p className="text-gray-300">Restricted Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              placeholder="Super Admin Username"
              value={loginForm.identifier}
              onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              placeholder="Super Admin Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Panel'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-dark border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">🔒</span>
            Super Admin Panel
          </h1>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Admin Access Requests</h2>
          <p className="text-gray-300">Review and manage business admin applications</p>
        </motion.div>

        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Requests</h3>
            <p className="text-gray-300">No admin access requests at the moment</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-xl">🏢</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{request.businessName}</h3>
                      <p className="text-gray-300">{request.businessType}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Owner/Manager</p>
                    <p className="text-white font-semibold">{request.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{request.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-semibold">{request.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Submitted</p>
                    <p className="text-white font-semibold">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {request.status === 'PENDING' && (
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
                    >
                      ✓ Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(request.id)}
                      className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
                    >
                      ✗ Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPanel;