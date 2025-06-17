import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { motion } from 'framer-motion';
import { sendInterviewScheduledMail } from '../../utils/sendInterviewScheduledMail.js';
import { useNavigate } from 'react-router-dom';
import PayPerInterview from '../Payment/PayPerInterview';

const HRScheduleInterview = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [interviewDate, setInterviewDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [availableCredits, setAvailableCredits] = useState(0);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  


  // Calculate duration when from/to times change
  useEffect(() => {
    if (fromTime && toTime) {
      const start = new Date(`1970-01-01T${fromTime}`);
      const end = new Date(`1970-01-01T${toTime}`);
      const diff = (end.getTime() - start.getTime()) / 60000;
      setDuration(diff > 0 ? diff : null);
    }
  }, [fromTime, toTime]);
  useEffect(() => {
    setFormError('');
  }, [selectedCandidate, selectedJob]);

  // Fetch data
  useEffect(() => {
    const loadInitialData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) return;
  
      // ✅ STEP 1: Get HR's company_id
      const userEmail = userData.user.email;
      const { data: hrRecord } = await supabase
      .from('HRTable')
      .select('*')
      .eq('EmailId', userEmail)
      .single();
    
    if (!hrRecord) {
      console.error("❌ HR record not found for email:", userEmail);
      return;
    }
    const { data: adminRecord } = await supabase
  .from('AdminTable')
  .select('company_id')
  .eq('id', hrRecord.createdByAdminId)
  .single();

  const fetchedCompanyId = adminRecord?.company_id;
  if (!fetchedCompanyId) {
    console.error("❌ Admin does not have a company_id");
    return;
  }
  setCompanyId(fetchedCompanyId);
  // ✅  Check if subscribed
const { data: subscriptionData, error: subError } = await supabase
.from('companysubscription')
.select('*')
.eq('company_id', fetchedCompanyId)
.eq('status', 'active')
.single();

if (subscriptionData) {
console.log('Company is subscribed ✅');
setIsSubscribed(true);
} else {
console.log('Company is not subscribed');
setIsSubscribed(false);
}

  
// ✅ STEP 2: Calculate available credits
const { data: creditRecords, error: creditError } = await supabase
  .from('credittransactions')
  .select('credits_added, credits_used')
  .eq('company_id', fetchedCompanyId);



if (creditError) {
console.error("Error fetching credit transactions:", creditError.message);
}

let totalAdded = 0;
let totalUsed = 0;

if (creditRecords && creditRecords.length > 0) {
creditRecords.forEach(rec => {
  totalAdded += rec.credits_added || 0;
  totalUsed += rec.credits_used || 0;
});
}

const availableCredits = totalAdded - totalUsed;
console.log("Available credits for company:", availableCredits);

// ⏩ Save it to state so we can use it later in the UI
setAvailableCredits(availableCredits);
  
      // 🔽 At this point, you now have `companyId` available for later use
  
      await fetchJobs();
await fetchCandidates();
await fetchInterviewers();
// ✅ Only call fetchInterviews if companyId is set
if (fetchedCompanyId) {
  await fetchInterviews(fetchedCompanyId);
}

  
      const { data: interviewersData } = await supabase
        .from('InterviewerTable')
        .select('*')
        .eq('created_by', userData.user.id);
  
      if (interviewersData) {
        setInterviewers(interviewersData);
        setTimeout(() => {
          fetchInterviews(); // no need for true anymore
        }, 0);
      }
    };
  
    loadInitialData();
  }, []);
  

  const fetchJobs = async () => {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user?.id) return;
    const { data } = await supabase.from('JobTable').select('*').eq('created_by', userData.user.id);
    if (data) setJobs(data);
  };

  const fetchCandidates = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;
    const { data } = await supabase.from('CandidateTable').select('*').eq('created_by', userData.user.id);
    if (data) setCandidates(data);
  };

  const fetchInterviewers = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;
    const { data } = await supabase.from('InterviewerTable').select('*').eq('created_by', userData.user.id);
    if (data) setInterviewers(data);
  };

  const fetchCompanyId = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.email) return null;
  
    const { data: hrRecord } = await supabase
      .from('HRTable')
      .select('*')
      .eq('EmailId', userData.user.email)
      .single();
  
    if (!hrRecord) return null;
  
    const { data: adminRecord } = await supabase
      .from('AdminTable')
      .select('company_id')
      .eq('id', hrRecord.createdByAdminId)
      .single();
  
    return adminRecord?.company_id || null;
  };
  // After fetchCompanyId
const fetchAvailableCredits = async (company: string) => {
  const { data: creditRecords, error: creditError } = await supabase
    .from('credittransactions')
    .select('credits_added, credits_used')
    .eq('company_id', company);

  let totalAdded = 0;
  let totalUsed = 0;
  if (creditRecords) {
    creditRecords.forEach(rec => {
      totalAdded += rec.credits_added || 0;
      totalUsed += rec.credits_used || 0;
    });
  }
  const available = totalAdded - totalUsed;
  console.log("✅ Re-fetched available credits:", available);
  setAvailableCredits(available);
  return available;
};


  const fetchInterviews = async (id?: string | null) => {
    const company = id ?? companyId;
    if (!id) {
      console.warn("⚠️ fetchInterviews: no companyId");
      return;
    }
  
    const { data: usedCredits } = await supabase
      .from('credittransactions')
      .select('reference_id')
      .eq('company_id', id)
      .eq('credits_used', 1);
  
    const creditUsedSet = new Set((usedCredits || []).map(c => c.reference_id));
  
    const { data, error } = await supabase
      .from('InterviewsTable')
      .select(`
        *,
        JobTable (title, description),
        CandidateTable (FirstName, LastName, EmailId)
      `)
      .eq('company_id', id);
  
    if (error) {
      console.error("Supabase join query error:", error.message);
      return;
    }
  
    const processedData = data.map(interview => ({
      id: interview.id,
      ...interview,
      jobTitle: interview.JobTable?.title,
      jobDescription: interview.JobTable?.description,
      candidateName: `${interview.CandidateTable?.FirstName} ${interview.CandidateTable?.LastName}`,
      candidateEmail: interview.CandidateTable?.EmailId,
      location_uploaded: interview.location_uploaded,
      isPaid: interview.payment_status === 'completed' || creditUsedSet.has(interview.Id),
      interviewerNames: (() => {
        let ids = [];
        try {
          ids = typeof interview.interviewer_ids === 'string'
            ? JSON.parse(interview.interviewer_ids)
            : interview.interviewer_ids;
        } catch (err) {
          console.error("Failed to parse interviewer_ids", err);
        }
        return Array.isArray(ids)
          ? ids.map((id: string) => {
              const interviewerMap = new Map(interviewers.map(i => [String(i.Id), i]));
              const match = interviewerMap.get(String(id));
              return match ? `${match.FirstName} ${match.LastName}` : 'Unknown';
            })
          : [];
      })(),
      interviewerEmails: (() => {
        let ids = [];
        try {
          ids = typeof interview.interviewer_ids === 'string'
            ? JSON.parse(interview.interviewer_ids)
            : interview.interviewer_ids;
        } catch (err) {
          console.error("Failed to parse interviewer_ids", err);
        }
        return Array.isArray(ids)
          ? ids.map((id: string) => {
              const match = interviewers.find(i => String(i.Id) === String(id));
              return match?.EmailId || 'Unknown';
            })
          : [];
      })(),
    }));
  
    setInterviews(processedData);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const id = await fetchCompanyId();
      if (!id) return;
  
      setCompanyId(id);
  
      const { data: creditRecords, error: creditError } = await supabase
        .from('credittransactions')
        .select('credits_added, credits_used')
        .eq('company_id', id);
  
      let totalAdded = 0;
      let totalUsed = 0;
      if (creditRecords) {
        creditRecords.forEach(rec => {
          totalAdded += rec.credits_added || 0;
          totalUsed += rec.credits_used || 0;
        });
      }
      setAvailableCredits(totalAdded - totalUsed);
  
      await fetchJobs();
      await fetchCandidates();
      await fetchInterviewers();
      await fetchInterviews(id);
    };
  
    loadInitialData();
  }, []);
  
  

  const resetForm = () => {
    setSelectedJob('');
    setSelectedCandidate('');
    setSelectedInterviewers([]);
    setInterviewDate('');
    setFromTime('');
    setToTime('');
    setDuration(null);
    setEditingInterviewId(null);  
  };
  const formatTime = (time: string) => {
    if (!time) return '';
    const parts = time.split(':');
    if (parts.length === 2) return `${time}:00`; // converts "HH:MM" -> "HH:MM:00"
    return time; // already in "HH:MM:SS"
  };
  

  const scheduleInterview = async () => {
    setIsScheduling(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const job = jobs.find(j => String(j.Id)=== String(selectedJob));
    const candidate = candidates.find(c => String(c.Id) === String(selectedCandidate));
    console.log("selectedJob:", selectedJob);
console.log("selectedCandidate:", selectedCandidate);
    
if (
  !selectedJob ||
  !selectedCandidate ||
  selectedInterviewers.length === 0 ||
  selectedInterviewers.some(id => id === '') ||  // ✅ NEW: check for blanks
  !interviewDate ||
  !fromTime ||
  !toTime
) {
  alert('Please fill all required fields');
  setIsScheduling(false);
  return;
}

// ✅ NEW: check with 'used' flag properly
console.log('🔑 Checking unused credits and subscription...');

let hasUnusedCredit = false;

if (companyId) {
  const { data: unusedCredits, error: unusedError } = await supabase
    .from('credittransactions')
    .select('*')
    .eq('company_id', companyId)
    .eq('used', false)
    .limit(1);

  if (unusedError) {
    console.error("❌ Error checking unused credits:", unusedError.message);
    setIsScheduling(false);
    return;
  }

  hasUnusedCredit = unusedCredits && unusedCredits.length > 0;
}

console.log('🔑 Is subscribed:', isSubscribed);
console.log('🔑 Has unused credit:', hasUnusedCredit);

if (!isSubscribed && !hasUnusedCredit) {
  console.log('No unused credits — redirecting to Pay Per Interview');
  navigate('/payperinterview', {
    state: {
      selectedJob,
      selectedCandidate,
      selectedInterviewers,
      interviewDate,
      fromTime,
      toTime,
      duration,
      companyId,
    },
  });
  setIsScheduling(false);
  return;
}

// ✅ Otherwise: not subscribed but has credits → proceed


    const { data: existing, error: checkError } = await supabase
  .from('InterviewsTable')
  .select('*')
  .eq('candidate_id', selectedCandidate)
  .eq('job_id', selectedJob)
  .neq('interview_status', 'completed');

if (existing && existing.length > 0 && (!editingInterviewId || String(existing[0].Id) !== String(editingInterviewId))) {
  setFormError('An interview for this candidate and job is already scheduled. Please complete or delete the previous one.');
  setIsScheduling(false);
  return;
}

    // Create interview for each selected interviewer
    const interviewData = {
      job_id: selectedJob,
      candidate_id: selectedCandidate,
      candidate_phone: candidate?.PhoneNumber,
      interviewer_ids: selectedInterviewers,
      interview_date: interviewDate,
      start_time: formatTime(fromTime),
      end_time: formatTime(toTime),
      duration,
      interview_status: 'Scheduled',
      payment_status: 'Pending',
      created_by: userData.user.id,
      createdby_email: userData.user.email,
      created_at: new Date().toISOString(),
      JobDescription: job?.description || '', 
      city: candidate?.city || '',
      company_id: companyId 
    };
    
    let data = null;
let error = null;
console.log('editingInterviewId=>'+editingInterviewId);
if (editingInterviewId) {
  const result = await supabase
    .from('InterviewsTable')
    .update(interviewData)
    .eq('Id', editingInterviewId)
    .select()
    .throwOnError();

  data = result.data;
  error = result.error;
} else {
  const result = await supabase
    .from('InterviewsTable')
    .insert([interviewData])
    .select()
    .throwOnError();  

  data = result.data;
  error = result.error;
}

    
    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log("Inserted interview:", data[0]);
      // ✅ 1️⃣ Immediately deduct one credit for this interview
      
      if (!companyId) {
  console.error("❌ Cannot schedule: no companyId");
  setIsScheduling(false);
  return;
}

if (isSubscribed) {
  // ✅ If subscribed, log usage for tracking (optional)
  await supabase.from('credittransactions').insert({
    company_id: companyId,
    credits_added: 0,
    used: true,
    reference_id: data[0].Id,
    reason: 'Subscription',
    amount_paid: 0,
    payment_mode: 'Subscription'
  });
  console.log("✅ Marked subscription usage for interview:", data[0].Id);
} else {
  // ✅ Not subscribed → find 1 unused credit and mark it used
  const { data: freeCredit, error: freeError } = await supabase
    .from('credittransactions')
    .select('*')
    .eq('company_id', companyId)
    .eq('used', false)
    .limit(1)
    .single();

  if (freeError || !freeCredit) {
    console.error("❌ No free credit found to mark used:", freeError?.message);
    setIsScheduling(false);
    return;
  }

  const { error: markError } = await supabase
    .from('credittransactions')
    .update({
      used: true,
      reference_id: data[0].Id
    })
    .eq('id', freeCredit.id);

  if (markError) {
    console.error("❌ Failed to mark credit as used:", markError.message);
  } else {
    console.log(`✅ Marked credit ${freeCredit.id} as used for interview ${data[0].Id}`);
  }
} 


    }
    console.log("Resolved candidate:", candidate);
    console.log("Candidate email:", candidate?.EmailId);
    console.log("interviewr Id:", data[0].Id);
    
    for (const interviewerId of selectedInterviewers) {
      const interviewer = interviewers.find(i => String(i.Id) === String(interviewerId));
      await sendInterviewScheduledMail({
        candidateName: `${candidate?.FirstName} ${candidate?.LastName}`,
        candidateEmail: candidate?.EmailId,
        jobTitle: job?.title,
        interviewerName: `${interviewer?.FirstName} ${interviewer?.LastName}`,
        fromTime,
        toTime,
        interviewDate,
        interviewId: data[0].Id
      });
      
    }
    // ✅ Send WhatsApp message to candidate
const candidatePhone = candidate?.PhoneNumber; // Ensure this field exists in your CandidateTable

if (candidatePhone) {
  const baseUrl = window.location.origin;
  const locationLink = `${baseUrl}/location-upload/${data[0].id}`;

  const message = `Hi ${candidate.FirstName}, your interview for the role of ${job.title} is scheduled on ${interviewDate} from ${fromTime} to ${toTime}. Please confirm and upload your location here: ${locationLink}`;

  const encodedMessage = encodeURIComponent(message);
  const phone = candidatePhone.replace(/^\+/, ''); // Remove '+' if already included
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  // ✅ Open WhatsApp chat in new tab (optional for testing)
  window.open(whatsappUrl, '_blank');
}

    
    console.log("editingInterviewId at render", editingInterviewId);
    resetForm();
    setIsScheduling(false);
    fetchInterviews(companyId);
  };

  const editInterview = (interview: any) => {
    if (interview.employee_started_at) {
      alert("Interview cannot be edited because GenZipper has already started.");
      return;
    }
  
    let parsedIds: string[] = [];
  
    try {
      parsedIds = typeof interview.interviewer_ids === 'string'
        ? JSON.parse(interview.interviewer_ids)
        : interview.interviewer_ids || [];
    } catch (err) {
      console.error("Error parsing interviewer_ids in edit:", err);
      parsedIds = [];
    }
  
    setSelectedJob(String(interview.job_id));
    setSelectedCandidate(String(interview.candidate_id));
    setSelectedInterviewers(parsedIds.map(String));
    setInterviewDate(interview.interview_date || '');
    setFromTime(interview.start_time);
    setToTime(interview.end_time);
    setDuration(interview.duration);
    setEditingInterviewId(String(interview.Id));  // Only set once and ensure it's a string
  };
  
  

  const deleteInterview = async (id: string) => {
    const { data: interviewData, error: fetchError } = await supabase
      .from('InterviewsTable')
      .select('interview_status, payment_status, employee_started_at')
      .eq('Id', id)
      .single();
  
    if (fetchError || !interviewData) {
      alert('Error fetching interview details.');
      console.error(fetchError);
      return;
    }
  
    
  
    if (
      interviewData.interview_status === 'Video Uploaded' ) {
      alert('This interview cannot be deleted because payment is completed or video is uploaded.');
      return;
    }
    if (interviewData.employee_started_at) {
      alert("Interview cannot be deleted because GenZipper has already started.");
      return;
    }
  
    if (confirm('Are you sure you want to delete this interview?')) {
      const { error } = await supabase.from('InterviewsTable').delete().eq('Id', id);
      if (error) {
        console.error('❌ Delete failed:', error.message);
        alert('Delete failed: ' + error.message);
      } else {
        console.log('✅ Interview deleted');
        // ✅ Rollback the reserved credit usage
        setInterviews(prev => prev.filter(i => String(i.Id) !== String(id)));
        // ✅ Correct rollback: find the exact row FIRST then update it.
const { data: creditsToRollback, error: fetchRollbackError } = await supabase
.from('credittransactions')
.select('id')
.eq('reference_id', id)
.eq('used', true)
.limit(1);

if (fetchRollbackError) {
console.error("❌ Failed to find credit for rollback:", fetchRollbackError.message);
} else if (creditsToRollback && creditsToRollback.length > 0) {
const creditId = creditsToRollback[0].id;
const { error: updateError } = await supabase
  .from('credittransactions')
  .update({
    used: false,
    reference_id: ''
  })
  .eq('id', creditId);

if (updateError) {
  console.error("❌ Failed to rollback credit:", updateError.message);
} else {
  console.log(`✅ Credit ${creditId} rolled back for deleted interview: ${id}`);
}
} else {
console.warn("⚠️ No used credit found to rollback for this interview");
}


if (companyId) {
  const updated = await fetchAvailableCredits(companyId);
  console.log("♻️ Updated credits after delete:", updated);
  setAvailableCredits(updated);
}
      }
    }
  };
  
  
  

  const removeInterviewer = (index: number) => {
    const updated = [...selectedInterviewers];
    updated.splice(index, 1);
    setSelectedInterviewers(updated);
  };

  const addInterviewer = () => {
    if (selectedInterviewers.length < interviewers.length) {
      setSelectedInterviewers([...selectedInterviewers, '']);
    }
  };

  const updateInterviewer = (index: number, value: string) => {
    const updated = [...selectedInterviewers];
    updated[index] = value;
    setSelectedInterviewers(updated);
  };

  const filteredInterviews = interviews.filter(interview => {
    const searchLower = searchTerm.toLowerCase();
    return (
      interview.candidateName?.toLowerCase().includes(searchLower) ||
      interview.interviewerName?.toLowerCase().includes(searchLower)
    );
  });

  // Get available interviewers (not already selected)
  const availableInterviewers = interviewers.filter(
    interviewer => !selectedInterviewers.includes(String(interviewer.Id))
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Interview</h2>
      
      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Job Selection */}
          <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Job Position *</label>
  <select
    value={selectedJob}
    onChange={e => setSelectedJob(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
  >
    <option value="">Select Job</option>
    {jobs.map(j => (
      <option key={j.Id} value={String(j.Id)}>
        {j.JobID} - {j.title}
      </option>
    ))}
  </select>
  {(() => {
  const selectedJobObj = jobs.find(j => String(j.Id) === String(selectedJob));
  return selectedJobObj?.description ? (
    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600 max-h-32 overflow-y-auto">
      <p className="font-medium">Job Description:</p>
      <p className="whitespace-pre-wrap">{selectedJobObj.description}</p>
    </div>
  ) : null;
})()}
</div>

          {/* Candidate Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Candidate *</label>
            <select
              value={selectedCandidate}
              onChange={e => setSelectedCandidate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Candidate</option>
              {candidates.map(c => (
                <option key={c.Id} value={String(c.Id)}>
                  {c.FirstName} {c.LastName}
                </option>
              ))}
            </select>
            {(() => {
  const selectedCandidateObj = candidates.find(c => String(c.Id) === String(selectedCandidate));
  return selectedCandidateObj ? (
    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
      <p>Name: {selectedCandidateObj.FirstName} {selectedCandidateObj.LastName}</p>
      <p>Email: {selectedCandidateObj.EmailId}</p>
    </div>
  ) : null;
})()}
          </div>

          {/* Interviewers Selection */}
          <div className="space-y-2 md:col-span-2">
  <label className="block text-sm font-medium text-gray-700">Interviewers *</label>
  {selectedInterviewers.map((interviewerId, index) => {
  const key = interviewerId || `temp-${index}`;
  const interviewer = interviewers.find(i => i.Id === String(interviewerId));
  return (
    <div key={key} className="space-y-2">
        <div className="flex gap-2 items-center"> 
          <select
            value={interviewerId}
            onChange={e => updateInterviewer(index, e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Interviewer {index + 1}</option>
            {availableInterviewers.map(i => (
              <option key={i.Id} value={i.Id}>
                {i.FirstName} {i.LastName}
              </option>
            ))}
          </select>
          {selectedInterviewers.length > 1 && (
            <button
              type="button"
              onClick={() => removeInterviewer(index)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
            >
              Remove
            </button>
          )}
        </div>
        {interviewer && (
          <div className="ml-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
            <p><span className="font-medium">Name:</span> {interviewer.FirstName} {interviewer.LastName}</p>
            <p><span className="font-medium">Email:</span> {interviewer.EmailId}</p>
          </div>
        )}  
      </div>
    );
  })}
  {availableInterviewers.length > 0 && (
    <button
      type="button"
      onClick={addInterviewer}
      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
      disabled={availableInterviewers.length === 0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Add Interviewer
    </button>
  )}
</div>

          {/* Date and Time Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Interview Date *</label>
            <input
              type="date"
              value={interviewDate}
              onChange={e => setInterviewDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Time Slot *</label>
            <div className="flex gap-2">
              <input
                type="time"
                value={fromTime}
                onChange={e => setFromTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="flex items-center">to</span>
              <input
                type="time"
                value={toTime}
                onChange={e => setToTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {duration !== null && (
              <p className="text-sm text-gray-600 mt-1">
                Duration: <span className="font-medium">{Math.floor(duration / 60)}h {duration % 60}m</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-2">
        {formError && (
  <div className="text-red-600 text-sm mb-4">{formError}</div>
)}

<button
  onClick={scheduleInterview}
  disabled={isScheduling || !!formError}
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
>
            
            {isScheduling ? (
  <span className="flex items-center">
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {editingInterviewId ? 'Updating...' : 'Scheduling...'}
  </span>
) : (
  editingInterviewId ? 'Update Interview' : 'Schedule Interview'
)}
          </button>
          {editingInterviewId && (
            
            <button
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Interviews Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Scheduled Interviews</h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by candidate or interviewer"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Location
                    </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map(interview => (
                  <tr key={interview.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                      <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.jobTitle}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{interview.jobDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                       {interview.interviewerNames?.join(', ')}
                      </div>
                    <div className="text-sm text-gray-500">
                       {interview.interviewerEmails?.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(interview.interview_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {interview.start_time} - {interview.end_time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(interview.duration / 60)}h {interview.duration % 60}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${interview.interview_status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                          interview.interview_status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {interview.interview_status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
  {interview.isPaid ? (
    <span className="text-green-600 font-semibold">Paid</span>
  ) : (
    <span className="text-yellow-600 font-semibold">Credit Reserved</span>
  )}
</td>



                    <td className="px-6 py-4 whitespace-nowrap text-sm">
  {interview.location_uploaded ? (
    <span className="text-green-600 font-semibold">Uploaded</span>
  ) : (
    <span className="text-red-500">Not Uploaded</span>
  )}
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => editInterview(interview)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteInterview(interview.Id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No interviews scheduled yet
                  </td>
                </tr>
              )}
              
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default HRScheduleInterview;