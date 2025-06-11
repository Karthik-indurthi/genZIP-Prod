import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PrivacyPolicyModal from './pages/Home/PrivacyPolicyModal.js';



const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">Gen-ZIP</h3>
            <p className="text-gray-400 mb-4">Ensuring authentic talent assessment through verified interview processes.</p>
            <p className="text-gray-400 text-sm">📍 Hyderabad, India</p>
            <p className="text-gray-400 text-sm">📧 support@gen-zip.in</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-white transition">Sign Up</Link></li>
              <li>
  <a
    onClick={(e) => {
      e.preventDefault();
      setShowModal(true);
    }}
    href="#"
    className="text-gray-400 hover:text-white transition"
  >
    Privacy Policy
  </a>
</li>


            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Get Started</h4>
            <Link 
              to="/signup"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300"
            >
              Schedule Interview
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Gen-ZIP. All rights reserved.
        </div>
      </footer>

      <PrivacyPolicyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Footer;
