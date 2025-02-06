import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";

function AdminLayout() {
  const [isFixed, setIsFixed] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const logicFunction = () => {
      const scrollY = window.innerHeight + window.scrollY;
      const wholeHeight = document.documentElement.scrollHeight;
      const heightForHiding = wholeHeight - 160;
      setIsFixed(scrollY < heightForHiding);
    };

    const reponsiveFunction = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("scroll", logicFunction);
    window.addEventListener("resize", reponsiveFunction);

    return () => {
      window.removeEventListener("scroll", logicFunction);
      window.removeEventListener("resize", reponsiveFunction);
    };
  }, []);

  return (
    <div className="grid grid-cols-[auto,1fr] h-screen">
      <div
        className={`text-black p-5 border-r-2 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } ${isFixed ? "fixed" : ""}`}
      >
        <button
          className="flex justify-end w-full mb-5"
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        >
          {!isSidebarOpen ? "X" : "☰"}
        </button>

        <h2 className="text-xl font-bold mb-4">
          {!isSidebarOpen ? (
            <MdAdminPanelSettings />
          ) : (
            "Admin Panel"
          )}
        </h2>

        <ul className="space-y-5">
          
          <li>
            <NavLink
              to="/dashboard/admin"
              end
              className={({ isActive }) => (isActive ? "text-blue-500" : "text-black")}
            >
              {!isSidebarOpen ? (
                <MdDashboardCustomize />
              ) : (
                "Dashboard"
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/admin/products"
              className={({ isActive }) => (isActive ? "text-blue-500" : "text-black")}
            >
              {!isSidebarOpen ? (
                <img src="/public/admin/product.png" className="w-5 h-5" />
              ) : (
                "Manage Products"
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/admin/users"
              className={({ isActive }) => (isActive ? "text-blue-500" : "text-black")}
            >
              {!isSidebarOpen ? (
                <FaUsersCog />
              ) : (
                "Manage Users"
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/admin/orders"
              className={({ isActive }) => (isActive ? "text-blue-500" : "text-black")}
            >
              {!isSidebarOpen ? (
                <img src="/public/admin/order.png" className="w-5 h-5" />
              ) : (
                "Manage Orders"
              )}
            </NavLink>
          </li>
        </ul>
      </div>

      <div
        className={`p-5 transition-all duration-300 ${isSidebarOpen ? "ml-[250px]" : "ml-[80px]"}`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
