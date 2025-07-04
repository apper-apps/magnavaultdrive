import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import platformSettingService from '@/services/api/platformSettingService'

const PlatformSettings = () => {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    Name: '',
    value: '',
    description: '',
    setting_type: 'storage'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await platformSettingService.getAll()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.Name || !formData.value) {
      toast.error('Name and value are required')
      return
    }

    try {
      if (editingId) {
        await platformSettingService.update(editingId, formData)
      } else {
        await platformSettingService.create(formData)
      }
      
      setFormData({ Name: '', value: '', description: '', setting_type: 'storage' })
      setEditingId(null)
      loadSettings()
    } catch (error) {
      console.error('Error saving setting:', error)
    }
  }

  const handleEdit = (setting) => {
    setFormData({
      Name: setting.Name,
      value: setting.value,
      description: setting.description || '',
      setting_type: setting.setting_type
    })
    setEditingId(setting.Id)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this setting?')) {
      await platformSettingService.delete(id)
      loadSettings()
    }
  }

  const settingTypes = [
    { value: 'storage', label: 'Storage' },
    { value: 'security', label: 'Security' },
    { value: 'email', label: 'Email' },
    { value: 'general', label: 'General' }
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
          <p className="text-gray-600">Manage Wasabi storage keys and platform configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Setting' : 'Add New Setting'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Setting Name"
              placeholder="e.g., wasabi_access_key"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setting Type
              </label>
              <select
                value={formData.setting_type}
                onChange={(e) => setFormData({ ...formData, setting_type: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {settingTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Value"
              placeholder="Setting value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                {editingId ? 'Update Setting' : 'Create Setting'}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ Name: '', value: '', description: '', setting_type: 'storage' })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Settings List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Settings</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {settings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No settings configured yet</p>
            ) : (
              settings.map((setting) => (
                <div key={setting.Id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{setting.Name}</h4>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {setting.setting_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 break-all">
                        {setting.value.length > 50 
                          ? `${setting.value.substring(0, 50)}...` 
                          : setting.value
                        }
                      </p>
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => handleEdit(setting)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDelete(setting.Id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Common Settings Quick Setup */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Wasabi Storage Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'wasabi_access_key', label: 'Access Key', type: 'storage' },
            { name: 'wasabi_secret_key', label: 'Secret Key', type: 'storage' },
            { name: 'wasabi_bucket_name', label: 'Bucket Name', type: 'storage' },
            { name: 'wasabi_region', label: 'Region', type: 'storage' }
          ].map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => setFormData({
                ...formData,
                Name: preset.name,
                setting_type: preset.type
              })}
              className="text-left justify-start"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {preset.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default PlatformSettings