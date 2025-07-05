import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FileCard from "@/components/molecules/FileCard";
import ContextMenu from "@/components/molecules/ContextMenu";
import FolderCard from "@/components/molecules/FolderCard";
import { fileService } from "@/services/api/fileService";

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
      onClick: async () => {
        if (contextMenu.item?.Id) {
          toast.info(`Downloading ${contextMenu.item?.Name}...`)
          const result = await fileService.readWebDAVFile(contextMenu.item.Id)
          if (result) {
            // Create download link
            const blob = new Blob([result.content], { type: contextMenu.item.type || 'application/octet-stream' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = contextMenu.item.Name
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
          }
        }
        closeContextMenu()
      }
    },
    {
      icon: 'Share2',
      label: 'Share',
      onClick: () => {
        toast.info(`Sharing ${contextMenu.item?.Name}`)
        // TODO: Implement sharing functionality
        closeContextMenu()
      }
    },
    {
      icon: 'Edit',
      label: 'Rename',
      onClick: async () => {
        const newName = prompt('Enter new name:', contextMenu.item?.Name)
        if (newName && newName.trim() && contextMenu.item?.Id) {
          await fileService.renameWebDAVFile(contextMenu.item.Id, newName.trim())
          onRefresh()
        }
        closeContextMenu()
      }
    },
    {
      icon: 'Copy',
      label: 'Copy',
      onClick: async () => {
        if (contextMenu.item?.Id) {
          await fileService.copyWebDAVFile(contextMenu.item.Id)
          onRefresh()
        }
        closeContextMenu()
      }
    },
    {
      icon: 'Move',
      label: 'Move',
      onClick: () => {
        toast.info(`Moving ${contextMenu.item?.Name}`)
        // TODO: Implement move to folder functionality
        closeContextMenu()
      }
    },
    { type: 'divider' },
    {
      icon: 'Trash2',
      label: 'Delete',
      onClick: async () => {
        if (contextMenu.item?.Id && confirm(`Are you sure you want to delete "${contextMenu.item?.Name}"?`)) {
          const result = await fileService.deleteWebDAVFile(contextMenu.item.Id)
          if (result) {
            onRefresh()
          }
        }
        closeContextMenu()
      },
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
                onClick={async () => {
                  toast.info(`Downloading ${selectedItems.length} selected files...`)
                  for (const item of selectedItems) {
                    if (item.Id) {
                      const result = await fileService.readWebDAVFile(item.Id)
                      if (result) {
                        const blob = new Blob([result.content], { type: item.type || 'application/octet-stream' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = item.Name
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                      }
                    }
                  }
                  setSelectedItems([])
                }}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Share2"
                onClick={() => {
                  toast.info(`Sharing ${selectedItems.length} selected files`)
                  // TODO: Implement bulk sharing functionality
                }}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Trash2"
                onClick={async () => {
                  if (confirm(`Are you sure you want to delete ${selectedItems.length} selected files?`)) {
                    toast.info(`Deleting ${selectedItems.length} selected files...`)
                    let deletedCount = 0
                    for (const item of selectedItems) {
                      if (item.Id) {
                        const result = await fileService.deleteWebDAVFile(item.Id)
                        if (result) deletedCount++
                      }
                    }
                    toast.success(`${deletedCount} files deleted successfully`)
                    setSelectedItems([])
                    onRefresh()
                  }
                }}
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