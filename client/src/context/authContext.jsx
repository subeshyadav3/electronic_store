import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../components/helper/axios';
const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '',
    name: '',
    email: '',
    role: '',
    exp: '',
    iat: '',

  }); // Store user details
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
          const res = await apiClient.get('/auth/verifyme', { withCredentials: true });
          console.log("Verify me", res)
          if(res.data.success){
            setUser({
              name: res.data.user?.name,
              email: res.data.user?.email,
              role: res.data.user?.role,
              userId: res.data.user?.userId,
              exp: res.data.user?.exp,
              iat: res.data.user?.iat,

          });
          setIsAuthenticated(true);
        
          }
      } catch (error) {
          setIsAuthenticated(false);
          setUser(null);
      }
      setIsLoading(false);
  };

  checkAuth();
}, []);


useEffect(() => {
  // console.log("Updated user state:", user);
  // console.log("Updated isAuthenticated state:", isAuthenticated);
}, [user]);


  const register= async (name,email,password,contact)=>{
    try{
      const res=await apiClient.post('/auth/register',{name,email,password,contact},{withCredentials:true});
      console.log(res)  
      if(res.data.success){
            console.log("Register", res)
            setUser({
                name: name,
                email: email,
                role: 'customer',
            });
            setIsAuthenticated(false);
        }
     
        // console.log(user)
      return res
    }catch(err){
      console.error('Register error:', err);
      throw err;
  }};

  const getOtp= async (email)=>{
    try{
      const res=await apiClient.post('/auth/otp',{email},{withCredentials:true});
      console.log("Verify Otp", res)
      return res
    }catch(err){
      console.error('OTP error:', err);
      throw err;
  }};

  const otpVerify= async (email,otp)=>{
    try{
      const res=await apiClient.post('/auth/verifyotp',{email,otp},{withCredentials:true});
      console.log("Verify Otp", res)
      return res.data
    }catch(err){
      console.error('OTP error:', err);
      throw err;
  }};

  // Login function
  const login = async (email, password) => {
    try {
      const res = await apiClient.post(
        '/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if(res.data.success){
        setUser({
          name: res.data.user?.name,
          email: res.data.user?.email,
          role: res.data.user?.role,
          userId: res.data.user?.userId,
          exp: res.data.user?.exp,
          iat: res.data.user?.iat,

      });
      setIsAuthenticated(true);
      }

        return res;

    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };


  const getAdminAllUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users', { withCredentials: true });
      // console.log("Get all users", res.data.users)
      return res.data.users;
    } catch (err) {
      console.error('Get all users error:', err);
      throw err;
    }
  };

  const getAdminUsersById =async(id)=>{
    try{
        const res=await apiClient.get(`/admin/users/${id}`,{withCredentials:true});
        console.log("Get user by id", res.data)
        return res.data
    }
    catch(err){
      console.error('Get user by id error:', err);
      throw err;
  }
  }

  const adminUserUpdate=async(id,user)=>{
    try{
        const res=await apiClient.put(`/admin/users/${id}`,user,{withCredentials:true});
        console.log("Update user by id", res.data)
        return res.data
    }
    catch(err){
      console.error('Update user by id error:', err);
      throw err;
  }
  } 

  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated,getAdminAllUsers,adminUserUpdate, getAdminUsersById,isLoading, login,register, logout,getOtp,otpVerify }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);