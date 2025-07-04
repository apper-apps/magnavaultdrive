import { toast } from 'react-toastify'

class FileService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'file'
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
          { field: { Name: "parent_id" } }
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
          { field: { Name: "parent_id" } }
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
          { field: { Name: "parent_id" } }
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
          parent_id: fileData.parentId
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
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
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
}

export const fileService = new FileService()