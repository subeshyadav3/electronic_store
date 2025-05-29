import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import LoadingComponent from '../../components/helper/loadingComponent'
import { useToast } from '../../context/toastContext'

function ManageUserIndividual() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const {showToast}=useToast();

  const { getAdminUsersById,adminUserUpdate } = useAuth()
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
            <label htmlFor='account_details' className='font-semibold mb-2 '>Basic Account Details</label>
            <div className='mb-5'>
                <p>Created at: {user.createdAt.slice(0,10)}</p>
                <p>Updated at: {user.updatedAt.slice(0,10)}</p>
            </div>

          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            disabled
            value={user.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={user.contact}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Self Bio</label>
          <input
            type="tel"
            id="bio"
            name="bio"
            value={user.bio}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div>
          <label htmlFor="isVerified" className="block text-sm font-medium text-gray-700">Verified</label>
          <input
            type="checkbox"
            id="isVerified"
            name="isVerified"
            checked={user.isVerified}
            onChange={(e) => setUser(prevUser => ({ ...prevUser, isVerified: e.target.checked }))}
            className="mt-1 block h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default ManageUserIndividual
