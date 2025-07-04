import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FileGrid from '@/components/organisms/FileGrid'
import { fileService } from '@/services/api/fileService'

const Trash = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedItems, setSelectedItems] = useState([])
  
  useEffect(() => {
    loadTrashedFiles()
  }, [])
  
  const loadTrashedFiles = async () => {
    setLoading(true)
    setError(null)
    
try {
      // In a real app, this would fetch trashed files
      // For now, we'll simulate some trashed files
      const trashedFiles = [
        {
          Id: 1,
          Name: 'old-document.pdf',
          size: 2048576,
          type: 'application/pdf',
          encrypted: true,
          deletedAt: new Date(Date.now() - 86400000).toISOString(),
          originalPath: '/Documents'
        },
        {
          Id: 2,
          Name: 'unused-image.jpg',
          size: 1024768,
          type: 'image/jpeg',
          encrypted: true,
          deletedAt: new Date(Date.now() - 172800000).toISOString(),
          originalPath: '/Photos'
        },
        {
          Id: 3,
          Name: 'backup-data.zip',
          size: 10485760,
          type: 'application/zip',
          encrypted: true,
          deletedAt: new Date(Date.now() - 259200000).toISOString(),
          originalPath: '/Archives'
        }
      ]
      
      setFiles(trashedFiles)
    } catch (err) {
      setError('Failed to load trashed files')
      console.error('Error loading trashed files:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRestore = async (fileIds) => {
    try {
      // In a real app, this would restore files
      toast.success(`${fileIds.length} file(s) restored`)
      loadTrashedFiles()
    } catch (err) {
      toast.error('Failed to restore files')
    }
  }
  
  const handlePermanentDelete = async (fileIds) => {
    try {
      // In a real app, this would permanently delete files
      toast.success(`${fileIds.length} file(s) permanently deleted`)
      loadTrashedFiles()
    } catch (err) {
      toast.error('Failed to permanently delete files')
    }
  }
  
  const handleEmptyTrash = async () => {
    if (window.confirm('Are you sure you want to permanently delete all files in trash? This action cannot be undone.')) {
      try {
        // In a real app, this would empty the trash
        toast.success('Trash emptied')
        setFiles([])
      } catch (err) {
        toast.error('Failed to empty trash')
      }
    }
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Trash2" size={24} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Trash</h1>
              <p className="text-gray-600">Files will be permanently deleted after 30 days</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {files.length > 0 && (
              <Button
                onClick={handleEmptyTrash}
                variant="danger"
                icon="Trash2"
                size="md"
              >
                Empty Trash
              </Button>
            )}
            
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
        {files.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Trash2" size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Trash is empty</h3>
            <p className="text-gray-600">Deleted files will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedItems.length} item(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      icon="RotateCcw"
                      onClick={() => handleRestore(selectedItems.map(item => item.Id))}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handlePermanentDelete(selectedItems.map(item => item.Id))}
                    >
                      Delete Forever
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Files List */}
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.Id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-float transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.some(item => item.Id === file.Id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(prev => [...prev, file])
                          } else {
                            setSelectedItems(prev => prev.filter(item => item.Id !== file.Id))
                          }
                        }}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                        <ApperIcon name="File" size={20} className="text-red-600" />
                      </div>
                      <div>
<h3 className="font-medium text-gray-800">{file.Name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Deleted {formatDate(file.deletedAt)}</span>
                          <span>•</span>
                          <span>From {file.originalPath}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleRestore([file.Id])}
                        variant="success"
                        size="sm"
                        icon="RotateCcw"
                      >
                        Restore
                      </Button>
                      <Button
                        onClick={() => handlePermanentDelete([file.Id])}
                        variant="danger"
                        size="sm"
                        icon="Trash2"
                      >
                        Delete Forever
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Trash