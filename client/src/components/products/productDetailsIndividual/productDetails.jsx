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
import { Star, MessageCircle, Reply, User, Truck, Shield, Heart } from "lucide-react"

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
      console.log("Product details:", foundProduct)
    }

    fetchProduct()
  }, [id, addComment])

  if (loading || !product) return <LoadingComponent />

  const discountedPrice = (
    (product.price || 0) *
    (1 - (product.discountPercentage || product.discount || 0) / 100)
  ).toFixed(2)

  const handleCommentAdd = () => {
    if (!isAuthenticated) return alert("Please login to add a comment")

    addComment(product._id, inputComment.comment, inputComment.user, inputComment.reply, inputComment.parentId)

    setInputComment({ comment: "", user: user?.name || "Guest", reply: false, parentId: null })
    setReplyVisibility({})
  }

  const handleReplyClick = (commentId) => {
    setReplyVisibility((prevState) => ({
      [commentId]: !prevState[commentId],
    }))

    setInputComment((prev) => ({ ...prev, reply: true, parentId: commentId }))
  }

  const discountPercentage = product.discountPercentage || product.discount || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200 via-purple-100 to-purple-400rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <ImageGallery images={product.images ? product.images : [`${product.thumbnail}`]} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {product.category || "Product"}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title ?? "Product Title"}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description ?? "No description available"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.rating || 0})</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{product.reviews?.length || 0} reviews</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  {discountPercentage > 0 && (
                    <span className="text-2xl text-gray-400 line-through">${product.price ?? "0.00"}</span>
                  )}
                  <span className="text-4xl font-bold text-green-600">${discountedPrice}</span>
                  {discountPercentage > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      Save ${((product.price || 0) - discountedPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Wishlist</span>
                  </div>
                </div>

                <AddToCartButton productId={product._id ?? ""} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="font-semibold text-blue-800">Stock:</span>
                  <span className="text-blue-600 ml-2">{product.stock || "In Stock"}</span>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <span className="font-semibold text-purple-800">Brand:</span>
                  <span className="text-purple-600 ml-2">{product.brand || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 flex sm:flex-row flex-col gap-2 mb-5 ">
            <div className="bg-white rounded-2xl shadow-lg flex-1  p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 flex-1 h-full to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">1-year warranty included</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              </div>
              <ReviewList reviews={product?.reviews || []} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <textarea
                    placeholder="Share your thoughts about this product..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 bg-white"
                    value={inputComment.comment}
                    onChange={(e) => setInputComment((prev) => ({ ...prev, comment: e.target.value }))}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {isAuthenticated ? `Commenting as ${user?.name}` : "Please login to comment"}
                    </span>
                    <button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCommentAdd}
                      disabled={!inputComment.comment.trim() || !isAuthenticated}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(product.comments || []).map((comment) => (
                  <div key={comment._id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(comment.user ?? "A").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{comment.user ?? "Anonymous"}</h3>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">Just now</span>
                        </div>
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          {comment.comment ?? "No comment available"}
                        </p>
                        <button
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                          onClick={() => handleReplyClick(comment._id)}
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>

                        {replyVisibility[comment._id] && (
                          <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                            <div className="space-y-3">
                              <textarea
                                placeholder="Write a reply..."
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                                value={inputComment.comment}
                                onChange={(e) => setInputComment((prev) => ({ ...prev, comment: e.target.value }))}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                                  onClick={() => setReplyVisibility({})}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                  onClick={handleCommentAdd}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {comment.reply?.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {comment.reply.map((rep, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-blue-200">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {(rep.user ?? "A").charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-gray-900 text-sm">{rep.user ?? "Anonymous"}</h4>
                                      <span className="text-xs text-gray-500">•</span>
                                      <span className="text-xs text-gray-500">Just now</span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{rep.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!product.comments || product.comments.length === 0) && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">No comments yet</h3>
                    <p className="text-gray-400">Be the first to share your thoughts about this product!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

       
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
