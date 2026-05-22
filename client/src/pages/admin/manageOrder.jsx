import { useState, useEffect } from "react"
import apiClient from "../../components/helper/axios"
import { useNavigate } from "react-router-dom"
import LoadingComponent from "../../components/helper/loadingComponent"
import ManageOrderSkeleton from "../../components/skeleton/manage-order-skeleton"
import { useToast } from "../../context/toastContext"

const ManageOrder = () => {
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/admin/orders")
        setOrders(response.data.orders)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await apiClient.post(`/admin/orders/${orderId}`, { status })
      const updatedOrder = response.data.order

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      )
      showToast(`Order status updated to ${status}`, "success")
    } catch (err) {
      console.error("Error updating status:", err.message)
    }
  }

  const handleProductEdit = async (orderId) => {
    if (orderId) {
      navigate(`/dashboard/admin/orders/${orderId}`)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-4 max-w-md text-center shadow-sm">
          <p className="font-medium">Error loading orders</p>
          <p className="text-sm opacity-90 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Manage Orders</h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor incoming shipments, track fulfillments, and update order statuses.
          </p>
        </div>
      </div>

      {orders && orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-24 py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:pl-6">ID</th>
                  <th scope="col" className="py-3.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total Amount</th>
                  <th scope="col" className="hidden md:table-cell py-3.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Discount</th>
                  <th scope="col" className="py-3.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th scope="col" className="hidden lg:table-cell py-3.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Destination</th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 sm:pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading && (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <ManageOrderSkeleton key={idx} />
                  ))
                )}
                {!loading && orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono font-medium text-gray-900 sm:pl-6">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ${order.discount.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-500 truncate max-w-xs">
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          disabled={order.status === 'shipped' || order.status === 'delivered'}
                          onClick={() => handleStatusChange(order._id, "shipped")}
                          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Ship
                        </button>
                        <button
                          type="button"
                          disabled={order.status === 'delivered'}
                          onClick={() => handleStatusChange(order._id, "delivered")}
                          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Deliver
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProductEdit(order._id)}
                          className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOrder