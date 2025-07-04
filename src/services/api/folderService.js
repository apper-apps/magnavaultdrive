import foldersData from '@/services/mockData/folders.json'

class FolderService {
  constructor() {
    this.folders = [...foldersData]
  }
  
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.folders]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const folder = this.folders.find(f => f.Id === id)
    if (!folder) {
      throw new Error('Folder not found')
    }
    return { ...folder }
  }
  
  async getByParent(parentId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.folders.filter(f => f.parentId === parentId)
  }
  
  async getPath(folderId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const path = []
    let currentId = folderId
    
    while (currentId) {
      const folder = this.folders.find(f => f.Id === currentId)
      if (!folder) break
      
      path.unshift(folder)
      currentId = folder.parentId
    }
    
    return path
  }
  
  async create(folderData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newFolder = {
      Id: Math.max(...this.folders.map(f => f.Id)) + 1,
      ...folderData,
      path: folderData.parentId 
        ? `${this.folders.find(f => f.Id === folderData.parentId)?.path}/${folderData.name}`
        : `/${folderData.name}`,
      createdAt: new Date().toISOString(),
      childCount: 0
    }
    
    this.folders.push(newFolder)
    return { ...newFolder }
  }
  
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.folders.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error('Folder not found')
    }
    
    this.folders[index] = {
      ...this.folders[index],
      ...updates
    }
    
    return { ...this.folders[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.folders.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error('Folder not found')
    }
    
    this.folders.splice(index, 1)
    return true
  }
}

export const folderService = new FolderService()