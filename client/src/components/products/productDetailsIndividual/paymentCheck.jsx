import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../helper/axios";

const PaymentCheck = () => {
  const location = useLocation();
  const { paymentUrl, paymentId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // SUCCESS / FAILED
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!paymentId) return;

    const verifyPayment = async () => {
      try {
     
        const res = await apiClient.get(`/payment/verify/${paymentId}`);
        setPayment(res.data.payment);
        setStatus(res.data.payment.status); // "SUCCESS" or "FAILED"
      } catch (err) {
        console.error(err);
        setStatus("FAILED");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Processing your payment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 text-center">
      {status === "SUCCESS" ? (
        <div className="bg-green-100 p-10 rounded-lg shadow-md inline-block">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="mb-4">Thank you for your purchase.</p>
          {payment && (
            <div className="text-left bg-white p-4 rounded-md shadow-md">
              <p><strong>Payment ID:</strong> {payment._id}</p>
              <p><strong>Total Amount:</strong> ${payment.totalAmount.toFixed(2)}</p>
              <p><strong>Payment Gateway:</strong> {payment.paymentGateway}</p>
              <p><strong>Status:</strong> {payment.status}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-100 p-10 rounded-lg shadow-md inline-block">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed!</h1>
          <p className="mb-4">Something went wrong. Please try again.</p>
          {payment && (
            <div className="text-left bg-white p-4 rounded-md shadow-md">
              <p><strong>Payment ID:</strong> {payment._id}</p>
              <p><strong>Total Amount:</strong> ${payment.totalAmount.toFixed(2)}</p>
              <p><strong>Payment Gateway:</strong> {payment.paymentGateway}</p>
              <p><strong>Status:</strong> {payment.status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentCheck;
