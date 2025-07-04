import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'

const UserStorage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Professional',
      storageUsed: 45.2,
      storageTotal: 100,
      filesCount: 1284,
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      plan: 'Basic',
      storageUsed: 8.7,
      storageTotal: 10,
      filesCount: 456,
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      plan: 'Enterprise',
      storageUsed: 342.1,
      storageTotal: 1000,
      filesCount: 5678,
      lastActive: '5 minutes ago'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [storageQuota, setStorageQuota] = useState('')

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStoragePercentage = (used, total) => {
    return (used / total) * 100
  }

  const getStorageStatus = (percentage) => {
    if (percentage >= 90) return 'critical'
    if (percentage >= 75) return 'warning'
    return 'normal'
  }

  const handleUpdateQuota = () => {
    if (!selectedUser || !storageQuota) {
      toast.error('Please select a user and enter a quota amount')
      return
    }

    setUsers(users.map(user =>
      user.id === selectedUser.id
        ? { ...user, storageTotal: parseFloat(storageQuota) }
        : user
    ))

    toast.success(`Storage quota updated for ${selectedUser.name}`)
    setSelectedUser(null)
    setStorageQuota('')
  }

  const handleResetStorage = (userId) => {
    if (confirm('Are you sure you want to reset this user\'s storage usage? This action cannot be undone.')) {
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, storageUsed: 0, filesCount: 0 }
          : user
      ))
      toast.success('User storage has been reset')
    }
  }

  const formatStorage = (gb) => {
    if (gb >= 1000) {
      return `${(gb / 1000).toFixed(1)} TB`
    }
    return `${gb} GB`
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Storage Management</h2>
          <p className="text-gray-600">Monitor and manage user storage allocations</p>
        </div>
      </div>

      {/* Search and Quick Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users by name or email..."
            icon="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon="Download">
            Export Report
          </Button>
          <Button variant="outline" icon="RefreshCw">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Storage Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="HardDrive" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Storage Used</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatStorage(users.reduce((sum, user) => sum + user.storageUsed, 0))}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Users Near Limit</p>
              <p className="text-xl font-semibold text-gray-900">
                {users.filter(u => getStoragePercentage(u.storageUsed, u.storageTotal) >= 75).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Critical Users</p>
              <p className="text-xl font-semibold text-gray-900">
                {users.filter(u => getStoragePercentage(u.storageUsed, u.storageTotal) >= 90).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Storage Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const percentage = getStoragePercentage(user.storageUsed, user.storageTotal)
                const status = getStorageStatus(percentage)
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{formatStorage(user.storageUsed)}</span>
                          <span className="text-gray-500">/ {formatStorage(user.storageTotal)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'critical' ? 'bg-red-500' :
                              status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% used</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.filesCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => {
                            setSelectedUser(user)
                            setStorageQuota(user.storageTotal.toString())
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="RotateCcw"
                          onClick={() => handleResetStorage(user.id)}
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Update Quota Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Storage Quota
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Updating quota for: <strong>{selectedUser.name}</strong>
              </p>
              <Input
                label="Storage Quota (GB)"
                type="number"
                placeholder="Enter storage quota in GB"
                value={storageQuota}
                onChange={(e) => setStorageQuota(e.target.value)}
              />
              <div className="flex gap-2 mt-6">
                <Button variant="primary" onClick={handleUpdateQuota}>
                  Update Quota
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSelectedUser(null)
                    setStorageQuota('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default UserStorage