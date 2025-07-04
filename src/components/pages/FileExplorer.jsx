import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Breadcrumb from '@/components/molecules/Breadcrumb'
import FileGrid from '@/components/organisms/FileGrid'
import FileUploadModal from '@/components/organisms/FileUploadModal'
import { fileService } from '@/services/api/fileService'
import { folderService } from '@/services/api/folderService'

const FileExplorer = () => {
  const { folderId } = useParams()
  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [breadcrumbPath, setBreadcrumbPath] = useState([])
  
  useEffect(() => {
    loadData()
  }, [folderId])
  
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
try {
      const [filesData, foldersData] = await Promise.all([
        fileService.getByFolder(folderId),
        folderService.getByParent(folderId)
      ])
      
      setFiles(filesData)
      setFolders(foldersData)
      
// Build breadcrumb path
      if (folderId) {
        const folderPath = await folderService.getPath(folderId)
        setBreadcrumbPath(folderPath)
      } else {
        setBreadcrumbPath([])
      }
    } catch (err) {
      setError('Failed to load files and folders')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (term) => {
    setSearchTerm(term)
  }
  
  const handleUploadComplete = (uploadedFiles) => {
    setIsUploadModalOpen(false)
    loadData()
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully`)
  }
  
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    
    try {
      await folderService.create({
        name: newFolderName,
        parentId: folderId
      })
      
      setNewFolderName('')
      setIsNewFolderModalOpen(false)
      loadData()
      toast.success('Folder created successfully')
    } catch (err) {
      toast.error('Failed to create folder')
    }
  }
  
const filteredFiles = files.filter(file =>
    file.Name?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) || false
  )
  
  const filteredFolders = folders.filter(folder =>
    folder.Name?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) || false
  )
  
const sortItems = (items, type) => {
    return [...items].sort((a, b) => {
      // Safely get values with fallbacks
      let aValue = a && a[sortBy] !== undefined ? a[sortBy] : null
      let bValue = b && b[sortBy] !== undefined ? b[sortBy] : null
      
      if (sortBy === 'size' && type === 'file') {
        aValue = (a && typeof a.size === 'number') ? a.size : 0
        bValue = (b && typeof b.size === 'number') ? b.size : 0
      } else if (sortBy === 'ModifiedOn' || sortBy === 'CreatedOn' || sortBy === 'modified_at' || sortBy === 'created_at') {
        // Handle date fields with null safety
        aValue = aValue ? new Date(aValue).getTime() : 0
        bValue = bValue ? new Date(bValue).getTime() : 0
      } else {
        // Handle text fields with null safety
        aValue = aValue !== null && aValue !== undefined ? aValue.toString().toLowerCase() : ''
        bValue = bValue !== null && bValue !== undefined ? bValue.toString().toLowerCase() : ''
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }
  
  const sortedFiles = sortItems(filteredFiles, 'file')
  const sortedFolders = sortItems(filteredFolders, 'folder')
  
  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col gap-4">
          {/* Breadcrumb */}
          <Breadcrumb path={breadcrumbPath} />
          
          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                variant="primary"
                icon="Upload"
                size="md"
              >
                Upload
              </Button>
              <Button
                onClick={() => setIsNewFolderModalOpen(true)}
                variant="outline"
                icon="FolderPlus"
                size="md"
              >
                New Folder
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon="Search"
                  className="w-64"
                />
              </div>
              
              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
<option value="Name-asc">Name (A-Z)</option>
                <option value="Name-desc">Name (Z-A)</option>
                <option value="ModifiedOn-desc">Modified (Newest)</option>
                <option value="ModifiedOn-asc">Modified (Oldest)</option>
                <option value="size-desc">Size (Largest)</option>
                <option value="size-asc">Size (Smallest)</option>
              </select>
              
              {/* View Mode */}
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
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <FileGrid
          files={sortedFiles}
          folders={sortedFolders}
          loading={loading}
          error={error}
          onRefresh={loadData}
          onUpload={() => setIsUploadModalOpen(true)}
          viewMode={viewMode}
        />
      </div>
      
      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
      
      {/* New Folder Modal */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsNewFolderModalOpen(false)} />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <Input
              label="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsNewFolderModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                variant="primary"
                disabled={!newFolderName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default FileExplorer