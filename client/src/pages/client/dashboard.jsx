"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import apiClient from "../../components/helper/axios";
import LoadingComponent from "../../components/helper/loadingComponent";
import { useToast } from "../../context/toastContext";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Save, X, ShoppingBag, MessageSquare, Lock, CheckCircle } from "lucide-react";
import ChangePassword from "../../components/auth/ChangePassword";
import EmailVerify from "../../components/auth/EmailVerify";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [customerData, setCustomerData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Modal tracking states for modular popups instead of nested broken layouts
  const [activeModal, setActiveModal] = useState(null); // 'password' | 'verify' | null

  useEffect(() => {
    if (!user?.userId) return;  
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/customer/${user.userId}`, { withCredentials: true });
        const customer = res.data.users;
        setCustomerData(customer);
        setUpdatedData(customer);
      } catch (err) {
        console.error(err);
        showToast("Failed to load profile details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();    
  }, [user?.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await apiClient.put(`/customer/${user?.userId}`, updatedData, {
        withCredentials: true,
      });

      if (res.data.success) {
        showToast("Profile updated successfully", "success");
        setIsEditing(false);
        setCustomerData(updatedData);
      } else {
        showToast("Failed to update profile updates", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      showToast("An error occurred while saving your updates.", "error");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedData(customerData);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Account Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your personalized details, check security metrics, and track preferences.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Content Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Profile Quick Glance Left Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <div className="px-6 pb-6 text-center relative">
              <div className="inline-flex -mt-14 mb-4 relative">
                <div className="w-24 h-24 rounded-full ring-4 ring-white bg-gradient-to-br from-indigo-100 to-purple-100 border border-slate-200 flex items-center justify-center text-3xl shadow-md">
                  👤
                </div>
                <span className="absolute bottom-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 ring-white"></span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{customerData?.name || "User"}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize mt-1 border border-indigo-100">
                {customerData?.role || "Customer"}
              </span>

              <div className="mt-5 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100 italic">
                "{user?.bio || `Hi, I am ${user?.name || 'there'} and I love buying new things`}"
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-indigo-500" /> 0
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">Orders Filled</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-purple-500" /> 0
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">Reviews Authored</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Data Inputs Right Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" /> Primary Core Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name</label>
                  {isEditing ? (
                    <input
                      name="name"
                      type="text"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition"
                      value={updatedData.name || ""}
                      onChange={handleChange}
                      placeholder="Your matching full identity name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-medium">
                      {customerData?.name}
                    </div>
                  )}
                </div>

                {/* Email Address block */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center justify-between">
                    <span>Email Workspace</span>
                    {!isEditing && (
                      <button 
                        onClick={() => setActiveModal('verify')}
                        className="text-[11px] text-indigo-600 hover:underline font-bold tracking-normal capitalize"
                      >
                        Verify Identity
                      </button>
                    )}
                  </label>
                  {isEditing ? (
                    <input
                      name="email"
                      type="email"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition"
                      value={updatedData.email || ""}
                      onChange={handleChange}
                      placeholder="you@domain.com"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-medium flex items-center justify-between">
                      <span className="truncate mr-2">{customerData?.email}</span>
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    </div>
                  )}
                </div>

                {/* Phone contact input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Phone Number</label>
                  {isEditing ? (
                    <input
                      name="contact"
                      type="tel"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition"
                      value={updatedData.contact || ""}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-medium">
                      {customerData?.contact || <span className="text-slate-400 italic font-normal text-sm">Not provided</span>}
                    </div>
                  )}
                </div>

                {/* Address block */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Default Address</label>
                  {isEditing ? (
                    <input
                      name="shortAddress"
                      type="text"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 focus:bg-white transition"
                      value={updatedData.shortAddress || ""}
                      onChange={handleChange}
                      placeholder="Street, City, State, ZIP"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-medium">
                      {customerData?.shortAddress || <span className="text-slate-400 italic font-normal text-sm">Not provided</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp Logs Details Sub-tier */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-500" /> Account Meta Access Informational logs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="text-xs text-slate-500 block mb-1">Registration Date</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {customerData?.createdAt ? new Date(customerData.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="text-xs text-slate-500 block mb-1">Last Update Log</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {customerData?.updatedAt ? new Date(customerData.updatedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="text-xs text-slate-500 block mb-1">Privilege tier</span>
                    <span className="text-sm font-semibold text-indigo-600 capitalize">{customerData?.role || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Utility Shortcut Row Grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-200 transition group cursor-pointer">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition mb-3">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Order Log History</h4>
                <p className="text-xs text-slate-500 mt-1">Review tracking status, returns, invoices.</p>
              </div>

              <div 
                onClick={() => setActiveModal('password')}
                className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:border-purple-200 transition group cursor-pointer"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Change Password</h4>
                <p className="text-xs text-slate-500 mt-1">Change current auth passwords safely.</p>
              </div>

              <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:border-pink-200 transition group cursor-pointer">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 group-hover:bg-pink-100 transition mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Customer Support</h4>
                <p className="text-xs text-slate-500 mt-1">Open tickets or chat live directly with support.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Window Sheet wrapper handles conditional rendering neatly for internal subviews */}
        {activeModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full relative overflow-hidden">
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-6">
                {activeModal === 'password' && <ChangePassword onSuccess={() => setActiveModal(null)} />}
                {activeModal === 'verify' && <EmailVerify initialEmail={customerData?.email} onSuccess={() => setActiveModal(null)} />}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}