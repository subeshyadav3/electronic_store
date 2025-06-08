import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "success", onClose }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-yellow-400 text-gray-900";
      case "info":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.4 }}
        className={`m-4 px-6 py-2 shadow-lg rounded-lg flex items-center space-x-4 ${getBackgroundColor()} z-50 notification`}
      >
        <div className="font-semibold text-sm md:text-base">{message}</div>
        <button
          onClick={onClose}
          className="text-white hover:bg-opacity-80 transition duration-200 ease-in-out rounded-full p-1"
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
