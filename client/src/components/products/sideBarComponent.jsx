"use client"

import React from "react"
import { Filter, Tag, DollarSign, Laptop, Watch, Smartphone, Tablet, X } from "lucide-react"

const SidebarComponent = ({ setFilter, handlePriceRangeChange, minPrice, maxPrice }) => {

  const [activeCategory, setActiveCategory] = React.useState(null)
  const [activeBrand, setActiveBrand] = React.useState(null)

  const categories = [
    { value: "laptops", label: "Laptops", icon: Laptop },
    { value: "mens-watches", label: "Watches", icon: Watch },
    { value: "smartphones", label: "Smartphones", icon: Smartphone },
    { value: "tablets", label: "Tablets", icon: Tablet },
  ]

  const brands = [
    "Asus", "Apple", "Huawei", "Lenovo", "Dell", "Rolex", "Samsung", "Vivo"
  ]

  const toggleCategory = (val) => {
    const newValue = activeCategory === val ? "" : val
    setActiveCategory(activeCategory === val ? null : val)
    setFilter({ target: { name: "category", value: newValue } })
  }

  const toggleBrand = (val) => {
    const newValue = activeBrand === val ? "" : val
    setActiveBrand(activeBrand === val ? null : val)
    setFilter({ target: { name: "brands", value: newValue } })
  }

  const clearAll = () => {
    setActiveCategory(null)
    setActiveBrand(null)

  }

  return (
    <div className="flex flex-col gap-8">

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Tag className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Categories</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.value
            return (
              <button
                key={cat.value}
                data-sidebar-category
                onClick={() => toggleCategory(cat.value)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group ${activeCategory === cat.value
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`} />
                  <span className="text-sm font-semibold">{cat.label}</span>
                </div>
                {isActive && <X className="w-3 h-3 text-white/70" />}
              </button>
            )
          })}
        </div>
      </div>


      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Brands</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => {
            const isActive = activeBrand === brand
            return (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${isActive
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
              >
                {brand}
              </button>
            )
          })}
        </div>
      </div>


      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <DollarSign className="w-4 h-4 text-green-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Price Range</h3>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                name="min"
                type="number"
                value={minPrice}
                onChange={handlePriceRangeChange}
                placeholder="Min"
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div className="flex-1">
              <input
                name="max"
                type="number"
                value={maxPrice}
                onChange={handlePriceRangeChange}
                placeholder="Max"
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Budget</span>
            <span className="text-sm font-black text-slate-700">
              ${Number(minPrice).toLocaleString()} — ${Number(maxPrice).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={clearAll}
        className="w-full py-3 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Reset All Filters
      </button>
    </div>
  )
}

export default SidebarComponent