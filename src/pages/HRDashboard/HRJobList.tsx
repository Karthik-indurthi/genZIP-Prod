import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase.js';

interface Job {
  id: string;
  title: string;
  jobId: string;
  description: string;
  closureDate: string;
  isHighPriority: boolean;
  totalCandidates: number;
  interviewed: number;
  pending: number;
}

const HRJobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const { data, error } = await supabase
      .from('JobTable')
      .select('*')
      .eq('created_by', userData.user.id);

    if (!error && data) {
      setJobs(data);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 overflow-auto h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">🧾 Job Listings</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="px-4 py-3">Job ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Closure Date</th>
              <th>Priority</th>
              <th>Interviewed</th>
              <th>Pending</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100 transition">
                <td className="px-4 py-2 font-medium text-indigo-800">{job.jobId}</td>
                <td>{job.title}</td>
                <td className="max-w-xs truncate">{job.description}</td>
                <td>{job.closureDate}</td>
                <td>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      job.isHighPriority ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {job.isHighPriority ? 'High' : 'Normal'}
                  </span>
                </td>
                <td>{job.interviewed}</td>
                <td>{job.pending}</td>
                <td>{job.totalCandidates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default HRJobList;
