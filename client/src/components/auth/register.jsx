"use client"

import React, { useState } from "react"
import LoadingComponent from "../helper/loadingComponent"
import { FaUser, FaEnvelope, FaLock, FaPhone, FaKey } from "react-icons/fa"
import { useAuth } from "../../context/authContext"
import { useToast } from "../../context/toastContext"

const Register = () => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [contact, setContact] = useState("")
  const [otp, setOtp] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { register, getOtp, otpVerify, user } = useAuth()
  const { showToast } = useToast()
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/


  const [completedSteps, setCompletedSteps] = useState([])


  const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Verification" },
  ]

  const validateRegistration = () => {
    const formErrors = {}
    if (!name) formErrors.name = "Name is required"
    if (!email) {
      formErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      formErrors.email = "Invalid email format"
    }
    if (!password) formErrors.password = "Password is required"
    if (!contact) formErrors.contact = "Contact is required"

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleRegistration = async (e) => {
    e.preventDefault()

    if (!validateRegistration()) return

    setIsLoading(true)
    try {
      const res = await register(name, email, password, contact)
      if(res.data.status==409){
        setErrors({ general: res.data.message })
        showToast(res.data.message, "error")
        return
      }
      
        
      console.log("Registration successful", res.data.success)
      if (res.data.success) {
        showToast(res.data.message, "success")
        getOtp(email)
        setCompletedSteps([...completedSteps, 1]) 
        setStep(2)
      }
    } catch (err) {
      showToast(err.response.data.message, "error")
      console.error("Error: ", err.response.data.message )
      err.response.data.errors.forEach((error) => {
        setErrors({ general: error.msg })
      })
     
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async () => {
    setIsLoading(true)
    try {
      console.log(user)
      const res = await getOtp(user.email)
      console.log("OTP sent successfully", res.data.message)
      showToast("OTP sent successfully", "success")
    } catch (err) {
      console.error("Error: ", err.response?.data.message)
      setErrors({ general: "Failed to resend OTP. Please try again." })
      showToast("Failed to resend OTP", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerification = async (e) => {
    e.preventDefault()
    setIsLoading(true)
 
    try {
      const res = await otpVerify(user.email, otp)
      console.log(res)
      if (res.success) {
        setCompletedSteps([...completedSteps, 2]) 
        window.location.href = "/login"
      }
      console.log("OTP verification successful", res.data.message)
    } catch (err) {
      console.error("Error: ", err.response?.data.message)
      setErrors({ general: err.response?.data.message })
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    setStep(1)
  }

  if (isLoading) return <LoadingComponent />

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl transform transition-all hover:scale-105">
   
        <div className="mb-6">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      completedSteps.includes(s.id)
                        ? "bg-green-500 text-white"
                        : step === s.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {completedSteps.includes(s.id) ? "✓" : s.id}
                  </div>
                  <div className="mt-2 text-xs font-medium">{s.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${completedSteps.includes(s.id) ? "bg-green-500" : "bg-gray-200"}`}
                    style={{ width: "60px" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {step === 1 ? "Create Your Account" : "Verify Your Email"}
        </h2>

        {step === 1 ? (
        
          <form onSubmit={handleRegistration} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact">
                Contact
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contact ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your contact number"
                />
              </div>
              {errors.contact && <p className="mt-2 text-sm text-red-500">{errors.contact}</p>}
            </div>

            {errors.general && <p className="text-sm text-red-500 text-center mb-4">{errors.general}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        ) : (
          // OTP Verification Form
          <form onSubmit={handleOtpVerification} noValidate>
            <div className="mb-4 relative">
              <button
                type="button"
                className="absolute top-[-40px] left-0 text-blue-600 flex items-center text-sm"
                onClick={goBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="otp">
                OTP
              </label>
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter the OTP sent to your email"
                />
              </div>
              {errors.otp && <p className="mt-2 text-sm text-red-500">{errors.otp}</p>}
            </div>

            {errors.general && <p className="text-sm text-red-500 text-center mb-4">{errors.general}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          {step === 1 ? (
            <span>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </span>
          ) : (
            <span>
              Didn't receive the OTP?{" "}
              <button onClick={resendOtp} className="text-blue-600 hover:underline">
                Resend
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register
