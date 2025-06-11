import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import { motion } from 'framer-motion';
import { FaEdit, FaSearch, FaUserPlus, FaTimes } from 'react-icons/fa';

interface Candidate {
  Id?: string; // ✅ Supabase column
  FirstName: string;
  LastName: string;
  EmailId: string;
  PhoneNumber: string;
  Location: string;
  AddedBy: string;
  createdBy?: string;
  country?: string;
  state?: string;
  city?: string;

}

interface HR {
  id?: string;
  name: string;
  email: string;
}

interface Job {
  id?: string;
  jobId: string;
  createdBy?: string;
}



const HRCandidates: React.FC = () => {
  const [form, setForm] = useState<Candidate>({
    FirstName: '',
    LastName: '',
    EmailId: '',
    PhoneNumber: '',
    Location: '',
    AddedBy: '',
    country: '',
    state: '',
    city: '',
  });
  
const [countries, setCountries] = useState<string[]>([]);
const [states, setStates] = useState<string[]>([]);
const [cities, setCities] = useState<string[]>([]);

const [selectedCountry, setSelectedCountry] = useState('');
const [selectedState, setSelectedState] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hrs, setHRs] = useState<HR[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHRs = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const { data, error } = await supabase
      .from('HRTable')
      .select('*')
      .eq('created_by', userData.user.id);

    if (!error && data) setHRs(data);
  };
  const fetchCountries = async () => {
    const { data, error } = await supabase
      .from('locationtable')
      .select('country')
      .eq('isactive', true)
      .neq('country', null)
      .limit(5000);
  
    if (!error && data) {
      const cleaned = data.map(d => d.country?.trim()).filter(Boolean);
      const uniqueCountries = Array.from(new Set(cleaned));
      setCountries(uniqueCountries);
    }
  }; 

  const fetchJobs = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const { data, error } = await supabase
      .from('JobTable')
      .select('*')
      .eq('created_by', userData.user.id);

    if (!error && data) setJobs(data);
  };

  const fetchCandidates = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const { data, error } = await supabase
      .from('CandidateTable')
      .select('*')
      .eq('created_by', userData.user.id);
      if (!error && data) {
        const normalized = data.map(item => ({
          ...item,
          id: item.Id || item.id,
        }));
        setCandidates(normalized);
      }
    setLoading(false);
  };

  useEffect(() => {
    fetchHRs();
    fetchJobs();
    fetchCandidates();
    fetchCountries();
  }, []);

  const fetchStates = async (country: string) => {
    const { data, error } = await supabase
      .from('locationtable')
      .select('state')
      .eq('country', country)
      .eq('isactive', true);
  
    if (!error && data) {
      const uniqueStates = Array.from(new Set(data.map(d => d.state?.trim()).filter(Boolean)));
      setStates(uniqueStates);
      setSelectedState('');
      setCities([]);
    }
  };
  
  const fetchCities = async (country: string, state: string) => {
    const { data, error } = await supabase
      .from('locationtable')
      .select('city')
      .eq('country', country)
      .eq('state', state)
      .eq('isactive', true);
  
    if (!error && data) {
      const uniqueCities = Array.from(new Set(data.map(d => d.city?.trim()).filter(Boolean)));
      setCities(uniqueCities);
    }
  };   

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return;

    const candidateData = {
      FirstName: form.FirstName,
      LastName: form.LastName,
      EmailId: form.EmailId,
      PhoneNumber: form.PhoneNumber,
      Location: form.Location,
      AddedBy: form.AddedBy, // fallback if full_name is missing
      created_by: userData.user.id,
      country: form.country,
      state: form.state,
      city: form.city,
    };

    try {
      if (editingId) {
        // Update both tables
        await supabase
          .from('CandidateTable')
          .update(candidateData)
          .eq('Id', editingId);
    
        await supabase
          .from('CandidateTable_duplicate')
          .update(candidateData)
          .eq('Id', editingId); // assuming IDs are shared
      } else {
        // Insert into CandidateTable and get the ID
        const { data, error } = await supabase
          .from('CandidateTable')
          .insert([candidateData])
          .select(); // to retrieve generated ID
    
        if (error) throw error;
    
        const inserted = data?.[0];
        if (inserted?.Id) {
          await supabase
            .from('CandidateTable_duplicate')
            .insert([{ ...candidateData, Id: inserted.Id }]);
            console.log("Inserted candidate:", inserted);
        }
      }
    
      setForm({
        FirstName: '',
        LastName: '',
        EmailId: '',
        PhoneNumber: '',
        Location: '',
        AddedBy: '',
      });
      setEditingId(null);
      await fetchCandidates();
    } 
     catch (error) {
      console.error("Error saving candidate:", error);
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setForm({
      FirstName: candidate.FirstName,
      LastName: candidate.LastName,
      EmailId: candidate.EmailId,
      PhoneNumber: candidate.PhoneNumber,
      Location: candidate.Location,
      AddedBy: candidate.AddedBy,
      country: candidate.country || '',
      state: candidate.state || '',
      city: candidate.city || '',
    });
  
    fetchStates(candidate.country || '');
    fetchCities(candidate.country || '', candidate.state || '');
    setEditingId(candidate.Id || candidate.Id!);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      const { error } = await supabase
        .from('CandidateTable')
        .delete()
        .eq('Id', id); // If your table column is 'Id', use .eq('Id', id)
      
      if (!error) {
        await fetchCandidates();
      }
    }
  };
  

  const handleCandidateSelect = (name: string) => {
    const selected = candidates.find(c => `${c.FirstName} ${c.LastName}`.toLowerCase() === name.toLowerCase());

    if (selected) { 
      setForm(selected);
      setEditingId(selected.Id!);
      setSearch('');
      setIsDropdownOpen(false);
    }
  };

  const filteredCandidates = candidates.filter(item =>
    item.FirstName.toLowerCase().includes(search.toLowerCase()) ||
    item.LastName.toLowerCase().includes(search.toLowerCase()) ||
    item.EmailId.toLowerCase().includes(search.toLowerCase()) ||
    item.PhoneNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.Location.toLowerCase().includes(search.toLowerCase())
  );
  const filteredNames = candidates.filter(c =>
    c.FirstName.toLowerCase().includes(search.toLowerCase()));
    

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">Candidate Management</h2>
          <p className="text-gray-600">
            {editingId ? 'Update candidate details' : 'Add new candidates to your database'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 relative w-full md:w-auto">
          
          
          {isDropdownOpen && filteredNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
            >
              {filteredNames.map((c: Candidate, i: number) => (
                <div
                  key={i}
                  className="p-3 hover:bg-indigo-50 cursor-pointer flex items-center border-b border-gray-100 last:border-0 transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleCandidateSelect(`${c.FirstName} ${c.LastName}`)}
                >
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <FaUserPlus className="text-indigo-600 text-sm" />
                  </div>
                  <div>
                  <p className="font-medium text-gray-800">{c.FirstName} {c.LastName}</p>
                    <p className="text-xs text-gray-500">{c.EmailId}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Form Section */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-full mr-3">
              {editingId ? (
                <FaEdit className="text-indigo-600" />
              ) : (
                <FaUserPlus className="text-indigo-600" />
              )}
            </span>
            {editingId ? 'Update Candidate' : 'Add New Candidate'}
          </h3>
          
          <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
    <input
      type="text"
      placeholder="First Name"
      value={form.FirstName}
      onChange={e => setForm({ ...form, FirstName: e.target.value })}
      className="w-full px-4 py-2 rounded-lg border border-gray-300"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
    <input
      type="text"
      placeholder="Last Name"
      value={form.LastName}
      onChange={e => setForm({ ...form, LastName: e.target.value })}
      className="w-full px-4 py-2 rounded-lg border border-gray-300"
    />
  </div>
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={form.EmailId}
                onChange={e => setForm({ ...form, EmailId: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="Phone"
                  value={form.PhoneNumber}
                  onChange={e => setForm({ ...form, PhoneNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  value={form.Location}
                  onChange={e => setForm({ ...form, Location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
  <select
    value={form.country}
    onChange={(e) => {
      const val = e.target.value;
      setForm({ ...form, country: val, state: '', city: '' });
      fetchStates(val);
    }}
    className="w-full px-4 py-2 rounded-lg border border-gray-300"
  >
    <option value="">Select Country</option>
    {countries.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
  <select
    value={form.state}
    onChange={(e) => {
      const val = e.target.value;
      setForm({ ...form, state: val, city: '' });
      fetchCities(form.country || '', val); 
    }}
    className="w-full px-4 py-2 rounded-lg border border-gray-300"
  >
    <option value="">Select State</option>
    {states.map(s => <option key={s} value={s}>{s}</option>)}
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
  <select
    value={form.city}
    onChange={(e) => setForm({ ...form, city: e.target.value })}
    className="w-full px-4 py-2 rounded-lg border border-gray-300"
  >
    <option value="">Select City</option>
    {cities.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
</div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Added By</label>
  <input
  type="text"
  placeholder="Enter HR Email AddedBy"
  value={form.AddedBy}
  onChange={e => setForm({ ...form, AddedBy: e.target.value })}
  className="w-full px-4 py-2 rounded-lg border border-gray-300"
  required
/>
</div>
            </div>
            

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
              >
                {editingId ? 'Update Candidate' : 'Add Candidate'}
              </button>
              {editingId && (
                <button
                  onClick={() => {
                    setForm({
                      FirstName: '',
                      LastName: '',
                      EmailId: '',
                      PhoneNumber: '',
                      Location: '',
                      AddedBy: '',
                      country: '',
                      state: '',
                      city: ''
                    });
                    
                    setEditingId(null);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats or other content can go here */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600 mb-2">{candidates.length}</div>
            <div className="text-gray-600">Total Candidates</div>
            <div className="mt-4 text-sm text-gray-500">
              {editingId ? 'Currently editing a candidate' : 'Ready to add new candidates'}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidate to update..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsDropdownOpen(e.target.value.length > 0);
              }}
              onFocus={() => setIsDropdownOpen(search.length > 0)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 w-full md:w-64 transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button> 
            )}
          </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-full mr-3">
              <FaEdit className="text-indigo-600" />
            </span>
            Candidates List
          </h3>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
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
                    City
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added By
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {candidate.FirstName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.FirstName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.EmailId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.PhoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.city || candidate.Location}  
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.AddedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <button
    onClick={() => handleEdit(candidate)}
    className="text-indigo-600 hover:text-indigo-900 mr-3"
  >
    <FaEdit />
  </button>
  <button
    onClick={() => handleDelete(candidate.Id!)} // or candidate.Id
    className="text-red-600 hover:text-red-900"
  >
    Delete
  </button>
</td>
                    
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HRCandidates;