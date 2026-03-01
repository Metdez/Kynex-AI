import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Linkedin } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="text-center max-w-4xl mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          To help great businesses reach the people they were built to serve
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-10 w-full max-w-sm text-center mb-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/kynex-logo.png" alt="Kynex AI Logo" className="h-16 object-contain" />
        </div>
        <p className="text-sm text-slate-500 mb-6">Your AI Growth Co-Pilot</p>

        <button
          onClick={handleLogin}
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm mb-4"
        >
          Log In
        </button>

        <a
          href="https://www.linkedin.com/in/zackary-hanna-515138331/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0A66C2] text-white font-medium rounded-lg hover:bg-[#004182] transition-colors text-sm"
        >
          <Linkedin size={18} />
          Developed by Zack Hanna
        </a>
      </div>

      <div className="text-2xl font-bold text-slate-400 tracking-wide mt-4">
        Agentic Growth
      </div>
    </div>
  );
}
