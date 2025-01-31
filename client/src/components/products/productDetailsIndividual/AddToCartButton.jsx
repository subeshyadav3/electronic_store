import { useState } from "react"

const AddToCartButton = ({ productId }) => {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    // Simulate adding to cart
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAdding(false)
    alert("Product added to cart!")
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300"
    >
      {isAdding ? "Adding to Cart..." : "Add to Cart"}
    </button>
  )
}

export default AddToCartButton

