import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <motion.div
      className={`flex items-center justify-center min-h-[400px] ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-md w-full text-center p-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            variant="primary"
            size="lg"
            icon="RotateCcw"
            className="w-full"
          >
            Try Again
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="lg"
            icon="RefreshCw"
            className="w-full"
          >
            Refresh Page
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          If the problem persists, please check your internet connection or try again later.
        </div>
      </Card>
    </motion.div>
  )
}

export default Error