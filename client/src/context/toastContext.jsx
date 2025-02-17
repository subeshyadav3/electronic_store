import { createContext, useState, useContext } from "react";
import Toast from "../pages/client/toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showToast = (message, type = "success") => {
    const id = new Date().getTime();
    setNotifications((prev) => [
      ...prev,
      { id, message, type }
    ]);
    console.log(notifications);
    setTimeout(() => {
      removeNotification(id);
    },3000); 
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-0 right-0 space-y-2 z-50">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
