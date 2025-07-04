import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const FolderCard = ({ 
  folder, 
  onSelect, 
  onContextMenu,
  onDoubleClick,
  selected = false,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(folder)
  }
  
  const handleDoubleClick = (e) => {
    e.stopPropagation()
    onDoubleClick?.(folder)
  }
  
  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(e, folder)
  }
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`
          relative p-4 cursor-pointer transition-all duration-200
          ${selected 
            ? 'border-primary bg-gradient-to-br from-blue-50 to-indigo-50' 
            : 'hover:shadow-float'
          }
        `}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        hover
      >
        {/* Folder Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center mb-3">
            <ApperIcon name="Folder" size={32} className="text-blue-600" />
          </div>
          
{/* Folder Name */}
          <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem] flex items-center">
            {folder.Name}
          </h3>
          
          {/* Folder Details */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>{folder.child_count} items</div>
            <div>{formatDistanceToNow(new Date(folder.created_at), { addSuffix: true })}</div>
          </div>
        </div>
        
        {/* Selection Indicator */}
        {selected && (
          <motion.div
            className="absolute top-2 left-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={12} className="text-white" />
            </div>
          </motion.div>
        )}
        
        {/* Hover Actions */}
        {isHovered && !selected && (
          <motion.div
            className="absolute top-2 left-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-white" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

export default FolderCard