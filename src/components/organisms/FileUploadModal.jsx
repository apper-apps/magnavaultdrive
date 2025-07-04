import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import FileUploadZone from '@/components/molecules/FileUploadZone'
import UploadProgress from '@/components/molecules/UploadProgress'
import { fileService } from '@/services/api/fileService'

const FileUploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploads, setUploads] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  
  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([])
      setUploads([])
      setIsUploading(false)
    }
  }, [isOpen])
  
  const handleFilesSelected = (files) => {
    setSelectedFiles(files)
  }
  
  const startUpload = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    const uploadPromises = selectedFiles.map((file, index) => {
      const uploadId = Date.now() + index
      const uploadData = {
        id: uploadId,
        fileName: file.name,
        fileSize: file.size,
        status: 'encrypting',
        progress: 0,
        errorMessage: null
      }
      
      setUploads(prev => [...prev, uploadData])
      return processFileUpload(file, uploadId)
    })
    
    try {
      await Promise.all(uploadPromises)
      onUploadComplete(selectedFiles)
      toast.success('All files uploaded successfully!')
    } catch (error) {
      toast.error('Some files failed to upload')
    } finally {
      setIsUploading(false)
    }
  }
  
  const processFileUpload = async (file, uploadId) => {
    try {
      // Simulate encryption phase
      await simulateProgress(uploadId, 'encrypting', 0, 30, 1000)
      
      // Simulate upload phase
      updateUploadStatus(uploadId, 'uploading', 30)
      await simulateProgress(uploadId, 'uploading', 30, 100, 2000)
      
      // Create file record
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        encrypted: true,
        parentId: null,
        sharedLinks: []
      }
      
      await fileService.create(fileData)
      updateUploadStatus(uploadId, 'completed', 100)
      
    } catch (error) {
      updateUploadStatus(uploadId, 'error', 0, 'Upload failed. Please try again.')
      throw error
    }
  }
  
  const simulateProgress = (uploadId, status, startProgress, endProgress, duration) => {
    return new Promise((resolve) => {
      const steps = 20
      const stepSize = (endProgress - startProgress) / steps
      const stepDuration = duration / steps
      let currentProgress = startProgress
      
      const interval = setInterval(() => {
        currentProgress += stepSize
        if (currentProgress >= endProgress) {
          currentProgress = endProgress
          clearInterval(interval)
          resolve()
        }
        updateUploadStatus(uploadId, status, currentProgress)
      }, stepDuration)
    })
  }
  
  const updateUploadStatus = (uploadId, status, progress, errorMessage = null) => {
    setUploads(prev => prev.map(upload => 
      upload.id === uploadId 
        ? { ...upload, status, progress, errorMessage }
        : upload
    ))
  }
  
  const handleRetry = (upload) => {
    const file = selectedFiles.find(f => f.name === upload.fileName)
    if (file) {
      processFileUpload(file, upload.id)
    }
  }
  
  const handleCancel = () => {
    setIsUploading(false)
    setUploads([])
    setSelectedFiles([])
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isUploading ? onClose : undefined}
        />
        
        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] mx-4 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white shadow-deep">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <ApperIcon name="Upload" size={24} />
                  Upload Files
                </h2>
                <button
                  onClick={!isUploading ? onClose : undefined}
                  disabled={isUploading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {selectedFiles.length === 0 ? (
                  <FileUploadZone
                    onFilesSelected={handleFilesSelected}
                    maxFiles={10}
                    maxFileSize={100}
                  />
                ) : (
                  <div className="space-y-4">
                    {/* Selected Files */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-3">
                        Selected Files ({selectedFiles.length})
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <ApperIcon name="File" size={20} className="text-gray-500" />
                              <div>
                                <div className="font-medium text-sm">{file.name}</div>
                                <div className="text-xs text-gray-500">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            {!isUploading && (
                              <button
                                onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <ApperIcon name="X" size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Upload Progress */}
                    {uploads.length > 0 && (
                      <UploadProgress
                        uploads={uploads}
                        onCancel={handleCancel}
                        onRetry={handleRetry}
                      />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                {selectedFiles.length > 0 && (
                  <Button
                    onClick={startUpload}
                    variant="primary"
                    icon="Upload"
                    loading={isUploading}
                    disabled={uploads.length > 0}
                  >
                    {isUploading ? 'Uploading...' : 'Start Upload'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default FileUploadModal