import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import FileGrid from '@/components/organisms/FileGrid'
import { fileService } from '@/services/api/fileService'
import { sharedLinkService } from '@/services/api/sharedLinkService'

const SharedFiles = () => {
  const [files, setFiles] = useState([])
  const [sharedLinks, setSharedLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [activeTab, setActiveTab] = useState('files')
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [allFiles, allSharedLinks] = await Promise.all([
        fileService.getAll(),
        sharedLinkService.getAll()
      ])
      
      // Filter files that have shared links
      const sharedFiles = allFiles.filter(file => 
        file.sharedLinks && file.sharedLinks.length > 0
      )
      
      setFiles(sharedFiles)
      setSharedLinks(allSharedLinks)
    } catch (err) {
      setError('Failed to load shared files')
      console.error('Error loading shared files:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link.url)
    toast.success('Link copied to clipboard')
  }
  
  const handleRevokeLink = async (linkId) => {
    try {
      await sharedLinkService.delete(linkId)
      loadData()
      toast.success('Shared link revoked')
    } catch (err) {
      toast.error('Failed to revoke link')
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
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Share2" size={24} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Shared Files</h1>
              <p className="text-gray-600">Files and links you've shared with others</p>
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
        
        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'files'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Shared Files ({files.length})
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'links'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Shared Links ({sharedLinks.length})
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'files' ? (
          <FileGrid
            files={files}
            folders={[]}
            loading={loading}
            error={error}
            onRefresh={loadData}
            viewMode={viewMode}
          />
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg shimmer" />
                        <div>
                          <div className="w-48 h-4 bg-gray-200 rounded shimmer mb-2" />
                          <div className="w-32 h-3 bg-gray-200 rounded shimmer" />
                        </div>
                      </div>
                      <div className="w-24 h-8 bg-gray-200 rounded shimmer" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : sharedLinks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Share2" size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No shared links</h3>
                <p className="text-gray-600">Share files to see them here</p>
              </div>
            ) : (
              sharedLinks.map((link) => {
                const file = files.find(f => f.Id === link.fileId)
                return (
                  <Card key={link.Id} className="p-4 hover:shadow-float transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Link" size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{file?.name || 'Unknown File'}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{link.accessCount} accesses</span>
                            <span>•</span>
                            <span>Created {formatDate(link.createdAt)}</span>
                            {link.expiresAt && (
                              <>
                                <span>•</span>
                                <span>Expires {formatDate(link.expiresAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="success" size="sm">
                          {link.permissions}
                        </Badge>
                        <Button
                          onClick={() => handleCopyLink(link)}
                          variant="outline"
                          size="sm"
                          icon="Copy"
                        >
                          Copy Link
                        </Button>
                        <Button
                          onClick={() => handleRevokeLink(link.Id)}
                          variant="outline"
                          size="sm"
                          icon="Trash2"
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SharedFiles