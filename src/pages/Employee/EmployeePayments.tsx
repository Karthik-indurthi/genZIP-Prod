import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';

const EmployeePayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (!employeeId) return;
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('EmployeePayments')
      .select('*')
      .eq('EmployeeId', employeeId);

    if (!error) setPayments(data || []);
  };

  const totalByStatus = (status: string) =>
    payments.filter(p => p.PaymentStatus === status).reduce((sum, p) => sum + Number(p.Amount || 0), 0);

  const totalAll = () =>
    payments.reduce((sum, p) => sum + Number(p.Amount || 0), 0);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">💰 My Payments</h2>

      {payments.length === 0 ? (
        <p>No payment records yet.</p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {payments.map((pay) => (
              <div key={pay.Id} className="p-3 bg-white shadow rounded">
                <p>Interview ID: {pay.InterviewId}</p>
                <p>Amount: ₹{pay.Amount}</p>
                <p>Status: <span className="font-semibold">{pay.PaymentStatus}</span></p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 space-y-1 text-right text-sm">
            <p>🟡 Pending: ₹{totalByStatus('Pending')}</p>
            <p>🟠 Confirmed: ₹{totalByStatus('Confirmed')}</p>
            <p>🟢 Settled: ₹{totalByStatus('Settled')}</p>
            <hr />
            <p className="font-bold text-lg">Total: ₹{totalAll()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeePayments;
