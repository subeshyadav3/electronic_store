"use client"

import { useProducts } from "../context/productContext"
import ProductCard from "../components/products/productCard"
import { ShoppingBag, Zap, Star, TrendingUp, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProductSkeleton from "../components/skeleton/product-skeleton"

const Home = () => {
  const { products, getHomeProducts, loading, setLoading, error, setFilter } = useProducts()

  const [allCategories, setAllCategories] = useState({
    smartphones: [],
    laptops: [],
    watches: [],
    tablets: [],
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const updatedCategories = {}
        const categories = ["smartphones", "laptops", "watches", "tablets"]
        for (const category of categories) {
          const response = await getHomeProducts(category)
          if (response.length > 0) {
            updatedCategories[category] = response
          }
        }
        setAllCategories(updatedCategories)
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCategories()
  }, [])

  const categoryIcons = {
    Smartphones: "📱",
    Laptops: "💻",
    Watches: "⌚",
    Tablets: "📱",
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">

        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-2 mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2 text-yellow-300" />
              <span className="text-white text-sm font-medium">Trusted by 10,000+ customers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Tech Style
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Shop the latest mobiles, laptops & more with unbeatable prices and premium quality
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/store"
                className="group bg-white text-purple-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center"
              >
                Shop Now
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <button className="text-white border-2 border-white border-opacity-50 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-700 transition-all duration-300">
                View Deals
              </button>
            </div>
          </div>

     
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="group bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Wide Selection</h3>
              <p className="text-blue-100 leading-relaxed">
                Discover thousands of premium tech products from top brands worldwide
              </p>
            </div>

            <div className="group bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Lightning Fast</h3>
              <p className="text-blue-100 leading-relaxed">
                Express delivery within 24 hours to your doorstep with premium packaging
              </p>
            </div>

            <div className="group bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">Premium Support</h3>
              <p className="text-blue-100 leading-relaxed">
                30-day hassle-free returns with 24/7 customer support and warranty
              </p>
            </div>
          </div>
        </div>
      </div>

  
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2 mb-4">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-purple-700 text-sm font-semibold">Popular Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of premium tech products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Smartphones", "Laptops", "Watches", "Tablets"].map((category, index) => (
              <Link to={`/store`} key={category} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 hover:border-purple-200">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                    {categoryIcons[category]}
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{category}</h3>
                  <p className="text-gray-500 text-sm">Explore Collection</p>
                  <div className="mt-4 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-2 mb-4">
              <Star className="w-4 h-4 mr-2 text-yellow-600" />
              <span className="text-orange-700 text-sm font-semibold">Best Sellers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked products that our customers love the most
            </p>
          </div>

          <div
            className={
              loading || error
                ? "flex justify-center items-center min-h-[400px]"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            }
          >
            {loading && Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />)}

            {error && (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">😞</div>
                <p className="text-red-500 text-xl font-semibold">Oops! Something went wrong</p>
                <p className="text-gray-500 mt-2">Please try refreshing the page</p>
              </div>
            )}

            {!loading &&
              !error &&
              products.slice(0, 4).map((product) => (
                <div key={product._id} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard products={product} />
                </div>
              ))}
          </div>
        </div>
      </div>


      {Object.keys(allCategories).map((category, index) => (
        <div
          key={category}
          className={`py-20 ${index % 2 === 0 ? "bg-white" : "bg-gradient-to-br from-gray-50 to-blue-50"}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-4">
                <span className="text-2xl mr-2">
                  {categoryIcons[category.charAt(0).toUpperCase() + category.slice(1)]}
                </span>
                <span className="text-purple-700 text-sm font-semibold">Premium Collection</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the latest {category} with cutting-edge technology and premium design
              </p>
            </div>

            <div
              className={
                error
                  ? "flex justify-center items-center min-h-[400px]"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              }
            >
              {error && (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">😞</div>
                  <p className="text-red-500 text-xl font-semibold">Unable to load {category}</p>
                  <p className="text-gray-500 mt-2">Please try again later</p>
                </div>
              )}

              {loading && Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />)}

              {!loading &&
                !error &&
                (allCategories[category] || []).slice(0, 4).map((product) => (
                  <div key={product._id} className="transform hover:scale-105 transition-transform duration-300">
                    <ProductCard products={product} />
                  </div>
                ))}
            </div>

            {!loading && !error && allCategories[category]?.length > 4 && (
              <div className="text-center mt-12">
                <Link
                  to="/store"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View All {category.charAt(0).toUpperCase() + category.slice(1)}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}

    </div>
  )
}

export default Home
