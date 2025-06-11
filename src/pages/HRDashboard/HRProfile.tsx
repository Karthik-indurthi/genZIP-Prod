import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase.js';
import PageWrapper from '../../components/PageWrapper.js';

const HRProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setFormError('');
    setSuccess('');

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const userEMail=userData?.user?.email;

    if (!userId) {
      setFormError('Unable to load user. Please log in again.');
      setLoading(false);
      return;
    }

    console.log("Logged-in userId:", userId);
    console.log("Logged-in userEMail:", userEMail);


    const { data, error } = await supabase
      .from('HRTable')
      .select('*')
      .eq('EmailId', userData?.user?.email)// Adjust if you use 'EmailId' or 'Id' for auth mapping
      .single();

    if (error) {
      setFormError('Failed to load profile');
    } else {
      setProfile(data);
    }

    setLoading(false);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    const { error } = await supabase
      .from('HRTable')
      .update({
        EmailId: profile.EmailId,
        PhoneNumber: profile.PhoneNumber,
        Branch: profile.Branch,
        FirstName: profile.FirstName,
        LastName: profile.LastName
      })
      .eq('Id', profile.Id); // This assumes HRTable has Id column as PK

    if (error) {
      setFormError('Update failed');
    } else {
      setSuccess('Profile updated successfully');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!profile && !loading) return <p>No profile data found</p>;

  return (
    <PageWrapper>
    <div>
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      {formError && <p className="text-red-600 mb-2">{formError}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={updateProfile} className="space-y-4 max-w-xl mx-auto">

        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            className="w-full p-2 border rounded"
            value={profile.FirstName || ''}
            onChange={e => setProfile({ ...profile, FirstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            className="w-full p-2 border rounded"
            value={profile.LastName || ''}
            onChange={e => setProfile({ ...profile, LastName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email ID</label>
          <input
            className="w-full p-2 border rounded"
            type="email"
            value={profile.EmailId || ''}
            onChange={e => setProfile({ ...profile, EmailId: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            className="w-full p-2 border rounded"
            value={profile.PhoneNumber || ''}
            onChange={e => setProfile({ ...profile, PhoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Branch</label>
          <input
            className="w-full p-2 border rounded"
            value={profile.Branch || ''}
            onChange={e => setProfile({ ...profile, Branch: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </form>
    </div>
     </PageWrapper>
  );
};

export default HRProfile;
