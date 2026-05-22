import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { HiSearch, HiPencilAlt, HiTrash } from "react-icons/hi";
import ManageUserSkeleton from "../../components/skeleton/manage-user-skeleton";

function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [timer, setTimer] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { getAdminAllUsers } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAdminAllUsers();

      const delay = 100;
      setTimeout(() => {
        setAdminUsers(users);
        setIsLoading(false);
      }, delay);
    };
    fetchUsers();
  }, []);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        setDebouncedSearchTerm(e.target.value);
      }, 1000)
    );
  };

  const handleProductEdit = (id) => {
    navigate(`/dashboard/admin/users/${id}`);
  };

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "manager":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section split adjustments */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Users</h1>
        <p className="text-sm text-gray-500 mt-0.5">Control registered accounts, evaluate assignments, and audit access credentials.</p>
      </div>

      {/* Input Search Container layout */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <HiSearch className="text-lg" />
        </span>
        <input
          type="text"
          name="username"
          placeholder="Search users by name..."
          onChange={handleSearchTerm}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Desktop View Table Area */}
      <div className="overflow-x-auto hidden md:block border border-gray-100 rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold">
              <th className="px-6 py-3.5">Avatar</th>
              <th className="px-6 py-3.5">Username</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Role</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {isLoading && Array.from({ length: 5 }).map((_, idx) => <ManageUserSkeleton key={idx} />)}

            {!isLoading && adminUsers
              .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={user.avatar || "/admin/default_avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-gray-50 shrink-0"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full border ${getRoleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleProductEdit(user._id)}
                        title="Edit User"
                      >
                        <HiPencilAlt className="text-lg" />
                      </button>
                      <button
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        onClick={() => {
                          setAdminUsers(adminUsers.filter((u) => u._id !== user._id));
                        }}
                        title="Delete User"
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

      {/* Mobile Stack Cards View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {!isLoading && adminUsers
          .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((user) => (
            <div
              key={user._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={user.avatar || "/admin/default_avatar.png"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 bg-gray-50 shrink-0"
                />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-bold text-gray-900 truncate">{user.name}</h2>
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${getRoleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-50 gap-2">
                <button
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                  onClick={() => handleProductEdit(user._id)}
                >
                  <HiPencilAlt />
                  <span>Edit</span>
                </button>
                <button
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all"
                  onClick={() => {
                    setAdminUsers(adminUsers.filter((u) => u._id !== user._id));
                  }}
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

export default ManageUsers;