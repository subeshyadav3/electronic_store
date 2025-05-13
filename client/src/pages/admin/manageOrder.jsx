
import { useState, useEffect } from "react"
import apiClient from "../../components/helper/axios"
import { useNavigate } from "react-router-dom"
import LoadingComponent from "../../components/helper/loadingComponent"
import ManageOrderSkeleton from "../../components/skeleton/manage-order-skeleton"

const ManageOrder = () => {
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
      const response = await apiClient.put(`/admin/orders/${orderId}`, { status })
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: response.data.status } : order)))
    } catch (err) {
      console.error("Error updating status:", err.message)
    }
  }

  const handleProductEdit = async (orderId) => {
    if (orderId) {
      navigate(`/dashboard/admin/orders/${orderId}`)
    }
  }


  if (error) return <div className="text-center text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Manage Orders</h1>
      {orders && orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 md:py-3 md:px-4 text-left text-xs md:text-sm text-gray-700">Order ID</th>
                <th className="py-2 px-3 md:py-3 md:px-4 text-left text-xs md:text-sm text-gray-700">Total</th>
                <th className="py-2 px-3 md:py-3 md:px-4 text-left text-xs md:text-sm text-gray-700 hidden md:table-cell">
                  Discount
                </th>
                <th className="py-2 px-3 md:py-3 md:px-4 text-left text-xs md:text-sm text-gray-700">Status</th>
                <th className="py-2 px-3 md:py-3 md:px-4 text-left text-xs md:text-sm text-gray-700 hidden md:table-cell">
                  Address
                </th>
                <th className="py-2 px-3 md:py-3 md:px-4 text-center text-xs md:text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (Array.from({ length: 1 }).map((_, idx) => <ManageOrderSkeleton key={idx} />))}
              {!loading &&
              (
                orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 md:py-3 md:px-4 text-xs md:text-sm text-gray-600">{order._id.slice(-6)}</td>
                    <td className="py-2 px-3 md:py-3 md:px-4 text-xs md:text-sm text-gray-600">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 md:py-3 md:px-4 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                      ${order.discount.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 md:py-3 md:px-4 text-xs md:text-sm text-gray-600">{order.status}</td>
                    <td className="py-2 px-3 md:py-3 md:px-4 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </td>
                    <td className="py-2 px-3 md:py-3 md:px-4 text-center">
                      <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-md hover:bg-blue-600 focus:outline-none w-full md:w-auto"
                          onClick={() => handleStatusChange(order._id, "shipped")}
                        >
                          Ship
                        </button>
                        <button
                          className="bg-green-500 text-white px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-md hover:bg-green-600 focus:outline-none w-full md:w-auto"
                          onClick={() => handleStatusChange(order._id, "delivered")}
                        >
                          Deliver
                        </button>
                        <button
                          className="bg-indigo-500 text-white px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-md hover:bg-indigo-600 focus:outline-none w-full md:w-auto"
                          onClick={() => handleProductEdit(order._id)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageOrder

