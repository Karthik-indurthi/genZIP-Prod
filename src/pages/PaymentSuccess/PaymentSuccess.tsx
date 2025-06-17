// PaymentSuccess.tsx - Enhanced confirmation page with credit update logic
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../../supabase.js';

const PaymentSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planName = searchParams.get('plan');
  const interviewId = searchParams.get('interviewId');

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) return;
  
      const { data: adminData } = await supabase
        .from('AdminTable')
        .select('company_id')
        .eq('EmailId', email)
        .single();
      const companyId = adminData?.company_id;
      if (!companyId) return;
  
      if (planName) {
        const planDetails = {
          Starter: { price: 49999, credits: 20, bonus: 3 },
          Pro: { price: 99999, credits: 50, bonus: 8 },
          Enterprise: { price: 199999, credits: 100, bonus: 20 },
        }[planName];
  
        if (!planDetails) return;
        const totalToAdd = planDetails.credits + planDetails.bonus;
  
        const { data: existing } = await supabase
          .from('companysubscription')
          .select('id')
          .eq('company_id', companyId)
          .eq('status', 'active')
          .maybeSingle();
  
        if (!existing) {
          await supabase.from('companysubscription').insert({
            company_id: companyId,
            plan_name: planName,
            total_paid: planDetails.price,
            credits_allocated: planDetails.credits,
            bonus_credits: planDetails.bonus,
            start_date: new Date().toISOString().slice(0, 10),
            end_date: null,
            status: 'active',
            auto_renew: false,
          });
        }
  
        const { data: creditExists } = await supabase
          .from('credittransactions')
          .select('id')
          .eq('company_id', companyId)
          .eq('reason', `Subscription - ${planName}`)
          .maybeSingle();
  
        if (!creditExists) {
          await supabase.from('credittransactions').insert({
            company_id: companyId,
            credits_added: totalToAdd,
            credits_used: 0,
            reason: `Subscription - ${planName}`,
            reference_id: null,
            amount_paid: planDetails.price,
            payment_mode: 'Razorpay',
          });
        }
      }
  
      // 💳 PAY PER INTERVIEW CREDIT LOGIC
      if (interviewId) {
        const { data: alreadyPaid } = await supabase
          .from('credittransactions')
          .select('id')
          .eq('reference_id', interviewId)
          .eq('reason', 'PayPerInterview ₹2000')
          .maybeSingle();
  
        if (alreadyPaid) {
          console.log("ℹ️ Credit already exists for this interview");
          return;
        }
  
        await supabase
          .from('InterviewsTable')
          .update({
            payment_status: 'completed',
            payment_date: new Date().toISOString(),
          })
          .eq('Id', interviewId);
  
        const { data: interview } = await supabase
          .from('InterviewsTable')
          .select('created_by')
          .eq('Id', interviewId)
          .single();
  
        if (!interview?.created_by) {
          console.error("❌ Missing created_by in interview");
          return;
        }
  
        let creditCompanyId: string | null = null;
  
        const { data: adminRecord } = await supabase
          .from('AdminTable')
          .select('company_id')
          .eq('user_id', interview.created_by)
          .maybeSingle();
  
        if (adminRecord?.company_id) {
          creditCompanyId = adminRecord.company_id;
        }
  
        if (!creditCompanyId) {
          const { data: hrRecord } = await supabase
            .from('HRTable')
            .select('createdByAdminId')
            .eq('Id', interview.created_by)
            .maybeSingle();
  
          if (hrRecord?.createdByAdminId) {
            const { data: adminOfHr } = await supabase
              .from('AdminTable')
              .select('company_id')
              .eq('id', hrRecord.createdByAdminId)
              .maybeSingle();
  
            creditCompanyId = adminOfHr?.company_id || null;
          }
        }
  
        if (!creditCompanyId) {
          const { data: fallbackAdmin } = await supabase
            .from('AdminTable')
            .select('company_id')
            .eq('EmailId', email)
            .maybeSingle();
  
          creditCompanyId = fallbackAdmin?.company_id || null;
          console.log("📄 Fallback via email:", fallbackAdmin);
        }
  
        console.log('👤 created_by:', interview.created_by);
        console.log('🏢 resolved creditCompanyId:', creditCompanyId);
        console.log('🎯 inserting credit for interviewId:', interviewId);
  
        if (!creditCompanyId) {
          console.error('❌ Could not determine company_id');
          return;
        }
  
        const { error: insertErr } = await supabase.from('credittransactions').insert({
          company_id: creditCompanyId,
          credits_added: 1,
          credits_used: 0,
          reason: 'PayPerInterview ₹2000',
          reference_id: interviewId,
          amount_paid: 2000,
          payment_mode: 'Razorpay',
        });
  
        if (insertErr?.code === '23505') {
          console.warn('⚠️ Duplicate insert blocked by constraint');
        } else if (insertErr) {
          console.error('❌ Failed to insert credit:', insertErr.message);
        } else {
          console.log('✅ Credit successfully inserted');
        }
      }
    };
  
    handlePaymentSuccess();
  }, [planName, interviewId]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center border-t-8 border-green-500">
        <h2 className="text-4xl font-extrabold text-green-700 mb-2">Payment Successful</h2>
        <p className="text-gray-700 text-base mb-4">
          {planName
            ? 'Your subscription payment was successful and credits have been added to your account.'
            : interviewId
            ? 'Your payment for the interview was successful. One reusable credit has been added to your account. This credit will be automatically used when the GenZipper starts the interview.'
            : 'Payment processed successfully.'}
        </p>

        <div className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-lg mb-6">
          ✅ You can now schedule or continue interviews without interruption.
        </div>
        <Link
           to="/hr/schedule"
          className="inline-block w-full bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
