import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine } from "react-icons/fa"

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Users" value="1,234" icon={<FaUsers className="text-blue-500" />} />
        <DashboardCard title="Total Orders" value="567" icon={<FaShoppingCart className="text-green-500" />} />
        <DashboardCard title="Total Revenue" value="$89,012" icon={<FaMoneyBillWave className="text-yellow-500" />} />
        <DashboardCard title="Growth" value="+12.5%" icon={<FaChartLine className="text-red-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  )
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function RecentOrders() {
  const orders = [
    { id: 1, customer: "John Doe", total: "$120.00", status: "Completed" },
    { id: 2, customer: "Jane Smith", total: "$85.50", status: "Processing" },
    { id: 3, customer: "Bob Johnson", total: "$200.00", status: "Shipped" },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md ">
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Order ID</th>
            <th className="text-left py-2">Customer</th>
            <th className="text-left py-2">Total</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="py-2">{order.id}</td>
              <td className="py-2">{order.customer}</td>
              <td className="py-2">{order.total}</td>
              <td className="py-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TopProducts() {
  const products = [
    { id: 1, name: "Product A", sales: 120 },
    { id: 2, name: "Product B", sales: 98 },
    { id: 3, name: "Product C", sales: 75 },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Top Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="flex justify-between items-center mb-2">
            <span>{product.name}</span>
            <span className="font-semibold">{product.sales} sales</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDashboard

