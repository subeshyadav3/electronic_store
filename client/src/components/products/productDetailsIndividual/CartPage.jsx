import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import apiClient from "../../helper/axios";
import LoadingComponent from "../../helper/loadingComponent";
import { useProducts } from "../../../context/productContext";
import { useNavigate } from "react-router-dom";
import CartSkeleton from "../../skeleton/cart-skeleton";
import { useToast } from "../../../context/toastContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getProductById } = useProducts();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const {showToast}=useToast();

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
        const response = await apiClient.post('/cart', {productId, quantity });
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
        setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== productId));
      } catch (error) {
        console.error("Error removing item:", error);
      }
  };

  const totalPrice = cartItems.reduce((sum, item) => selectedItems.includes(item.productId)? sum + item.price * item.quantity: sum, 0);
  
  const handleCheckout = () => {
    if(selectedItems.length===0) {
      showToast("Please select at least one item to checkout","error");
      return;
    }
    const itemsToCheckout= cartItems.filter(item => selectedItems.includes(item.productId));
    navigate("/checkout", { state: { itemsToCheckout, totalPrice } });
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map(item => item.productId));
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2.5 bg-purple-100 rounded-xl text-purple-600">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Your Shopping Cart</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => <CartSkeleton key={idx} />)}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center max-w-xl mx-auto mt-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Your cart is empty</h3>
            <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <button 
              onClick={() => navigate('/store')}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Discover Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                    checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                    onChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium text-slate-600">
                    Select All ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                {selectedItems.length > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">
                    {selectedItems.length} Selected
                  </span>
                )}
              </div>

              <ul className="divide-y divide-slate-100 px-6">
                {cartItems.map((item) => {
                  const isSelected = selectedItems.includes(item.productId);
                  return (
                    <li key={item.productId} className={`py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-colors duration-150 ${isSelected ? 'bg-purple-50/10 -mx-6 px-6' : ''}`}>
                      <div className="flex items-center space-x-4 w-full sm:w-auto flex-1">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 flex-shrink-0"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.productId]);
                            } else {
                              setSelectedItems(selectedItems.filter((id) => id !== item.productId));
                            }
                          }}
                        />
                        <div className="h-20 w-20 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-slate-800 truncate mb-1">{item.title}</h3>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-base font-bold text-slate-900">${item.price.toFixed(2)}</span>
                            {item.discount > 0 && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-medium">
                                Save ${item.discount.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
                          <button
                            className="p-1.5 hover:bg-white text-slate-500 hover:text-purple-600 rounded-md transition-all active:scale-90"
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center font-semibold text-sm text-slate-800">{item.quantity}</span>
                          <button
                            className="p-1.5 hover:bg-white text-slate-500 hover:text-purple-600 rounded-md transition-all active:scale-90"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3.5 pb-4 border-b border-slate-100">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Selected Items</span>
                  <span className="font-medium text-slate-700">{selectedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 mb-6">
                <span className="text-base font-medium text-slate-800">Total Price</span>
                <span className="text-2xl font-black text-purple-600">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className={`w-full py-3.5 px-4 font-semibold rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
                  selectedItems.length === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-100 hover:shadow-lg transform active:scale-[0.99]"
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {selectedItems.length === 0 && (
                <p className="text-center text-xs text-slate-400 mt-3">
                  Select at least one product above to enable checkout.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;