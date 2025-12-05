import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const DisplayScreen = () => {
  const { eventId } = useParams();
  const [currentServing, setCurrentServing] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchCurrentServing = async () => {
      try {
        const response = await api.get(`/api/display/current-serving/${eventId}`);
        setCurrentServing(response.data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch current serving', error);
        setCurrentServing([]);
      }
    };

    const fetchEventInfo = async () => {
      try {
        const response = await api.get(`/api/events/${eventId}`);
        setEventInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch event info', error);
      }
    };

    fetchCurrentServing();
    fetchEventInfo();
    
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchCurrentServing, 3000);
    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 text-center pt-8 pb-4"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-7xl md:text-9xl font-black text-white mb-4 tracking-tight"
        >
          NOW SERVING
        </motion.h1>
        {eventInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-gray-300 font-semibold"
          >
            {eventInfo.eventName}
          </motion.div>
        )}
      </motion.div>

      {/* Main Display Area */}
      <div className="relative z-10 flex items-center justify-center min-h-[60vh] px-8">
        <AnimatePresence mode="wait">
          {currentServing.length > 0 ? (
            <motion.div
              key="serving"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div className="grid gap-8">
                {currentServing.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 100, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: index * 0.2,
                      duration: 1,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="glass rounded-3xl p-12 shadow-2xl backdrop-blur-lg border border-white/20"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        textShadow: [
                          '0 0 20px rgba(255,255,255,0.5)',
                          '0 0 40px rgba(255,255,255,0.8)',
                          '0 0 20px rgba(255,255,255,0.5)'
                        ]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-6 leading-none"
                    >
                      {ticket.ticketCode}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                      {ticket.customerName || 'Walk-in Customer'}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.2 }}
                      className="text-xl text-gray-300"
                    >
                      Please proceed to the counter
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 mx-auto mb-8 text-8xl"
              >
                ⏳
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl md:text-6xl font-bold text-white mb-4"
              >
                Please Wait
              </motion.div>
              <div className="text-2xl text-gray-300">
                No customers currently being served
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative z-10 text-center pb-8"
      >
        <div className="glass rounded-2xl mx-auto max-w-md p-6">
          <div className="text-gray-300 text-lg font-semibold mb-2">
            SmartQueue Digital Display
          </div>
          <div className="text-gray-400 text-sm">
            Event ID: {eventId} • Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-2 text-green-400 text-sm"
          >
            🔄 Auto-refreshing...
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DisplayScreen;
