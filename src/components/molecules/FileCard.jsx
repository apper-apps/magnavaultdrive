import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const FileCard = ({ 
  file, 
  onSelect, 
  onContextMenu,
  onDoubleClick,
  selected = false,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Utility function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get appropriate icon based on file type
  const getFileIcon = (type) => {
    if (!type) return 'File'
    
    const fileType = type.toLowerCase()
    
    if (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileType)) {
      return 'Image'
    }
    if (fileType.includes('video') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileType)) {
      return 'Video'
    }
    if (fileType.includes('audio') || ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(fileType)) {
      return 'Music'
    }
    if (fileType.includes('pdf')) {
      return 'FileText'
    }
    if (fileType.includes('document') || ['doc', 'docx', 'txt', 'rtf'].includes(fileType)) {
      return 'FileText'
    }
    if (fileType.includes('spreadsheet') || ['xls', 'xlsx', 'csv'].includes(fileType)) {
      return 'FileSpreadsheet'
    }
    if (fileType.includes('presentation') || ['ppt', 'pptx'].includes(fileType)) {
      return 'Presentation'
    }
    if (fileType.includes('archive') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileType)) {
      return 'Archive'
    }
    if (fileType.includes('code') || ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'php', 'py', 'java'].includes(fileType)) {
      return 'Code'
    }
    
    return 'File'
  }

  // Get icon color based on file type
  const getIconColor = (type) => {
    if (!type) return 'text-gray-500'
    
    const fileType = type.toLowerCase()
    
    if (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileType)) {
      return 'text-yellow-500'
    }
    if (fileType.includes('video') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileType)) {
      return 'text-red-500'
    }
    if (fileType.includes('audio') || ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(fileType)) {
      return 'text-purple-500'
    }
    if (fileType.includes('pdf')) {
      return 'text-red-600'
    }
    if (fileType.includes('document') || ['doc', 'docx', 'txt', 'rtf'].includes(fileType)) {
      return 'text-blue-500'
    }
    if (fileType.includes('spreadsheet') || ['xls', 'xlsx', 'csv'].includes(fileType)) {
      return 'text-green-500'
    }
    if (fileType.includes('presentation') || ['ppt', 'pptx'].includes(fileType)) {
      return 'text-orange-500'
    }
    if (fileType.includes('archive') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileType)) {
      return 'text-green-600'
    }
    if (fileType.includes('code') || ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'php', 'py', 'java'].includes(fileType)) {
      return 'text-indigo-500'
    }
    
    return 'text-gray-500'
  }

  // Event handlers
  const handleClick = (e) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect(file)
    }
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    if (onDoubleClick) {
      onDoubleClick(file)
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onContextMenu) {
      onContextMenu(e, file)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className={`relative ${className}`}
    >
      <Card
        className={`
          cursor-pointer transition-all duration-200 hover:shadow-lg
          ${selected ? 'ring-2 ring-primary ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'}
          ${isHovered ? 'shadow-md' : 'shadow-card'}
        `}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Encryption badge */}
        {file.encrypted && (
          <div className="encryption-badge">
            <ApperIcon name="Shield" size={12} />
            <span>Encrypted</span>
          </div>
        )}

        <div className="p-4">
          {/* File icon */}
          <div className={`file-icon ${getIconColor(file.type).replace('text-', '')}`}>
            <ApperIcon 
              name={getFileIcon(file.type)} 
              size={24} 
              className={getIconColor(file.type)}
            />
          </div>

          {/* File details */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 truncate text-sm">
              {file.Name || file.name || 'Untitled'}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              {file.modified_at && (
                <span>
                  {formatDistanceToNow(new Date(file.modified_at), { addSuffix: true })}
                </span>
              )}
            </div>

            {/* Tags */}
            {file.Tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {file.Tags.split(',').slice(0, 2).map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="text-xs px-2 py-1"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
                {file.Tags.split(',').length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{file.Tags.split(',').length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="Check" size={12} className="text-white" />
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default FileCard