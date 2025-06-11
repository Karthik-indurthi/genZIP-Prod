import React, { useState } from 'react';
import { supabase } from '../../supabase.js';

const AdminEnquiries: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    if (!subject || !message) {
      setStatus('Please fill in both fields.');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;

    const response = await fetch('/api/send-enquiry-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, from: email }),
    });

    if (response.ok) {
      setStatus('Message sent successfully.');
      setSubject('');
      setMessage('');
    } else {
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📩 Send an Enquiry</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded"
          placeholder="Enter subject"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full mt-1 p-2 border border-gray-300 rounded resize-none"
          placeholder="Type your message here..."
        ></textarea>
      </div>

      <button
        onClick={handleSend}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium"
      >
        Send
      </button>

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
};

export default AdminEnquiries;
