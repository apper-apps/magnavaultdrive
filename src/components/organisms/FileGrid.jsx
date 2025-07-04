import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import FileCard from '@/components/molecules/FileCard'
import FolderCard from '@/components/molecules/FolderCard'
import ContextMenu from '@/components/molecules/ContextMenu'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const FileGrid = ({ 
  files = [], 
  folders = [], 
  loading = false, 
  error = null, 
  onRefresh,
  onUpload,
  viewMode = 'grid',
  className = "" 
}) => {
  const [selectedItems, setSelectedItems] = useState([])
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, item: null })
  const navigate = useNavigate()
  
  const handleItemSelect = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.Id === item.Id)
      if (isSelected) {
        return prev.filter(selected => selected.Id !== item.Id)
      } else {
        return [...prev, item]
      }
    })
  }
  
  const handleFolderDoubleClick = (folder) => {
    navigate(`/folder/${folder.Id}`)
  }
  
  const handleFileDoubleClick = (file) => {
    toast.info(`Opening ${file.name}`)
    // In a real app, this would open a file preview
  }
  
  const handleContextMenu = (e, item) => {
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      item
    })
  }
  
  const closeContextMenu = () => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, item: null })
  }
  
  const contextMenuItems = [
    {
      icon: 'Download',
      label: 'Download',
      onClick: () => toast.info(`Downloading ${contextMenu.item?.name}`)
    },
    {
      icon: 'Share2',
      label: 'Share',
      onClick: () => toast.info(`Sharing ${contextMenu.item?.name}`)
    },
    {
      icon: 'Edit',
      label: 'Rename',
      onClick: () => toast.info(`Renaming ${contextMenu.item?.name}`)
    },
    {
      icon: 'Copy',
      label: 'Copy',
      onClick: () => toast.info(`Copying ${contextMenu.item?.name}`)
    },
    {
      icon: 'Move',
      label: 'Move',
      onClick: () => toast.info(`Moving ${contextMenu.item?.name}`)
    },
    { type: 'divider' },
    {
      icon: 'Trash2',
      label: 'Delete',
      onClick: () => toast.info(`Deleting ${contextMenu.item?.name}`),
      danger: true
    }
  ]
  
  const handleSelectAll = () => {
    const allItems = [...folders, ...files]
    setSelectedItems(allItems)
  }
  
  const handleDeselectAll = () => {
    setSelectedItems([])
  }
  
  if (loading) {
    return <Loading variant={viewMode} className={className} />
  }
  
  if (error) {
    return <Error message={error} onRetry={onRefresh} className={className} />
  }
  
  if (files.length === 0 && folders.length === 0) {
    return (
      <Empty
        icon="FolderOpen"
        title="No files or folders"
        description="Upload your first file or create a new folder to get started"
        actionText="Upload Files"
        onAction={onUpload}
        className={className}
      />
    )
  }
  
  return (
    <div className={`${className}`}>
      {/* Selection Actions */}
      {selectedItems.length > 0 && (
        <motion.div
          className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon="Download"
                onClick={() => toast.info('Downloading selected files')}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Share2"
                onClick={() => toast.info('Sharing selected files')}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Trash2"
                onClick={() => toast.info('Deleting selected files')}
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
              >
                Clear
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Grid/List View */}
      <div className={viewMode === 'grid' ? 'file-grid' : 'space-y-2'}>
        {/* Folders */}
        {folders.map((folder) => (
          <FolderCard
            key={folder.Id}
            folder={folder}
            onSelect={handleItemSelect}
            onDoubleClick={handleFolderDoubleClick}
            onContextMenu={handleContextMenu}
            selected={selectedItems.some(item => item.Id === folder.Id)}
          />
        ))}
        
        {/* Files */}
        {files.map((file) => (
          <FileCard
            key={file.Id}
            file={file}
            onSelect={handleItemSelect}
            onDoubleClick={handleFileDoubleClick}
            onContextMenu={handleContextMenu}
            selected={selectedItems.some(item => item.Id === file.Id)}
          />
        ))}
      </div>
      
      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        onClose={closeContextMenu}
        position={contextMenu.position}
        items={contextMenuItems}
      />
    </div>
  )
}

export default FileGrid