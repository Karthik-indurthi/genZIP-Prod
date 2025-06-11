import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

interface Interview {
  job_id: string;
  candidate_id: string;
  interviewer_id: string;
  interview_status: string;
  date: string;
  start_time: string;
  branch: string;
}

const InterviewTable = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchInterviews = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('InterviewsTable')
        .select('*')
        .eq('created_by', userData?.user?.id);

      setInterviews(data || []);
    };

    fetchInterviews();
  }, []);

  const filteredData = interviews.filter((item) =>
    item.job_id.toLowerCase().includes(search.toLowerCase()) &&
    (branch ? item.branch === branch : true) &&
    (status ? item.interview_status === status : true)
  );

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by Job ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Branches</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Pending">Pending</option>
          <option value="Selected">Selected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Job ID</th>
              <th className="py-3 px-6 text-left">Candidate</th>
              <th className="py-3 px-6 text-left">Interviewer</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Time</th>
              <th className="py-3 px-6 text-left">Branch</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{row.job_id}</td>
                <td className="py-3 px-6">{row.candidate_id}</td>
                <td className="py-3 px-6">{row.interviewer_id}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-white ${
                    row.interview_status === 'Scheduled'
                      ? 'bg-blue-500'
                      : row.interview_status === 'Pending'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}>
                    {row.interview_status}
                  </span>
                </td>
                <td className="py-3 px-6">{row.date}</td>
                <td className="py-3 px-6">{row.start_time}</td>
                <td className="py-3 px-6">{row.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewTable;
