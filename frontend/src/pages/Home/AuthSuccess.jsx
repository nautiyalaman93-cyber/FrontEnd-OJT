import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      loginToken(token);
      // Wait a moment for context to update if needed, then redirect
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      navigate('/');
    }
  }, [searchParams, loginToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-primary border-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-white">Authenticating...</h2>
        <p className="text-slate-400 mt-2">Setting up your secure session.</p>
      </div>
    </div>
  );
}
