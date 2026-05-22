"use client";

import React, { useEffect, useState } from 'react';
import apiClient from '../helper/axios';
import { useToast } from '../../context/toastContext';
import { Lock, Mail, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenVerified, setTokenVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);

    // auto-verify when opened from emailed link
    if (emailParam && tokenParam) {
      (async () => {
        setLoading(true);
        try {
          const res = await apiClient.post('/auth/verify-reset-token', { email: emailParam, token: tokenParam }, { withCredentials: true });
          if (res.data.success) {
            setTokenVerified(true);
            showToast(res.data.message || 'Token verified successfully', 'success');
          } else {
            showToast(res.data.message || 'Token verification failed', 'error');
          }
        } catch (err) {
          showToast(err?.response?.data?.message || 'Server error occurred', 'error');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tokenVerified) {
      showToast('Token not verified. Open the link from your email to verify.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', { email, token, newPassword }, { withCredentials: true });
      if (res.data.success) {
        showToast(res.data.message || 'Password reset successful', 'success');
        // brief delay then redirect to login
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showToast(res.data.message || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Server error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
          {!tokenVerified && (
            <p className="text-sm text-slate-500 mt-1">A password reset link has been sent to your email. Open that link to continue and set a new password.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                readOnly
                required
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>

          {!tokenVerified && (
            <div className="space-y-1.5">
              <p className="text-sm text-slate-500">Check your email for the password reset link and open it to proceed. If you didn't receive it, request a new link.</p>
            </div>
          )}

          {loading && (
            <div className="text-center text-sm text-slate-600">Verifying token...</div>
          )}

          {/* Don't show token/verification messages when token is verified; show password form only */}

          {tokenVerified && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Reset Password'}
              </button>
            </>
          )}

          {!tokenVerified && !loading && (
            <div className="text-sm text-slate-600">Please check your email for the password reset link to continue.</div>
          )}
        </form>
      </div>
    </div>
  );
}
