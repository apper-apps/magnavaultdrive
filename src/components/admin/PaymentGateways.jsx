import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'

const PaymentGateways = () => {
  const [gateways, setGateways] = useState([
    {
      id: 1,
      name: 'Stripe',
      enabled: true,
      credentials: {
        publishableKey: 'pk_test_...',
        secretKey: '••••••••••••••••',
        webhookSecret: '••••••••••••••••'
      },
      status: 'Connected',
      transactions: 1250
    },
    {
      id: 2,
      name: 'PayPal',
      enabled: false,
      credentials: {
        clientId: '',
        clientSecret: '',
        webhookId: ''
      },
      status: 'Not Connected',
      transactions: 0
    },
    {
      id: 3,
      name: 'Square',
      enabled: false,
      credentials: {
        applicationId: '',
        accessToken: '',
        locationId: ''
      },
      status: 'Not Connected',
      transactions: 0
    }
  ])

  const [editingGateway, setEditingGateway] = useState(null)
  const [showCredentials, setShowCredentials] = useState({})

  const handleToggleGateway = (gatewayId) => {
    setGateways(gateways.map(gateway =>
      gateway.id === gatewayId
        ? { ...gateway, enabled: !gateway.enabled }
        : gateway
    ))
    
    const gateway = gateways.find(g => g.id === gatewayId)
    toast.success(`${gateway.name} ${!gateway.enabled ? 'enabled' : 'disabled'} successfully`)
  }

  const handleUpdateCredentials = (gatewayId, newCredentials) => {
    setGateways(gateways.map(gateway =>
      gateway.id === gatewayId
        ? { 
            ...gateway, 
            credentials: { ...gateway.credentials, ...newCredentials },
            status: 'Connected'
          }
        : gateway
    ))
    toast.success('Payment gateway credentials updated successfully')
    setEditingGateway(null)
  }

  const toggleCredentialVisibility = (gatewayId) => {
    setShowCredentials(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }))
  }

  const testConnection = (gateway) => {
    // Simulate API test
    toast.info(`Testing connection to ${gateway.name}...`)
    setTimeout(() => {
      toast.success(`${gateway.name} connection test successful`)
    }, 2000)
  }

  const getCredentialFields = (gatewayName) => {
    switch (gatewayName) {
      case 'Stripe':
        return [
          { key: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_test_...' },
          { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_test_...', secret: true },
          { key: 'webhookSecret', label: 'Webhook Secret', placeholder: 'whsec_...', secret: true }
        ]
      case 'PayPal':
        return [
          { key: 'clientId', label: 'Client ID', placeholder: 'Client ID' },
          { key: 'clientSecret', label: 'Client Secret', placeholder: 'Client Secret', secret: true },
          { key: 'webhookId', label: 'Webhook ID', placeholder: 'Webhook ID' }
        ]
      case 'Square':
        return [
          { key: 'applicationId', label: 'Application ID', placeholder: 'Application ID' },
          { key: 'accessToken', label: 'Access Token', placeholder: 'Access Token', secret: true },
          { key: 'locationId', label: 'Location ID', placeholder: 'Location ID' }
        ]
      default:
        return []
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Gateways</h2>
          <p className="text-gray-600">Configure payment processors for subscription billing</p>
        </div>
      </div>

      {/* Gateway Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  gateway.name === 'Stripe' ? 'bg-purple-100' :
                  gateway.name === 'PayPal' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  <ApperIcon 
                    name={gateway.name === 'Stripe' ? 'CreditCard' : 
                          gateway.name === 'PayPal' ? 'Wallet' : 'Banknote'} 
                    size={24} 
                    className={
                      gateway.name === 'Stripe' ? 'text-purple-600' :
                      gateway.name === 'PayPal' ? 'text-blue-600' :
                      'text-gray-600'
                    } 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{gateway.name}</h3>
                  <span className={`text-sm ${
                    gateway.status === 'Connected' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gateway.status}
                  </span>
                </div>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={gateway.enabled}
                  onChange={() => handleToggleGateway(gateway.id)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gateway.enabled ? 'bg-primary' : 'bg-gray-200'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gateway.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transactions:</span>
                <span className="font-medium text-gray-900">{gateway.transactions.toLocaleString()}</span>
              </div>
              
              {gateway.status === 'Connected' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Credentials:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={showCredentials[gateway.id] ? "EyeOff" : "Eye"}
                      onClick={() => toggleCredentialVisibility(gateway.id)}
                    />
                  </div>
                  {showCredentials[gateway.id] && (
                    <div className="space-y-1">
                      {getCredentialFields(gateway.name).map((field) => (
                        <div key={field.key} className="text-xs">
                          <span className="text-gray-500">{field.label}:</span>
                          <code className="ml-2 bg-gray-100 px-1 rounded">
                            {field.secret && !showCredentials[gateway.id] 
                              ? '••••••••••••••••' 
                              : gateway.credentials[field.key] || 'Not set'
                            }
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon="Settings"
                onClick={() => setEditingGateway(gateway)}
                className="flex-1"
              >
                Configure
              </Button>
              {gateway.status === 'Connected' && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Zap"
                  onClick={() => testConnection(gateway)}
                />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Configuration Modal */}
      {editingGateway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configure {editingGateway.name}
              </h3>
              
              <div className="space-y-4">
                {getCredentialFields(editingGateway.name).map((field) => (
                  <Input
                    key={field.key}
                    label={field.label}
                    type={field.secret ? "password" : "text"}
                    placeholder={field.placeholder}
                    defaultValue={editingGateway.credentials[field.key]}
                    onChange={(e) => {
                      editingGateway.credentials[field.key] = e.target.value
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  variant="primary"
                  onClick={() => handleUpdateCredentials(editingGateway.id, editingGateway.credentials)}
                >
                  Save Configuration
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setEditingGateway(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Setup Guide */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">1. Choose Gateway</h4>
            <p className="text-sm text-gray-600">Select the payment gateway that best fits your needs and geographic requirements.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">2. Get Credentials</h4>
            <p className="text-sm text-gray-600">Obtain API keys and credentials from your payment provider's dashboard.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">3. Test Integration</h4>
            <p className="text-sm text-gray-600">Use the test connection feature to verify your configuration is working correctly.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PaymentGateways