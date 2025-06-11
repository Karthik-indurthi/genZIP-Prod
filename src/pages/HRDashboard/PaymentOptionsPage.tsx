import { loadStripe } from "@stripe/stripe-js";
import React from 'react';

interface PaymentOptionsPageProps {
    interviewId: string;
    hrEmail: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RFDH8P6nau3Ig8lFvQedNoM402Qpwap3JoM2shw5sHAr2jJxGy2cIYKoeJch1W8MnzD7VFWNG3Ww0Ylnx4SAhfz00C8vUzO0m');

const PaymentOptionsPage: React.FC<PaymentOptionsPageProps> = ({ interviewId, hrEmail }) => {
    const handleOneTimePayment = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_FUNCTION_API_URL}/createCheckoutSession`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    interviewId,
                    amount: 1999,
                    hrEmail,
                })
            });

            const data = await response.json();
            const sessionId = data.id;

            const stripe = await stripePromise;
            if (stripe && sessionId) {
                await stripe.redirectToCheckout({ sessionId });
            }
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    const handleSubscriptionPayment = async (planType: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_FUNCTION_API_URL}/createSubscriptionSession`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planType,
                    hrEmail,
                }),
            });

            const data = await response.json();
            const sessionId = data.id;

            const stripe = await stripePromise;
            if (stripe && sessionId) {
                await stripe.redirectToCheckout({ sessionId });
            }
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Subscription failed. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* One-Time Payment Card */}
                <div className="border p-6 rounded shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold mb-2">One-Time Interview</h3>
                    <p className="mb-4">₹1999 for one interview.</p>
                    <button onClick={handleOneTimePayment} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Pay ₹1999
                    </button>
                </div>

                {/* Basic Plan Card */}
                <div className="border p-6 rounded shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold mb-2">Basic Plan</h3>
                    <p className="mb-4">₹2999 / 3 Months (1 Interview Free)</p>
                    <button onClick={() => handleSubscriptionPayment("Basic")} className="bg-green-600 text-white px-4 py-2 rounded">
                        Subscribe Basic
                    </button>
                </div>

                {/* Pro Plan Card */}
                <div className="border p-6 rounded shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold mb-2">Pro Plan</h3>
                    <p className="mb-4">₹4999 / 6 Months (3 Interviews Free)</p>
                    <button onClick={() => handleSubscriptionPayment("Pro")} className="bg-green-600 text-white px-4 py-2 rounded">
                        Subscribe Pro
                    </button>
                </div>

                {/* Premium Plan Card */}
                <div className="border p-6 rounded shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold mb-2">Premium Plan</h3>
                    <p className="mb-4">₹8999 / 12 Months (8 Interviews Free)</p>
                    <button onClick={() => handleSubscriptionPayment("Premium")} className="bg-green-600 text-white px-4 py-2 rounded">
                        Subscribe Premium
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentOptionsPage;
