import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase.js';

interface Props {
  email: string; 
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ email: initialEmail, onClose }) => {
  const [email, setEmail] = useState(initialEmail);      
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      setSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl w-96 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Reset Your Password</h2>

        {!sent ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </>
        ) : (
          <>
            <p className="text-green-600 mb-4">✅ Password reset email sent! Check your inbox.</p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </>
        )}

        <button onClick={onClose} className="mt-4 text-xs text-gray-400 hover:underline">
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordModal;