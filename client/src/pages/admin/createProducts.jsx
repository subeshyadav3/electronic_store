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

    if (product.price && isNaN(Number(product.price))) newErrors.price = "Price must be a number"
    if (product.stock && isNaN(Number(product.stock))) newErrors.stock = "Stock must be a number"
    if (product.discountPercentage && isNaN(Number(product.discountPercentage))) newErrors.discountPercentage = "Discount must be a number"
    
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Create New Product</h1>
        <p className="mt-2 text-sm text-gray-500">Add detailed catalog information to launch a new product storefront.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Basic Information</h2>
            <p className="text-sm text-gray-500">Core details shown directly to browsing shoppers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {[
              { label: 'Title', name: 'title', type: 'text' },
              { label: 'Brand', name: 'brand', type: 'text' },
              { label: 'Category', name: 'category', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={product[name]}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors[name] 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                {errors[name] && <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>}
              </div>
            ))}
            
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1.5">
                Thumbnail URL
              </label>
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                value={product.thumbnail}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                  errors.thumbnail 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              {errors.thumbnail && <p className="text-red-500 text-xs mt-1.5">{errors.thumbnail}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows="4"
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.description 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
          </div>
        </div>

        <div className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Pricing & Inventory</h2>
            <p className="text-sm text-gray-500">Configure margins, discounts, and inventory control.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'Price ($)', name: 'price', type: 'number', min: '0' },
              { label: 'Stock Level', name: 'stock', type: 'number', min: '0' },
              { label: 'Discount (%)', name: 'discountPercentage', type: 'number', min: '0', max: '100' },
            ].map(({ label, name, type, min, max }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors[name] 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                {errors[name] && <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Additional Logistics</h2>
            <p className="text-sm text-gray-500">Provide shipping parameters, warranty guidelines, and legal assurances.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            {[
              { label: 'Warranty Information', name: 'warranty' },
              { label: 'Shipping Information', name: 'shippingInformation' },
              { label: 'Return Policy', name: 'returnPolicy' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <textarea
                  id={name}
                  name={name}
                  value={product[name]}
                  onChange={handleInputChange}
                  rows="3"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Creating Item..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProductForm