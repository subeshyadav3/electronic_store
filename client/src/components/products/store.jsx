"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useProducts } from "../../context/productContext"
import ProductCard from "./productCard"
import SidebarComponent from "./sideBarComponent"
import ProductSkeleton from "../skeleton/product-skeleton"
import { ChevronLeft, ChevronRight, Search, Filter, ShoppingBag } from "lucide-react"

const Store = () => {
  const { products, setFilter, setPriceRangeFilter, loading } = useProducts()
  const [displayedProducts, setDisplayedProducts] = useState([]) // stable products
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [page, setPage] = useState(1)


  useEffect(() => {
    if (!loading && products.length > 0) {
      setDisplayedProducts(products)
      setPage(1) 
    }
  }, [products, loading])

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setPriceRangeFilter(`${minPrice}-${maxPrice}`)
    }, 400)
    return () => clearTimeout(handler)
  }, [minPrice, maxPrice])

  const ITEMS_PER_PAGE = 12
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / ITEMS_PER_PAGE))

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const paginatedProducts = useMemo(() => {
    return displayedProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  }, [displayedProducts, page])

  const getPageNumbers = () => {
    const pageNumbers = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
    } else {
      if (page <= 3) pageNumbers.push(1, 2, 3, "...", totalPages)
      else if (page >= totalPages - 2) pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      else pageNumbers.push(1, "...", page - 1, page, page + 1, "...", totalPages)
    }
    return pageNumbers
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-[1440px] mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          <aside className="lg:w-[280px] shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 font-semibold text-slate-800">
                <Filter className="w-4 h-4" />
                <span>Refine Selection</span>
              </div>
              <SidebarComponent
                setFilter={setFilter}
                setPriceRangeFilter={setPriceRangeFilter}
                handlePriceRangeChange={(e) => {
                  const { name, value } = e.target
                  if (name === "min") setMinPrice(value)
                  if (name === "max") setMaxPrice(value)
                }}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </div>
          </aside>

          <div className="flex-1">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="title"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  onChange={setFilter}
                />
              </div>
              <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                Showing <span className="text-slate-900">{displayedProducts.length}</span> Results
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => <ProductSkeleton key={idx} />)
              ) : displayedProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mb-4" />
                  <h2 className="text-xl font-semibold text-slate-900">No products found</h2>
                  <p className="text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                paginatedProducts.map((product) => (
                  <div key={product._id} className="transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard products={product} />
                  </div>
                ))
              )}
            </div>

        
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex px-2">
                    {getPageNumbers().map((pageNum, index) => (
                      <React.Fragment key={index}>
                        {pageNum === "..." ? (
                          <span className="px-3 py-2 text-slate-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                              page === pageNum
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Page {page} of {totalPages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Store