import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Empty = ({ 
  icon = "FolderOpen",
  title = "No files found",
  description = "Upload your first file to get started",
  actionText = "Upload Files",
  onAction,
  className = "" 
}) => {
  return (
    <motion.div
      className={`flex items-center justify-center min-h-[400px] ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-md w-full text-center p-8 gradient">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={40} className="text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            size="lg"
            icon="Plus"
            className="mb-4"
          >
            {actionText}
          </Button>
        )}
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <ApperIcon name="Shield" size={16} className="text-success" />
            <span>Files are encrypted before upload</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ApperIcon name="Zap" size={16} className="text-warning" />
            <span>Fast and secure cloud storage</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Empty