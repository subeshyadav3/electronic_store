import React, { useState, useEffect } from "react";
import apiClient from "../../components/helper/axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/helper/loadingComponent";

const ManageOrderUpdate = () => {
  const {id} = useParams(); 
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    totalAmount: "",
    discount: "",
    street: "",
    city: "",
    country: "",
  });
  const [formErrors, setFormErrors] = useState({
    status: "",
    totalAmount: "",
    discount: "",
    street: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // console.log(id);
        const response = await apiClient.get(`/admin/orders/${id}`);
        setOrder(response.data);
        console.log(response.data.orders);
        setFormData({
          status: response.data.orders.status,
          totalAmount: response.data.orders.totalAmount,
          discount: response.data.orders.discount,
          street: response.data.orders.shippingAddress.street,
          city: response.data.orders.shippingAddress.city,
          country: response.data.orders.shippingAddress.country,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.status) errors.status = "Status is required";
    if (!formData.totalAmount || isNaN(formData.totalAmount) || formData.totalAmount <= 0) errors.totalAmount = "Valid total amount is required";
    if (!formData.discount || isNaN(formData.discount) || formData.discount < 0) errors.discount = "Valid discount is required";
    if (!formData.street) errors.street = "Street address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.country) errors.country = "Country is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updatedOrder = {
        status: formData.status,
        totalAmount: parseFloat(formData.totalAmount),
        discount: parseFloat(formData.discount),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          country: formData.country,
        },
      };

      const response = await apiClient.post(`/admin/orders/${id}`, updatedOrder);

    //   navigate("/admin/orders"); 
    } catch (err) {
      setError("Failed to update order. Please try again.");
    }
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Update Order</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700">Order Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          {formErrors.status && <p className="text-red-500 text-sm">{formErrors.status}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="totalAmount" className="block text-gray-700">Total Amount</label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {formErrors.totalAmount && <p className="text-red-500 text-sm">{formErrors.totalAmount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="discount" className="block text-gray-700">Discount</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {formErrors.discount && <p className="text-red-500 text-sm">{formErrors.discount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="street" className="block text-gray-700">Street Address</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street }
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {formErrors.street && <p className="text-red-500 text-sm">{formErrors.street}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {formErrors.country && <p className="text-red-500 text-sm">{formErrors.country}</p>}
        </div>

        <div className="mb-4 flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Update Order
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/orders")}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageOrderUpdate;
