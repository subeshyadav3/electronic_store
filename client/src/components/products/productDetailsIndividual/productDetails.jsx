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
  const [addcomment, setAddComment] = useState({ comment: "", user: user?.name || "" });

  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await getProductById(id);
      setProduct(foundProduct);
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) return <LoadingComponent />;

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  const handleCommentAdd = () => {
    if (!isAuthenticated) return alert("Please login to add a comment");
    addComment(product._id, addcomment.comment, addcomment.user);
    setAddComment({ comment: "", user: user?.name || "" }); // Clear input after adding
  };

  const handleReplyClick = (commentId) => {
    setReplyVisibility((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  return (
    <div className="px-4 relative">
      <Breadcrumb className="absolute" />
      <div className="px-2 grid grid-cols-1 md:grid-cols-2 border-slate-200 bg-white mb-5">
        <div className="flex flex-col items-center justify-center">
          <ImageGallery images={product.images} />
          <div className="w-full flex justify-center items-center flex-col mb-5">
            <h2 className="text-xl font-semibold mb-3">Product Details</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Weight: {product.weight} kg</li>
              <li>
                Dimensions: {product.dimensions.width}" x {product.dimensions.height}" x {product.dimensions.depth}"
              </li>
              <li>Warranty: {product.warrantyInformation}</li>
              <li>Return Policy: {product.returnPolicy}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 min-w-[200px] max-w-[500px] w-full">
          <h1 className="md:text-2xl text-xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-gray-400 line-through">${product.price}</p>
            <p className="font-bold text-green-600">${discountedPrice}</p>
            <span className="bg-green-100 text-green-800 font-semibold px-2.5 py-0.5 rounded">
              {product.discountPercentage}% OFF
            </span>
          </div>
          <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
          <p className="text-gray-600 mb-2">SKU: {product.sku}</p>
          <p className="text-gray-600 mb-2">Availability: {product.availabilityStatus}</p>
          <p className="text-gray-600 mb-4">Ships in: {product.shippingInformation}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>

      <div className="mt-[80px] w-full md:max-w-[70%] border-none sm:ml-10 p-2 bg-white">
        <h2 className="text-xl font-semibold mb-4">Customer Rating & Reviews</h2>
        <ReviewList reviews={product.reviews} />
      </div>

      <div className="my-12 sm:max-w-[400px] sm:ml-10 bg-white p-2 w-full md:max-w-[70%]">
        <p className="text-2xl font-semibold mb-4">Comments</p>
        {product.comments.map((comment) => (
          <div key={comment._id} className="border-b-2 border-slate-200 py-2">
            <h3 className="font-semibold">{comment.user}</h3>
            <p>{comment.comment}</p>
            <button className="text-blue-500" onClick={() => handleReplyClick(comment._id)}>
              Reply
            </button>
            {replyVisibility[comment._id] && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Reply to comment"
                  className="border p-1 rounded"
                  value={addcomment.comment}
                  onChange={(e) => setAddComment((prev) => ({ ...prev, comment: e.target.value }))}
                />
                <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded" onClick={handleCommentAdd}>
                  Submit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;