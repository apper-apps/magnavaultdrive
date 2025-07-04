import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import { selectIsAdmin } from '@/store/userSlice'
const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const isAdmin = useSelector(selectIsAdmin)
  const [settings, setSettings] = useState({
    webdavEnabled: true,
    webdavUrl: 'https://vault.example.com/webdav',
    webdavUsername: 'user@example.com',
    webdavPassword: '',
    wasabiAccessKey: '',
    wasabiSecretKey: '',
    wasabiBucket: 'my-vault-bucket',
    wasabiRegion: 'us-east-1',
    encryptionEnabled: true,
    autoSync: true,
    syncInterval: 300,
    maxFileSize: 100,
    allowedFileTypes: 'all'
  })
  
  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'webdav', label: 'WebDAV', icon: 'Globe' },
    { id: 'storage', label: 'Storage', icon: 'HardDrive' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'advanced', label: 'Advanced', icon: 'Cog' }
  ]
  
  const handleSave = (section) => {
    toast.success(`${section} settings saved`)
  }
  
  const handleTestConnection = (type) => {
    toast.info(`Testing ${type} connection...`)
    setTimeout(() => {
      toast.success(`${type} connection successful`)
    }, 2000)
  }
  
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ApperIcon name="Settings" size={20} />
          General Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Auto-sync files</label>
              <p className="text-sm text-gray-500">Automatically sync files when changes are detected</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={(e) => setSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sync interval (seconds)
            </label>
            <Input
              type="number"
              value={settings.syncInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, syncInterval: parseInt(e.target.value) }))}
              min="60"
              max="3600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum file size (MB)
            </label>
            <Input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
              min="1"
              max="1000"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button onClick={() => handleSave('General')} variant="primary">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  )
  
  const renderWebDAVSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ApperIcon name="Globe" size={20} />
            WebDAV Configuration
          </h3>
          <Badge variant={settings.webdavEnabled ? 'success' : 'default'}>
            {settings.webdavEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Enable WebDAV</label>
              <p className="text-sm text-gray-500">Allow access to files via WebDAV protocol</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.webdavEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, webdavEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {settings.webdavEnabled && (
            <>
              <Input
                label="WebDAV URL"
                value={settings.webdavUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, webdavUrl: e.target.value }))}
                placeholder="https://your-server.com/webdav"
              />
              
              <Input
                label="Username"
                value={settings.webdavUsername}
                onChange={(e) => setSettings(prev => ({ ...prev, webdavUsername: e.target.value }))}
                placeholder="your-username"
              />
              
              <Input
                label="Password"
                type="password"
                value={settings.webdavPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, webdavPassword: e.target.value }))}
                placeholder="your-password"
              />
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">WebDAV Access</p>
                    <p className="text-blue-600 mt-1">
                      Use the URL above to access your files from any WebDAV client.
                      Your files will be decrypted on-the-fly when accessed.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 flex gap-2">
          <Button onClick={() => handleSave('WebDAV')} variant="primary">
            Save Changes
          </Button>
          {settings.webdavEnabled && (
            <Button onClick={() => handleTestConnection('WebDAV')} variant="outline">
              Test Connection
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
  
const renderStorageSettings = () => {
    if (!isAdmin) {
      return (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Lock" size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Restricted</h3>
              <p className="text-gray-600 mb-4">
                Storage settings can only be configured by administrators.
              </p>
              <Badge variant="error">Admin Access Required</Badge>
            </div>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ApperIcon name="HardDrive" size={20} />
              Wasabi Cloud Storage
            </h3>
            <Badge variant="success">Admin Only</Badge>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Access Key"
              value={settings.wasabiAccessKey}
              onChange={(e) => setSettings(prev => ({ ...prev, wasabiAccessKey: e.target.value }))}
              placeholder="Your Wasabi access key"
            />
            
            <Input
              label="Secret Key"
              type="password"
              value={settings.wasabiSecretKey}
              onChange={(e) => setSettings(prev => ({ ...prev, wasabiSecretKey: e.target.value }))}
              placeholder="Your Wasabi secret key"
            />
            
            <Input
              label="Bucket Name"
              value={settings.wasabiBucket}
              onChange={(e) => setSettings(prev => ({ ...prev, wasabiBucket: e.target.value }))}
              placeholder="my-vault-bucket"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                value={settings.wasabiRegion}
                onChange={(e) => setSettings(prev => ({ ...prev, wasabiRegion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="us-east-1">US East 1 (N. Virginia)</option>
                <option value="us-east-2">US East 2 (N. Virginia)</option>
                <option value="us-west-1">US West 1 (Oregon)</option>
                <option value="eu-central-1">EU Central 1 (Amsterdam)</option>
                <option value="eu-west-1">EU West 1 (London)</option>
                <option value="ap-northeast-1">Asia Pacific 1 (Tokyo)</option>
                <option value="ap-southeast-1">Asia Pacific 2 (Singapore)</option>
              </select>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Default Storage Backend</p>
                  <p className="text-blue-600 mt-1">
                    All uploaded files are automatically stored in Wasabi with client-side encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            <Button onClick={() => handleSave('Storage')} variant="primary">
              Save Changes
            </Button>
            <Button onClick={() => handleTestConnection('Wasabi')} variant="outline">
              Test Connection
            </Button>
          </div>
        </Card>
      </div>
    )
  }
  
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ApperIcon name="Shield" size={20} />
          Security Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Client-side encryption</label>
              <p className="text-sm text-gray-500">Encrypt files before uploading to cloud storage</p>
            </div>
            <Badge variant="success">Always Enabled</Badge>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <ApperIcon name="Shield" size={16} className="text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">AES-256 Encryption</p>
                <p className="text-green-600 mt-1">
                  All files are encrypted with AES-256 before being stored. 
                  Encryption keys are derived from your master password and never leave your device.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Encryption Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Algorithm:</span>
                <span className="ml-2 text-gray-600">AES-256-GCM</span>
              </div>
              <div>
                <span className="font-medium">Key Derivation:</span>
                <span className="ml-2 text-gray-600">PBKDF2</span>
              </div>
              <div>
                <span className="font-medium">Salt Length:</span>
                <span className="ml-2 text-gray-600">32 bytes</span>
              </div>
              <div>
                <span className="font-medium">Iterations:</span>
                <span className="ml-2 text-gray-600">100,000</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
  
  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ApperIcon name="Cog" size={20} />
          Advanced Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed File Types
            </label>
            <select
              value={settings.allowedFileTypes}
              onChange={(e) => setSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All file types</option>
              <option value="documents">Documents only</option>
              <option value="images">Images only</option>
              <option value="media">Media files only</option>
              <option value="custom">Custom list</option>
            </select>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <ApperIcon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Danger Zone</p>
                <p className="text-red-600 mt-1">
                  These actions are permanent and cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Button variant="danger" size="sm" icon="Trash2">
                Clear All Data
              </Button>
              <Button variant="danger" size="sm" icon="RefreshCw">
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button onClick={() => handleSave('Advanced')} variant="primary">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  )
  
  const renderContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings()
      case 'webdav': return renderWebDAVSettings()
      case 'storage': return renderStorageSettings()
      case 'security': return renderSecuritySettings()
      case 'advanced': return renderAdvancedSettings()
      default: return renderGeneralSettings()
    }
  }
  
  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <ApperIcon name="Settings" size={24} className="text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">Manage your VaultDrive configuration</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          {/* Sidebar */}
<div className="w-64 bg-white border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const isStorageTab = tab.id === 'storage'
                const isRestricted = isStorageTab && !isAdmin
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => !isRestricted && setActiveTab(tab.id)}
                    disabled={isRestricted}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left relative
                      ${activeTab === tab.id
                        ? 'bg-primary text-white'
                        : isRestricted
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <ApperIcon name={tab.icon} size={18} />
                    {tab.label}
                    {isStorageTab && !isAdmin && (
                      <ApperIcon name="Lock" size={14} className="ml-auto" />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings