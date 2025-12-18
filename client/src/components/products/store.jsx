"use client"

import React, { useState, useEffect } from "react"
import { useProducts } from "../../context/productContext"
import ProductCard from "./productCard"
import SidebarComponent from "./sideBarComponent"
import ProductSkeleton from "../skeleton/product-skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Store = () => {
  const { products, setFilter, setPriceRangeFilter, loading } = useProducts()

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
    // console.log(products)
  }, [products])

  useEffect(() => {
    setPriceRangeFilter(`${minPrice}-${maxPrice}`)
  }, [minPrice, maxPrice])

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target
    if (name === "min") setMinPrice(value)
    if (name === "max") setMaxPrice(value)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(products.length / 12)) {
      setPage(newPage)
    }
  }

  const totalPages = Math.max(1, Math.ceil(products.length / 12))

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {

      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {

      if (page <= 3) {
  
        pageNumbers.push(1, 2, 3, "...", totalPages)
      } else if (page >= totalPages - 2) {
 
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
 
        pageNumbers.push(1, "...", page - 1, page, page + 1, "...", totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 min-h-screen">
      <div className="lg:w-[250px] bg-slate-100 p-4">
        <SidebarComponent
          setFilter={setFilter}
          setPriceRangeFilter={setPriceRangeFilter}
          handlePriceRangeChange={handlePriceRangeChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>

      <div className="flex flex-col items-center p-5">
        <div className="mb-5 w-full max-w-[500px] flex-col flex gap-2 sm:flex-row">
          <input
            type="text"
            name="title"
            placeholder="Search"
            className="p-2 mb-3 w-full border border-gray-300 rounded-md"
            onChange={setFilter}
          />
          <button
            name="search"
            value="search"
            onClick={setFilter}
            className="w-fit bg-blue-500 text-white px-4 py-2 h-fit rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />)}

          {!products || products.length === 0 ? (
            <h1 className="text-2xl text-red-500">No products found</h1>
          ) : (
            products
              .slice((page - 1) * 12, page * 12)
              .map((product) => <ProductCard key={product._id} products={product} />)
          )}
        </div>

    
        {products && products.length > 12 && (
          <div className="mt-8 flex flex-col items-center space-y-4">
         
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, products.length)} of {products.length} products
            </div>

        
            <div className="flex items-center space-x-2">

              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

 
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === "..." ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          page === pageNum
                            ? "bg-blue-600 text-white shadow-lg transform scale-105"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
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
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          
            <div className="flex items-center space-x-2 md:hidden">
              <span className="text-sm text-gray-600">Go to page:</span>
              <select
                value={page}
                onChange={(e) => handlePageChange(Number.parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <option key={pageNum} value={pageNum}>
                    {pageNum}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Store
