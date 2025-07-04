import { toast } from 'react-toastify'

class FolderService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'folder'
  }
  
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "path" } },
          { field: { Name: "created_at" } },
          { field: { Name: "child_count" } },
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
      console.error("Error fetching folders:", error)
      toast.error("Failed to load folders")
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
          { field: { Name: "path" } },
          { field: { Name: "created_at" } },
          { field: { Name: "child_count" } },
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
      console.error(`Error fetching folder with ID ${id}:`, error)
      toast.error("Failed to load folder")
      return null
    }
  }
  
  async getByParent(parentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "path" } },
          { field: { Name: "created_at" } },
          { field: { Name: "child_count" } },
          { field: { Name: "parent_id" } }
        ],
        where: [
          {
            FieldName: "parent_id",
            Operator: "EqualTo",
            Values: [parentId]
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
      console.error("Error fetching folders by parent:", error)
      toast.error("Failed to load folders")
      return []
    }
  }
  
  async getPath(folderId) {
    try {
      const path = []
      let currentId = folderId
      
      while (currentId) {
        const folder = await this.getById(currentId)
        if (!folder) break
        
        path.unshift(folder)
        currentId = folder.parent_id
      }
      
      return path
    } catch (error) {
      console.error("Error building folder path:", error)
      return []
    }
  }
  
  async create(folderData) {
    try {
      let folderPath = `/${folderData.name}`
      if (folderData.parentId) {
        const parentFolder = await this.getById(folderData.parentId)
        if (parentFolder) {
          folderPath = `${parentFolder.path}/${folderData.name}`
        }
      }
      
      const params = {
        records: [{
          Name: folderData.name,
          Tags: folderData.tags || "",
          Owner: folderData.owner,
          path: folderPath,
          created_at: new Date().toISOString(),
          child_count: 0,
          parent_id: folderData.parentId
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
      console.error("Error creating folder:", error)
      toast.error("Failed to create folder")
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
      if (updates.path !== undefined) updateData.path = updates.path
      if (updates.child_count !== undefined) updateData.child_count = updates.child_count
      if (updates.parentId !== undefined) updateData.parent_id = updates.parentId
      
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
      console.error("Error updating folder:", error)
      toast.error("Failed to update folder")
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
      console.error("Error deleting folder:", error)
      toast.error("Failed to delete folder")
      return false
    }
  }
}

export const folderService = new FolderService()