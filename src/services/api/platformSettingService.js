import { toast } from 'react-toastify'

class PlatformSettingService {
  constructor() {
    this.tableName = 'platform_setting'
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
          { field: { Name: "value" } },
          { field: { Name: "description" } },
          { field: { Name: "setting_type" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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
      console.error("Error fetching platform settings:", error)
      toast.error("Failed to fetch platform settings")
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
          { field: { Name: "value" } },
          { field: { Name: "description" } },
          { field: { Name: "setting_type" } }
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
      console.error(`Error fetching platform setting with ID ${id}:`, error)
      toast.error("Failed to fetch platform setting")
      return null
    }
  }

  async create(settingData) {
    try {
      const params = {
        records: [
          {
            Name: settingData.Name,
            Tags: settingData.Tags || "",
            Owner: settingData.Owner || null,
            value: settingData.value,
            description: settingData.description || "",
            setting_type: settingData.setting_type
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
          toast.success("Platform setting created successfully")
          return successfulRecords[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error creating platform setting:", error)
      toast.error("Failed to create platform setting")
      return null
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: updateData.Name,
            Tags: updateData.Tags,
            Owner: updateData.Owner,
            value: updateData.value,
            description: updateData.description,
            setting_type: updateData.setting_type
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
          toast.success("Platform setting updated successfully")
          return successfulUpdates[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error updating platform setting:", error)
      toast.error("Failed to update platform setting")
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
          toast.success("Platform setting deleted successfully")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting platform setting:", error)
      toast.error("Failed to delete platform setting")
      return false
    }
  }

  async getByType(settingType) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "description" } },
          { field: { Name: "setting_type" } }
        ],
        where: [
          {
            FieldName: "setting_type",
            Operator: "EqualTo",
            Values: [settingType]
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
      console.error(`Error fetching settings by type ${settingType}:`, error)
      toast.error("Failed to fetch settings")
      return []
    }
  }
}

const platformSettingService = new PlatformSettingService()
export default platformSettingService