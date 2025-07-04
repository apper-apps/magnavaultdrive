import filesData from '@/services/mockData/files.json'

class FileService {
  constructor() {
    this.files = [...filesData]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.files]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const file = this.files.find(f => f.Id === id)
    if (!file) {
      throw new Error('File not found')
    }
    return { ...file }
  }
  
  async getByFolder(folderId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.files.filter(f => f.parentId === folderId)
  }
  
  async create(fileData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newFile = {
      Id: Math.max(...this.files.map(f => f.Id)) + 1,
      ...fileData,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }
    
    this.files.push(newFile)
    return { ...newFile }
  }
  
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.files.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error('File not found')
    }
    
    this.files[index] = {
      ...this.files[index],
      ...updates,
      modifiedAt: new Date().toISOString()
    }
    
    return { ...this.files[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.files.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error('File not found')
    }
    
    this.files.splice(index, 1)
    return true
  }
}

export const fileService = new FileService()