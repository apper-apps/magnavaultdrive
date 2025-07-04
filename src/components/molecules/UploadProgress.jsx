import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import ProgressBar from '@/components/atoms/ProgressBar'
import Badge from '@/components/atoms/Badge'

const UploadProgress = ({ 
  uploads = [], 
  onCancel,
  onRetry,
  className = "" 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'error': return 'error'
      case 'encrypting': return 'warning'
      case 'uploading': return 'info'
      default: return 'default'
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle'
      case 'error': return 'AlertCircle'
      case 'encrypting': return 'Shield'
      case 'uploading': return 'Upload'
      default: return 'Clock'
    }
  }
  
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'error': return 'Failed'
      case 'encrypting': return 'Encrypting'
      case 'uploading': return 'Uploading'
      default: return 'Pending'
    }
  }
  
  if (uploads.length === 0) return null
  
  return (
    <Card className={`${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <ApperIcon name="Upload" size={20} />
            Upload Progress
          </h3>
          <button
            onClick={() => onCancel?.()}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {uploads.map((upload) => (
            <motion.div
              key={upload.id}
              className="border border-gray-200 rounded-lg p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <ApperIcon name="File" size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm text-gray-700 truncate">
                    {upload.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getStatusColor(upload.status)}
                    size="sm"
                    icon={getStatusIcon(upload.status)}
                  >
                    {getStatusText(upload.status)}
                  </Badge>
                  {upload.status === 'error' && (
                    <button
                      onClick={() => onRetry?.(upload)}
                      className="text-primary hover:text-blue-700 transition-colors"
                      title="Retry upload"
                    >
                      <ApperIcon name="RotateCcw" size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatFileSize(upload.fileSize)}</span>
                  <span>
                    {upload.status === 'uploading' || upload.status === 'encrypting' 
                      ? `${upload.progress}%` 
                      : ''
                    }
                  </span>
                </div>
                
                {(upload.status === 'uploading' || upload.status === 'encrypting') && (
                  <ProgressBar
                    value={upload.progress}
                    max={100}
                    variant={upload.status === 'encrypting' ? 'warning' : 'primary'}
                    size="sm"
                  />
                )}
                
                {upload.status === 'error' && upload.errorMessage && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {upload.errorMessage}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default UploadProgress