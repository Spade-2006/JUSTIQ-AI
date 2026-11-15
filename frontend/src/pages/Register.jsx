import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Lock, Mail, User, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [barCouncilNumber, setBarCouncilNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill out all mandatory registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem(
        'justiq_auth_user',
        JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          barCouncilNumber: barCouncilNumber.trim() || 'D/2024/TEMP',
          role: 'Advocate',
        })
      );
      alert('Registration successful! Welcome to JUSTIQ.');
      navigate('/');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-[8px] bg-[#252A29] text-[#FFFFFF] flex items-center justify-center mx-auto shadow-md border border-[#323837]">
          <Scale className="w-6 h-6 text-[#A48658]" />
        </div>
        <h2 className="mt-4 font-editorial text-2xl font-bold tracking-tight text-[#252A29]">
          Advocate Registration
        </h2>
        <p className="mt-1 text-xs text-[#747A62] font-serif italic">
          Create your verified profile on the JUSTIQ legal workspace
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
                Full Name / Title <span className="text-[#713F42]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#747A62] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Adv. Rajesh Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
                Official Email Address <span className="text-[#713F42]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#747A62] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="advocate@bar.org.in"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
                Bar Council Enrollment Number
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-[#747A62] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={barCouncilNumber}
                  onChange={(e) => setBarCouncilNumber(e.target.value)}
                  placeholder="e.g. D/1482/2012"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
                  Password <span className="text-[#713F42]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#747A62] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
                  Confirm Password <span className="text-[#713F42]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#747A62] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                'Creating Account...'
              ) : (
                <>
                  Complete Registration <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#DEDAD0]">
            <p className="text-xs text-[#747A62]">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-[#252A29] hover:text-[#A48658] underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
