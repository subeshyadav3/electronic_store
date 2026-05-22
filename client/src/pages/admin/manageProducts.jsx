import { useEffect, useState } from "react";
import { useProducts } from "../../context/productContext";
import { useNavigate } from "react-router-dom";
import { HiPlus, HiSearch, HiPencilAlt, HiTrash } from "react-icons/hi";
import ManageProductsSkeleton from "../../components/skeleton/manage-product-skeleton";

function ManageProducts() {
  const { getAdminAllProducts, error, adminProducts, setFilter, adminProductDelete, adminProductUpdate, getProductById } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminAllProducts();
    const delay = 100;
    const t = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => clearTimeout(t);
  }, [adminProducts]);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        setDebouncedSearchTerm(e.target.value);
        if (e.target.value) {
          setFilter({ Target: { name: 'title', value: e.target.value } });
        }
      }, 500)
    );
  };

  const handleCreateProduct = () => {
    navigate('/dashboard/admin/products/create');
  };

  if (loading) return <ManageProductsSkeleton />;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-semibold">Error: {error}</div>;

  const handleProductEdit = (id) => {
    navigate(`/dashboard/admin/products/${id}`);
    console.log(id);
  };

  const filteredProducts = adminProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header section split adjustments */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create, look up, revise, and purge items within inventory catalogs.</p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 shadow-blue-100 transition-all self-start sm:self-auto shrink-0"
          onClick={handleCreateProduct}
        >
          <HiPlus className="text-lg" />
          <span>Create Product</span>
        </button>
      </div>

      {/* Input Search Container layout */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <HiSearch className="text-lg" />
        </span>
        <input
          type="text"
          name="title"
          value={searchTerm}
          placeholder="Search items by keyword..."
          onChange={handleSearchTerm}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Desktop Responsive Grid View Table Area */}
      <div className="overflow-x-auto hidden md:block border border-gray-100 rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold">
              <th className="px-6 py-3.5">Image</th>
              <th className="px-6 py-3.5">Title</th>
              <th className="px-6 py-3.5">Price</th>
              <th className="px-6 py-3.5">Stock</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50/40 transition-colors">
                <td className="px-6 py-4">
                  <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{product.title}</td>
                <td className="px-6 py-4 font-semibold">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-bold ${product.stock > 10 ? 'bg-gray-100 text-gray-700' : 'bg-rose-50 text-rose-700'}`}>
                    {product.stock} items
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      onClick={() => handleProductEdit(product._id)}
                      title="Edit Product"
                    >
                      <HiPencilAlt className="text-lg" />
                    </button>
                    <button 
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                      onClick={() => product?._id ? adminProductDelete(product._id) : console.error("Product ID is missing")}
                      title="Delete Product"
                    >
                      <HiTrash className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Grid Stack cards View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <img
                src={product.thumbnail || "/placeholder.svg"}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{product.title}</h2>
                <p className="text-sm font-bold text-blue-600">${product.price.toFixed(2)}</p>
                <p className="text-xs font-semibold text-gray-400">Stock count: <span className="text-gray-700 font-bold">{product.stock}</span></p>
              </div>
            </div>
            
            <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-50 gap-2">
              <button
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                onClick={() => handleProductEdit(product._id)}
              >
                <HiPencilAlt />
                <span>Edit</span>
              </button>
              <button
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all"
                onClick={() => product?._id ? adminProductDelete(product._id) : console.error("Product ID is missing")}
              >
                <HiTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProducts;