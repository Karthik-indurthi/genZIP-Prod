import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface GeoPricingModalProps {
  plan: string;
  onClose: () => void;
}

const GeoPricingModal: React.FC<GeoPricingModalProps> = ({ plan, onClose }) => {
  const distanceInfo = {
    basic: { freeKm: 5 },
    pro: { freeKm: 10 },
    premium: { freeKm: 15 },
  };

  const current = distanceInfo[plan as keyof typeof distanceInfo] || { freeKm: 5 };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg max-w-md text-center shadow-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-blue-700">Extra Distance Charges Apply</h3>
        <p className="text-sm text-gray-700 mb-4">
          Based on your <strong>{plan}</strong> plan, you have <strong>{current.freeKm} KM</strong> of free coverage.
          Your candidate is beyond this limit. Additional fee applies.
        </p>
        <p className="text-gray-600 mb-4">Would you like to upgrade your plan and waive the extra distance fee?</p>

        <div className="flex justify-center gap-4">
          <Link to="/signup">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Plans
            </button>
          </Link>
          <button
            onClick={onClose}
            className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GeoPricingModal;
