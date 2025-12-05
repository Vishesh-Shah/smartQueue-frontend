import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';

const RequestAdminAccess = () => {
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const businessTypes = [
    'Restaurant', 'Retail Store', 'Healthcare', 'Government Office', 
    'Bank', 'Service Center', 'Educational Institution', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Submitting form:', form);
      const response = await api.post('/api/admin-request', form);
      console.log('Response:', response);
      setSuccess(true);
    } catch (error) {
      console.error('Error details:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || error.message || 'Failed to submit request');
    }
    setLoading(false);
  };

  if (success) {
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
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-2xl text-white">✓</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">Request Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Your admin access request has been submitted successfully. 
            We'll review your application and get back to you within 2-3 business days.
          </p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl"
            >
              Back to Home
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
        <div className="container mx-auto px-6 py-4 flex items-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mr-4 p-2 glass text-white rounded-lg hover:bg-white/20 transition-all"
            >
              ← Back
            </motion.button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Request Admin Access</h1>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🏢</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Business Admin Access</h2>
              <p className="text-gray-300">
                Apply for admin access to manage your business queue system
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <input
                    type="text"
                    placeholder="Business Name *"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <input
                    type="text"
                    placeholder="Owner/Manager Name *"
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <input
                    type="email"
                    placeholder="Business Email *"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-dark text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <select
                  value={form.businessType}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-dark text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="">Select Business Type *</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type} className="bg-gray-800">{type}</option>
                  ))}
                </select>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20"
              >
                <h4 className="text-blue-300 font-semibold mb-2">📋 What happens next?</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• We'll review your business information</li>
                  <li>• Verification process takes 2-3 business days</li>
                  <li>• You'll receive login credentials via email once approved</li>
                  <li>• Start managing your queue system immediately</li>
                </ul>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-blue-500/25"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Request...</span>
                  </div>
                ) : (
                  'Submit Admin Request'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestAdminAccess;