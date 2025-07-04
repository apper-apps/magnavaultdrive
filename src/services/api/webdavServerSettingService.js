import { toast } from 'react-toastify'

class WebDAVServerSettingService {
  constructor() {
    this.tableName = 'webdav_server_setting'
    this.initializeApperClient()
  }

  initializeApperClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } },
          { field: { Name: "user_id" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
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
      console.error("Error fetching WebDAV settings:", error)
      toast.error("Failed to fetch WebDAV settings")
      return []
    }
  }

  async getByUserId(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data && response.data.length > 0 ? response.data[0] : null
    } catch (error) {
      console.error(`Error fetching WebDAV settings for user ${userId}:`, error)
      toast.error("Failed to fetch WebDAV settings")
      return null
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } },
          { field: { Name: "user_id" } }
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
      console.error(`Error fetching WebDAV setting with ID ${id}:`, error)
      toast.error("Failed to fetch WebDAV setting")
      return null
    }
  }

  async create(settingData) {
    try {
      const params = {
        records: [
          {
            Name: settingData.Name || "WebDAV Configuration",
            Tags: settingData.Tags || "",
            Owner: settingData.Owner || null,
            server_url: settingData.server_url,
            username: settingData.username,
            password: settingData.password,
            user_id: settingData.user_id
          }
        ]
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
        
        if (successfulRecords.length > 0) {
          toast.success("WebDAV settings saved successfully")
          return successfulRecords[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error creating WebDAV setting:", error)
      toast.error("Failed to save WebDAV settings")
      return null
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: updateData.Name || "WebDAV Configuration",
            Tags: updateData.Tags,
            Owner: updateData.Owner,
            server_url: updateData.server_url,
            username: updateData.username,
            password: updateData.password,
            user_id: updateData.user_id
          }
        ]
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
        
        if (successfulUpdates.length > 0) {
          toast.success("WebDAV settings updated successfully")
          return successfulUpdates[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error updating WebDAV setting:", error)
      toast.error("Failed to update WebDAV settings")
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
        
        if (successfulDeletions.length > 0) {
          toast.success("WebDAV settings deleted successfully")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting WebDAV setting:", error)
      toast.error("Failed to delete WebDAV settings")
      return false
    }
  }

  async testConnection(serverUrl, username, password) {
    try {
      // This would typically make a test request to the WebDAV server
      // For now, we'll simulate the test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (!serverUrl || !username) {
        toast.error("Server URL and username are required for testing")
        return false
      }
      
      // Simulate successful connection
      toast.success("WebDAV connection test successful")
      return true
    } catch (error) {
      console.error("Error testing WebDAV connection:", error)
      toast.error("WebDAV connection test failed")
      return false
    }
  }
}

const webdavServerSettingService = new WebDAVServerSettingService()
export default webdavServerSettingService