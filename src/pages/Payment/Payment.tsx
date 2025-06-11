// SubscriptionPage.tsx - Styled subscription selection page
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase.js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RFDH8P6nau3Ig8lFvQedNoM402Qpwap3JoM2shw5sHAr2jJxGy2cIYKoeJch1W8MnzD7VFWNG3Ww0Ylnx4SAhfz00C8vUzO0m');

const plans = [
  { name: 'Starter', price: 49999, interviews: 20, bonus: 3, stripePriceId: 'price_1RIpKoP6nau3Ig8lCrDRxXiA', tag: 'Most Popular' },
  { name: 'Pro', price: 99999, interviews: 50, bonus: 8, stripePriceId: 'price_1RIpKFP6nau3Ig8lzEw9ZuHO', tag: 'Best Value' },
  { name: 'Enterprise', price: 199999, interviews: 100, bonus: 20, stripePriceId: 'price_1RIpJ5P6nau3Ig8l46b4EkBU', tag: 'For Scale' },
];

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyId = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) return;

      const { data: adminData } = await supabase
        .from('AdminTable')
        .select('id')
        .eq('EmailId', email)
        .single();

      if (adminData?.id) setCompanyId(adminData.id);
      setLoading(false);
    };

    fetchCompanyId();
  }, []);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    const stripe = await stripePromise;

    const result = await stripe?.redirectToCheckout({
      lineItems: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl: 'http://localhost:5173/payment-success',
      cancelUrl: 'http://localhost:5173/payment-failure',
      customerEmail: localStorage.getItem('clientEmail') || '',
    });

    if (result?.error) {
      alert(result.error.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading subscription plans...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Choose Your GenZip Subscription Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map(plan => (
          <div
            key={plan.name}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300 relative"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-xl">
              {plan.tag}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{plan.name}</h2>
            <p className="text-sm text-gray-500 mb-4">Includes {plan.interviews} interviews + <span className="font-semibold">{plan.bonus} bonus</span></p>
            <p className="text-3xl font-bold text-indigo-600 mb-4">₹{plan.price.toLocaleString()}
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-6">
              <li>✓ Verified interview recording</li>
              <li>✓ GenZipper onsite verification</li>
              <li>✓ Access across all HRs in your company</li>
              <li>✓ 1 year validity</li>
            </ul>
            <button
              onClick={() => handleSubscribe(plan)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
