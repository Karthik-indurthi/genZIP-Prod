// Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase.js';
import LogoScroller from '../../components/LogoScroller/LogoScroller.js';
import '../../styles/stars.css';
import GenZIPExplainer  from '../../assets/GenZIPExplainer.mp4';
import '../../styles/index.css';
import Stars from '../../components/Animations/Stars.js';
import GenHubVideo from '../../assets/GenHub-idea.mp4';


const Home = () => {
  const navigate = useNavigate();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const aboutRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const careersRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-16 bg-gradient-to-br from-white via-blue-50 to-indigo-100 min-h-screen text-gray-800">
      {/* Logo Marquee */}
      <div className="py-8 bg-white">
        {/* Explainer Video Section */}
        {/* What is Gen-ZIP? Section - Side by Side */}
          <section className="py-16 bg-white px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
             {/* Left Text */}
           <div className="md:w-1/2 text-center md:text-left">
      <h2 className="text-3xl font-bold text-indigo-900 mb-4">What is Gen-ZIP?</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Gen-ZIP is a trusted interview verification service. We send trained professionals to the candidate’s location to verify their identity and record the entire interview. The video is securely uploaded for HR and interviewers to review, ensuring every interview is real and fraud-free.
      </p>
        </div>

    {/* Right Video */}
    <div className="md:w-1/2 w-full rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
      <video
        controls
        autoPlay
        muted
        loop
        className="w-full h-auto"
      >
        <source src={GenZIPExplainer} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</section>


        {/* <LogoScroller /> */}
      </div>
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-indigo-100">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
    
    {/* Left: Heading & CTA */}
    <div className="md:w-1/2 text-center md:text-left">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-6 text-indigo-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Trusted Interview Verification
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl mb-6 text-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Gen-ZIP ensures authentic candidate assessments by sending our professionals to conduct and record interviews at the candidate's location.
      </motion.p>
      <motion.button 
        className="relative bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl group"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        onClick={() => setShowAuthOptions(true)}
      >
        <span className="relative z-10">Schedule Interview Now</span>
        <span className="absolute inset-0 bg-indigo-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </motion.button>
    </div>

    {/* Right: GenZIP Hub Video */}
    <div className="md:w-1/2 w-full rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
  <video
    controls
    autoPlay
    muted
    loop
    className="w-full h-auto"
  >
    <source src={GenHubVideo} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>


  </div>
</section>


      {/* Auth Modal */}
      {showAuthOptions && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Schedule Verified Interview</h3>
            <p className="text-sm text-gray-500 mb-6">Authenticate to access our verification services</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/login')} 
                className="relative bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium overflow-hidden group"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 bg-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className="relative border border-indigo-600 text-indigo-600 py-2.5 rounded-lg hover:bg-indigo-50 transition-all font-medium overflow-hidden group"
              >
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button 
                onClick={() => setShowAuthOptions(false)} 
                className="text-xs text-gray-400 mt-4 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-16 text-indigo-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Verification Process
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Schedule',
                desc: 'Provide candidate details and preferred time for the interview.',
                icon: '📅'
              },
              {
                title: 'Dispatch',
                desc: 'Our Gen-ZIP professional arrives at the candidate location.',
                icon: '🚀'
              },
              {
                title: 'Verify & Deliver',
                desc: 'We record and securely upload the verified interview for your review.',
                icon: '✅'
              }
            ].map(({ title, desc, icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-800">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={aboutRef} className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Why Choose Gen-ZIP</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Ensuring authentic talent assessment through our verified interview process</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div 
              className="bg-indigo-50 p-8 rounded-xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">Eliminate Proxy Interviews</h3>
              <p className="text-gray-700 mb-6">Our on-site verification ensures the candidate being interviewed is the actual applicant, not a proxy.</p>
              <div className="space-y-4">
                {[
                  'Location-verified interviews',
                  'Professional recording equipment',
                  'Secure video uploads'
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">Streamlined Hiring Process</h3>
              <p className="text-gray-700 mb-6">We handle the logistics so you can focus on evaluating the right talent.</p>
              <div className="space-y-4">
                {[
                  'Flexible scheduling options',
                  'Trained interview facilitators',
                  'Quick turnaround time',
                  'Confidentiality guaranteed'
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Hiring Process?
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 opacity-90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Get started with Gen-ZIP today and ensure authentic candidate assessments.
          </motion.p>
          <motion.button
            className="bg-white text-indigo-700 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            onClick={() => setShowAuthOptions(true)}
          >
            Schedule Your First Interview
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
};

export default Home;