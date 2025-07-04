import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'

const SMTPSettings = () => {
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    username: 'your-app@gmail.com',
    password: '••••••••••••••••',
    fromName: 'VaultDrive',
    fromEmail: 'noreply@vaultdrive.com'
  })

  const [testEmail, setTestEmail] = useState('')
  const [testing, setTesting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const smtpProviders = [
    {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: '587',
      secure: false,
      instructions: 'Use your Gmail address and an App Password (not your regular password)'
    },
    {
      name: 'Outlook/Hotmail',
      host: 'smtp-mail.outlook.com',
      port: '587',
      secure: false,
      instructions: 'Use your Outlook/Hotmail address and password'
    },
    {
      name: 'Yahoo',
      host: 'smtp.mail.yahoo.com',
      port: '587',
      secure: false,
      instructions: 'Use your Yahoo address and an App Password'
    },
    {
      name: 'SendGrid',
      host: 'smtp.sendgrid.net',
      port: '587',
      secure: false,
      instructions: 'Use "apikey" as username and your API key as password'
    },
    {
      name: 'Mailgun',
      host: 'smtp.mailgun.org',
      port: '587',
      secure: false,
      instructions: 'Use your Mailgun SMTP credentials'
    }
  ]

  const handleConfigChange = (field, value) => {
    setSmtpConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProviderSelect = (provider) => {
    setSmtpConfig(prev => ({
      ...prev,
      host: provider.host,
      port: provider.port,
      secure: provider.secure
    }))
    toast.info(`SMTP settings updated for ${provider.name}`)
  }

  const handleSaveConfig = () => {
    // Validate required fields
    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.username) {
      toast.error('Please fill in all required SMTP fields')
      return
    }

    // Here you would typically save to your backend
    toast.success('SMTP configuration saved successfully')
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address')
      return
    }

    setTesting(true)
    try {
      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Test email sent to ${testEmail}`)
    } catch (error) {
      toast.error('Failed to send test email')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SMTP Settings</h2>
          <p className="text-gray-600">Configure email settings for file sharing notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SMTP Configuration */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SMTP Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="SMTP Host"
                placeholder="smtp.gmail.com"
                value={smtpConfig.host}
                onChange={(e) => handleConfigChange('host', e.target.value)}
                required
              />
              
              <Input
                label="Port"
                type="number"
                placeholder="587"
                value={smtpConfig.port}
                onChange={(e) => handleConfigChange('port', e.target.value)}
                required
              />
              
              <Input
                label="Username/Email"
                type="email"
                placeholder="your-app@gmail.com"
                value={smtpConfig.username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                required
              />
              
              <div className="relative">
                <Input
                  label="Password/API Key"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password or API key"
                  value={smtpConfig.password}
                  onChange={(e) => handleConfigChange('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={smtpConfig.secure}
                  onChange={(e) => handleConfigChange('secure', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Use TLS/SSL encryption</span>
              </label>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Email Appearance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="From Name"
                  placeholder="VaultDrive"
                  value={smtpConfig.fromName}
                  onChange={(e) => handleConfigChange('fromName', e.target.value)}
                />
                
                <Input
                  label="From Email"
                  type="email"
                  placeholder="noreply@vaultdrive.com"
                  value={smtpConfig.fromEmail}
                  onChange={(e) => handleConfigChange('fromEmail', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="primary" onClick={handleSaveConfig}>
                Save Configuration
              </Button>
              <Button variant="outline" icon="RotateCcw">
                Reset to Defaults
              </Button>
            </div>
          </Card>

          {/* Test Email Section */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Email Configuration</h3>
            <p className="text-gray-600 mb-4">
              Send a test email to verify your SMTP configuration is working correctly.
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter test email address"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="secondary" 
                icon="Send"
                loading={testing}
                onClick={handleTestEmail}
              >
                Send Test
              </Button>
            </div>
          </Card>
        </div>

        {/* Provider Templates */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a provider to auto-fill SMTP settings:
            </p>
            
            <div className="space-y-3">
              {smtpProviders.map((provider) => (
                <div key={provider.name} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{provider.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleProviderSelect(provider)}
                    >
                      Use
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">{provider.instructions}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <ApperIcon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Security Note</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Always use App Passwords or API keys instead of your main account password for better security.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Email Templates Preview */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 text-sm">File Share Notification</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Sent when a user shares a file via email link
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 text-sm">Storage Limit Warning</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Notifies users when approaching storage limits
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 text-sm">Account Notifications</h4>
                <p className="text-xs text-gray-600 mt-1">
                  General account and security notifications
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Customize Templates
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SMTPSettings