import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ContextMenu = ({ 
  isOpen, 
  onClose, 
  position, 
  items, 
  className = "" 
}) => {
  const menuRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className={`context-menu ${className}`}
          style={{
            left: position.x,
            top: position.y,
          }}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.type === 'divider' ? (
                <div className="border-t border-gray-200 my-1" />
              ) : (
                <button
                  onClick={() => {
                    item.onClick()
                    onClose()
                  }}
                  className={`context-menu-item w-full text-left ${
                    item.danger ? 'danger' : ''
                  }`}
                  disabled={item.disabled}
                >
                  {item.icon && <ApperIcon name={item.icon} size={16} />}
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="ml-auto text-xs text-gray-400">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContextMenu