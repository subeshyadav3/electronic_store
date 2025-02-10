import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import apiClient from "../../helper/axios"

const AddToCartButton = ({ productId, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99))
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
     console.log("productId",productId)
      const response=await apiClient.post('/cart',{productId, quantity})
      console.log(response.data)
      alert(response.data.message)
    } catch (error) {
      console.error(error)
      if(error.response.status===401)  return alert("Please Login First!!!")
       return  alert("An error occurred while adding to cart")

      
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center border border-gray-300 rounded-l-full overflow-hidden">
        <button
          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
          onClick={decrementQuantity}
          disabled={isAdding}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </button>
        <span className="w-10 text-center font-medium">{quantity}</span>
        <button
          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
          onClick={incrementQuantity}
          disabled={isAdding}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </button>
      </div>
      <button
        className="flex items-center  justify-center md:text-sm text-base  rounded-r-full px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        <ShoppingCart className="h-4 w-4 mr-2 "  />
        {isAdding ? "Adding..." : "Add"}
      </button>
    </div>
  )
}

export default AddToCartButton

