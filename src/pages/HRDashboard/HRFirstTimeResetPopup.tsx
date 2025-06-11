import React, { useState } from 'react';
import { supabase } from '../../supabase.js';
import { useNavigate } from 'react-router-dom';

interface Props {
  userEmail: string;
  onComplete: () => void;
}

const HRFirstTimeResetPopup: React.FC<Props> = ({ userEmail, onComplete }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      await supabase.from('HRTable').update({ first_login: false }).eq('EmailId', userEmail);
      await supabase.auth.signOut();
      onComplete();
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🔐 First-Time Password Reset</h2>
        <p className="text-sm text-gray-600 mb-4">Please set a new password before accessing your dashboard.</p>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-3"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : 'Set New Password'}
        </button>
      </div>
    </div>
  );
};

export default HRFirstTimeResetPopup;
