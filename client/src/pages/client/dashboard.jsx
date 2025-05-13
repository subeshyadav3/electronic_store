import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import apiClient from '../../components/helper/axios';
import LoadingComponent from '../../components/helper/loadingComponent';

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [customerData, setCustomerData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({});

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const res = await apiClient.get(`/customer/${user?.userId}`, { withCredentials: true });
                const customer = res.data.users;
                // console.log(customer);
                setCustomerData(customer);
                setUpdatedData(customer); 
            } catch (err) {
                console.error('Error fetching customer data:', err);
            }
        };

        if (user?.userId) {
            fetchCustomerData();
        }
    }, []);

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
                alert('User updated successfully');
                setIsEditing(false);
                setCustomerData(updatedData);
            } else {
                alert('Failed to update user');
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('An error occurred while updating');
        }
    };

    if (!customerData) {
        return <LoadingComponent />;
    }

    return (
        <div className="flex flex-col w-full lg:px-32 md:px-20 mt-10 h-screen">
            <div className="flex flex-col w-full h-full sm:flex-row md:gap-[20px] items-center sm:items-start">
                <div className="w-full sm:w-1/2 flex h-[320px] flex-col items-center p-5 bg-gray-200 rounded-sm shadow-sm hover:shadow-md">
                    <div className="w-[150px] h-[150px] rounded-full bg-gray-300 mb-2 flex items-center justify-center text-4xl text-white">
                        👤
                    </div>
                    <p className=" font-thin font-ougkeh"> {user?.bio || `Hi, I am ${user?.name} and I love buying new things`}</p>
                </div>

                <div className="w-full sm:w-1/2 flex flex-col mt-5 sm:mt-0 gap-5 bg-gray-200 p-5 rounded-sm shadow-sm hover:shadow-md">
                    <h1 className="text-lg font-semibold flex justify-between items-center">
                        Customer Details
                        <span
                            className="ml-2 bg-slate-300 p-2 rounded-md cursor-pointer"
                            onClick={() => {
                                if (isEditing) handleSave();
                                else setIsEditing(true);
                            }}
                        >
                            {isEditing ? 'Save' : 'Update'}
                        </span>
                    </h1>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-600">
                            Name:{' '}
                            {isEditing ? (
                                <input
                                    name="name"
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.name || ''}
                                    onChange={handleChange}
                                />
                            ) : (
                                customerData.name
                            )}
                        </label>
                        <label className="text-gray-600">
                            Email:{' '}
                            {isEditing ? (
                                <input
                                    name="email"
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.email || ''}
                                    onChange={handleChange}
                                />
                            ) : (
                                customerData.email
                            )}
                        </label>
                        <label className="text-gray-600">
                            Phone:{''}
                            {isEditing ? (
                                <input
                                    name="contact"
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.contact }
                                    onChange={handleChange}
                                />
                            ) : (
                                customerData?.contact
                            )}
                        </label>
                        <label className="text-gray-600">
                            Address:{' '}
                            {isEditing ? (
                                <input
                                    name="shortAddress"
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.shortAddress }
                                    onChange={handleChange}
                                />
                            ) : (
                                customerData?.shortAddress
                            )}
                        </label>
                        <p className="text-gray-600">
                            Created At:{' '}
                            {customerData.createdAt
                                ? new Date(customerData.createdAt).toLocaleDateString()
                                : ''}
                        </p>
                        <p className="text-gray-600">
                            Last Updated At:{' '}
                            {customerData.createdAt
                                ? new Date(customerData.updatedAt).toLocaleDateString()
                                : ''}
                        </p>
                        <p className="text-gray-600">Role: {customerData.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
