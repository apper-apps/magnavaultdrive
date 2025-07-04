import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ProgressBar from '@/components/atoms/ProgressBar'

const StorageIndicator = ({ used = 0, total = 100, className = "" }) => {
  const percentage = (used / total) * 100
  const remainingSpace = total - used
  
  const formatSize = (sizeInGB) => {
    if (sizeInGB >= 1024) {
      return `${(sizeInGB / 1024).toFixed(1)} TB`
    }
    return `${sizeInGB.toFixed(1)} GB`
  }
  
  const getVariant = () => {
    if (percentage >= 90) return 'error'
    if (percentage >= 75) return 'warning'
    return 'success'
  }
  
  return (
    <motion.div
      className={`bg-white rounded-lg p-4 border border-gray-200 shadow-card ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ApperIcon name="HardDrive" size={20} className="text-gray-500" />
          <span className="font-medium text-gray-700">Storage</span>
        </div>
        <div className="text-sm text-gray-500">
          {formatSize(used)} of {formatSize(total)} used
        </div>
      </div>
      
      <ProgressBar
        value={used}
        max={total}
        variant={getVariant()}
        size="md"
        className="mb-2"
      />
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>{Math.round(percentage)}% used</span>
        <span>{formatSize(remainingSpace)} remaining</span>
      </div>
    </motion.div>
  )
}

export default StorageIndicator