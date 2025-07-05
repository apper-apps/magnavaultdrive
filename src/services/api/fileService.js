import { toast } from "react-toastify";
import React from "react";
import { createClient } from "webdav";
import Error from "@/components/ui/Error";

class FileService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'file';
    this.webdavClient = null;
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
  async getWebDAVClient() {
    if (this.webdavClient) {
      return this.webdavClient;
    }

    try {
      const { ApperClient } = window.ApperSDK;
      const webdavApperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const settingsResponse = await webdavApperClient.fetchRecords('webdav_server_setting', {
        fields: [
          { field: { Name: "server_url" } },
          { field: { Name: "username" } },
          { field: { Name: "password" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!settingsResponse.success || !settingsResponse.data || settingsResponse.data.length === 0) {
        throw new Error("WebDAV not configured");
      }

      const webdavSettings = settingsResponse.data[0];
      
      this.webdavClient = createClient(
        webdavSettings.server_url,
        {
          username: webdavSettings.username,
          password: webdavSettings.password,
          maxContentLength: 1000000000, // 1GB
          maxBodyLength: 1000000000
        }
      );

      return this.webdavClient;
    } catch (error) {
      console.error("Error creating WebDAV client:", error);
      throw error;
    }
  }

  async testWebDAVConnection() {
    try {
      const client = await this.getWebDAVClient();
      
      // Test connection by getting directory contents
      await client.getDirectoryContents("/");
      return true;
    } catch (error) {
      console.error("WebDAV connection test failed:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed - invalid credentials");
      } else if (error.status === 404) {
        toast.error("WebDAV server not found - check server URL");
      } else if (error.status === 200 && error.message?.includes('Not a valid DAV response')) {
        toast.error("Server returned invalid WebDAV response - ensure WebDAV is enabled");
      } else {
        toast.error(`WebDAV connection failed: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  }

  async listWebDAVDirectory(path = "/") {
    try {
      const client = await this.getWebDAVClient();
      
      const contents = await client.getDirectoryContents(path, {
        details: true,
        includeSelf: false
      });

      return contents.map(item => ({
        name: item.filename.split('/').pop(),
        path: item.filename,
        type: item.type, // 'file' or 'directory'
        size: item.size || 0,
        lastmod: item.lastmod,
        etag: item.etag,
        contentType: item.mime || 'application/octet-stream'
      }));
    } catch (error) {
      console.error("Error listing WebDAV directory:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed");
      } else if (error.status === 404) {
        toast.error("Directory not found");
      } else {
        toast.error(`Failed to list directory: ${error.message || 'Unknown error'}`);
      }
      throw error;
    }
  }

  async readWebDAVFile(fileId) {
    try {
      const file = await this.getById(fileId);
      if (!file) {
        toast.error("File not found");
        return null;
      }

      const client = await this.getWebDAVClient();
      
      // Normalize Windows-compatible path
      const normalizedPath = this.normalizeWindowsPath(file.Name);
      
      // Read file content as buffer
      const content = await client.getFileContents(normalizedPath, { format: "binary" });
      
      toast.success(`File read successfully: ${file.Name}`);
      return {
        content: content,
        metadata: {
          size: file.size,
          type: file.type,
          modified: file.modified_at,
          name: file.Name
        }
      };
    } catch (error) {
      console.error("Error reading WebDAV file:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed");
      } else if (error.status === 404) {
        toast.error("File not found on WebDAV server");
      } else {
        toast.error(`Failed to read file: ${error.message || 'Unknown error'}`);
      }
      return null;
    }
  }
async writeWebDAVFile(fileId, content) {
    try {
      const file = await this.getById(fileId);
      if (!file) {
        toast.error("File not found");
        return false;
      }

      const client = await this.getWebDAVClient();
      
      // Normalize Windows-compatible path
      const normalizedPath = this.normalizeWindowsPath(file.Name);
      
      // Write file content to WebDAV server
      await client.putFileContents(normalizedPath, content, {
        overwrite: true,
        contentType: file.type || 'application/octet-stream'
      });
      
// Update file metadata in database
      const contentSize = content instanceof ArrayBuffer ? content.byteLength : 
                         typeof content === 'string' ? new TextEncoder().encode(content).length : 0;
      await this.update(fileId, {
        modified_at: new Date().toISOString(),
        size: contentSize
      });
      
      toast.success(`File saved successfully: ${file.Name}`);
      return true;
    } catch (error) {
      console.error("Error writing WebDAV file:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed");
      } else if (error.status === 403) {
        toast.error("Permission denied - cannot write to WebDAV server");
      } else if (error.status === 507) {
        toast.error("Insufficient storage space on WebDAV server");
      } else {
        toast.error(`Failed to save file: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  }
async deleteWebDAVFile(fileId) {
    try {
      const file = await this.getById(fileId);
      if (!file) {
        toast.error("File not found");
        return false;
      }

      const client = await this.getWebDAVClient();
      
      // Normalize Windows-compatible path
      const normalizedPath = this.normalizeWindowsPath(file.Name);
      
      // Delete file from WebDAV server
      await client.deleteFile(normalizedPath);
      
      // Delete from database
      const deleteResult = await this.delete(fileId);
      
      if (deleteResult) {
        toast.success(`File deleted successfully: ${file.Name}`);
        return true;
      } else {
        toast.error("Failed to delete file from database");
        return false;
      }
    } catch (error) {
      console.error("Error deleting WebDAV file:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed");
      } else if (error.status === 403) {
        toast.error("Permission denied - cannot delete file");
      } else if (error.status === 404) {
        toast.error("File not found on WebDAV server");
      } else {
        toast.error(`Failed to delete file: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  }
async copyWebDAVFile(fileId, newName) {
    try {
      const file = await this.getById(fileId);
      if (!file) {
        toast.error("File not found");
        return false;
      }

      const client = await this.getWebDAVClient();
      
      // Normalize paths
      const sourcePath = this.normalizeWindowsPath(file.Name);
      const targetName = newName || `Copy of ${file.Name}`;
      const targetPath = this.normalizeWindowsPath(targetName);
      
      // Copy file on WebDAV server
      await client.copyFile(sourcePath, targetPath);
      
      // Create new file record in database
      const newFile = await this.create({
        Name: targetName,
        Tags: file.Tags,
        Owner: file.Owner,
        size: file.size,
        type: file.type,
        encrypted: file.encrypted,
        parent_id: file.parent_id,
        storage_location: file.storage_location,
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString()
      });
      
      if (newFile) {
        toast.success(`File copied successfully: ${targetName}`);
        return newFile;
      } else {
        toast.error("Failed to create file copy in database");
        return false;
      }
    } catch (error) {
      console.error("Error copying WebDAV file:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed");
      } else if (error.status === 403) {
        toast.error("Permission denied - cannot copy file");
      } else if (error.status === 404) {
        toast.error("Source file not found on WebDAV server");
      } else if (error.status === 409) {
        toast.error("File already exists at destination");
      } else {
        toast.error(`Failed to copy file: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  }
async moveWebDAVFile(fileId, newParentId) {
    try {
      const file = await this.getById(fileId);
      if (!file) {
        toast.error("File not found");
        return false;
      }

      const client = await this.getWebDAVClient();
      
      // Get target folder path if moving to a specific folder
      let targetPath = this.normalizeWindowsPath(file.Name);
      if (newParentId) {
        // Get parent folder to determine new path structure
        const { ApperClient } = window.ApperSDK;
        const folderClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        const parentResponse = await folderClient.getRecordById('folder', newParentId, {
          fields: [{ field: { Name: "path" } }]
        });
        
        if (parentResponse.success && parentResponse.data) {
          targetPath = `${parentResponse.data.path}/${file.Name}`;
        }
      }
      
      const sourcePath = this.normalizeWindowsPath(file.Name);
      
      // Move file on WebDAV server
      await client.moveFile(sourcePath, targetPath);
      
      // Update file parent in database
      const updateResult = await this.update(fileId, {
        parent_id: newParentId
      });
      
      if (updateResult) {
        toast.success(`File moved successfully: ${file.Name}`);
        return updateResult;
      } else {
        toast.error("Failed to update file location in database");
        return false;
      }
    } catch (error) {
      console.error("Error moving WebDAV file:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed");
      } else if (error.status === 403) {
        toast.error("Permission denied - cannot move file");
      } else if (error.status === 404) {
        toast.error("Source file not found on WebDAV server");
      } else if (error.status === 409) {
        toast.error("File already exists at destination");
      } else {
        toast.error(`Failed to move file: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  }
async renameWebDAVFile(fileId, newName) {
    try {
      const file = await this.getById(fileId);
      if (!file) {
        toast.error("File not found");
        return false;
      }

      const client = await this.getWebDAVClient();
      
      // Normalize paths
      const sourcePath = this.normalizeWindowsPath(file.Name);
      const targetPath = this.normalizeWindowsPath(newName);
      
      // Rename (move) file on WebDAV server
      await client.moveFile(sourcePath, targetPath);
      
      // Update file name in database
      const updateResult = await this.update(fileId, {
        Name: newName
      });
      
      if (updateResult) {
        toast.success(`File renamed successfully: ${newName}`);
        return updateResult;
      } else {
        toast.error("Failed to update file name in database");
        return false;
      }
    } catch (error) {
      console.error("Error renaming WebDAV file:", error);
      if (error.status === 401) {
        toast.error("WebDAV authentication failed");
      } else if (error.status === 403) {
        toast.error("Permission denied - cannot rename file");
      } else if (error.status === 404) {
        toast.error("File not found on WebDAV server");
      } else if (error.status === 409) {
        toast.error("File with new name already exists");
      } else {
        toast.error(`Failed to rename file: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  }

  // Enhanced Windows path normalization for WebDAV URLs
  normalizeWindowsPath(path) {
    if (!path) return '';
    
    // Remove invalid characters for URLs
    let normalized = path.replace(/[<>:"|?*]/g, '_');
    
    // Replace backslashes with forward slashes
    normalized = normalized.replace(/\\/g, '/');
    
    // Remove leading/trailing slashes
    normalized = normalized.replace(/^\/+|\/+$/g, '');
    
    // Encode special characters for URL
    normalized = encodeURIComponent(normalized);
    
    return normalized;
  }

}

export const fileService = new FileService()