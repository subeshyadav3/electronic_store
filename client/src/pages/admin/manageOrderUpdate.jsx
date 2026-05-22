import React, { useState, useEffect } from "react"
import apiClient from "../../components/helper/axios"
import { useNavigate, useParams } from "react-router-dom"
import LoadingComponent from "../../components/helper/loadingComponent"
import { useToast } from "../../context/toastContext"

const ManageOrderUpdate = () => {
  const { id } = useParams() 
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    status: "",
    totalAmount: "",
    discount: "",
    street: "",
    city: "",
    country: "",
  })
  const [formErrors, setFormErrors] = useState({
    status: "",
    totalAmount: "",
    discount: "",
    street: "",
    city: "",
    country: "",
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/admin/orders/${id}`)
        setOrder(response.data)
        setFormData({
          status: response.data.orders.status,
          totalAmount: response.data.orders.totalAmount,
          discount: response.data.orders.discount,
          street: response.data.orders.shippingAddress.street,
          city: response.data.orders.shippingAddress.city,
          country: response.data.orders.shippingAddress.country,
        })
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  };

  const validateForm = () => {
    const errors = {}
    if (!formData.status) errors.status = "Status is required"
    if (!formData.totalAmount || isNaN(formData.totalAmount) || formData.totalAmount <= 0) errors.totalAmount = "Valid total amount is required"
    if (formData.discount && (isNaN(formData.discount) || formData.discount < 0)) errors.discount = "Valid discount is required"
    if (!formData.street) errors.street = "Street address is required"
    if (!formData.city) errors.city = "City is required"
    if (!formData.country) errors.country = "Country is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const updatedOrder = {
        status: formData.status,
        totalAmount: parseFloat(formData.totalAmount),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          country: formData.country,
        },
      }

      const response = await apiClient.post(`/admin/orders/${id}`, updatedOrder)
      showToast("Order updated successfully!", "success")
      navigate("/dashboard/admin/orders")
    } catch (err) {
      setError("Failed to update order. Please try again.")
    }
  }

  if (loading) return <LoadingComponent />
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-4 max-w-md text-center shadow-sm">
          <p className="font-medium">Adjustment Error</p>
          <p className="text-sm opacity-90 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Update Order</h1>
        <p className="mt-2 text-sm text-gray-500">
          Modify dispatch status, financials, or delivery location coordinates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">Order Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.status ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            {formErrors.status && <p className="text-red-500 text-xs mt-1.5">{formErrors.status}</p>}
          </div>

          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1.5">Total Amount ($)</label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.totalAmount ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {formErrors.totalAmount && <p className="text-red-500 text-xs mt-1.5">{formErrors.totalAmount}</p>}
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1.5">Discount Allocation ($)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.discount ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {formErrors.discount && <p className="text-red-500 text-xs mt-1.5">{formErrors.discount}</p>}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Shipping Destination</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors.street ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              {formErrors.street && <p className="text-red-500 text-xs mt-1.5">{formErrors.street}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors.city ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              {formErrors.city && <p className="text-red-500 text-xs mt-1.5">{formErrors.city}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors.country ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              {formErrors.country && <p className="text-red-500 text-xs mt-1.5">{formErrors.country}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/orders")}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel Modifications
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Update Records
          </button>
        </div>
      </form>
    </div>
  )
}

export default ManageOrderUpdate