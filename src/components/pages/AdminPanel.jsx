import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectIsAdmin } from '@/store/userSlice'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import PlatformSettings from '@/components/admin/PlatformSettings'
import PricingPlans from '@/components/admin/PricingPlans'
import UserStorage from '@/components/admin/UserStorage'
import PaymentGateways from '@/components/admin/PaymentGateways'
import SMTPSettings from '@/components/admin/SMTPSettings'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('platform')
  const isAdmin = useSelector(selectIsAdmin)

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const tabs = [
    { id: 'platform', label: 'Platform Settings', icon: 'Settings', component: PlatformSettings },
    { id: 'pricing', label: 'Pricing Plans', icon: 'DollarSign', component: PricingPlans },
    { id: 'storage', label: 'User Storage', icon: 'HardDrive', component: UserStorage },
    { id: 'payments', label: 'Payment Gateways', icon: 'CreditCard', component: PaymentGateways },
    { id: 'smtp', label: 'SMTP Settings', icon: 'Mail', component: SMTPSettings }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Shield" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage platform settings and configurations</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'ghost'}
                  size="md"
                  icon={tab.icon}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-shrink-0"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="min-h-96">
          {ActiveComponent && <ActiveComponent />}
        </Card>
      </div>
    </div>
  )
}

export default AdminPanel