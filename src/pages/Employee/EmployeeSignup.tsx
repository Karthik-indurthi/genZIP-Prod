import React, { useState } from 'react';
import { supabase } from '../../supabase.js';
import { useNavigate } from 'react-router-dom';

const EmployeeSignup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Address: '',
    City: '',
    AltPhoneNumber: '',
    EmergencyContact: '',
    Password: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const uploadToStorage = async (file: File, folder: string) => {
    const filePath = `${folder}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('employee-uploads').upload(filePath, file);
    if (error) {
      alert('Upload failed: ' + error.message);
      return null;
    }
    return supabase.storage.from('employee-uploads').getPublicUrl(filePath).data.publicUrl;
  };

  const handleOtpSend = () => {
    if (mobile.length < 10) return alert('Enter valid mobile number');
    setStep(2);
  };

  const handleOtpVerify = () => {
    if (otp !== '123456') return alert('Invalid OTP');
    setStep(3);
  };

  const generateEmployeeId = (city: string) => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `EMP-${city?.slice(0, 3).toUpperCase()}-${random}`;
  };

  const handleFinalSubmit = async () => {
    if (!photoFile || !govIdFile) {
      alert('Upload photo and government ID');
      return;
    }

    const photoUrl = await uploadToStorage(photoFile, 'photos');
    const govIdUrl = await uploadToStorage(govIdFile, 'ids');

    if (!photoUrl || !govIdUrl) {
      alert('Upload failed. Please try again.');
      return;
    }

    const employeeId = generateEmployeeId(form.City);

    const { error } = await supabase.from('EmployeeTable').insert({
      EmployeeId: employeeId,
      MobileNumber: mobile,
      Password: form.Password,
      FirstName: form.FirstName,
      LastName: form.LastName,
      Email: form.Email,
      Address: form.Address,
      City: form.City,
      AltPhoneNumber: form.AltPhoneNumber,
      EmergencyContact: form.EmergencyContact,
      PhotoUrl: photoUrl,
      GovernmentIdUrl: govIdUrl,
      Status: 'pending',
    });

    if (error) {
      console.error('Insert error:', error);
      alert('Signup failed');
    } else {
      alert('Signup successful. Please login.');
      navigate('/employee-login');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Enter Mobile Number</h2>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
          />
          <button className="mt-4 w-full bg-blue-600 text-white p-2 rounded" onClick={handleOtpSend}>
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP (123456)"
          />
          <button className="mt-4 w-full bg-green-600 text-white p-2 rounded" onClick={handleOtpVerify}>
            Verify
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-bold mb-4">Complete Profile</h2>
          <div className="space-y-3">
            <input type="text" placeholder="First Name" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, FirstName: e.target.value })} />
            <input type="text" placeholder="Last Name" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, LastName: e.target.value })} />
            <input type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, Email: e.target.value })} />
            <input type="text" placeholder="Address" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, Address: e.target.value })} />
            <input type="text" placeholder="City" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, City: e.target.value })} />
            <input type="text" placeholder="Alt Phone Number" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, AltPhoneNumber: e.target.value })} />
            <input type="text" placeholder="Emergency Contact" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, EmergencyContact: e.target.value })} />
            <input type="password" placeholder="Set Password" className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, Password: e.target.value })} />

            <div>
              <label>Upload Photo:</label>
              <input type="file" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            </div>

            <div>
              <label>Upload Government ID:</label>
              <input type="file" onChange={(e) => setGovIdFile(e.target.files?.[0] || null)} />
            </div>

            <button className="mt-4 w-full bg-blue-700 text-white p-2 rounded" onClick={handleFinalSubmit}>
              Submit Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeSignup;  
