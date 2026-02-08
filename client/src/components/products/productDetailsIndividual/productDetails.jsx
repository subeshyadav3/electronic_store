"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ImageGallery from "./ImageGallery"
import AddToCartButton from "./AddToCartButton"
import ReviewList from "./ReviewList"
import { useProducts } from "../../../context/productContext"
import Breadcrumb from "../../helper/breadcrumbs"
import LoadingComponent from "../../helper/loadingComponent"
import { useAuth } from "../../../context/authContext"
import { Star, MessageCircle, Reply, User, Truck, Shield, Heart, ShoppingBag, CheckCircle, Info } from "lucide-react"

const ProductDetails = () => {
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const { getProductById, loading, addComment } = useProducts()
  const { user, isAuthenticated } = useAuth()
  const [replyVisibility, setReplyVisibility] = useState({})
  const [inputComment, setInputComment] = useState({
    comment: "",
    user: user?.name || "Guest",
    reply: false,
    parentId: null,
  })

  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await getProductById(id)
      setProduct(foundProduct || {})
    }
    fetchProduct()
  }, [id, addComment])

  if (loading || !product) return <LoadingComponent />

  const discountPercentage = product.discountPercentage || product.discount || 0
  const discountedPrice = (
    (product.price || 0) * (1 - discountPercentage / 100)
  ).toFixed(2)

  const handleCommentAdd = () => {
    if (!isAuthenticated) return alert("Please login to add a comment")
    addComment(product._id, inputComment.comment, inputComment.user, inputComment.reply, inputComment.parentId)
    setInputComment({ comment: "", user: user?.name || "Guest", reply: false, parentId: null })
    setReplyVisibility({})
  }

  const handleReplyClick = (commentId) => {
    setReplyVisibility((prevState) => ({ [commentId]: !prevState[commentId] }))
    setInputComment((prev) => ({ ...prev, reply: true, parentId: commentId }))
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <Breadcrumb />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
         
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="relative group">
                <ImageGallery images={product.images ? product.images : [`${product.thumbnail}`]} />
                <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-md">
                  {product.category || "New Arrival"}
                </span>
                {discountPercentage > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-md">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {product.title ?? "Product Title"}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "text-amber-400 fill-current" : "text-gray-200"}`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-amber-700 text-sm">{product.rating || 0}</span>
                </div>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm font-medium hover:underline cursor-pointer">
                  {product.reviews?.length || 0} customer reviews
                </span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-gray-100 pl-4">
                {product.description ?? "No description available"}
              </p>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-gray-900">${discountedPrice}</span>
                  {discountPercentage > 0 && (
                    <span className="text-xl text-gray-400 line-through pb-1">${product.price}</span>
                  )}
                </div>

                <div className="flex flex-col gap-3 mb-8">
                   <div className="flex items-center gap-3 text-sm text-emerald-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>{product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"}</span>
                   </div>
                   <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Truck className="w-4 h-4" /> Fast Delivery</div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Shield className="w-4 h-4" /> Secure Checkout</div>
                   </div>
                </div>

                <div className="transform transition-transform active:scale-[0.98]">
                  <AddToCartButton productId={product._id ?? ""} className="w-full py-4 rounded-xl shadow-lg shadow-blue-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white border border-gray-100 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-bold">Technical Specifications</h3>
            </div>
            <dl className="grid grid-cols-1 gap-y-4">
              {[
                { label: "Brand", value: product.brand },
                { label: "Category", value: product.category },
                { label: "SKU", value: product.sku },
                { label: "Weight", value: product.weight }
              ].map((spec) => (
                <div key={spec.label} className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-500">{spec.label}</dt>
                  <dd className="font-semibold text-gray-900">{spec.value || "N/A"}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-indigo-600 text-white rounded-2xl p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Why shop with us?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <p className="font-medium">Free express shipping on orders over $50</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <p className="font-medium">Extended 12-month manufacturer warranty</p>
              </div>
            </div>
          </div>
        </div>

   
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-16">
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:sticky lg:top-24">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold flex items-center gap-3">
                   Reviews <span className="text-sm font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{product.reviews?.length || 0}</span>
                 </h2>
               </div>
               <ReviewList reviews={product?.reviews || []} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Discussion</h2>
            </div>


            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-10 transition-all focus-within:ring-2 focus-within:ring-blue-100">
              <textarea
                placeholder="What's your take on this product?"
                className="w-full p-4 border-none focus:ring-0 rounded-xl resize-none h-28 text-gray-700"
                value={inputComment.comment}
                onChange={(e) => setInputComment((prev) => ({ ...prev, comment: e.target.value }))}
              />
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {isAuthenticated ? `Posting as ${user?.name}` : "Log in to join the conversation"}
                  </span>
                </div>
                <button
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all disabled:opacity-30"
                  onClick={handleCommentAdd}
                  disabled={!inputComment.comment.trim() || !isAuthenticated}
                >
                  Post Comment
                </button>
              </div>
            </div>

     
            <div className="space-y-6">
              {(product.comments || []).map((comment) => (
                <div key={comment._id} className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-600 font-bold shadow-sm">
                      {(comment.user ?? "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 transition-all group-hover:border-blue-100 group-hover:shadow-md group-hover:shadow-blue-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{comment.user ?? "Anonymous"}</h3>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-xs text-gray-400 italic">verified user</span>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{comment.comment}</p>
                      
                      <button
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors"
                        onClick={() => handleReplyClick(comment._id)}
                      >
                        <Reply className="w-3 h-3" /> Reply
                      </button>

               
                      {replyVisibility[comment._id] && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                           <textarea
                              placeholder="Write a reply..."
                              className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white transition-all outline-none h-24"
                              value={inputComment.comment}
                              onChange={(e) => setInputComment((prev) => ({ ...prev, comment: e.target.value }))}
                            />
                            <div className="flex justify-end gap-3 mt-3">
                               <button className="text-sm font-bold text-gray-400" onClick={() => setReplyVisibility({})}>Cancel</button>
                               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-100" onClick={handleCommentAdd}>Send Reply</button>
                            </div>
                        </div>
                      )}

           
                      {comment.reply?.length > 0 && (
                        <div className="mt-6 space-y-4 pl-4 border-l-2 border-gray-50">
                          {comment.reply.map((rep, index) => (
                            <div key={index} className="flex items-start gap-3 bg-gray-50/50 p-4 rounded-xl">
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black uppercase">
                                {(rep.user ?? "A").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-xs">{rep.user ?? "Anonymous"}</h4>
                                <p className="text-gray-600 text-sm mt-1 leading-snug">{rep.comment}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!product.comments || product.comments.length === 0) && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <MessageCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold">No discussions yet</h3>
                <p className="text-gray-500 text-sm">Be the first to ask a question or leave a thought.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails