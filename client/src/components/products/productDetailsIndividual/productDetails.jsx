import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import AddToCartButton from "./AddToCartButton";
import ReviewList from "./ReviewList";
import { useProducts } from "../../../context/productContext";
import Breadcrumb from "../../helper/breadcrumbs";
import LoadingComponent from "../../helper/loadingComponent";
import { useAuth } from "../../../context/authContext";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { getProductById, loading, addComment } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const [replyVisibility, setReplyVisibility] = useState({});
  const [inputComment, setInputComment] = useState({ comment: "", user: user?.name || "Guest", reply: false, parentId: null });

  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await getProductById(id);
      setProduct(foundProduct || {});
      console.log("Product details:", foundProduct);
    };

    fetchProduct();
  }, [id, addComment]);

  if (loading || !product) return <LoadingComponent />;

  const discountedPrice = ((product.price || 0) * (1 - (product.discountPercentage || product.discount || 0) / 100)).toFixed(2);

  const handleCommentAdd = () => {
    if (!isAuthenticated) return alert("Please login to add a comment");


    addComment(product._id, inputComment.comment, inputComment.user, inputComment.reply, inputComment.parentId);


    setInputComment({ comment: "", user: user?.name || "Guest", reply: false, parentId: null });
    setReplyVisibility({});
  };

  const handleReplyClick = (commentId) => {
    setReplyVisibility((prevState) => ({
      [commentId]: !prevState[commentId],
    }));


    setInputComment((prev) => ({ ...prev, reply: true, parentId: commentId }));
  };

  return (
    <div className="px-4 relative">
      <Breadcrumb className="absolute" />
      <div className="px-2 grid grid-cols-1 md:grid-cols-2 border-slate-200 bg-white mb-5">

        <div className="flex flex-col items-center justify-center">
          <ImageGallery images={!product.images ? product.images : [`${product.thumbnail}`]} />
        </div>
        <div className="mt-10 min-w-[200px] max-w-[500px] w-full">
          <h1 className="md:text-2xl text-xl font-bold mb-4">{product.title ?? "Product Title"}</h1>
          <p className="text-gray-600 mb-4">{product.description ?? "No description available"}</p>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-gray-400 line-through">${product.price ?? "0.00"}</p>
            <p className="font-bold text-green-600">${discountedPrice}</p>
          </div>
          <AddToCartButton productId={product._id ?? ""} />
        </div>
      </div>

      <div className="mt-[80px] w-full md:max-w-[70%] border-none sm:ml-10 p-2 bg-white">
        <h2 className="text-xl font-semibold mb-4">Customer Rating & Reviews</h2>
        <ReviewList reviews={product?.reviews || []} />
      </div>

      <div className="my-12 sm:max-w-[400px] sm:ml-10 bg-white p-2 w-full md:max-w-[70%]">
        <p className="text-2xl font-semibold mb-4">Comments</p>


        <div className="mb-6">
          <input
            type="text"
            placeholder="Add a comment"
            className="border p-2 rounded w-full"
            value={inputComment.comment}
            onChange={(e) => setInputComment((prev) => ({ ...prev, comment: e.target.value }))}
          />
          <button
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
            onClick={handleCommentAdd}
          >
            Add Comment
          </button>
        </div>

        {(product.comments || []).map((comment) => (
          <div key={comment._id} className="border-b-2 border-slate-200 py-2">
            <h3 className="font-semibold">{comment.user ?? "Anonymous"}</h3>
            <p>{comment.comment ?? "No comment available"}</p>

            <button
              className="text-blue-500 text-sm mt-1"
              onClick={() => handleReplyClick(comment._id)}
            >
              Reply
            </button>


            {replyVisibility[comment._id] && (
              <div className="mt-2 ml-4">
                <input
                  type="text"
                  placeholder="Reply to comment"
                  className="border p-1 rounded w-full"
                  value={inputComment.comment}
                  onChange={(e) => setInputComment((prev) => ({ ...prev, comment: e.target.value }))}
                />
                <button
                  className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={handleCommentAdd}
                >
                  Submit Reply
                </button>
              </div>
            )}


            {comment.reply?.length > 0 && (
              <div className="ml-4 mt-2">
                {comment.reply.map((rep, index) => (
                  <div key={index} className="border-l-2 border-gray-300 pl-2 mt-1">
                    <h4 className="text-sm font-semibold">{rep.user ?? "Anonymous"}</h4>
                    <p className="text-sm">{rep.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
