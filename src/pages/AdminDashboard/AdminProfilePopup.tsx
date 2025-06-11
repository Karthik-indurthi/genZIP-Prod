import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase.js';

const AdminProfilePopup = ({
  email,
  onComplete,
  onCancel,
}: {
  email: string;
  onComplete: () => void;
  onCancel?: () => void;
}) => {
  const [form, setForm] = useState({
    phoneNumber: '',
    industry_type: '',
    company_website: '',
    contact_person_name: '',
    company_description: '',
    company_name: '',
    EmailId: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data, error } = await supabase
        .from('AdminTable')
        .select('company_name, EmailId')
        .eq('EmailId', email)
        .single();

      if (data) {
        setForm((prev) => ({
          ...prev,
          company_name: data.company_name || '',
          EmailId: data.EmailId || '',
        }));
      }

      if (error) console.error('Error fetching company data:', error);
    };

    fetchCompany();
  }, [email]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () =>
    form.phoneNumber &&
    form.industry_type &&
    form.company_website &&
    form.contact_person_name &&
    form.company_description;

  const handleSave = async () => {
    setLoading(true);
    const updatePayload = {
      PhoneNumber: form.phoneNumber,
      industry_type: form.industry_type,
      company_website: form.company_website,
      contact_person_name: form.contact_person_name,
      company_description: form.company_description,
      updated_at: new Date().toISOString(),
    };

    const { error: mainError } = await supabase
      .from('AdminTable')
      .update(updatePayload)
      .eq('EmailId', email);

    setLoading(false);

    if (!mainError ) {
      onComplete();
    } else {
      alert('Error saving profile. Please try again.');
      console.error(mainError );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Complete Your Profile
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            name="company_name"
            value={form.company_name}
            disabled
            className="bg-gray-100 text-gray-500 border border-gray-300 p-2 rounded"
          />
          <input
            name="EmailId"
            value={form.EmailId}
            disabled
            className="bg-gray-100 text-gray-500 border border-gray-300 p-2 rounded"
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number *"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="industry_type"
            placeholder="Industry Type *"
            value={form.industry_type}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="company_website"
            placeholder="Company Website *"
            value={form.company_website}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="contact_person_name"
            placeholder="Contact Person's Name *"
            value={form.contact_person_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="company_description"
            placeholder="Company Description *"
            value={form.company_description}
            onChange={handleChange}
            className="border p-2 rounded resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleSave}
          className={`mt-6 w-full py-2 text-white rounded ${
            isFormValid()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isFormValid() || loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-600 underline w-full mt-3"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePopup;
