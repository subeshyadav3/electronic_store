import { useEffect, useState } from "react"; 
import apiClient from "../../components/helper/axios";
import { useAuth } from "../../context/authContext";
import ManageOrderSkeleton from "../../components/skeleton/manage-order-skeleton";
import { ShoppingBag, Package, MapPin } from "lucide-react";

export default function CustomerOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/customer/orders`, { withCredentials: true });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching customer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchCustomerOrders();
  }, [user?.userId]);

  const getStatusStyles = (status) => {
    const normalized = status?.toLowerCase() || "";
    switch (normalized) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "processing":
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  if (loading) {
    return <ManageOrderSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 py-6 md:py-10">
      <div className="max-w-4xl  px-4">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Track and review your recent purchases.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center max-w-md mx-auto shadow-sm">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900">No orders yet</h3>
            <p className="text-slate-500 text-sm mt-1">Your purchase history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => {
              if (!order?._id) return null;

              return (
                <div key={order._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  
            
                  <div className="bg-slate-50 border-b border-slate-100 px-4 md:px-6 py-4 grid grid-cols-2 md:flex md:items-center md:justify-between gap-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 font-bold uppercase block">Order ID</span>
                      <span className="font-mono font-bold text-slate-700">#{order._id.slice(-6).toUpperCase()}</span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 font-bold uppercase block">Status</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize border mt-0.5 ${getStatusStyles(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="col-span-2 md:col-span-1 md:text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase block">Ship To</span>
                      <span className="text-slate-600 font-medium truncate block max-w-xs md:ml-auto">
                        {order.shippingAddress?.street ? `${order.shippingAddress.street}, ` : ""}
                        {order.shippingAddress?.city || "Address"}
                      </span>
                    </div>
                  </div>

             
                  <div className="p-4 md:p-6">
                    
             
                    <div className="block md:hidden space-y-3">
                      {order.products?.map((item, index) => (
                        <div key={item?.productId?._id || index} className="flex justify-between items-start text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                          <div className="pr-4">
                            <p className="font-semibold text-slate-900">{item?.productId?.title || "Product Item"}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Qty: {item?.quantity || 1} × ${item?.priceAtPurchase?.toFixed(2)}</p>
                          </div>
                          <span className="font-mono font-semibold text-slate-900">
                            ${((item?.quantity || 1) * (item?.priceAtPurchase || 0)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                   
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full table-auto text-sm text-left">
                        <thead>
                          <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="pb-3 font-semibold">Product</th>
                            <th className="pb-3 text-center font-semibold">Quantity</th>
                            <th className="pb-3 text-right font-semibold">Price</th>
                            <th className="pb-3 text-right font-semibold">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {order.products?.map((item, index) => (
                            <tr key={item?.productId?._id || index} className="text-slate-700">
                              <td className="py-3 font-medium text-slate-900">{item?.productId?.title || "Product Item"}</td>
                              <td className="py-3 text-center text-slate-500">{item?.quantity || 1}</td>
                              <td className="py-3 text-right font-mono">${item?.priceAtPurchase?.toFixed(2)}</td>
                              <td className="py-3 text-right font-mono font-semibold text-slate-900">
                                ${((item?.quantity || 1) * (item?.priceAtPurchase || 0)).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 md:mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</span>
                      <div className="text-right">
                        {order.discount > 0 && (
                          <span className="text-xs font-medium text-emerald-600 block mb-0.5">
                            Saved ${order.discount.toFixed(2)}
                          </span>
                        )}
                        <span className="font-mono text-indigo-600 text-lg md:text-xl font-extrabold">
                          ${(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}