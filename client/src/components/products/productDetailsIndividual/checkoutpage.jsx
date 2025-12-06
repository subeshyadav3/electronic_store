import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../helper/axios";


const submitEsewaForm = (url, data) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  form.target = "_self";

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = data[key];
      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();

};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], totalPrice = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | "success" | "failed"
  const [paymentMessage, setPaymentMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      setIsProcessing(true);


      const response = await apiClient.post("/payment/create", {
        userInfo: formData,
        items: cartItems,
        totalAmount: totalPrice,
        paymentGateway: "esewa",
      });
      console.log("Payment creation response:", response.data);
      const { esewaUrl, esewaFormData } = response.data;

      submitEsewaForm(esewaUrl, esewaFormData);


    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed. Please check console for details.");
      setIsProcessing(false);
    }
  };


  useEffect(() => {
    const query = window.location.search;
    const cleanedQuery = query.replace(/\?data=/, "&data=");
    const params = new URLSearchParams(cleanedQuery);
    const esewaCallback = params.get("esewa_callback");
    const responseData = params.get("data");


    if (esewaCallback) {
      setIsProcessing(true);

      if (esewaCallback === "success" && responseData) {
        apiClient.post("/payment/verify-esewa", { responseData })
          .then((res) => {
            setPaymentStatus("success");
            setPaymentMessage(
              "Payment successful! Transaction ID: " + res.data.payment.paymentId
            );
          })
          .catch((err) => {
            setPaymentStatus("failed");
            setPaymentMessage(
              err.response?.data?.message || "Payment verification failed"
            );
          })
          .finally(() => {
            setIsProcessing(false);

            window.history.replaceState({}, document.title, "/checkout");
          });
      } else if (esewaCallback === "failed") {
        setPaymentStatus("failed");
        setPaymentMessage("Payment failed or cancelled.");
        setIsProcessing(false);
        window.history.replaceState({}, document.title, "/checkout");
      }
    }
  }, []);

  if (isProcessing) {
    return (
      <div className="container mx-auto md:mx-[100px] px-4 py-8 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-6">Processing...</h1>
        <p>Verifying payment status or redirecting to eSewa. Please wait.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto md:mx-[100px] px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {paymentStatus ? (
        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg text-center">

          <div className="flex justify-center mb-4">
            {paymentStatus === "success" ? (
              <svg
                className="w-16 h-16 text-green-500 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-16 h-16 text-red-500 animate-shake"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
          </div>

          {/* Status text */}
          <h2
            className={`text-2xl font-bold mb-2 ${paymentStatus === "success" ? "text-green-600" : "text-red-600"
              }`}
          >
            {paymentStatus === "success" ? "Payment Successful!" : "Payment Failed!"}
          </h2>

          {/* Message */}
          <p className="mb-6 text-gray-700">{paymentMessage}</p>

          {/* Action button */}
          <button
            onClick={() => navigate("/")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${paymentStatus === "success"
              ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
              : "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white"
              }`}
          >
            {paymentStatus === "success" ? "Go to Home" : "Try Again"}
          </button>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            {["fullName", "email", "address", "city", "zipCode"].map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block mb-2 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isProcessing || cartItems.length === 0}
              className={`mt-6 w-full py-2 px-4 rounded-md text-white transition duration-300 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isProcessing ? "Redirecting to eSewa..." : `Pay $${totalPrice.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-100 p-4 rounded-md space-y-2">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex  justify-between items-center">
                <span className="flex-1 truncate">
                  {item.title} x {item.quantity}
                </span>
                <span className="ml-4 flex-shrink-0 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-300 pt-4 font-semibold flex justify-between items-center">
              <span className="flex-1">Total</span>
              <span className="ml-4 flex-shrink-0 text-right">${totalPrice.toFixed(2)}</span>
            </div>
          </div>



        </div>
      )}
    </div>
  );
};

export default CheckoutPage;