import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase.js';

const LocationUpload: React.FC = () => {
  const { interviewId } = useParams();
  const [status, setStatus] = useState<string>('Requesting location...');

  useEffect(() => {
    if (!interviewId) {
      setStatus('Invalid interview link.');
      return;
    }

    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const { error } = await supabase
  .from('InterviewsTable')
  .update({
    latitude,
    longitude,
    location_uploaded: true // ✅ set flag to true
  })
  .eq('Id', interviewId);

        if (error) {
          console.error('Error saving location:', error);
          setStatus('Failed to upload location. Please try again.');
        } else {
          setStatus('✅ Location uploaded successfully! You may now close this page.');
        }
      },
      (err) => {
        console.error('Location error:', err);
        setStatus('Location access denied. Please allow location access.');
      }
    );
  }, [interviewId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center max-w-md">
        <h1 className="text-xl font-semibold mb-4">Upload Your Location</h1>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default LocationUpload;
