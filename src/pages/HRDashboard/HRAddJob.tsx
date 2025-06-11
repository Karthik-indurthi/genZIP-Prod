import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { motion } from 'framer-motion';

interface Job {
  Id?: string;
  JobID: string;
  title: string;
  Branch:string;
  description: string;
  closureDate: string;
  highPriority: boolean;
  created_by?: string;
}

const HRAddJob: React.FC = () => {
  const [form, setForm] = useState<Job>({
    JobID: '',
    title: '',
    Branch:'',
    description: '',
    closureDate: '',
    highPriority: false,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;
  
    const { data, error } = await supabase
      .from('JobTable')
      .select('*')
      .eq('created_by', userData.user.id);
  
    console.log('Current user ID:', userData.user.id);
    console.log('Fetched jobs:', data);
    console.log('Fetch error:', error);
  
    if (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
      return;
    }
  
    if (data) {
      setJobs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchJobs();
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    if (editingId) {
      await supabase
        .from('JobTable')
        .update({ 
          JobID: form.JobID,
          title: form.title,
          Branch: form.Branch,
          description: form.description,
          closureDate: form.closureDate,
          highPriority: form.highPriority
        })
        .eq('Id', editingId);
      setEditingId(null);
    } else {
      const { error } = await supabase
  .from('JobTable')
  .insert([{ 
    JobID: form.JobID,
    title: form.title,
    Branch: form.Branch,
    description: form.description,
    closureDate: form.closureDate,
    highPriority: form.highPriority,
    created_by: userData.user.id 
  }]);

if (error) {
  console.error('Insert failed:', error.message);
  alert(`Insert failed: ${error.message}`);
}
    } 

    setForm({ Id: '',JobID: '', title: '', description: '',Branch:'', closureDate: '', highPriority: false });
    await fetchJobs();
    setLoading(false);
  };
  
  const handleEdit = (job: Job) => {
    console.log("Editing job:", job);
    console.log("Job id "+job.Id);
    if (!job.Id) {
      console.error("Job ID is missing.");
      return;
    }
  
    setForm({ ...job });
    setEditingId(job.Id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setLoading(true);
      const { error } = await supabase.from('JobTable').delete().eq('Id', id);
      if (error) {
        console.error('Delete failed:', error.message);
        alert(`Delete failed: ${error.message}`);
        setLoading(false);
      return;
      }
      setJobs(jobs.filter(job => job.Id !== id));
    setLoading(false);
    }
  };
  const filteredJobs = jobs.filter((job) =>
    job.JobID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          {editingId ? 'Edit Job' : 'Add New Job'}
        </h2>

        <div className="grid gap-4 max-w-xl bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-8">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Job ID</label>
            <input
              type="text"
              value={form.JobID}
              onChange={e => setForm({ ...form, JobID: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
              placeholder="JOB-123"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition h-32"
              placeholder="Job responsibilities and requirements..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Closure Date</label>
            <input
              type="date"
              value={form.closureDate}
              onChange={e => setForm({ ...form, closureDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="highPriority"
              checked={form.highPriority}
              onChange={e => setForm({ ...form, highPriority: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="highPriority" className="ml-2 block text-sm text-gray-700">
              Mark as High Priority
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
  <button
    onClick={handleSubmit}
    disabled={loading}
    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
  >
    {loading ? 'Processing...' : editingId ? 'Update Job' : 'Add Job'}
  </button>

  {editingId && (
    <button
      onClick={() => {
        setForm({ 
          Id: '',
          JobID: '', 
          title: '', 
          Branch: '', 
          description: '', 
          closureDate: '', 
          highPriority: false 
        });
        setEditingId(null);
      }}
      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
    >
      Cancel
    </button>
  )}
</div>
        </div>
        <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by Job ID or Title"
    className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition"
  />

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Job Listings
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
          ) : jobs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">No jobs found. Add your first job listing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closure Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <div className="mb-4">  
</div>


                <tbody className="bg-white divide-y divide-gray-200"> 
                  
                {filteredJobs.length === 0 && jobs.length > 0 ? (
  <div className="p-6 text-center text-gray-500">
    No jobs match your search criteria
  </div>
) : filteredJobs.map((job) => (
                    <tr key={job.Id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.JobID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{job.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.closureDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.highPriority ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {job.highPriority ? 'High' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                           onClick={() => {
                            if (!job.Id) {
                              console.error('Missing job ID for delete.');
                              return;
                            }
                            handleDelete(job.Id);
                          }}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
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

export default HRAddJob;