import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const EmployeeLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Employee Panel</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/employee/dashboard">Dashboard</Link>
          <Link to="/employee/scheduled">Scheduled</Link>
          <Link to="/employee/in-progress">In Progress</Link>
          <Link to="/employee/completed">Completed</Link>
          <Link to="/employee/transferred">Transferred</Link>
          <Link to="/employee/payments">Payments</Link>
          <Link to="/employee/profile">Profile</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
