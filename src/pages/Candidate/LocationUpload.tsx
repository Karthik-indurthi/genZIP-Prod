// LocationUpload.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabase.js';

const LocationUpload: React.FC = () => {
  const { interviewId } = useParams();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus('idle');
      },
      (error) => {
        setErrorMsg('Failed to get location. Please allow location access.');
        setStatus('error');
      }
    );
  }, []);

  const handleSubmit = async () => {
    if (!coords || !interviewId) return;
    setStatus('loading');

    const { error } = await supabase
      .from('InterviewsTable')
      .update({
        latitude: coords.lat,
        longitude: coords.lng,
        location_uploaded: true,
      })
      .eq('Id', interviewId);

    if (error) {
      console.error('Supabase error:', error);
      setErrorMsg('Failed to upload location. Try again.');
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">📍 Upload Location</h2>

        {status === 'loading' && <p className="text-blue-500">Fetching your location...</p>}

        {status === 'error' && <p className="text-red-500">{errorMsg}</p>}

        {coords && (
          <>
            <div className="mb-4">
              <iframe
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
              ></iframe>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Latitude: <strong>{coords.lat}</strong>, Longitude: <strong>{coords.lng}</strong>
            </p>

            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirm & Submit
            </button>
          </>
        )}

        {status === 'success' && (
          <p className="text-green-600 font-semibold mt-4">
            ✅ Your location has been uploaded successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationUpload;
