import React, { useState, useEffect } from "react";
import apiClient from "../../components/helper/axios";

const ManageOrder = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/admin/orders");
        setOrders(response.data.orders);
        // console.log(response.data.orders[0].discount);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await apiClient.put(`/admin/orders/${orderId}`, { status });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: response.data.status } : order));
    } catch (err) {
      console.error("Error updating status:", err.message);
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Orders</h1>
      {orders && orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4 text-left text-gray-700">Order ID</th>
                <th className="py-3 px-4 text-left text-gray-700">Total Amount</th>
                <th className="py-3 px-4 text-left text-gray-700">Discount</th>
                <th className="py-3 px-4 text-left text-gray-700">Status</th>
                <th className="py-3 px-4 text-left text-gray-700">Shipping Address</th>
                <th className="py-3 px-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{order._id}</td>
                  <td className="py-3 px-4 text-gray-600">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-600">${order.discount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-600">{order.status}</td>
                  <td className="py-3 px-4 text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                      onClick={() => handleStatusChange(order._id, 'shipped')}
                    >
                      Mark as Shipped
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none ml-2"
                      onClick={() => handleStatusChange(order._id, 'delivered')}
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrder;
