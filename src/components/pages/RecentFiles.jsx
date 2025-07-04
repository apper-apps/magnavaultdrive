import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import FileGrid from '@/components/organisms/FileGrid'
import { fileService } from '@/services/api/fileService'

const RecentFiles = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  
  useEffect(() => {
    loadRecentFiles()
  }, [])
  
  const loadRecentFiles = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const allFiles = await fileService.getAll()
      // Sort by modified date and take the most recent 50
      const recentFiles = allFiles
        .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
        .slice(0, 50)
      
      setFiles(recentFiles)
    } catch (err) {
      setError('Failed to load recent files')
      console.error('Error loading recent files:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Recent Files</h1>
              <p className="text-gray-600">Files you've accessed recently</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                <ApperIcon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                <ApperIcon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <FileGrid
          files={files}
          folders={[]}
          loading={loading}
          error={error}
          onRefresh={loadRecentFiles}
          viewMode={viewMode}
        />
      </div>
    </motion.div>
  )
}

export default RecentFiles