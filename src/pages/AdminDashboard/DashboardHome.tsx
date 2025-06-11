import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const DashboardHome = () => {
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [totalHRs, setTotalHRs] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) return;

      const { data: hrList } = await supabase
        .from('HRTable')
        .select('*')
        .eq('createdByAdminId', userData.user.id);
      setTotalHRs(hrList?.length || 0);

      const { data: interviews } = await supabase
        .from('InterviewsTable')
        .select('*')
        .eq('created_by', userData.user.id);

      setTotalInterviews(interviews?.length || 0);

      const pending = interviews?.filter((i) => i.payment_status === 'Pending') || [];
      setPendingPayments(pending.length);
    };

    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Total Interviews</h2>
          <p className="text-2xl">{totalInterviews}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Pending Payments</h2>
          <p className="text-2xl">{pendingPayments}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Active HRs</h2>
          <p className="text-2xl">{totalHRs}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
