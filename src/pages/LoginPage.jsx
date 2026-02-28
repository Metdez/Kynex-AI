import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-10 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
          G
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">GrowthPilot</h1>
        <p className="text-sm text-slate-500 mb-8">Your AI Growth Co-Pilot</p>

        <button
          onClick={handleLogin}
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
