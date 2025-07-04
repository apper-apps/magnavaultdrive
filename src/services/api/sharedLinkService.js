import { toast } from 'react-toastify'

class SharedLinkService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'shared_link'
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "file_id" } },
          { field: { Name: "url" } },
          { field: { Name: "expires_at" } },
          { field: { Name: "access_count" } },
          { field: { Name: "permissions" } },
          { field: { Name: "created_at" } }
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
      console.error("Error fetching shared links:", error)
      toast.error("Failed to load shared links")
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
          { field: { Name: "file_id" } },
          { field: { Name: "url" } },
          { field: { Name: "expires_at" } },
          { field: { Name: "access_count" } },
          { field: { Name: "permissions" } },
          { field: { Name: "created_at" } }
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
      console.error(`Error fetching shared link with ID ${id}:`, error)
      toast.error("Failed to load shared link")
      return null
    }
  }
  
  async getByFileId(fileId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "file_id" } },
          { field: { Name: "url" } },
          { field: { Name: "expires_at" } },
          { field: { Name: "access_count" } },
          { field: { Name: "permissions" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "file_id",
            Operator: "EqualTo",
            Values: [fileId]
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
      console.error("Error fetching shared links by file ID:", error)
      toast.error("Failed to load shared links")
      return []
    }
  }
  
  async create(linkData) {
    try {
      const params = {
        records: [{
          Name: linkData.name || "Shared Link",
          Tags: linkData.tags || "",
          Owner: linkData.owner,
          file_id: linkData.fileId,
          url: linkData.url || `https://vault.example.com/share/${Math.random().toString(36).substr(2, 12)}`,
          expires_at: linkData.expiresAt,
          access_count: 0,
          permissions: linkData.permissions || "read",
          created_at: new Date().toISOString()
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
      console.error("Error creating shared link:", error)
      toast.error("Failed to create shared link")
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
      if (updates.fileId !== undefined) updateData.file_id = updates.fileId
      if (updates.url !== undefined) updateData.url = updates.url
      if (updates.expiresAt !== undefined) updateData.expires_at = updates.expiresAt
      if (updates.accessCount !== undefined) updateData.access_count = updates.accessCount
      if (updates.permissions !== undefined) updateData.permissions = updates.permissions
      
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
      console.error("Error updating shared link:", error)
      toast.error("Failed to update shared link")
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
      console.error("Error deleting shared link:", error)
      toast.error("Failed to delete shared link")
      return false
    }
  }
}

export const sharedLinkService = new SharedLinkService()