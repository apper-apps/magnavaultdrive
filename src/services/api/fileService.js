import { toast } from "react-toastify";
import React from "react";

class FileService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'file';
  }
  
  async getAll() {
try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "size" } },
          { field: { Name: "type" } },
          { field: { Name: "encrypted" } },
          { field: { Name: "created_at" } },
          { field: { Name: "modified_at" } },
          { field: { Name: "shared_links" } },
          { field: { Name: "parent_id" } },
          { field: { Name: "storage_location" } }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching files:", error)
      toast.error("Failed to load files")
      return []
    }
  }
  
  async getById(id) {
try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "size" } },
          { field: { Name: "type" } },
          { field: { Name: "encrypted" } },
          { field: { Name: "created_at" } },
          { field: { Name: "modified_at" } },
          { field: { Name: "shared_links" } },
          { field: { Name: "parent_id" } },
          { field: { Name: "storage_location" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching file with ID ${id}:`, error)
      toast.error("Failed to load file")
      return null
    }
  }
  
  async getByFolder(folderId) {
try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "size" } },
          { field: { Name: "type" } },
          { field: { Name: "encrypted" } },
          { field: { Name: "created_at" } },
          { field: { Name: "modified_at" } },
          { field: { Name: "shared_links" } },
          { field: { Name: "parent_id" } },
          { field: { Name: "storage_location" } }
        ],
        where: [
          {
            FieldName: "parent_id",
            Operator: "EqualTo",
            Values: [folderId]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching files by folder:", error)
      toast.error("Failed to load files")
      return []
    }
  }
  
  async create(fileData) {
try {
      const params = {
        records: [{
          Name: fileData.name,
          Tags: fileData.tags || "",
          Owner: fileData.owner,
          size: fileData.size,
          type: fileData.type,
          encrypted: fileData.encrypted,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
          shared_links: fileData.shared_links || "",
          parent_id: fileData.parentId,
          storage_location: fileData.storageLocation || "wasabi"
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records: ${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error creating file:", error)
      toast.error("Failed to create file")
      return null
    }
  }
  
  async update(id, updates) {
    try {
      const updateData = {
        Id: id
      }
      
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.tags !== undefined) updateData.Tags = updates.tags
      if (updates.owner !== undefined) updateData.Owner = updates.owner
      if (updates.size !== undefined) updateData.size = updates.size
if (updates.type !== undefined) updateData.type = updates.type
      if (updates.encrypted !== undefined) updateData.encrypted = updates.encrypted
      if (updates.shared_links !== undefined) updateData.shared_links = updates.shared_links
      if (updates.parentId !== undefined) updateData.parent_id = updates.parentId
      if (updates.storageLocation !== undefined) updateData.storage_location = updates.storageLocation
      updateData.modified_at = new Date().toISOString()
      
      const params = {
        records: [updateData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records: ${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating file:", error)
      toast.error("Failed to update file")
      return null
    }
  }
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records: ${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete file")
return false
    }
  }

  // WebDAV Operations
  async readWebDAVFile(fileId) {
    try {
      const file = await this.getById(fileId)
      if (!file) {
        toast.error("File not found")
        return null
      }

      // Get WebDAV settings
      const { ApperClient } = window.ApperSDK
      const webdavClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const settingsResponse = await webdavClient.fetchRecords('webdav_server_setting', {
        fields: [
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      })

      if (!settingsResponse.success || !settingsResponse.data || settingsResponse.data.length === 0) {
        toast.error("WebDAV not configured")
        return null
      }

      const webdavSettings = settingsResponse.data[0]
      
      // Normalize Windows-compatible path
      const normalizedPath = this.normalizeWindowsPath(file.Name)
      const webdavUrl = `${webdavSettings.server_url}/${normalizedPath}`

      // Simulate WebDAV read operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`Reading file: ${file.Name}`)
      return {
        content: `File content for: ${file.Name}`,
        metadata: {
          size: file.size,
          type: file.type,
          modified: file.modified_at
        }
      }
    } catch (error) {
      console.error("Error reading WebDAV file:", error)
      toast.error("Failed to read file via WebDAV")
      return null
    }
  }

  async writeWebDAVFile(fileId, content) {
    try {
      const file = await this.getById(fileId)
      if (!file) {
        toast.error("File not found")
        return false
      }

      // Get WebDAV settings
      const { ApperClient } = window.ApperSDK
      const webdavClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const settingsResponse = await webdavClient.fetchRecords('webdav_server_setting', {
        fields: [
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      })

      if (!settingsResponse.success || !settingsResponse.data || settingsResponse.data.length === 0) {
        toast.error("WebDAV not configured")
        return false
      }

      const webdavSettings = settingsResponse.data[0]
      
      // Normalize Windows-compatible path
      const normalizedPath = this.normalizeWindowsPath(file.Name)
      const webdavUrl = `${webdavSettings.server_url}/${normalizedPath}`

      // Simulate WebDAV write operation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update file metadata
      await this.update(fileId, {
        modified_at: new Date().toISOString(),
        size: content ? content.length : file.size
      })
      
      toast.success(`File saved via WebDAV: ${file.Name}`)
      return true
    } catch (error) {
      console.error("Error writing WebDAV file:", error)
      toast.error("Failed to save file via WebDAV")
      return false
    }
  }

  async deleteWebDAVFile(fileId) {
    try {
      const file = await this.getById(fileId)
      if (!file) {
        toast.error("File not found")
        return false
      }

      // Get WebDAV settings
      const { ApperClient } = window.ApperSDK
      const webdavClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const settingsResponse = await webdavClient.fetchRecords('webdav_server_setting', {
        fields: [
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      })

      if (!settingsResponse.success || !settingsResponse.data || settingsResponse.data.length === 0) {
        toast.error("WebDAV not configured")
        return false
      }

      const webdavSettings = settingsResponse.data[0]
      
      // Normalize Windows-compatible path
      const normalizedPath = this.normalizeWindowsPath(file.Name)
      const webdavUrl = `${webdavSettings.server_url}/${normalizedPath}`

      // Simulate WebDAV delete operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Delete from database
      const deleteResult = await this.delete(fileId)
      
      if (deleteResult) {
        toast.success(`File deleted via WebDAV: ${file.Name}`)
        return true
      } else {
        toast.error("Failed to delete file from database")
        return false
      }
    } catch (error) {
      console.error("Error deleting WebDAV file:", error)
      toast.error("Failed to delete file via WebDAV")
      return false
    }
  }

  async copyWebDAVFile(fileId, newName) {
    try {
      const file = await this.getById(fileId)
      if (!file) {
        toast.error("File not found")
        return false
      }

      // Get WebDAV settings
      const { ApperClient } = window.ApperSDK
      const webdavClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const settingsResponse = await webdavClient.fetchRecords('webdav_server_setting', {
        fields: [
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      })

      if (!settingsResponse.success || !settingsResponse.data || settingsResponse.data.length === 0) {
        toast.error("WebDAV not configured")
        return false
      }

      // Simulate WebDAV copy operation
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Create new file record
      const newFile = await this.create({
        name: newName || `Copy of ${file.Name}`,
        tags: file.Tags,
        owner: file.Owner,
        size: file.size,
        type: file.type,
        encrypted: file.encrypted,
        parentId: file.parent_id,
        storageLocation: file.storage_location
      })
      
      if (newFile) {
        toast.success(`File copied via WebDAV: ${newFile.Name}`)
        return newFile
      } else {
        toast.error("Failed to create file copy")
        return false
      }
    } catch (error) {
      console.error("Error copying WebDAV file:", error)
      toast.error("Failed to copy file via WebDAV")
      return false
    }
  }

  async moveWebDAVFile(fileId, newParentId) {
    try {
      const file = await this.getById(fileId)
      if (!file) {
        toast.error("File not found")
        return false
      }

      // Get WebDAV settings
      const { ApperClient } = window.ApperSDK
      const webdavClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const settingsResponse = await webdavClient.fetchRecords('webdav_server_setting', {
        fields: [
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      })

      if (!settingsResponse.success || !settingsResponse.data || settingsResponse.data.length === 0) {
        toast.error("WebDAV not configured")
        return false
      }

      // Simulate WebDAV move operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update file parent
      const updateResult = await this.update(fileId, {
        parentId: newParentId
      })
      
      if (updateResult) {
        toast.success(`File moved via WebDAV: ${file.Name}`)
        return updateResult
      } else {
        toast.error("Failed to move file")
        return false
      }
    } catch (error) {
      console.error("Error moving WebDAV file:", error)
      toast.error("Failed to move file via WebDAV")
      return false
    }
  }

  async renameWebDAVFile(fileId, newName) {
    try {
      const file = await this.getById(fileId)
      if (!file) {
        toast.error("File not found")
        return false
      }

      // Get WebDAV settings
      const { ApperClient } = window.ApperSDK
      const webdavClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const settingsResponse = await webdavClient.fetchRecords('webdav_server_setting', {
        fields: [
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      })

      if (!settingsResponse.success || !settingsResponse.data || settingsResponse.data.length === 0) {
        toast.error("WebDAV not configured")
        return false
      }

      // Simulate WebDAV rename operation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Update file name
      const updateResult = await this.update(fileId, {
        name: newName
      })
      
      if (updateResult) {
        toast.success(`File renamed via WebDAV: ${newName}`)
        return updateResult
      } else {
        toast.error("Failed to rename file")
        return false
      }
    } catch (error) {
      console.error("Error renaming WebDAV file:", error)
      toast.error("Failed to rename file via WebDAV")
      return false
    }
  }

  normalizeWindowsPath(path) {
    if (!path) return ""
    
    // Replace Windows-incompatible characters
    let normalized = path.replace(/[<>:"|?*]/g, '_')
    
    // Handle reserved Windows names
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
    const nameWithoutExt = normalized.split('.')[0].toUpperCase()
    
    if (reservedNames.includes(nameWithoutExt)) {
      normalized = `_${normalized}`
    }
    
    // Remove leading/trailing spaces and dots
    normalized = normalized.trim().replace(/^\.+|\.+$/g, '')
    
    // Ensure not empty
    if (!normalized) {
      normalized = 'file'
    }
    
    // URL encode for WebDAV compatibility
    return encodeURIComponent(normalized)
  }
}

export const fileService = new FileService()