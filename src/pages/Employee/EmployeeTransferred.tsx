import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const EmployeeTransferred: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (!employeeId) return;
    fetchTransferredInterviews();
  }, []);

  const fetchTransferredInterviews = async () => {
    const { data, error } = await supabase
      .from('InterviewsTable')
      .select('*');

    if (error) return;

    const result = (data || []).filter((int) =>
      Array.isArray(int.transfer_log) &&
      int.transfer_log.some(
        (entry: any) => entry.from === employeeId || entry.to === employeeId
      )
    );

    setInterviews(result);
  };

  const getTransferHistory = (log: any[]) => {
    return log.map((entry, idx) => (
      <li key={idx} className="text-xs">
        🔁 {entry.from} → {entry.to} at {new Date(entry.at).toLocaleString()}
      </li>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">🔄 Transferred Interviews</h2>
      {interviews.length === 0 ? (
        <p>No transfer activity yet.</p>
      ) : (
        <div className="space-y-4">
          {interviews.map((int) => (
            <div key={int.Id} className="p-4 bg-white shadow rounded">
              <p><strong>Interview ID:</strong> {int.Id}</p>
              <p><strong>Status:</strong> {int.interview_status}</p>
              <p><strong>Accepted By:</strong> {int.accepted_by}</p>
              <p><strong>Date:</strong> {int.interview_date}</p>
              <p><strong>Transfer History:</strong></p>
              <ul className="ml-4 list-disc">{getTransferHistory(int.transfer_log)}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTransferred;
