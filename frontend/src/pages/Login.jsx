import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('sharma.legal@delhibar.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      // Store mock user session in localStorage
      localStorage.setItem(
        'justiq_auth_user',
        JSON.stringify({
          name: 'Adv. Rajesh Sharma',
          email: email.trim(),
          barCouncilNumber: 'D/1482/2012',
          role: 'Advocate',
        })
      );
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* JUSTIQ Wordmark & Brand Logo */}
        <div className="w-12 h-12 rounded-[8px] bg-[#252A29] text-[#FFFFFF] flex items-center justify-center mx-auto shadow-md border border-[#323837]">
          <Scale className="w-6 h-6 text-[#A48658]" />
        </div>
        <h2 className="mt-4 font-editorial text-2xl font-bold tracking-tight text-[#252A29]">
          Sign in to JUSTIQ
        </h2>
        <p className="mt-1 text-xs text-[#747A62] font-serif italic">
          AI-Assisted Legal Research & Case Intelligence Platform
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:rounded-[8px] sm:px-9 border border-[#DEDAD0] shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-[6px] bg-[#713F42]/10 border border-[#713F42]/30 text-[#713F42] text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-[#713F42] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#747A62] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@bar.org.in"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#A48658] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#747A62] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747A62] hover:text-[#252A29]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                'Authenticating...'
              ) : (
                <>
                  Sign in to Chambers <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="p-3.5 bg-[#F4F2EC] rounded-[6px] border border-[#DEDAD0] text-xs text-[#747A62] space-y-1 font-mono">
            <span className="font-semibold text-[#252A29] block">Academic Demo Credentials:</span>
            <p>Email: <code className="text-[#252A29] font-bold">sharma.legal@delhibar.in</code></p>
            <p>Password: <code className="text-[#252A29] font-bold">password123</code></p>
          </div>

          <div className="pt-2 text-center border-t border-[#DEDAD0]">
            <p className="text-xs text-[#747A62]">
              Don't have an advocate account?{' '}
              <Link to="/register" className="font-semibold text-[#252A29] hover:text-[#A48658] underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
