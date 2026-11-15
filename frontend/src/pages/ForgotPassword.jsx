import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your registered advocate email address.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-[8px] bg-[#252A29] text-[#FFFFFF] flex items-center justify-center mx-auto shadow-md border border-[#323837]">
          <Scale className="w-6 h-6 text-[#A48658]" />
        </div>
        <h2 className="mt-4 font-editorial text-2xl font-bold tracking-tight text-[#252A29]">
          Reset Password
        </h2>
        <p className="mt-1 text-xs text-[#747A62] font-serif italic">
          Enter your email to receive recovery instructions
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

          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-[8px] bg-[#747A62]/10 border border-[#747A62]/30 text-[#747A62] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#252A29] font-editorial">
                  Password Reset Link Dispatched
                </h3>
                <p className="text-xs text-[#747A62] mt-1.5 leading-relaxed">
                  We have dispatched a secure recovery authorization token to <strong>{email}</strong>. Please check your inbox and verified chambers folder.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center text-xs font-semibold text-[#252A29] hover:text-[#A48658] transition-colors pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
                  Registered Email Address
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

              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
              >
                Send Recovery Link
              </button>

              <div className="pt-2 text-center border-t border-[#DEDAD0]">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs text-[#747A62] hover:text-[#252A29] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
