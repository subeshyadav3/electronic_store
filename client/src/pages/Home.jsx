"use client"

import { useProducts } from "../context/productContext"
import ProductCard from "../components/products/productCard"
import { ShoppingBag, Zap, Star, TrendingUp, Award, ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProductSkeleton from "../components/skeleton/product-skeleton"

const Home = () => {
  const { products, getHomePageProducts, loading, setLoading, error } = useProducts()
  const [allCategories, setAllCategories] = useState({
    smartphones: [],
    laptops: [],
    watches: [],
    tablets: [],
  })

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true)
        const data = await getHomePageProducts()
        if (data && typeof data === "object") {
          setAllCategories({
            smartphones: data.smartphones || [],
            laptops: data.laptops || [],
            watches: data.watches || [],
            tablets: data.tablets || [],
          })
        }
      } catch (err) {
        console.error(err)
        setAllCategories({
          smartphones: [],
          laptops: [],
          watches: [],
          tablets: [],
        })
      } finally {
        setLoading(false)
      }
    }
    fetchHomeProducts()
  }, [])

  const categoryIcons = {
    Smartphones: "📱",
    Laptops: "💻",
    Watches: "⌚",
    Tablets: "📱",
  }

  const categoryKeys = ["smartphones", "laptops", "watches", "tablets"]

  const getGridClasses = (count) => {
    if (count <= 3) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center"
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] selection:bg-purple-200">

      <div className="relative overflow-hidden bg-[#0a0a0c]">

        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"></div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-40">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-gray-300 text-xs md:text-sm font-medium tracking-wider uppercase">Next Gen Tech Hub</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white">
              Redefine Your
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Digital Life
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-12 text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the pinnacle of innovation with our handpicked selection of 
              <span className="text-white font-normal"> premium gadgets</span> and lifestyle tech.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                to="/store"
                className="group relative bg-white text-black px-12 py-5 rounded-2xl text-lg font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center overflow-hidden"
              >
                <span className="relative z-10">Start Exploring</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>

              <button className="text-gray-300 border border-white/20 px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-white/5 hover:text-white transition-all duration-300 backdrop-blur-sm">
                View Seasonal Deals
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <ShoppingBag />, title: "Elite Curation", desc: "Top-tier brands vetted for quality.", color: "from-blue-500" },
              { icon: <Zap />, title: "Flash Delivery", desc: "Priority shipping on all orders.", color: "from-orange-500" },
              { icon: <Award />, title: "Secure Warranty", desc: "2-year protection on every device.", color: "from-purple-500" }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.07] transition-all duration-500">
                <div className={`bg-gradient-to-br ${feature.color} to-transparent w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <div className="text-white w-6 h-6">{feature.icon}</div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-white py-24 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold tracking-widest text-xs uppercase">
                <div className="h-px w-8 bg-indigo-600"></div> Browse Universe
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
            </div>
            <p className="text-gray-500 max-w-md italic">Finding the perfect tech shouldn't be hard. We've organized everything for your convenience.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categoryKeys.map((category) => (
              <Link to={`/store?category=${category}`} key={category} className="group">
                <div className="relative bg-gray-50 rounded-[2.5rem] p-10 text-center transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-transparent group-hover:border-indigo-100 overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100"></div>
                  <div className="text-7xl mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    {categoryIcons[category.charAt(0).toUpperCase() + category.slice(1)]}
                  </div>
                  <h3 className="font-black text-lg text-gray-800 uppercase tracking-wider relative z-10">
                    {category}
                  </h3>
                  <div className="flex items-center justify-center mt-4 text-indigo-500 font-bold text-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    VIEW ALL <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-[#f8f9ff] py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold mb-4 uppercase tracking-tighter shadow-sm">Hot Picks</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Featured Products</h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>

          <div className={getGridClasses(products.slice(0, 4).length)}>
            {loading && Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />)}

            {!loading &&
              !error &&
              products.slice(0, 4).map((product) => (
                <div key={product._id} className="w-full">
                  <ProductCard products={product} />
                </div>
              ))}

            {error && (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm">
                <div className="text-5xl mb-4">🔧</div>
                <p className="text-gray-800 text-xl font-bold">Something went wrong</p>
                <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 font-semibold underline underline-offset-4">Try Refreshing</button>
              </div>
            )}
          </div>
        </div>
      </div>


      {categoryKeys.map((category, index) => (
        <div
          key={category}
          className={`py-28 ${index % 2 === 0 ? "bg-white" : "bg-[#fafbff]"}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16">
              <div className="text-left mb-8 md:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl grayscale group-hover:grayscale-0">
                    {categoryIcons[category.charAt(0).toUpperCase() + category.slice(1)]}
                  </span>
                  <div className="h-px w-12 bg-gray-200"></div>
                  <span className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em]">New Arrivals</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 capitalize">
                  {category}
                </h2>
              </div>
              
              {!loading && !error && allCategories[category]?.length > 4 && (
                <Link
                  to={`/store?category=${category}`}
                  className="flex items-center gap-2 font-bold text-gray-900 group border-b-2 border-transparent hover:border-black pb-1 transition-all"
                >
                  Explore the collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            <div className={getGridClasses((allCategories[category] || []).slice(0, 4).length)}>
              {loading && Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />)}

              {!loading &&
                !error &&
                (allCategories[category] || []).slice(0, 4).map((product) => (
                  <div key={product._id} className="w-full">
                    <ProductCard products={product} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
      

      <div className="h-20 bg-white"></div>
    </div>
  )
}

export default Home