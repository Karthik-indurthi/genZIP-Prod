import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const EmployeeScheduled: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeCity, setEmployeeCity] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    const storedName = localStorage.getItem('employeeName');
    if (!storedId) return;
    setEmployeeId(storedId);

    supabase
      .from('EmployeeTable')
      .select('city')
      .eq('EmployeeId', storedId)
      .single()
      .then(({ data }) => setEmployeeCity(data?.city));
  }, []);

  useEffect(() => {
    if (!employeeCity) return;
    fetchInterviews();
  }, [employeeCity]);

  const fetchInterviews = async () => {
    const { data, error } = await supabase
      .from('InterviewsTable')
      .select(`*, CandidateTable(*), JobTable(*)`)
      .in('interview_status', ['Scheduled', 'Allotted'])
      .is('accepted_by', null);
      console.log('Raw interviews:', data);

    if (error) return;

    const filtered = data.filter((i: any) => i.city === employeeCity);
    console.log('Filtered by city:', filtered);
    setInterviews(filtered);
  };

  const handleAccept = async (id: string) => {
    // First check if it's reservable by this employee
    const { data: interview } = await supabase
      .from('InterviewsTable')
      .select('reserved_by')
      .eq('Id', id)
      .single();
  
    if (interview?.reserved_by && interview.reserved_by !== employeeId) {
      alert('This interview is reserved by another employee.');
      return;
    }
  
    // Update with proper syntax
    const { error } = await supabase
      .from('InterviewsTable')
      .update({ 
        interview_status: 'Accepted', 
        accepted_by: employeeId, 
        accepted_at: new Date().toISOString(),
        reserved_by: null 
      })
      .eq('Id', id)
      .or(`reserved_by.eq.${employeeId},reserved_by.is.null`);
  
    if (error) {
      console.error('Accept error:', error);
      alert('Error accepting interview');
    } else {
      fetchInterviews();
    }
  };

  const handleReserve = async (id: string) => {
    const { data: row } = await supabase
      .from('InterviewsTable')
      .select('reserved_by')
      .eq('Id', id)
      .single();
  
    if (row?.reserved_by) {
      alert('This interview is already reserved.');
      return;
    }
  
    const { error } = await supabase
      .from('InterviewsTable')
      .update({
        interview_status: 'Allotted',
        reserved_by: employeeId
      })
      .eq('Id', id);
      if (error) {
        console.error('Reserve error:', error);
        alert('Error reserving interview');
      } else {
        fetchInterviews();
      }
  };
  

  const handleDecline = async (id: string) => {
    const { error } = await supabase
      .from('InterviewsTable')
      .update({ interview_status: 'Scheduled', reserved_by: null })
      .eq('Id', id)
      .eq('reserved_by', employeeId);

    if (!error) fetchInterviews();
  };

  const handleTransfer = async (id: string, newEmpId: string) => {
    const { data, error: fetchError } = await supabase
      .from('InterviewsTable')
      .select('transfer_log')
      .eq('Id', id)
      .single();

    if (fetchError) return;

    const newLog = data.transfer_log || [];
    newLog.push({ from: employeeId, to: newEmpId, at: new Date().toISOString() });

    const { error } = await supabase
      .from('InterviewsTable')
      .update({ accepted_by: newEmpId, transfer_log: newLog })
      .eq('Id', id)
      .eq('accepted_by', employeeId);

    if (!error) fetchInterviews();
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📝 Scheduled Interviews</h2>
      {interviews.length === 0 ? (
        <p>No interviews available in your city.</p>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.Id} className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold">
                Candidate: {interview.CandidateTable?.FirstName} {interview.CandidateTable?.LastName}
              </h3>
              <p>Job: {interview.JobTable?.title}</p>
              <p>Date: {interview.interview_date} | Time: {interview.start_time} - {interview.end_time}</p>
              <p>Status: {interview.interview_status}</p>
              <p>Payment: {interview.payment_status}</p>
              <p>
                Location Uploaded:{' '}
                {interview.location_uploaded ? (
                  <a
                    href={`https://maps.google.com/?q=${interview.latitude},${interview.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline ml-1"
                  >
                    📍 View
                  </a>
                ) : (
                  <span className="text-red-500"> ❌</span>
                )}
              </p>

              <div className="mt-3 space-x-2">
                {interview.payment_status === 'completed' && interview.interview_status === 'Scheduled' && (
                  <button
                    onClick={() => handleAccept(interview.Id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                )}

                {interview.payment_status !== 'completed' && interview.interview_status === 'Scheduled' && (
                  <button
                    onClick={() => handleReserve(interview.Id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Reserve
                  </button>
                )}

                {interview.interview_status === 'Allotted' && interview.reserved_by === employeeId && (
                  <button
                    onClick={() => handleDecline(interview.Id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Decline
                  </button>
                )}

                {interview.interview_status === 'Accepted' && interview.accepted_by === employeeId && (
                  <button
                    onClick={() => {
                      const newEmpId = prompt('Enter Employee ID to transfer to:');
                      if (newEmpId) handleTransfer(interview.Id, newEmpId);
                    }}
                    className="bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Transfer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeScheduled;
