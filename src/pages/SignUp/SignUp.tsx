import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.js'
import { supabase } from '../../supabase.js'
import logo from '../../assets/Logo.png';

import AdminProfilePopup from '../AdminDashboard/AdminProfilePopup.js';

const SignUp = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [searchParams] = useSearchParams()
  const defaultPlan = searchParams.get('plan') || 'basic'
  const [plan, setPlan] = useState(defaultPlan)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      alert('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      await signup(email, password);

      const {
        data: { user },
        error: getUserError
      } = await supabase.auth.getUser();

      if (getUserError || !user) {
        throw getUserError || new Error('No user returned after signup');
      }

      const uid = user.id;
      const companyId = crypto.randomUUID();

      const { error: adminInsertError } = await supabase.from('AdminTable').insert([
        {
          user_id: uid,
          company_id: companyId,
          company_name: companyName,
          username: username,
          EmailId: email,
          Role: 'Admin',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]);
      if (adminInsertError) {
        console.error('Admin insert error:', adminInsertError.message);
        throw adminInsertError;
      }

      setNewUserEmail(email);
      setShowProfileModal(true);
    } catch (err) {
      console.error('Full error object:', err);
    
      if (err instanceof Error) {
        alert(`Signup failed: ${err.message}`);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        alert(`Signup failed: ${(err as any).message}`);
      } else {
        alert('Signup failed: Unknown error occurred');
      }
    
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center text-white p-10"
      >
        <div className="max-w-md text-center">
  <div className="flex justify-center mb-6">
    <div className="p-3">
      <img
        src={logo}
        className="w-36 h-auto"
        alt="Gen-ZIP logo"
      />
    </div>
  </div>
  <h2 className="text-4xl font-bold mb-2">Welcome to Gen-ZIP</h2>
  <p className="text-lg">
    Record, verify, and trust your hires — skip the interview frauds.
  </p>
</div>

      </motion.div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSignup}
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="Your company name"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          <p className="text-xs text-gray-500 mb-4 text-center">
            No credit card required for sign-up.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.form>

        {showProfileModal && (
          <AdminProfilePopup
            email={newUserEmail}
            onComplete={() => {
              setShowProfileModal(false);
              navigate('/admin/dashboard');
            }}
            onCancel={() => {
              setShowProfileModal(false);
              navigate('/admin/dashboard');
            }}
          />
        )}
      </div>
    </div>
  )
}

export default SignUp
