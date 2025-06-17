import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { supabase } from '../../supabase.js';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaSearch } from 'react-icons/fa';
import PayPerInterview from '../Payment/PayPerInterview'; // adjust path if needed


const AdminInterviewUpdates: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [availableCredits, setAvailableCredits] = useState(0);
const [companyId, setCompanyId] = useState<string | null>(null);



  const fetchInterviews = async () => {
    if (!companyId) {
      console.warn("No companyId yet, skipping fetchInterviews.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email;
    if (!email) return;
  
    // 1. Get Admin ID
    const { data: adminData, error: adminError } = await supabase
      .from('AdminTable')
      .select('id')
      .eq('EmailId', email)
      .single();
  
    if (adminError || !adminData?.id) {
      console.error('Admin lookup failed:', adminError?.message);
      return;
    }
  
    const adminId = adminData.id;
  
    // 2. Get HRs under this admin
    const { data: hrs, error: hrError } = await supabase
      .from('HRTable')
      .select('Id, EmailId, FirstName, LastName')
      .eq('createdByAdminId', adminId);
  
    if (hrError) {
      console.error('Error fetching HRs:', hrError.message);
      return;
    }
  
    const hrEmails = hrs?.map(hr => hr.EmailId) || [];
    if (hrEmails.length === 0) {
      setInterviews([]);
      return;
    }
  
    const hrMap = new Map(
      hrs.map(hr => [hr.EmailId, `${hr.FirstName} ${hr.LastName}`])
    );
  
    // 3. Fetch Interviews created by those HRs
    const { data: interviewsData, error: intError } = await supabase
      .from('InterviewsTable')
      .select(`
        *,
        CandidateTable (
          FirstName,
          LastName,
          EmailId
        ),
        JobTable (
          JobID,
          title
        ),
         InterviewerTable (Id, FirstName, LastName)
      `)
      .in('createdby_email', hrEmails);
  
    if (intError) {
      console.error('Error fetching interviews:', intError.message);
      return;
    }
  
    // 4. Extract unique interviewer IDs from all interviews
    // 4. Extract unique interviewer IDs from all interviews
    const allInterviewerIds = new Set<string>();
    for (const i of interviewsData || []) {
      try {
        const ids = Array.isArray(i.interviewer_ids)
          ? i.interviewer_ids
          : JSON.parse(i.interviewer_ids || '[]');
        
        ids.forEach((id: string) => {
          if (id && typeof id === 'string') {
            allInterviewerIds.add(id); // Your IDs are clean UUIDs, no trim needed
          }
        });
      } catch (err) {
        console.warn('Could not parse interviewer_ids:', err);
      }
    }
    
    console.log('Unique Interviewer IDs:', Array.from(allInterviewerIds));
    
    // 5. Fetch all interviewer details
    const { data: allInterviewers, error: interviewerFetchErr } = await supabase
      .from('InterviewerTable')
      .select('Id, FirstName, LastName')
      .in('Id', Array.from(allInterviewerIds));
    
    if (interviewerFetchErr) {
      console.error('Error fetching interviewers:', interviewerFetchErr.message);
      return; // Add this to prevent further processing
    }
    
    console.log('Fetched Interviewers:', allInterviewers);
    
    // Debug check for missing IDs
    const missingIds = Array.from(allInterviewerIds).filter(
      id => !(allInterviewers || []).some(int => int.Id === id)
    );
    console.log('IDs not found in InterviewerTable:', missingIds);
    
    // Create the interviewer map
    const interviewerMap = new Map(
      (allInterviewers || []).map((int) => [
        int.Id,
        `${int.FirstName} ${int.LastName}`.trim()
      ])
    );
  
    // 6. Map and enrich interview data
    const interviewIds = interviewsData.map((i: any) => i.Id);

    const { data: usedCredits } = await supabase
    .from('credittransactions')
    .select('reference_id')
    .eq('credits_used', 1)
    .eq('company_id', companyId) // <-- ensure it’s this admin's company only
    .in('reference_id', interviewIds);
  

const creditUsedSet = new Set((usedCredits || []).map(c => c.reference_id));

    const processed = (interviewsData || []).map((i: any) => {
      let names: string[] = [];
  
      try {
        const ids = Array.isArray(i.interviewer_ids)
          ? i.interviewer_ids
          : JSON.parse(i.interviewer_ids || '[]');
  
        names = ids.map((id: string) => interviewerMap.get(id) || 'Unknown');
      } catch (err) {
        console.error('Failed to parse or map interviewer IDs', err);
      }
      console.log('Interviewer IDs:', i.interviewer_ids);
console.log('Names resolved:', names);

  
return {
  ...i,
  candidateName: i.CandidateTable ? `${i.CandidateTable.FirstName} ${i.CandidateTable.LastName}` : 'Unknown',
  candidateEmail: i.CandidateTable?.EmailId || '',
  interviewerNames: names,
  jobTitle: i.JobTable?.title || 'Unknown',
  jobCode: i.JobTable?.JobID || i.job_id,
  hrName: hrMap.get(i.createdby_email) || i.createdby_email,
  isPaid: i.payment_status === 'completed' 
  ? true 
  : creditUsedSet.has(i.Id)

};

    });
  
    setInterviews(processed);
  };
  
  

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) return;
  
      const { data: adminRecord } = await supabase
        .from('AdminTable')
        .select('company_id')
        .eq('EmailId', email)
        .single();
  
      const fetchedCompanyId = adminRecord?.company_id;
      if (!fetchedCompanyId) return;
  
      setCompanyId(fetchedCompanyId);
  
      const { data: creditsData } = await supabase
        .from('credittransactions')
        .select('credits_added, credits_used')
        .eq('company_id', fetchedCompanyId);
  
      const totalAdded = creditsData?.reduce((sum, row) => sum + row.credits_added, 0) || 0;
      const totalUsed = creditsData?.reduce((sum, row) => sum + row.credits_used, 0) || 0;
  
      setAvailableCredits(totalAdded - totalUsed);
    };
  
    load();
  }, []);
  useEffect(() => {
    if (companyId) {
      fetchInterviews();
    } 
  }, [companyId]);
    

  const filtered = interviews.filter(interview =>
    interview.candidateName?.toLowerCase().includes(search.toLowerCase())
  );


  const getPaymentBadge = (paymentStatus: string) => {
    return paymentStatus === 'completed' ?
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Paid</span> :
      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-700">📋 Interview Updates</h2>
        <div className="flex items-center gap-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by Candidate"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
  <table className="min-w-full text-sm text-gray-700">
    <thead className="bg-indigo-100 text-gray-700 text-sm">
      <tr>
        <th className="px-4 py-3 text-left">Candidate</th>
        <th className="px-4 py-3 text-left">Job ID</th>
        <th className="px-4 py-3 text-left">Interviewer</th>
        <th className="px-4 py-3 text-left">Date</th>
        <th className="px-4 py-3 text-left">Time</th>
        <th className="px-4 py-3 text-center">Status</th>
        <th className="px-4 py-3 text-center">Payment</th>
        <th className="px-4 py-3 text-left">HR Name</th>
      </tr>
    </thead>
    <tbody>
  {filtered.length === 0 ? (
    <tr>
      <td colSpan={8} className="text-center py-6 text-gray-500">
        No interviews found
      </td>
    </tr>
  ) : (
    filtered.map((interview, idx) => (
      <tr key={idx} className="border-b hover:bg-gray-50 text-sm">
        <td className="px-4 py-2">{interview.candidateName}</td>
        <td className="px-4 py-2">
        <div className="font-medium">{interview.jobCode}</div>
         <div className="text-xs text-gray-500">{interview.jobTitle}</div>
          </td>

        <td className="px-4 py-2">{interview.interviewerNames?.join(', ') || 'Unknown'}</td>
        <td className="px-4 py-2">{interview.interview_date || 'Unknown'}</td>
        <td className="px-4 py-2">{interview.start_time} - {interview.end_time}</td>
        <td className="px-4 py-2 text-center">
          <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
            interview.interview_status === 'Completed' ? 'bg-green-100 text-green-700' :
            interview.interview_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {interview.interview_status}
          </span>
        </td>
        <td className="px-4 py-2 text-center">
  {interview.isPaid ? (
    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
      Completed
    </span>
  ) : availableCredits > 0 ? (
    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
      Completed (via Credits)
    </span>
  ) : (
    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
      Payment Pending
    </span>
  )}
</td>


        <td className="px-4 py-2">{interview.hrName}</td>

      </tr>
    ))
  )}
</tbody>

  </table>
</div>

    </motion.div>
  );
};

export default AdminInterviewUpdates;