"use client"

import { useRef, useState, useEffect } from "react"
import { Filter, Tag, DollarSign, Laptop, Watch, Smartphone, Tablet } from "lucide-react"

const SidebarComponent = ({ setFilter, handlePriceRangeChange, minPrice, maxPrice }) => {
  const ref = useRef(null)
  const [activeElement, setActiveElement] = useState({
    brands: null,
    brands_event: "",
    category: null,
    category_event: "",
  })
  const [isFixed, setIsFixed] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollPosition = window.innerHeight + window.scrollY
      const footerThreshold = scrollHeight - 400

      if (scrollPosition >= footerThreshold) {
        setIsFixed(false)
      } else {
        setIsFixed(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const give = (e) => {
    const name = e.target.name
    const value = e.target.value

    if (name === "category") {
      if (activeElement.category === value) {
        e.target.classList.remove("active-filter-product")
        setActiveElement({ ...activeElement, category: null, category_event: "" })
      } else {
        if (activeElement.category_event) activeElement.category_event.classList.remove("active-filter-product")
        e.target.classList.add("active-filter-product")
        setActiveElement({ ...activeElement, category: value, category_event: e.target })
      }
    } else if (name === "brands") {
      if (activeElement.brands === value) {
        e.target.classList.remove("active-filter-product")
        setActiveElement({ ...activeElement, brands: null, brands_event: "" })
      } else {
        if (activeElement.brands_event) activeElement.brands_event.classList.remove("active-filter-product")
        e.target.classList.add("active-filter-product")
        setActiveElement({ ...activeElement, brands: value, brands_event: e.target })
      }
    }
  }

  const categories = [
    { value: "laptops", label: "Laptops", icon: Laptop },
    { value: "mens-watches", label: "Watches", icon: Watch },
    { value: "smartphones", label: "Smartphones", icon: Smartphone },
    { value: "tablets", label: "Tablets", icon: Tablet },
  ]

  const brands = [
    { value: "Asus", label: "Asus", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { value: "Apple", label: "Apple", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    { value: "Huawei", label: "Huawei", color: "bg-red-100 text-red-700 hover:bg-red-200" },
    { value: "Lenovo", label: "Lenovo", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { value: "Dell", label: "Dell", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { value: "Rolex", label: "Rolex", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    { value: "Samsung", label: "Samsung", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
    { value: "Vivo", label: "Vivo", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  ]

  return (
    <div
      className={`md:w-[220px] lg:w-[260px] bg-white border-r border-gray-200 shadow-lg ${
        isFixed ? "top-0 md:h-screen md:mt-[50px] md:fixed" : "md:relative"
      }`}
    >
      <div className="p-3 space-y-4 md:pt-[15%] overflow-y-auto h-full">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <div className="p-1 bg-blue-100 rounded-md">
            <Filter className="w-3 h-3 text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-gray-800">Filters</h2>
        </div>

        <div className="space-y-2" onClick={give}>
          <div className="flex items-center gap-1 mb-2">
            <Tag className="w-3 h-3 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-800">Categories</h3>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.value}
                  name="category"
                  value={category.value}
                  onClick={setFilter}
                  className="flex items-center gap-2 p-1.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-lg transition-all duration-200 text-left group"
                >
                  <div className="p-1 bg-white rounded-md group-hover:bg-blue-100 transition-colors">
                    <IconComponent className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2" onClick={give}>
          <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800">Brands</h3>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {brands.map((brand) => (
              <button
                key={brand.value}
                name="brands"
                value={brand.value}
                onClick={setFilter}
                className={`p-1.5 rounded-md font-medium transition-all duration-200 text-xs border border-transparent hover:border-current ${brand.color}`}
              >
                {brand.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 mb-2">
            <div className="p-0.5 bg-green-100 rounded-md">
              <DollarSign className="w-3 h-3 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">Price Range</h3>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Min</label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    name="min"
                    type="number"
                    value={minPrice}
                    placeholder="0"
                    className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    onChange={handlePriceRangeChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Max</label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    name="max"
                    type="number"
                    value={maxPrice}
                    placeholder="1000000"
                    className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    onChange={handlePriceRangeChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-md p-2 border border-blue-100">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-0.5">Range</p>
                <p className="text-xs font-bold text-gray-800">
                  ${Number.parseInt(minPrice).toLocaleString()} - ${Number.parseInt(maxPrice).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <button
            onClick={() => {
              setActiveElement({ brands: null, brands_event: "", category: null, category_event: "" })
              document.querySelectorAll(".active-filter-product").forEach((el) => {
                el.classList.remove("active-filter-product")
              })
            }}
            className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-1 text-xs"
          >
            <Filter className="w-3 h-3" />
            Clear Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        .active-filter-product {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
          color: white !important;
          border-color: #3b82f6 !important;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  )
}

export default SidebarComponent
