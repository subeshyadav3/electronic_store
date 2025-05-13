import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import Breadcrumb from "../../components/helper/breadcrumbs";
import { MdManageHistory } from "react-icons/md";
import { FaComments } from "react-icons/fa";

function CustomerLayout() {
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
    <div className="flex min-h-screen">
      <div
        className={`text-black p-5 border-r-2 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } ${isFixed ? "fixed h-full" : "absolute"}`}
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
            "Customer Panel"
          )}
        </h2>

        <ul className="space-y-5">
          <li>
            <NavLink
              to="/dashboard/customer"
              end
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-black"
              }
            >
              {!isSidebarOpen ? <MdDashboardCustomize /> : "Dashboard"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/customer/cart"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-black"
              }
            >
              {!isSidebarOpen ? <FaCartArrowDown /> : "Cart Items"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/customer/orders"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-black"
              }
            >
              {!isSidebarOpen ? <MdManageHistory /> : "Orders"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/admin/comments"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-black"
              }
            >
              {!isSidebarOpen ? <FaComments /> : "Comments"}
            </NavLink>
          </li>
        </ul>
      </div>

      <div
        className={`flex-1 p-5 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Breadcrumb />
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerLayout;
