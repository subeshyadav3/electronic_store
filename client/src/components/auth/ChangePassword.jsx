"use client";

import React, { useState } from 'react';
import apiClient from '../helper/axios';
import { useToast } from '../../context/toastContext';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default function ChangePassword({ onSuccess }) {
  const [prevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/change-password', { prevPassword, newPassword }, { withCredentials: true });
      if (res.data.success) {
        showToast(res.data.message || 'Secret password changed successfully', 'success');
        setPrevPassword('');
        setNewPassword('');
        if (onSuccess) onSuccess();
      } else {
        showToast(res.data.message || 'Failed to modify credentials', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Server execution update rejection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-bold text-slate-900">Update Secure Password</h4>
        <p className="text-xs text-slate-500 mt-0.5">Ensure your account metrics stay updated with solid characters.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Current Secret Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={prevPassword} 
              onChange={(e) => setPrevPassword(e.target.value)} 
              required 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition text-sm" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">New Secret Password</label>
          <div className="relative">
            <ShieldAlert className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition text-sm" 
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow-sm disabled:opacity-50" 
          disabled={loading}
        >
          {loading ? 'Saving security updates...' : 'Commit New Password'}
        </button>
      </form>
    </div>
  );
}