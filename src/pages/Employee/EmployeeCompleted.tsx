import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const EmployeeCompleted: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (!employeeId) return;
    fetchCompleted();
  }, []);

  const fetchCompleted = async () => {
    const { data, error } = await supabase
      .from('InterviewsTable')
      .select(`*, CandidateTable(*), JobTable(*)`)
      .eq('accepted_by', employeeId)
      .eq('interview_status', 'completed');

    if (!error) setInterviews(data || []);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">✅ Completed Interviews</h2>
      {interviews.length === 0 ? (
        <p>No completed interviews yet.</p>
      ) : (
        <div className="space-y-3">
          {interviews.map((int) => (
            <div key={int.Id} className="p-4 bg-white rounded shadow">
              <p>Candidate: {int.CandidateTable?.FirstName} {int.CandidateTable?.LastName}</p>
              <p>Job: {int.JobTable?.title}</p>
              <p>Date: {int.interview_date}</p>
              <p>Payment: {int.payment_status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeCompleted;
