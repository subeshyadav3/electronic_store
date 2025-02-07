import { useState, useEffect } from "react"
import LoadingComponent from "../../components/helper/loadingComponent"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../context/authContext"

function ManageUsers() {
  // const [adminUsers, setAdminUsers] = useState([
  //   { _id: "1", username: "john_doe", email: "john@example.com", role: "admin", avatar: "/placeholder-avatar.svg" },
  //   { _id: "2", username: "jane_doe", email: "jane@example.com", role: "user", avatar: "/placeholder-avatar.svg" },
  //   { _id: "3", username: "alex_smith", email: "alex@example.com", role: "admin", avatar: "/placeholder-avatar.svg" },
  // ])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [timer, setTimer] = useState(null)
  const [adminUsers, setAdminUsers] = useState([])
  const navigate=useNavigate();

  const { getAdminAllUsers, isLoading}= useAuth()

  if(isLoading) return <LoadingComponent />


  useEffect(() => {
    
    const fetchUsers = async () => {
      const users = await getAdminAllUsers()
      setAdminUsers(users)
     
    }
    fetchUsers()

  }, [])

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value)
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        setDebouncedSearchTerm(e.target.value)
      }, 1000),
    )
  }

  const handleProductEdit = (id) => {
    navigate(`/dashboard/admin/users/${id}`);
    // console.log(id)
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="mb-4">
        <input
          type="text"
          name="username"
          placeholder="Search users..."
          onChange={handleSearchTerm}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {adminUsers
              .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={user.avatar || "/admin/default_avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={()=>handleProductEdit(user._id)}>Edit</button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        setAdminUsers(adminUsers.filter(u => u._id !== user._id))
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageUsers
