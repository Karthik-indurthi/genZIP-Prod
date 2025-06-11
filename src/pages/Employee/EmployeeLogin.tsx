import React, { useState } from 'react';
import { supabase } from '../../supabase.js';
import { useNavigate, Link } from 'react-router-dom';

const EmployeeLogin: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!mobile || !password) {
      setErrorMsg('Please enter both mobile number and password.');
      return;
    }

    const { data, error } = await supabase
      .from('EmployeeTable')
      .select('*')
      .eq('MobileNumber', mobile)
      .eq('Password', password)
      .single();

    if (error || !data) {
      setErrorMsg('Invalid mobile number or password.');
    } else {
      localStorage.setItem('employeeId', data.EmployeeId);
      localStorage.setItem('employeeName', `${data.FirstName} ${data.LastName}`);
      navigate('/employee');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Employee Login</h2>

      <input
        type="text"
        className="w-full border p-2 rounded mb-3"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <input
        type="password"
        className="w-full border p-2 rounded mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}

      <button
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        onClick={handleLogin}
      >
        Login
      </button>

      <div className="mt-4 text-sm text-center">
        <Link to="/employee-forgot-password" className="text-indigo-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default EmployeeLogin;
