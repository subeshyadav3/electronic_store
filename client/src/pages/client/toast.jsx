import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "success", onClose }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-gray-900";
      case "info":
        return "bg-blue-500 text-white";
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
        transition={{ duration: 0.3 }}
        className={` m-2 px-4 py-3 shadow-lg flex items-center space-x-4 ${getBackgroundColor()} z-50 notification`}
      >
        <div className="font-medium">{message}</div>
        <button onClick={onClose} className="text-white">
          <X size={20} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
