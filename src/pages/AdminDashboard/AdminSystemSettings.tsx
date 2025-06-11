import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const AdminSystemSettings: React.FC = () => {
  const [form, setForm] = useState({
    company_name: '',
    company_website: '',
    industry_type: '',
    contact_person_name: '',
    official_email: '',
    company_description: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;

    const { data, error } = await supabase
      .from('AdminTable')
      .select(
        'company_name, company_website, industry_type, contact_person_name, official_email, company_description'
      )
      .eq('EmailId', email)
      .single();

    if (error) {
      setStatus('Failed to load settings.');
    } else {
      setForm({
        company_name: data.company_name || '',
        company_website: data.company_website || '',
        industry_type: data.industry_type || '',
        contact_person_name: data.contact_person_name || '',
        official_email: data.official_email || '',
        company_description: data.company_description || '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveSettings = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;

    const { error } = await supabase
      .from('AdminTable')
      .update(form)
      .eq('EmailId', email);

    setStatus(error ? 'Failed to update settings.' : 'Settings saved successfully.');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">⚙️ System Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Website</label>
          <input
            type="text"
            name="company_website"
            value={form.company_website}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Industry Type</label>
          <input
            type="text"
            name="industry_type"
            value={form.industry_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Person</label>
          <input
            type="text"
            name="contact_person_name"
            value={form.contact_person_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Official Email</label>
          <input
            type="email"
            name="official_email"
            value={form.official_email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Company Description</label>
          <textarea
            name="company_description"
            value={form.company_description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
      </div>

      <button
        onClick={saveSettings}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Save Settings
      </button>

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
};

export default AdminSystemSettings;
