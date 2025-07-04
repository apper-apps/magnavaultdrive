import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const FileCard = ({ 
  file, 
  onSelect, 
  onContextMenu,
  onDoubleClick,
  selected = false,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image'
    if (type.startsWith('video/')) return 'Video'
    if (type.startsWith('audio/')) return 'Music'
    if (type.includes('pdf')) return 'FileText'
    if (type.includes('document') || type.includes('word')) return 'FileText'
    if (type.includes('spreadsheet') || type.includes('excel')) return 'FileSpreadsheet'
    if (type.includes('archive') || type.includes('zip')) return 'Archive'
    return 'File'
  }
  
  const getIconColor = (type) => {
    if (type.startsWith('image/')) return 'text-yellow-500'
    if (type.startsWith('video/')) return 'text-red-500'
    if (type.startsWith('audio/')) return 'text-purple-500'
    if (type.includes('pdf')) return 'text-red-600'
    if (type.includes('document') || type.includes('word')) return 'text-blue-500'
    if (type.includes('spreadsheet') || type.includes('excel')) return 'text-green-500'
    if (type.includes('archive') || type.includes('zip')) return 'text-amber-500'
    return 'text-gray-500'
  }
  
  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(file)
  }
  
  const handleDoubleClick = (e) => {
    e.stopPropagation()
    onDoubleClick?.(file)
  }
  
  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.(e, file)
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
        {/* Encryption Badge */}
        {file.encrypted && (
          <Badge
            variant="encrypted"
            size="sm"
            icon="Shield"
            className="absolute top-2 right-2 z-10"
          >
            Encrypted
          </Badge>
        )}
        
        {/* File Icon */}
        <div className="flex flex-col items-center text-center">
          <div className={`file-icon mb-3 ${file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 
            file.type.includes('archive') ? 'archive' : 'document'}`}>
            <ApperIcon 
              name={getFileIcon(file.type)} 
              size={32} 
              className={getIconColor(file.type)}
            />
          </div>
          
          {/* File Name */}
          <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem] flex items-center">
            {file.name}
          </h3>
          
          {/* File Details */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>{formatFileSize(file.size)}</div>
            <div>{formatDistanceToNow(new Date(file.modifiedAt), { addSuffix: true })}</div>
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

export default FileCard