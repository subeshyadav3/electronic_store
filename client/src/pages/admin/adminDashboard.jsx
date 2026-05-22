import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine } from "react-icons/fa";

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time statistics of your sales ecosystem performance metrics.</p>
      </div>

      {/* Metrics Card Grid layout system */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard title="Total Users" value="1,234" icon={<FaUsers />} colorClass="bg-blue-50 text-blue-600" />
        <DashboardCard title="Total Orders" value="567" icon={<FaShoppingCart />} colorClass="bg-emerald-50 text-emerald-600" />
        <DashboardCard title="Total Revenue" value="$89,012" icon={<FaMoneyBillWave />} colorClass="bg-amber-50 text-amber-600" />
        <DashboardCard title="Growth" value="+12.5%" icon={<FaChartLine />} colorClass="bg-rose-50 text-rose-600" />
      </div>

      {/* Layout Split views */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, colorClass }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
      <div className={`p-4 rounded-xl shrink-0 text-xl md:text-2xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
}

function RecentOrders() {
  const orders = [
    { id: 1, customer: "John Doe", total: "$120.00", status: "Completed" },
    { id: 2, customer: "Jane Smith", total: "$85.50", status: "Processing" },
    { id: 3, customer: "Bob Johnson", total: "$200.00", status: "Shipped" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Processing": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Shipped": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
      </div>
      
      {/* Scrollable container for tables on small viewports */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-medium">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 px-4 font-mono text-gray-900">#{order.id}</td>
                <td className="py-3.5 px-4">{order.customer}</td>
                <td className="py-3.5 px-4 text-gray-900 font-semibold">{order.total}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopProducts() {
  const products = [
    { id: 1, name: "Product A", sales: 120 },
    { id: 2, name: "Product B", sales: 98 },
    { id: 3, name: "Product C", sales: 75 },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
      </div>
      <ul className="divide-y divide-gray-50">
        {products.map((product, idx) => (
          <li key={product.id} className="flex justify-between items-center py-3.5 hover:bg-gray-50/50 rounded-lg px-2 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center text-xs font-bold bg-gray-100 rounded-md text-gray-500">
                {idx + 1}
              </span>
              <span className="font-semibold text-gray-700">{product.name}</span>
            </div>
            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">
              {product.sales} units
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;