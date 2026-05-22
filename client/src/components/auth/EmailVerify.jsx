"use client";

import React, { useState } from 'react';
import apiClient from '../helper/axios';
import { useToast } from '../../context/toastContext';
import { Mail, ShieldCheck, RefreshCw } from 'lucide-react';

export default function EmailVerify({ initialEmail = '', onSuccess }) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const sendOtp = async () => {
    if (!email) return showToast('Email string cannot be blank', 'error');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/otp', { email }, { withCredentials: true });
      if (res.data.success) {
        showToast('Verification code successfully dispatched', 'success');
        setSent(true);
      } else {
        showToast('Failed to deploy code token sequence', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Server network communication failure', 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!email || !otp) return showToast('Provide both active destination email & code', 'error');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/verifyotp', { email, otp }, { withCredentials: true });
      if (res.data.success) {
        showToast('Email verified successfully!', 'success');
        setSent(false);
        if (onSuccess) onSuccess();
      } else {
        showToast(res.data.message || 'Verification logic validation rejected', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Server error processing token validation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-bold text-slate-900">Email Identity Check</h4>
        <p className="text-xs text-slate-500 mt-0.5">Deploy or type validation challenge values to clean metrics.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Target Identity Endpoint</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="email" 
            placeholder="workspace@domain.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition text-sm" 
          />
        </div>
      </div>

      {sent && (
        <div className="space-y-1.5 animate-slideDown">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Verification Value (OTP)</label>
          <input 
            type="text"
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="Input numeric verification value sequence" 
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition text-sm text-center font-mono tracking-widest" 
          />
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <button 
          onClick={sendOtp} 
          disabled={loading} 
          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl bg-white hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          {sent ? 'Resend Token' : 'Get Token Code'}
        </button>
        
        {sent && (
          <button 
            onClick={verifyOtp} 
            disabled={loading || !otp} 
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Verify Now
          </button>
        )}
      </div>
    </div>
  );
}