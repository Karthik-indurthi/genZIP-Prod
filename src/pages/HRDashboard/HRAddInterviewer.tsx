import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { motion } from 'framer-motion';

interface Interviewer {
  Id?: string;
  FirstName: string;
  LastName: string;
  EmailId: string;
  PhoneNumber: string;
  job_id: string;
  createdBy?: string;
}

const HRAddInterviewer: React.FC = () => {
  const [form, setForm] = useState<Interviewer>({
    FirstName: '',
    LastName:'',
    EmailId: '',
    PhoneNumber: '',
    job_id: '',
  });

  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [jobIds, setJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  const fetchJobs = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const { data, error } = await supabase
      .from('JobTable')
      .select('JobID')
      .eq('created_by', userData.user.id);

    if (!error && data) {
      setJobIds(data.map(job => job.JobID));
    }
  };

  const fetchInterviewers = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const { data, error } = await supabase
      .from('InterviewerTable')
      .select('*')
      .eq('created_by', userData.user.id);

    if (!error && data) {
      const normalized = data.map(item => ({
        ...item,
        id: item.id || item.Id,
  name: `${item.FirstName} ${item.LastName}`, // ✅ this enables UI display
      }));
      setInterviewers(normalized);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;
    if (!form.FirstName || !form.LastName || !form.EmailId || !form.PhoneNumber || !form.job_id) return;

    try {
      const { error } = await supabase.from('InterviewerTable').insert([
        {
          FirstName: form.FirstName,
          LastName:form.LastName,
          EmailId: form.EmailId,
          PhoneNumber: form.PhoneNumber,
          job_id: form.job_id,
          created_by: userData.user.id
        }
      ]);

      if (!error) {
        setForm({ FirstName: '',LastName:'', EmailId: '', PhoneNumber: '', job_id: '' });
        await fetchInterviewers();
      }
    } catch (error) {
      console.error("Error adding interviewer:", error);
    }
  };
  const handleEdit = (item: Interviewer) => {
    setForm({
      FirstName: item.FirstName,
      LastName: item.LastName,
      EmailId: item.EmailId,
      PhoneNumber: item.PhoneNumber,
      job_id: item.job_id,
    });
    setEditingId(item.Id || null);
  };
  const handleUpdate = async () => {
    if (!editingId) return;
  
    const { error } = await supabase
      .from('InterviewerTable')
      .update({
        FirstName: form.FirstName,
        LastName: form.LastName,
        EmailId: form.EmailId,
        PhoneNumber: form.PhoneNumber,
        job_id: form.job_id,
      })
      .eq('Id', editingId)
  
    if (!error) {
      setForm({ FirstName: '', LastName: '', EmailId: '', PhoneNumber: '', job_id: '' });
      setEditingId(null);
      await fetchInterviewers();
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this interviewer?')) {
      const { error } = await supabase
        .from('InterviewerTable')
        .delete()
        .eq('Id', id);
  
      if (!error) {
        await fetchInterviewers();
      }
    }
  };
  
  
  

  useEffect(() => {
    fetchJobs();
    fetchInterviewers();
  }, []);
  const filteredInterviewers = interviewers.filter(item =>
    item.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.job_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          {editingId ? "Update Interviewer" : "Add Interviewer"}
        </h2>

        <div className="grid gap-4 max-w-xl bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-8">
        <div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">First Name</label>
  <input
    type="text"
    value={form.FirstName}
    onChange={e => setForm({ ...form, FirstName: e.target.value })}
    className="w-full px-4 py-2 rounded-lg border border-gray-300"
    required
  />
</div>

<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">Last Name</label>
  <input
    type="text"
    value={form.LastName}
    onChange={e => setForm({ ...form, LastName: e.target.value })}
    className="w-full px-4 py-2 rounded-lg border border-gray-300"
    required
  />
</div>

          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.EmailId}
              onChange={e => setForm({ ...form, EmailId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={form.PhoneNumber}
              onChange={e => setForm({ ...form, PhoneNumber: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Job ID</label>
            <select
              value={form.job_id}
              onChange={e => setForm({ ...form, job_id: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
              required
            >
              <option value="">Select Job ID</option>
              {jobIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <button
            onClick={editingId ? handleUpdate : handleAdd}
            className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                {editingId ? 'Update Interviewer' : 'Add Interviewer'} 
              </>
            )}
          </button>
          {editingId && (
  <button
    onClick={() => {
      setEditingId(null);
      setForm({ FirstName: '', LastName: '', EmailId: '', PhoneNumber: '', job_id: '' });
    }}
    className="bg-gray-400 text-white px-4 py-2 rounded-lg"
  >
    Cancel
  </button>
)}

        </div>
        <div className="mb-4">
  <input
    type="text"
    placeholder="Search by First Name, Last Name, or Job ID"
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
  />
</div>


        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Interviewers List
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : interviewers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">No interviewers found. Add your first interviewer.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterviewers.map((item, index) => (
                  
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.FirstName} {item.LastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.EmailId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.PhoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.job_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                     <button onClick={() => {console.log('Deleting ID:', item.Id);item.Id && handleDelete(item.Id)}} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HRAddInterviewer;