import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import LoadingComponent from '../../components/helper/loadingComponent'
import { useToast } from '../../context/toastContext'

function ManageUserIndividual() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const { showToast } = useToast()

  const { getAdminUsersById, adminUserUpdate } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getAdminUsersById(id)
        setUser(response.users)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await adminUserUpdate(id, user)
      showToast("User Updated Successfully!", 'success')
    } catch (error) {
      showToast("Some Error Occured While Updating!", 'error')
    }
  }

  if (loading) return <LoadingComponent />
  if (!user) return <div>User not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Manage User: {user.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className='font-semibold text-gray-800 mb-2'>Basic Account Details</h2>
          <div className='mb-5 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 space-y-1 shadow-sm'>
            <p><span className="font-medium text-gray-700">Created at:</span> {user.createdAt ? user.createdAt.slice(0, 10) : 'N/A'}</p>
            <p><span className="font-medium text-gray-700">Updated at:</span> {user.updatedAt ? user.updatedAt.slice(0, 10) : 'N/A'}</p>
          </div>

          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            disabled
            value={user.email || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed rounded-md shadow-sm outline-none"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={user.contact || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Self Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={user.bio || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            name="role"
            value={user.role || 'user'}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isVerified"
            name="isVerified"
            checked={!!user.isVerified}
            onChange={(e) => setUser(prevUser => ({ ...prevUser, isVerified: e.target.checked }))}
            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
          />
          <label htmlFor="isVerified" className="text-sm font-medium text-gray-700 cursor-pointer">Verified Account Status</label>
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors duration-150 outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default ManageUserIndividual