import { useState } from "react"
import { useProducts } from "../../context/productContext"
import LoadingComponent from "../../components/helper/loadingComponent"

function CreateProductForm() {
  const { adminCreateProduct, loading } = useProducts()
  const [errors, setErrors] = useState({})
  const [product, setProduct] = useState({
    title: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    discountPercentage: "",
    description: "",
    thumbnail: "",
    availabilityStatus: "in_stock",
    warranty: "",
    shippingInformation: "",
    returnPolicy: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!product.title.trim()) newErrors.title = "Title is required"
    else if (product.title.length < 3) newErrors.title = "Title must be at least 3 characters"
    
    if (!product.brand.trim()) newErrors.brand = "Brand is required"
    if (!product.category.trim()) newErrors.category = "Category is required"
    
    if (!product.description.trim()) newErrors.description = "Description is required"
    else if (product.description.length < 20) newErrors.description = "Description must be at least 20 characters"

    // Numeric validation
    if (product.price && isNaN(Number(product.price))) newErrors.price = "Price must be a number"
    if (product.stock && isNaN(Number(product.stock))) newErrors.stock = "Stock must be a number"
    if (product.discountPercentage && isNaN(Number(product.discountPercentage))) newErrors.discountPercentage = "Discount must be a number"
    
    // Thumbnail URL validation
    if (product.thumbnail && !isValidUrl(product.thumbnail)) newErrors.thumbnail = "Please enter a valid URL"
    return newErrors
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    const productData = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      discountPercentage: Number(product.discountPercentage),
    }
    console.log(productData)
    try {
      await adminCreateProduct(productData)
      alert("Product created successfully!")
      setProduct({
        title: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        discountPercentage: "",
        description: "",
        thumbnail: "",
        availabilityStatus: "in_stock",
        warranty: "",
        shippingInformation: "",
        returnPolicy: "",
      })
      setErrors({})
    } catch (error) {
      alert("Failed to create product. Please try again.")
    }
  }

  if (loading) return <LoadingComponent />

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Create New Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Title', name: 'title', type: 'text' },
              { label: 'Brand', name: 'brand', type: 'text' },
              { label: 'Category', name: 'category', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={product[name]}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                />
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
              </div>
            ))}
            
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium mb-1">
                Thumbnail URL
              </label>
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                value={product.thumbnail}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${errors.thumbnail ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full p-2 border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Pricing and Inventory */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Price', name: 'price', type: 'number', min: '0' },
              { label: 'Stock', name: 'stock', type: 'number', min: '0' },
              { label: 'Discount Percentage', name: 'discountPercentage', type: 'number', min: '0', max: '100' },
            ].map(({ label, name, type, min, max }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={product[name]}
                  onChange={handleInputChange}
                  min={min}
                  max={max}
                  className={`w-full p-2 border rounded-md ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                />
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Availability and Additional Info */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">Additional Information</h2>
          <div className="space-y-4">
            {[
              { label: 'Warranty Information', name: 'warranty' },
              { label: 'Shipping Information', name: 'shippingInformation' },
              { label: 'Return Policy', name: 'returnPolicy' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <textarea
                  id={name}
                  name={name}
                  value={product[name]}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProductForm
