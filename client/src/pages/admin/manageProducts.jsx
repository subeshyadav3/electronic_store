import { useEffect, useState } from "react";
import { useProducts } from "../../context/productContext";
import LoadingComponent from "../../components/helper/loadingComponent";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";


function ManageProducts() {
  const { getAdminAllProducts, loading, error, adminProducts, setFilter ,adminProductDelete,adminProductUpdate,getProductById} = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [timer, setTimer] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    getAdminAllProducts();
  
  }, [adminProducts]);


  const handleSearchTerm=(e)=>{
    setSearchTerm(e.target.value);
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        setDebouncedSearchTerm(e.target.value);
        if(debouncedSearchTerm){
            setFilter({Target:{ name:'title' ,value:debouncedSearchTerm}});        }
      }, 500)
    );
  }


  if (loading) return <LoadingComponent />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const handleProductEdit = (id) => {
    navigate(`/dashboard/admin/products/${id}`);
    console.log(id)
  };
 

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      <div className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Search products..."
          
          onChange={handleSearchTerm}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 ">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {adminProducts
              .filter((product) =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={()=> handleProductEdit(product._id)}>Edit</button>
                    <button className="text-red-600 hover:text-red-900" onClick={()=> {
                        if (product && product._id) {
                            adminProductDelete(product._id);
                          } else {
                            console.error("Product ID is missing");
                          }
                    }} >Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageProducts;
