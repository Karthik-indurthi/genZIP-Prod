import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { format } from 'date-fns';

const AdminPaymentHistory: React.FC = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyIdAndData = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) return;

      const { data: admin } = await supabase
        .from('AdminTable')
        .select('company_id')
        .eq('EmailId', email)
        .single();

      const cid = admin?.company_id;
      setCompanyId(cid);

      if (!cid) return;

      // Now load payment history
      const rows: any[] = [];

      const { data: creditsData } = await supabase
        .from('credittransactions')
        .select('*')
        .eq('company_id', cid)
        .order('created_at', { ascending: false });

      creditsData?.forEach((row) => {
        const isAddition = row.credits_added > 0;
        rows.push({
          date: format(new Date(row.created_at), 'yyyy-MM-dd'),
          type: isAddition ? 'Credit Added' : 'Credit Used',
          description: isAddition
  ? row.reason || 'Credit Added'
  : 'Interview Started',
amount: isAddition
  ? `₹${row.amount_paid || 'N/A'}`
  : '–',

          credits: isAddition ? `+${row.credits_added}` : `${row.credits_added}`,
          paymentMode: isAddition ? 'Stripe' : '–',
          status: 'Success',
        });
      });

      setHistory(rows);
      setLoading(false);
    };

    loadCompanyIdAndData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Credits</th>
              <th className="p-2 border">Payment Mode</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i} className="text-center">
                <td className="p-2 border">{row.date}</td>
                <td className="p-2 border">{row.type}</td>
                <td className="p-2 border">{row.description}</td>
                <td className="p-2 border">{row.amount}</td>
                <td className="p-2 border">{row.credits}</td>
                <td className="p-2 border">{row.paymentMode}</td>
                <td className="p-2 border">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPaymentHistory;
