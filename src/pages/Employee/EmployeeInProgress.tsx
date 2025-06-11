import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const EmployeeInProgress: React.FC = () => {
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoLink, setVideoLink] = useState('');
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (!employeeId) return;
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('InterviewsTable')
      .select('*')
      .eq('accepted_by', employeeId)
      .in('interview_status', ['Allotted', 'On the Way', 'Interview in Progress', 'completed'])
      .order('interview_date', { ascending: true })
      .limit(1);

    if (!error && data && data.length > 0) setInterview(data[0]);
    setLoading(false);
  };

  const updateInterview = async (fields: any) => {
    const { error } = await supabase
      .from('InterviewsTable')
      .update(fields)
      .eq('Id', interview.Id);

    if (!error) fetchInterview();
  };

  const handleStartTravel = () => {
    updateInterview({ interview_status: 'On the Way', employee_started_at: new Date() });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = `candidate_photos/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('employee_uploads').upload(filePath, file);

    if (error) return alert('Upload failed');

    const url = supabase.storage.from('employee_uploads').getPublicUrl(filePath).data.publicUrl;
    updateInterview({ candidate_photo_url: url, interview_status: 'Interview in Progress', recording_started_at: new Date() });
  };

  const handleFinishInterview = () => {
    updateInterview({ interview_status: 'completed', recording_completed_at: new Date() });
  };

  const handleVideoLinkSubmit = () => {
    if (!videoLink) return;
    updateInterview({ video_upload_url: videoLink });
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!interview) return <p className="p-4">No active interviews assigned.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">🎥 Interview In Progress</h2>
      <p><strong>Status:</strong> {interview.interview_status}</p>
      <p><strong>Date:</strong> {interview.interview_date}</p>
      <p><strong>Time:</strong> {interview.start_time} - {interview.end_time}</p>

      {interview.interview_status === 'Allotted' && (
        <button
          onClick={handleStartTravel}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Travel
        </button>
      )}

      {interview.interview_status === 'On the Way' && (
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Upload Candidate Photo:</label>
          <input type="file" onChange={handlePhotoUpload} />
        </div>
      )}

      {interview.interview_status === 'Interview in Progress' && (
        <button
          onClick={handleFinishInterview}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Finish Interview
        </button>
      )}

      {interview.interview_status === 'completed' && (
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Upload Final Video Link:</label>
          <input
            type="url"
            placeholder="https://yourvideolink.com"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full border p-2 mb-2"
          />
          <button
            onClick={handleVideoLinkSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Submit Video Link
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeInProgress;
