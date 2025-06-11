// PayPerInterview.tsx - Enhanced UI for one-time interview payment
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FaShieldAlt, FaVideo, FaUserCheck } from 'react-icons/fa';


const stripePromise = loadStripe('pk_test_51RFDH8P6nau3Ig8lFvQedNoM402Qpwap3JoM2shw5sHAr2jJxGy2cIYKoeJch1W8MnzD7VFWNG3Ww0Ylnx4SAhfz00C8vUzO0m');

interface PayPerInterviewProps {
  interviewId: string;
  onSuccess: () => void;
}

const PayPerInterview: React.FC<PayPerInterviewProps> = ({ interviewId, onSuccess }) => {

  const handlePayNow = async () => {
    const stripe = await stripePromise;

    const result = await stripe?.redirectToCheckout({
      lineItems: [
        {
          price: 'price_1RFDLEP6nau3Ig8labGQTi4p',
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl: `${window.location.origin}/payment-success?interviewId=${interviewId}`,
      cancelUrl: 'http://localhost:5173/payment-failure',
      customerEmail: localStorage.getItem('clientEmail') || '',
    });

    if (result?.error) {
      alert(result.error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg text-center">
        <h1 className="text-3xl font-extrabold text-red-600 mb-4">Payment Required</h1>
        <p className="text-gray-700 text-base mb-2">
          To proceed with this interview, please complete your one-time payment of
        </p>
        <p className="text-4xl font-bold text-red-500 mb-6">
          ₹2,000
        </p>

        <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 text-left mb-6">
          <div className="flex items-center gap-2">
            <FaUserCheck className="text-red-400" /> GenZipper on-site identity verification
          </div>
          <div className="flex items-center gap-2">
            <FaVideo className="text-red-400" /> Full video recording of the interview
          </div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-red-400" /> Malpractice prevention guarantee
          </div>
        </div>

        <button
          onClick={handlePayNow}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-red-700 transition duration-200"
        >
          Pay & Continue to Interview
        </button>

        <p className="text-xs text-gray-400 mt-4">
          This ensures a secure and verified interview experience.
        </p>
      </div>
    </div>
  );
};

export default PayPerInterview;
