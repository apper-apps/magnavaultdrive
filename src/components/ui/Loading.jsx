import { motion } from 'framer-motion'

const Loading = ({ variant = 'grid', className = "" }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg shimmer mb-3" />
        <div className="w-24 h-4 bg-gray-200 rounded shimmer mb-2" />
        <div className="w-16 h-3 bg-gray-200 rounded shimmer mb-1" />
        <div className="w-20 h-3 bg-gray-200 rounded shimmer" />
      </div>
    </div>
  )
  
  const SkeletonList = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-card">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg shimmer" />
        <div className="flex-1">
          <div className="w-32 h-4 bg-gray-200 rounded shimmer mb-2" />
          <div className="w-24 h-3 bg-gray-200 rounded shimmer" />
        </div>
        <div className="w-16 h-3 bg-gray-200 rounded shimmer" />
      </div>
    </div>
  )
  
  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {variant === 'grid' ? (
        <div className="file-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonList key={index} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default Loading