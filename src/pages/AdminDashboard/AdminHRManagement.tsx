import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { supabase } from '../../supabase.js';
import emailjs from 'emailjs-com';
import { sendWelcomeEmail } from '../../utils/sendWelcomeEmail.js';

interface HR {  
  Id?: string;
  FirstName: string;
  LastName: string;
  EmailId: string;
  PhoneNumber: string;
  Branch: string;
  Role:string;
}

const AdminHRManagement: React.FC = () => {
  const [branchFilter, setBranchFilter] = useState('All');
  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hrList, setHrList] = useState<HR[]>([]);
  const [formData, setFormData] = useState<HR>({
    FirstName: '',
    LastName: '',
    EmailId: '',
    PhoneNumber: '',
    Branch: '',
    Role:'HR',
  });

  const fetchHRs = async () => {
    const { data: hrs } = await supabase.from('HRTable').select('*');
    setHrList(hrs || []);
  };

  useEffect(() => {
    fetchHRs();
  }, []);

  const handleAddHR = async () => {
    if (loading) return;
    setLoading(true);
  
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const adminEmail = userData?.user?.email;
      if (userError || !adminEmail) throw new Error('Failed to fetch user');
  
      // Get Admin ID
      const { data: adminData, error: adminError } = await supabase
        .from('AdminTable')
        .select('id')
        .eq('EmailId', adminEmail)
        .single();
  
      if (adminError || !adminData?.id) throw new Error('Admin not found');
  
      const tempPassword = Math.random().toString(36).slice(-8);
      const { data, error } = await supabase.auth.signUp({
        email: formData.EmailId,
        password: tempPassword,
      });
  
      if (error) {
        console.error('Supabase signUp error:', error.message);
        alert(`Failed to create HR account: ${error.message}`);
        setLoading(false);
        return;
      }
  
      // ✅ Insert with createdByAdminId
      await supabase.from('HRTable').insert([
        {
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          EmailId: formData.EmailId,
          PhoneNumber: formData.PhoneNumber,
          Branch: formData.Branch,
          Role: 'HR',
          first_login: true,
          createdByAdminId: adminData.id, // ✅ set admin link
        },
      ]);
  
      await sendWelcomeEmail(
        formData.EmailId,
        tempPassword,
        `${formData.FirstName} ${formData.LastName}`
      );
  
      setFormData({ FirstName: '', LastName: '', EmailId: '', PhoneNumber: '', Branch: '', Role: 'HR' });
      setShowModal(false);
      fetchHRs();
    } catch (err) {
      console.error('Error adding HR:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const filtered = hrList.filter((hr) => {
    return (branchFilter === 'All' || hr.Branch === branchFilter)
      && hr.FirstName.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }} 
      className="p-6 min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">HR Management</h2>
            <p className="text-gray-600 mt-1">Manage all HR personnel in your organization</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200"
          >
            <FaUserPlus className="mr-2" /> Add New HR
          </button>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by HR Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="pl-10 border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none pr-8 transition"
              >
                <option value="All">All Branches</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>
        </div>

        {/* HR Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No HR personnel found
                    </td>
                  </tr>
                ) : (
                  filtered.map((hr, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {hr.FirstName.charAt(0)}{hr.LastName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {hr.FirstName} {hr.LastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hr.EmailId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hr.PhoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${hr.Branch === 'Hyderabad' ? 'bg-green-100 text-green-800' :
                            hr.Branch === 'Bangalore' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'}`}>
                          {hr.Branch}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add HR Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Add New HR</h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John" 
                      value={formData.FirstName} 
                      onChange={e => setFormData({ ...formData, FirstName: e.target.value })} 
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      value={formData.LastName} 
                      onChange={e => setFormData({ ...formData, LastName: e.target.value })} 
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      value={formData.EmailId} 
                      onChange={e => setFormData({ ...formData, EmailId: e.target.value })} 
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+1 (555) 123-4567" 
                      value={formData.PhoneNumber} 
                      onChange={e => setFormData({ ...formData, PhoneNumber: e.target.value })} 
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <select 
                      value={formData.Branch} 
                      onChange={e => setFormData({ ...formData, Branch: e.target.value })} 
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select Branch</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddHR}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : 'Add HR'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminHRManagement;