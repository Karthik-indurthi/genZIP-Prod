import React from 'react';

const EmployeeDashboard: React.FC = () => {
  const employeeId = localStorage.getItem('employeeId');
  const employeeName = localStorage.getItem('employeeName');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md p-4 rounded mb-6">
        <h2 className="text-2xl font-bold">Welcome, {employeeName}</h2>
        <p className="text-sm text-gray-600">Your Employee ID: <span className="font-semibold">{employeeId}</span></p>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">📝 Scheduled Interviews (Nearby)</h3>
          <p className="text-sm text-gray-600">You will see interviews near your location to accept.</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">✅ Completed Interviews</h3>
          <p className="text-sm text-gray-600">Your interview history will appear here.</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">💰 Payments</h3>
          <p className="text-sm text-gray-600">See your interview earnings and payment status.</p>
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">⚙️ Profile Settings</h3>
          <p className="text-sm text-gray-600">Update your contact info, photo, and address.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
