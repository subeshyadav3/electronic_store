"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import apiClient from "../../components/helper/axios"
import LoadingComponent from "../../components/helper/loadingComponent"
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Save, X } from "lucide-react"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [customerData, setCustomerData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedData, setUpdatedData] = useState({})

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await apiClient.get(`/customer/${user?.userId}`, { withCredentials: true })
        const customer = res.data.users
        setCustomerData(customer)
        setUpdatedData(customer)
      } catch (err) {
        console.error("Error fetching customer data:", err)
      }
    }

    if (user?.userId) {
      fetchCustomerData()
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUpdatedData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const res = await apiClient.put(`/customer/${user?.userId}`, updatedData, {
        withCredentials: true,
      })

      if (res.data.success) {
        alert("User updated successfully")
        setIsEditing(false)
        setCustomerData(updatedData)
      } else {
        alert("Failed to update user")
      }
    } catch (err) {
      console.error("Update error:", err)
      alert("An error occurred while updating")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUpdatedData(customerData)
  }

  if (!customerData) {
    return <LoadingComponent />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
    
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your profile and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
     
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl text-white shadow-lg">
                    👤
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

             
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{customerData.name}</h2>
                <p className="text-gray-500 mb-4 capitalize">{customerData.role}</p>

             
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-gray-600 italic leading-relaxed">
                    {user?.bio || `Hi, I am ${user?.name} and I love buying new things`}
                  </p>
                </div>

  
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

    
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
       
              <div className="flex justify-between items-center p-8 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Account Details</h3>
                  <p className="text-gray-500 mt-1">Manage your personal information</p>
                </div>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

  
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-blue-500" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        name="name"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        value={updatedData.name || ""}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                        {customerData.name}
                      </div>
                    )}
                  </div>

            
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Mail className="w-4 h-4 text-green-500" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        name="email"
                        type="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        value={updatedData.email || ""}
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                        {customerData.email}
                      </div>
                    )}
                  </div>

     
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Phone className="w-4 h-4 text-purple-500" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        name="contact"
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        value={updatedData.contact || ""}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                        {customerData?.contact || "Not provided"}
                      </div>
                    )}
                  </div>

            
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 text-red-500" />
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        name="shortAddress"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        value={updatedData.shortAddress || ""}
                        onChange={handleChange}
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                        {customerData?.shortAddress || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>

      
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Account Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-gray-700">Member Since</span>
                      </div>
                      <div className="text-gray-800 font-medium">
                        {customerData.createdAt
                          ? new Date(customerData.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-700">Last Updated</span>
                      </div>
                      <div className="text-gray-800 font-medium">
                        {customerData.updatedAt
                          ? new Date(customerData.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-semibold text-gray-700">Account Type</span>
                      </div>
                      <div className="text-gray-800 font-medium capitalize">{customerData.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

   
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">My Orders</h3>
                <p className="text-sm text-gray-500">View order history</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Security</h3>
                <p className="text-sm text-gray-500">Password & security</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Support</h3>
                <p className="text-sm text-gray-500">Get help & support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
