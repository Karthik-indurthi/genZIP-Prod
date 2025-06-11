// src/pages/AdminDashboard/AdminLayout.tsx
import React from 'react';


import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Interview Updates', path: '/admin/interview-updates', icon: '🗂️' },
  { label: 'Add/Remove HR', path: '/admin/hr-management', icon: '👥' },
  //{ label: 'Branch Management', path: '/admin/branches', icon: '🏢' },
  { label: 'Payments History', path: '/admin/payments', icon: '💳' },
  { label: 'Enquiries', path: '/admin/enquiries', icon: '📩' },
  //{ label: 'Analytics & Insights', path: '/admin/analytics', icon: '📈' },
  //{ label: 'Activity Log', path: '/admin/activity-log', icon: '📝' },
  //{ label: 'Connect', path: '/admin/connect', icon: '🔗' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

const AdminLayout = () => {

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-slate-100 to-indigo-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-xl flex flex-col">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold px-6 py-8 tracking-wide text-center bg-indigo-800 shadow"
        >
          Admin Panel 🚀
        </motion.div>

        <nav className="flex-1 overflow-y-auto mt-2">
          {navItems.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-indigo-700 rounded-l-full shadow'
                    : 'hover:bg-indigo-600 hover:pl-7'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
