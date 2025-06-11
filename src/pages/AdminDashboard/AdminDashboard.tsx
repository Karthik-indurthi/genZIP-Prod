import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../../supabase.js';


interface MonthlyData {
  name: string;
  interviews: number;
}

interface PieData {
  name: string;
  value: number;
}

const COLORS = ['#4CAF50', '#FF9800', '#2196F3'];

const AdminDashboard = () => {
  const [interviewData, setInterviewData] = useState<MonthlyData[]>([]);
  const [paymentData, setPaymentData] = useState<PieData[]>([]);
  const [statusData, setStatusData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditInfo, setCreditInfo] = useState({ added: 0, used: 0 });
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // 1. Get logged-in user's email
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const email = userData?.user?.email;
        if (userError || !email) {
          throw new Error(userError?.message || 'User not found');
        }
  
        // 2. Look up the admin's numeric ID using the email
        const { data: adminRecord, error: adminError } = await supabase
          .from('AdminTable')
          .select('id')
          .eq('EmailId', email)
          .single();
  
        if (adminError || !adminRecord?.id) {
          throw new Error(adminError?.message || 'Admin record not found');
        }
  
        const adminId = adminRecord.id;
  
        // 3. Get HRs created by this admin
        const { data: hrs, error: hrError } = await supabase
          .from('HRTable')
          .select('EmailId')
          .eq('createdByAdminId', adminId);
  
        if (hrError) throw hrError;
  
        const hrEmails = hrs?.map((hr) => hr.EmailId) || [];
  
        if (hrEmails.length === 0) {
          setInterviewData([]);
          setPaymentData([]);
          setStatusData([]);
          return;
        }
  
        // 4. Fetch interviews created by these HRs
        const { data: interviews, error: interviewError } = await supabase
          .from('InterviewsTable')
          .select('*')
          .in('createdby_email', hrEmails);
  
        if (interviewError) throw interviewError;
  
        if (!interviews || interviews.length === 0) {
          setInterviewData([]);
          setPaymentData([]);
          setStatusData([]);
          return;
        }
  
        // 5. Monthly interviews
        const monthlyCounts = Array(12).fill(0);
        interviews.forEach((interview) => {
          try {
            const date = new Date(interview.created_at);
            const month = date.getMonth();
            monthlyCounts[month]++;
          } catch (e) {
            console.warn('Invalid date format', interview.created_at);
          }
        });
  
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedInterviewData = months.map((month, i) => ({
          name: month,
          interviews: monthlyCounts[i],
        }));
  
        // 6. Payment data
        const paid = interviews.filter(i => i.payment_status === 'completed').length;
        const pending = interviews.filter(i => i.payment_status === 'Pending').length;
  
        // 7. Status data
        const scheduled = interviews.filter(i => i.interview_status === 'Scheduled').length;
        const completed = interviews.filter(i => i.interview_status === 'completed').length;
        const cancelled = interviews.filter(i => i.interview_status === 'Cancelled').length;
        const videoUploaded = interviews.filter(i => i.interview_status === 'Video Uploaded').length;
  
        setInterviewData(formattedInterviewData);
        setPaymentData([
          { name: 'Paid', value: paid },  
          { name: 'Pending', value: pending },
        ]);
        setStatusData([
          { name: 'Scheduled', value: scheduled },
          { name: 'completed', value: completed },
          { name: 'Cancelled', value: cancelled },
          { name: 'Video Uploaded', value: videoUploaded },
        ]);
  
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    const loadAdminCredits = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) return;
    
      const { data: adminRecord } = await supabase
        .from('AdminTable')
        .select('company_id')
        .eq('EmailId', email)
        .single();
    
      const company_id = adminRecord?.company_id;
      if (!company_id) return;
    
      const { data: creditTransactions } = await supabase
        .from('credittransactions')
        .select('credits_added, credits_used')
        .eq('company_id', company_id);
    
      const added = creditTransactions?.reduce((sum, row) => sum + row.credits_added, 0) || 0;
      const used = creditTransactions?.reduce((sum, row) => sum + row.credits_used, 0) || 0;
    
      setCreditInfo({ added, used });
    };
    
    loadAdminCredits();
    
  
    fetchDashboardData();
  }, []);
  

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-white to-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📊 Admin Dashboard Overview</h1>
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 w-full max-w-xs mb-6">
  <h3 className="text-lg font-semibold text-gray-700 mb-2">💳 Credit Summary</h3>
  <div className="space-y-1 text-sm text-gray-600">
    <div><strong>Total Credits:</strong> {creditInfo.added}</div>
    <div><strong>Used Credits:</strong> {creditInfo.used}</div>
    <div><strong>Remaining:</strong> {creditInfo.added - creditInfo.used}</div>
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interviews Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Interviews (Monthly)</h2>
          {interviewData.length === 0 ? (
            <p className="text-gray-500">No interview data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={interviewData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interviews" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payment Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Status</h2>
          {paymentData.length === 0 ? (
            <p className="text-gray-500">No payment data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={paymentData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  labelLine={false}
                  label={({ name, percent, value }) => value > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}

                  dataKey="value"
                >
                  {paymentData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} interviews`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Interview Status Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Interview Status Overview</h2>
          {statusData.length === 0 ? (
            <p className="text-gray-500">No interview status data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={statusData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {statusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} interviews`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;