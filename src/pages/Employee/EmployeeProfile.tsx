import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const EmployeeProfile: React.FC = () => {
  const [form, setForm] = useState<any>({});
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (!employeeId) return;
    supabase
      .from('EmployeeTable')
      .select('*')
      .eq('EmployeeId', employeeId)
      .single()
      .then(({ data }) => setForm(data || {}));
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('EmployeeTable')
      .update(form)
      .eq('EmployeeId', employeeId);

    if (!error) alert('Profile updated');
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">⚙️ Profile Settings</h2>
      <input
        value={form.FirstName || ''}
        onChange={(e) => setForm({ ...form, FirstName: e.target.value })}
        placeholder="First Name"
        className="border p-2 w-full mb-2"
      />
      <input
        value={form.LastName || ''}
        onChange={(e) => setForm({ ...form, LastName: e.target.value })}
        placeholder="Last Name"
        className="border p-2 w-full mb-2"
      />
      <input
        value={form.Email || ''}
        onChange={(e) => setForm({ ...form, Email: e.target.value })}
        placeholder="Email"
        className="border p-2 w-full mb-2"
      />
      <input
        value={form.Address || ''}
        onChange={(e) => setForm({ ...form, Address: e.target.value })}
        placeholder="Address"
        className="border p-2 w-full mb-2"
      />
      <input
        value={form.City || ''}
        onChange={(e) => setForm({ ...form, City: e.target.value })}
        placeholder="City"
        className="border p-2 w-full mb-2"
      />

      <button onClick={handleUpdate} className="mt-2 bg-blue-600 text-white p-2 w-full rounded">
        Save Changes
      </button>
    </div>
  );
};

export default EmployeeProfile;
