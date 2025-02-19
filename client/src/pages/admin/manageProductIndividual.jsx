
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useProducts } from "../../context/productContext"
import LoadingComponent from "../../components/helper/loadingComponent"

function ManageProductIndividual() {
  const { id } = useParams()
  const { getProductById, adminProductUpdate, loading } = useProducts()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductById(id)
        setProduct(result)
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    fetchProduct()
  }, [id, getProductById])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await adminProductUpdate(id, product)
      alert("Product updated successfully!")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Please try again.")
    }
  }

  if (loading) return <LoadingComponent />
  if (!product) return <div>Product not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <h1 className="text-2xl font-semibold mb-6">Manage Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={product.title}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={product.brand}
              readOnly
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              readOnly
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleInputChange}
              min="0"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium">Discount Percentage</label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={product.discountPercentage}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max="100"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={product.rating}
              readOnly
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="mt-6">
          <label htmlFor="thumbnail" className="block text-sm font-medium">Thumbnail URL</label>
          <input
            type="text"
            id="thumbnail"
            name="thumbnail"
            value={product.thumbnail}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-6">
          <label htmlFor="availabilityStatus" className="block text-sm font-medium">Availability Status</label>
          <input
            type="text"
            id="availabilityStatus"
            name="availabilityStatus"
            value={product.availabilityStatus}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-6">
          <label htmlFor="warranty" className="block text-sm font-medium">Warranty</label>
          <input
            type="text"
            id="warranty"
            name="warranty"
            value={product.warranty}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-6">
          <label htmlFor="shippingInformation" className="block text-sm font-medium">Shipping Information</label>
          <input
            type="text"
            id="shippingInformation"
            name="shippingInformation"
            value={product.shippingInformation}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-6">
          <label htmlFor="returnPolicy" className="block text-sm font-medium">Return Policy</label>
          <input
            type="text"
            id="returnPolicy"
            name="returnPolicy"
            value={product.returnPolicy}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md"
        >
          Update Product
        </button>
      </form>
    </div>
  )
}

export default ManageProductIndividual
