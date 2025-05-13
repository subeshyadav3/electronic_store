import { useEffect, useState } from "react";
import apiClient from "../../components/helper/axios";
import { useAuth } from "../../context/authContext";
import ManageOrderSkeleton from "../../components/skeleton/manage-order-skeleton";

export default function CustomerOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const res = await apiClient.get(`/customer/${user?.userId}`, { withCredentials: true });
        setOrders(res.data.users.orders || []);
        // console.log(res);
      } catch (err) {
        console.error("Error fetching customer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchCustomerOrders();
    }
  }, [user?.userId]);

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">My Orders</h1>

      {loading ? (
        <ManageOrderSkeleton />
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left text-xs md:text-sm text-gray-700">Order ID</th>
                <th className="py-2 px-3 text-left text-xs md:text-sm text-gray-700">Total</th>
                <th className="py-2 px-3 text-left text-xs md:text-sm text-gray-700 hidden md:table-cell">Discount</th>
                <th className="py-2 px-3 text-left text-xs md:text-sm text-gray-700">Status</th>
                <th className="py-2 px-3 text-left text-xs md:text-sm text-gray-700 hidden md:table-cell">Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 text-xs md:text-sm text-gray-600">{order._id.slice(-6)}</td>
                  <td className="py-2 px-3 text-xs md:text-sm text-gray-600">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2 px-3 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                    ${order.discount.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-xs md:text-sm text-gray-600">{order.status}</td>
                  <td className="py-2 px-3 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
