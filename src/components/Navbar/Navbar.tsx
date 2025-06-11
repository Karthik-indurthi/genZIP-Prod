// Navbar.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { supabase } from '../../supabase.js';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [subscription, setSubscription] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [creditInfo, setCreditInfo] = useState<{ added: number; used: number }>({
    added: 0,
    used: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      setCreditInfo({ added: 0, used: 0 });
 
    
      if (!isLoggedIn || !email) return;
    
      const { data: admin } = await supabase
        .from('AdminTable')
        .select('EmailId, company_id')
        .eq('EmailId', email)
        .single();
    
      if (admin) {
        setRole('admin');
        console.log("Admin company_id:", admin.company_id);
        
    
        const { data: adminSub, error } = await supabase
     .from('companysubscription')
      .select('plan_name, company_id, status')
      .eq('company_id', admin.company_id)
      .eq('status', 'active')
     .maybeSingle();

        console.log("SUB DATA:", adminSub);
        console.log("SUB ERROR:", error);
    
        if (adminSub?.plan_name) {
          setSubscription(adminSub.plan_name);
        }
        const { data: creditData } = await supabase
        .from('credittransactions')
        .select('credits_added, credits_used')
         .eq('company_id', admin.company_id);

         const totalAdded = (creditData || []).reduce((sum, tx) => sum + tx.credits_added, 0);
         const totalUsed = (creditData || []).reduce((sum, tx) => sum + tx.credits_used, 0);
      console.log("CREDITS fetched:", creditData);
      console.log("CREDITS Added:", totalAdded);
      console.log("CREDITS Used:", totalUsed);

        setCreditInfo({ added: totalAdded, used: totalUsed });
    
        return;
      }
    
      const { data: hr } = await supabase
  .from('HRTable')
  .select('EmailId, createdByAdminId')
  .eq('EmailId', email)
  .single();

if (hr?.createdByAdminId) {
  setRole('hr');

  // Step 1: Get company_id from AdminTable
  const { data: adminInfo } = await supabase
    .from('AdminTable')
    .select('company_id')
    .eq('id', hr.createdByAdminId)
    .maybeSingle();

  const companyId = adminInfo?.company_id;
  if (!companyId) return;

  // Step 2: Fetch subscription
  const { data: hrSub } = await supabase
    .from('companysubscription')
    .select('plan_name')
    .eq('company_id', companyId)
    .eq('status', 'active')
    .maybeSingle();

  if (hrSub?.plan_name) {
    setSubscription(hrSub.plan_name);
  }

  // Step 3: Fetch credit info
  const { data: hrCredits } = await supabase
    .from('credittransactions')
    .select('credits_added, credits_used')
    .eq('company_id', companyId);

  const totalAdded = (hrCredits || []).reduce((sum, tx) => sum + tx.credits_added, 0);
  const totalUsed = (hrCredits || []).reduce((sum, tx) => sum + tx.credits_used, 0);

  setCreditInfo({ added: totalAdded, used: totalUsed });

  return;
}

    };
    
    
    fetchUserRole();
  }, [isLoggedIn]);

  const handleDashboard = () => {
    if (role === 'admin') return navigate('/admin/dashboard');
    if (role === 'hr') return navigate('/hr/add-job');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full h-16 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        {/* Branding */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-indigo-700 tracking-tight">
            Gen-ZIP<span className="text-indigo-500">™</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium text-sm"
          >
            Home
          </Link>
          
          {!isLoggedIn ? (
            <>
              <Link 
  to="/login" 
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
>
  Login
</Link>
<Link 
  to="/signup" 
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
>
  Sign Up
</Link>
<Link 
  to="/employee-signup" 
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
>
  Become a GenZipper
</Link>

            </>
          ) : (
            <>
              <button
                onClick={handleDashboard}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium text-sm"
              >
                Dashboard
              </button>
              
              {subscription ? (
  <div className="relative group">
    <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full cursor-default">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      <span className="text-green-700 text-xs font-medium">{subscription} Plan Active</span>
    </div>
    <div className="absolute bottom-[-60px] left-0 bg-white border border-gray-200 shadow-lg rounded-lg text-xs text-gray-800 p-3 w-60 opacity-0 group-hover:opacity-100 transition duration-300 z-50">
      <div><strong>Total Credits:</strong> {creditInfo.added}</div>
      <div><strong>Used:</strong> {creditInfo.used}</div>
      <div><strong>Remaining:</strong> {creditInfo.added - creditInfo.used}</div>
    </div>
  </div>
) : (
                <Link
                  to="/subscription"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  Subscribe
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-500 transition-colors duration-200 font-medium text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;