import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import apiClient from "../../helper/axios";
import LoadingComponent from "../../helper/loadingComponent";
import { useProducts } from "../../../context/productContext";
import { useNavigate } from "react-router-dom";
import CartSkeleton from "../../skeleton/cart-skeleton";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getProductById } = useProducts();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await apiClient.get("/cart");
        const cartItemsData = await Promise.all(
          response.data.getAllCartItems.map(async (item) => {
            const product = await getProductById(item.productId);
            return {
              productId: item.productId,
              title: product.title,
              discount: product.discountPercentage * 0.01 * product.price,
              price: product.price - product.discountPercentage * 0.01 * product.price,
              image: product?.thumbnail,
              quantity: item.quantity,
            };
          })
        );
        setCartItems(cartItemsData);
      } catch (error) {
        setError("Error fetching cart items");
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [getProductById]);

  const updateQuantity = async(productId, quantity) => {
    
    try {
        console.log("productId",productId)
        const response = await apiClient.post('/cart', {productId, quantity });
        console.log(response.data);
    
        setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
  };

  const removeItem = async(productId) => {
    try {
        const response=await apiClient.delete(`/cart/${productId}`);
        
        setCartItems((prevCartItems) => prevCartItems.filter((item) => item.productId !== productId));
        
      } catch (error) {
        console.error("Error removing item:", error);
      }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout')
  }
  

  return (
    <div className="container  mx-auto px-4 py-8 min-h-screen">
      
      <div className="bg-white shadow-lg  rounded-md p-6">
        <div className="flex items-center text-2xl font-bold ">
          <ShoppingCart className="mr-2" /> Your Cart
        </div>
        <div className="m-10">
          {loading && Array.from({ length: 5 }).map((_, idx) => <CartSkeleton key={idx} />)}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Loading Your Cart..</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.productId} className="py-4 flex items-center  flex-col sm:flex-row gap-5">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-16 w-16 rounded-md object-cover mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                    <p className="text-sm text-green-600">Discount: -${item.discount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="p-2 border rounded-md mr-2"
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-2 font-semibold">{item.quantity}</span>
                    <button
                      className="p-2 border rounded-md ml-2"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 border rounded-md ml-4 text-red-600"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</div>
            <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-blue-600 text-white rounded-md">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
