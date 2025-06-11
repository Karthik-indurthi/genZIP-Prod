import React, { useState } from 'react';
import { supabase } from '../../supabase.js';
import { useNavigate } from 'react-router-dom';

const EmployeeForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (mobile.length < 10) {
      setErrorMsg('Enter a valid mobile number');
      return;
    }

    // Here you'd normally trigger real OTP logic
    setStep(2);
    setErrorMsg('');
  };

  const handleVerifyOtp = () => {
    if (otp !== '123456') {
      setErrorMsg('Invalid OTP');
    } else {
      setStep(3);
      setErrorMsg('');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setErrorMsg('Please enter a new password');
      return;
    }

    const { error } = await supabase
      .from('EmployeeTable')
      .update({ Password: newPassword })
      .eq('MobileNumber', mobile);

    if (error) {
      setErrorMsg('Failed to reset password');
    } else {
      alert('Password updated successfully. Please log in.');
      navigate('/employee-login');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Enter your mobile number"
            className="w-full border p-2 rounded mb-3"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button onClick={handleSendOtp} className="w-full bg-blue-600 text-white p-2 rounded">
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP (123456)"
            className="w-full border p-2 rounded mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white p-2 rounded">
            Verify OTP
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border p-2 rounded mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} className="w-full bg-indigo-600 text-white p-2 rounded">
            Reset Password
          </button>
        </>
      )}

      {errorMsg && <p className="text-red-600 text-sm mt-3">{errorMsg}</p>}
    </div>
  );
};

export default EmployeeForgotPassword;
