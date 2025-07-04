import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const FileUploadZone = ({ onFilesSelected, maxFiles = 10, maxFileSize = 100, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
      setDragActive(false)
    }
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }
  
  const processFiles = (files) => {
    const validFiles = files.filter(file => {
      const sizeInMB = file.size / (1024 * 1024)
      return sizeInMB <= maxFileSize
    }).slice(0, maxFiles)
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }
  
  const openFileSelector = () => {
    fileInputRef.current?.click()
  }
  
  return (
    <Card className={`relative ${className}`}>
      <motion.div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? dragActive 
              ? 'border-success bg-gradient-to-br from-green-50 to-emerald-50' 
              : 'border-primary bg-gradient-to-br from-blue-50 to-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
        
        <AnimatePresence mode="wait">
          {isDragOver ? (
            <motion.div
              key="drag-over"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon 
                name={dragActive ? "Upload" : "FileText"} 
                size={48} 
                className={`mx-auto mb-4 ${dragActive ? 'text-success' : 'text-primary'}`}
              />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {dragActive ? "Drop files here!" : "Drag files here"}
              </h3>
              <p className="text-gray-500">
                {dragActive ? "Release to upload" : "Or click to select files"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Upload Files
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <Button
                onClick={openFileSelector}
                variant="primary"
                size="lg"
                icon="FolderOpen"
                className="mb-4"
              >
                Select Files
              </Button>
              <div className="text-sm text-gray-400">
                <p>Maximum {maxFiles} files, up to {maxFileSize}MB each</p>
                <p>Files will be encrypted before upload</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  )
}

export default FileUploadZone