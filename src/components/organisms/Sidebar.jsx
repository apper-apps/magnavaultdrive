import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import StorageIndicator from '@/components/molecules/StorageIndicator'
import { selectIsAdmin } from '@/store/userSlice'
const Sidebar = ({ isOpen, onClose, className = "" }) => {
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState(null)
  const isAdmin = useSelector(selectIsAdmin)
  
  const menuItems = [
    { path: '/', label: 'My Files', icon: 'Folder', count: null },
    { path: '/recent', label: 'Recent', icon: 'Clock', count: null },
    { path: '/shared', label: 'Shared', icon: 'Share2', count: 5 },
    { path: '/trash', label: 'Trash', icon: 'Trash2', count: 3 },
    { path: '/settings', label: 'Settings', icon: 'Settings', count: null },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel', icon: 'Shield', count: null }] : [])
  ]
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/folder/')
    }
    return location.pathname === path
  }
  
  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Shield" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">VaultDrive</h1>
            <p className="text-sm text-gray-500">Secure Cloud Storage</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: navIsActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                ${navIsActive || isActive(item.path)
                  ? 'bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border-l-4 border-primary'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
              {item.count && (
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-8">
          <StorageIndicator used={45.2} total={100} />
        </div>
      </div>
    </div>
  )
  
  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 z-50 overflow-y-auto"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Shield" size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">VaultDrive</h1>
                    <p className="text-sm text-gray-500">Secure Cloud Storage</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-600" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive: navIsActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                      ${navIsActive || isActive(item.path)
                        ? 'bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border-l-4 border-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                    {item.count && (
                      <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
              
              <div className="mt-8">
                <StorageIndicator used={45.2} total={100} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
  
  return (
    <div className={className}>
      <DesktopSidebar />
      <MobileSidebar />
    </div>
  )
}

export default Sidebar