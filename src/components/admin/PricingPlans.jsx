import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'

const PricingPlans = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Basic',
      storage: '10 GB',
      price: '$5.99',
      features: ['10GB Storage', 'Basic Support', 'File Sharing'],
      active: true,
      users: 1250
    },
    {
      id: 2,
      name: 'Professional',
      storage: '100 GB',
      price: '$19.99',
      features: ['100GB Storage', 'Priority Support', 'Advanced Sharing', 'Encryption'],
      active: true,
      users: 850
    },
    {
      id: 3,
      name: 'Enterprise',
      storage: '1 TB',
      price: '$49.99',
      features: ['1TB Storage', '24/7 Support', 'Team Collaboration', 'Advanced Security'],
      active: true,
      users: 320
    }
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    storage: '',
    price: '',
    features: '',
    active: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.storage || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    const planData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      users: 0
    }

    if (editingPlan) {
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id 
          ? { ...plan, ...planData }
          : plan
      ))
      toast.success('Pricing plan updated successfully')
    } else {
      const newPlan = {
        ...planData,
        id: Date.now()
      }
      setPlans([...plans, newPlan])
      toast.success('Pricing plan created successfully')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      storage: '',
      price: '',
      features: '',
      active: true
    })
    setEditingPlan(null)
    setShowForm(false)
  }

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      storage: plan.storage,
      price: plan.price,
      features: plan.features.join(', '),
      active: plan.active
    })
    setEditingPlan(plan)
    setShowForm(true)
  }

  const handleDelete = (planId) => {
    if (confirm('Are you sure you want to delete this pricing plan?')) {
      setPlans(plans.filter(plan => plan.id !== planId))
      toast.success('Pricing plan deleted successfully')
    }
  }

  const togglePlanStatus = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, active: !plan.active }
        : plan
    ))
    toast.success('Plan status updated successfully')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pricing Plans</h2>
          <p className="text-gray-600">Create and manage storage pricing plans</p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Add New Plan
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Plan Name"
              placeholder="e.g., Basic, Pro, Enterprise"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Storage Amount"
              placeholder="e.g., 10 GB, 100 GB, 1 TB"
              value={formData.storage}
              onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
              required
            />

            <Input
              label="Price"
              placeholder="e.g., $9.99, $19.99"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (comma-separated)
              </label>
              <textarea
                placeholder="e.g., 10GB Storage, Basic Support, File Sharing"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Active Plan</span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" variant="primary">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary">{plan.price}</p>
                <p className="text-sm text-gray-600">{plan.storage} storage</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  onClick={() => handleEdit(plan)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                />
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
              <ul className="space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Check" size={14} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  plan.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Users:</span>
                <span className="text-sm font-medium text-gray-900">{plan.users.toLocaleString()}</span>
              </div>
              <Button
                variant={plan.active ? 'danger' : 'success'}
                size="sm"
                onClick={() => togglePlanStatus(plan.id)}
                className="w-full"
              >
                {plan.active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <Card className="p-12 text-center">
          <ApperIcon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pricing Plans</h3>
          <p className="text-gray-600 mb-4">Create your first pricing plan to get started.</p>
          <Button variant="primary" icon="Plus" onClick={() => setShowForm(true)}>
            Create First Plan
          </Button>
        </Card>
      )}
    </div>
  )
}

export default PricingPlans