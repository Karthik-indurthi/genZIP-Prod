  // src/pages/HRDashboard/HRLayout.tsx
  import React from 'react';
  import { NavLink, Outlet } from 'react-router-dom';
  import { motion } from 'framer-motion';

  const HRLayout: React.FC = () => {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
        {/* Enhanced Sidebar with Glass Morphism Effect */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-gradient-to-b from-indigo-600 to-blue-500 shadow-2xl backdrop-blur-sm border-r border-blue-400/20"
        >
          <div className="p-6 border-b border-blue-400/20">
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-white"
            >
              HR Panel
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-blue-100 mt-1"
            >
              Human Resources Dashboard
            </motion.p>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {[
              { to: "/hr/add-job", icon: "➕", text: "Add Job" },
              { to: "/hr/interviewers", icon: "🧑‍💼", text: "Interviewers" },
              { to: "/hr/candidates", icon: "👤", text: "Candidate List" },
              { to: "/hr/schedule", icon: "🗓️", text: "Schedule Interview" },
              { to: "/hr/profile", icon: "👤", text: "My Profile" }
            ].map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                <NavLink
    to={item.to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-white/20 text-white font-medium shadow-lg backdrop-blur-sm'
          : 'text-blue-100 hover:bg-white/10 hover:text-white'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className="mr-3 text-lg">{item.icon}</span>
        <span>{item.text}</span>
        {isActive && (
          <motion.span 
            layoutId="navIndicator"
            className="ml-auto w-2 h-2 bg-white rounded-full"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </>
    )}
  </NavLink>
              </motion.div>
            ))}
          </nav>
          
          {/* Sidebar Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-0 left-0 right-0 p-4 text-center text-blue-100/80 text-xs border-t border-blue-400/20"
          >
            HR Dashboard v1.0
          </motion.div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 p-8 overflow-auto"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 min-h-[80vh] backdrop-blur-sm bg-opacity-70"
            >
              <Outlet />
            </motion.div>
            
            {/* Subtle animated background elements */}
            <motion.div 
              className="fixed -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl -z-10"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="fixed -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-200/20 blur-3xl -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 2
              }}
            />
          </div>
        </motion.main>
      </div>
    );
  };

  export default HRLayout;