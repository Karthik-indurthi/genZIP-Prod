import React from 'react';
import { FaShieldAlt, FaVideo, FaUserCheck } from 'react-icons/fa';
import { openRazorpay } from '../../utils/razorpay';
import { supabase } from '../../supabase';
import { useLocation, useNavigate } from 'react-router-dom';

const PayPerInterview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Read all data passed from HRScheduleInterview
  const {
    selectedJob,
    selectedCandidate,
    selectedInterviewers,
    interviewDate,
    fromTime,
    toTime,
    duration,
    companyId
  } = location.state || {};

  const handlePayNow = async () => {
    if (!selectedJob || !selectedCandidate || !selectedInterviewers || !interviewDate || !fromTime || !toTime) {
      alert('Missing required details. Please go back and fill the form again.');
      return;
    }

    // ✅ Open Razorpay & on success:
    openRazorpay(2000, 'Pay Per Interview', async () => {
      // 1️⃣ Insert interview in Supabase
      const { data: userData } = await supabase.auth.getUser();
      const interviewData = {
        job_id: selectedJob,
        candidate_id: selectedCandidate,
        interviewer_ids: selectedInterviewers,
        interview_date: interviewDate,
        start_time: `${fromTime}:00`,
        end_time: `${toTime}:00`,
        duration,
        interview_status: 'Scheduled',
        payment_status: 'Pending',
        created_by: userData?.user?.id,
        createdby_email: userData?.user?.email,
        created_at: new Date().toISOString(),
        company_id: companyId
      };

      const { data, error } = await supabase
        .from('InterviewsTable')
        .insert([interviewData])
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to insert interview:', error.message);
        alert('Something went wrong. Please try again.');
        return;
      }

      // 2️⃣ Insert credit record
      const { error: creditError } = await supabase
        .from('credittransactions')
        .insert({
          company_id: companyId,
          credits_added: 1,
          used: true,
          credits_used: 1,
          reason: 'Pay Per Interview',
          reference_id: data.Id,
          amount_paid: 2000,
          payment_mode: 'Razorpay'
        });

      if (creditError) {
        console.error('❌ Failed to insert credit:', creditError.message);
        alert('Payment succeeded but failed to record credit. Please contact support.');
        return;
      }

      // 3️⃣ Redirect to success or back to schedule
      navigate('/hr/schedule');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg text-center">
        <h1 className="text-3xl font-extrabold text-red-600 mb-4">Payment Required</h1>
        <p className="text-gray-700 text-base mb-2">
          To proceed with this interview, please complete your one-time payment of
        </p>
        <p className="text-4xl font-bold text-red-500 mb-6">₹2,000</p>

        <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 text-left mb-6">
          <div className="flex items-center gap-2">
            <FaUserCheck className="text-red-400" /> GenZipper on-site identity verification
          </div>
          <div className="flex items-center gap-2">
            <FaVideo className="text-red-400" /> Full video recording of the interview
          </div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-red-400" /> Malpractice prevention guarantee
          </div>
        </div>

        <button
          onClick={handlePayNow}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-red-700 transition duration-200"
        >
          Pay & Schedule Interview
        </button>

        <p className="text-xs text-gray-400 mt-4">
          This ensures a secure and verified interview experience.
        </p>
      </div>
    </div>
  );
};

export default PayPerInterview;
