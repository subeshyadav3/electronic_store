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
        // Call api
        const res = await apiClient.get(`/customer/orders`, { withCredentials: true });
        setOrders(res.data.orders || []);
        console.log("Fetched orders:", res.data.orders);
      } catch (err) {
        console.error("Error fetching customer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchCustomerOrders();
  }, [user?.userId]);

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">My Orders</h1>

      {loading ? (
        <ManageOrderSkeleton />
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <span className="font-semibold">Order ID: {order._id.slice(-6)}</span>
                <span className="font-semibold">
                  Product Name: {order.products.map((item) => item.productId.title).join(", ")}
                </span>
                <span>Status: {order.status}</span>
              </div>

              <div className="mb-3">
                <span className="font-semibold">Shipping:</span>{" "}
                {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.country}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse bg-gray-50 rounded-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left text-sm text-gray-700">Product</th>
                      <th className="py-2 px-3 text-left text-sm text-gray-700">Quantity</th>
                      <th className="py-2 px-3 text-left text-sm text-gray-700">Price</th>
                      <th className="py-2 px-3 text-left text-sm text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item) => (
                      <tr key={item.productId._id} className="border-b">
                        <td className="py-2 px-3 text-gray-600">{item.productId.title}</td>
                        <td className="py-2 px-3 text-gray-600">{item.quantity}</td>
                        <td className="py-2 px-3 text-gray-600">${item.priceAtPurchase.toFixed(2)}</td>
                        <td className="py-2 px-3 text-gray-600">
                          ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-3 font-semibold">
                Total: ${order.totalAmount.toFixed(2)} (Discount: ${order.discount.toFixed(2)})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
