import { useProducts } from "../context/productContext"
import ProductCard from "../components/products/productCard"
import LoadingComponent from "../components/helper/loadingComponent"

import { ShoppingBag, Zap, Truck } from "lucide-react"
import { useEffect, useState } from "react"
import apiClient from "../components/helper/axios"
import { Link } from "react-router-dom"

const Home = () => {
  const { products, getHomeProducts, loading, setLoading, error,setFilter } = useProducts()


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
        const categories = ['smartphones', 'laptops', 'watches', 'tablets']
        for (let category of categories) {

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




  return (
    <div className="min-h-screen flex flex-col">

      <div className="bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">Discover Your Tech Style</h1>
            <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
              Shop the latest mobiles, laptops & more
            </p>
            <Link
              to='/store'
              className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
            >
              Shop Now
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm animate-fade-in-up animation-delay-600">
              <ShoppingBag className="w-10 h-10 mr-4" />
              <div>
                <h3 className="font-semibold text-lg">Wide Selection</h3>
                <p>Find the perfect tech for you</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm animate-fade-in-up animation-delay-800">
              <Zap className="w-10 h-10 mr-4" />
              <div>
                <h3 className="font-semibold text-lg">Fast Shipping</h3>
                <p>Get your products quickly</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm animate-fade-in-up animation-delay-1000">
              <Truck className="w-10 h-10 mr-4" />
              <div>
                <h3 className="font-semibold text-lg">Easy Returns</h3>
                <p>30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Smartphones", "Laptops", "Watches", "Tablets"].map((category) => (
              <Link to={`/store`} key={category}>
                <div

                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300"
                >
                  <h3 className="font-semibold text-lg">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div
          className={
            loading || error
              ? "flex justify-center items-center"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          }
        >
          {error && <p className="text-red-500 text-center">Some Error Occurred!</p>}
          {loading ? (
            <LoadingComponent />
          ) : (
            products.slice(0, 4).map((product) => <ProductCard key={product._id} products={product} />)
          )}
        </div>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        Object.keys(allCategories).map((category) => (
          <div key={category} className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
              <div
                className={
                  error
                    ? "flex justify-center items-center"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                }
              >
                {error && <p className="text-red-500 text-center">Some Error Occurred!</p>}
                {(allCategories[category] || []).slice(0, 4).map((product) => (
                  <ProductCard key={product._id} products={product} />
                ))}
              </div>
            </div>
          </div>
        ))
      )}



    </div>
  )
}

export default Home

