import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import apiClient from '../../components/helper/axios';

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setUpdatedData({
                name: user.name || '',
                email: user.email || '',
                // phone: user.phone || '',
                // address: user.address || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            const res = await apiClient.put(`/customer/${user?.userId}`, updatedData)

            const data = await res.json();
            if (data.success) {
                alert('User updated successfully');
                setIsEditing(false);
            } else {
                alert('Failed to update user');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while updating');
        }
    };

    return (
        <div className="flex flex-col w-full lg:px-32 sm:px-20 mt-10 h-screen">
            <div className="flex flex-col w-full h-full sm:flex-row md:gap-[20px] items-center sm:items-start">
                <div className="w-full sm:w-1/2 flex h-[272px] flex-col items-center p-5 bg-gray-200 rounded-sm shadow-sm hover:shadow-md">
                    <div className="w-[150px] h-[150px] rounded-full bg-gray-300 mb-2 flex items-center justify-center text-4xl text-white">
                        👤
                    </div>
                    <h1 className="text-lg font-semibold">Customer ID: {user?.userId}</h1>
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
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.name}
                                    onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                                />
                            ) : (
                                user?.name
                            )}
                        </label>
                        <label className="text-gray-600">
                            Email:{' '}
                            {isEditing ? (
                                <input
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.email}
                                    onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                                />
                            ) : (
                                user?.email
                            )}
                        </label>
                        <label className="text-gray-600">
                            Phone:{' '}
                            {isEditing ? (
                                <input
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.phone}
                                    onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
                                />
                            ) : (
                                user?.phone
                            )}
                        </label>
                        <label className="text-gray-600">
                            Address:{' '}
                            {isEditing ? (
                                <input
                                    className="p-1 border border-gray-300 rounded w-full"
                                    value={updatedData.address}
                                    onChange={(e) => setUpdatedData({ ...updatedData, address: e.target.value })}
                                />
                            ) : (
                                user?.address
                            )}
                        </label>
                        <p className="text-gray-600">
                            Created At: {user?.iat ? new Date(user.iat * 1000).toLocaleDateString() : ''}
                        </p>
                        <p className="text-gray-600">Role: {user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
