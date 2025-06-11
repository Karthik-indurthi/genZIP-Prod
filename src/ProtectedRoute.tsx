import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login'); // 🔁 redirect if no session
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  if (loading) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
