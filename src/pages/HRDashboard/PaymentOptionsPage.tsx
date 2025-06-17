import React from 'react';
import { openRazorpay } from '../../utils/razorpay';

interface PaymentOptionsPageProps {
  interviewId: string;
  hrEmail: string;
}

const PaymentOptionsPage: React.FC<PaymentOptionsPageProps> = ({ interviewId }) => {
  const handleRazorpay = (amount: number, description: string, isOneTime: boolean) => {
    openRazorpay(amount, description, () => {
      if (isOneTime) {
        window.location.href = `/payment-success?interviewId=${interviewId}`;
      } else {
        window.location.href = `/payment-success?plan=${description}`;
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* One-Time Payment */}
        <div className="border p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">One-Time Interview</h3>
          <p className="mb-4">₹1999 for one interview.</p>
          <button onClick={() => handleRazorpay(1999, 'PayPerInterview ₹1999', true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Pay ₹1999
          </button>
        </div>

        {/* Basic Plan */}
        <div className="border p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Basic Plan</h3>
          <p className="mb-4">₹2999 / 3 Months (1 Interview Free)</p>
          <button onClick={() => handleRazorpay(2999, 'Basic', false)} className="bg-green-600 text-white px-4 py-2 rounded">
            Subscribe Basic
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Pro Plan</h3>
          <p className="mb-4">₹4999 / 6 Months (3 Interviews Free)</p>
          <button onClick={() => handleRazorpay(4999, 'Pro', false)} className="bg-green-600 text-white px-4 py-2 rounded">
            Subscribe Pro
          </button>
        </div>

        {/* Premium Plan */}
        <div className="border p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Premium Plan</h3>
          <p className="mb-4">₹8999 / 12 Months (8 Interviews Free)</p>
          <button onClick={() => handleRazorpay(8999, 'Premium', false)} className="bg-green-600 text-white px-4 py-2 rounded">
            Subscribe Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsPage;
