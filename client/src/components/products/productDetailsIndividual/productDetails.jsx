



import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ImageGallery from "./ImageGallery"
import AddToCartButton from "./AddToCartButton"
import ReviewList from "./ReviewList"

import { useProducts } from '../../../context/productContext';
import Breadcrumb from "../../helper/breadcrumbs"
import LoadingComponent from "../../helper/loadingComponent"
import { useAuth } from "../../../context/authContext"

const ProductDetails = () => {
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const { getProductById, loading ,addComment} = useProducts()
  const { user ,isAuthenticated } = useAuth()
  const [replyVisibility, setReplyVisibility] = useState({})
  const [addcomment, setAddComment] = useState({
    comment: "",
    user: user.name,
  })

  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await getProductById(id)
      setProduct(foundProduct)
    }

    fetchProduct()
  }, [id])

  if (!product) {
    return <LoadingComponent />
  }

  if(loading) <LoadingComponent />


  
  const handleCommentAdd = () => { 
    console.log(isAuthenticated)
    if(!isAuthenticated) return alert("Please login to add comment") 

    console.log(addcomment)
    addComment(product._id,addcomment.comment,addcomment.user)
  }
  const handleReplyClick = (commentId) => {
    setReplyVisibility((prevState) => ({...prevState,[commentId]:!prevState[commentId]}))
   }
 
  return (
    <div className="px-4 relative">
   
      <div className="mt-[80px] w-full md:max-w-[70%] border-none sm:ml-10 p-2 bg-white ">
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer Rating & Reviews</h2>
          <ReviewList reviews={product.reviews} />
        </div>
      </div>

    
      <div className="my-12 sm:max-w-[400px] sm:ml-10 bg-white p-2 w-full md:max-w-[70%] ">
        <p className="text-2xl font-semibold mb-4">Comments</p>
        {product.comments.map((comment) => (
          <div key={comment.user} className="border-b-2 border-slate-200 py-2">
            <h3 className="font-semibold">{comment.user}</h3>
            <p>{comment.comment}</p>
            <button className="text-blue-500" onClick={() => handleReplyClick(comment.user)}>
              Reply
            </button>
            {replyVisibility[comment.user] && (
              <div>
                <input type="text" placeholder="Reply to comment" value={comment.addcomment} onChange={(e) => setAddComment((prev) => ({ ...prev, comment: e.target.value }))}/>
                <button onClick={handleCommentAdd}>Submit</button>
              </div>

            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductDetails

