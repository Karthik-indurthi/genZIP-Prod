import React, { useState } from 'react';
import InterviewForm from '../../components/InterviewForm/InterviewForm.js';
import InterviewList from '../../components/InterviewList/InterviewList.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { supabase } from '../../supabase.js';




export interface Interview {
  candidateName: string;
  lastName: string;
  candidateEmail: string;
  candidatePhone: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  companyName: string;
  zipCode: string;
  comments: string;
  status: 'awaiting_confirmation' | 'scheduled' | 'completed' | 'processed';
  clientId?: string;
}

const Dashboard: React.FC = () => {
const [plan, setPlan] = useState<string>('loading');


const [interviews, setInterviews] = useState<Interview[]>([]);


  const addInterview = (newInterview: Interview) => {
    setInterviews((prev) => [{ ...newInterview, status: 'awaiting_confirmation' }, ...prev]);
  };

  const [activeTab, setActiveTab] = useState<'awaiting_confirmation' | 'scheduled' | 'completed' | 'processed'>(
    'awaiting_confirmation'
  );

  const filteredInterviews = interviews.filter((interview) => interview.status === activeTab);
  useEffect(() => {
    const fetchPlan = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const { data: users, error } = await supabase
      .from('users')
      .select('plan')
      .eq('uid', userData.user.id)
      .single();

    if (!error && users?.plan) {
      setPlan(users.plan || 'basic');
    }
  };
  
    fetchPlan();
    const fetchInterviews = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('InterviewsTable')
      .select('*')
      .eq('clientId', userData?.user?.id);

    if (!error && data) setInterviews(data);
  };
    
    fetchInterviews(); // 🔥 add this line
    
  }, []);

  const tabs = [
    { key: 'awaiting_confirmation', label: 'Awaiting', color: 'blue' },
    { key: 'scheduled', label: 'Scheduled', color: 'yellow' },
    { key: 'completed', label: 'Completed', color: 'green' },
    { key: 'processed', label: 'Processed', color: 'indigo' },
  ] as const;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Current Plan:{' '}
      
{plan === 'loading' ? (
  <p className="text-sm text-gray-500 mb-6">Fetching your plan...</p>
) : (
  <p className="text-sm text-gray-600 mb-6">
    Current Plan: <span className="font-semibold capitalize text-blue-600">{plan}</span>
  </p>
)}


      </p>

      <InterviewForm onAddInterview={addInterview} />

      <div className="mt-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition 
                ${
                  activeTab === tab.key
                    ? `bg-${tab.color}-600 text-white shadow`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <InterviewList interviews={filteredInterviews} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
