import sharedLinksData from '@/services/mockData/sharedLinks.json'

class SharedLinkService {
  constructor() {
    this.sharedLinks = [...sharedLinksData]
  }
  
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.sharedLinks]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const link = this.sharedLinks.find(l => l.Id === id)
    if (!link) {
      throw new Error('Shared link not found')
    }
    return { ...link }
  }
  
  async getByFileId(fileId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.sharedLinks.filter(l => l.fileId === fileId)
  }
  
  async create(linkData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newLink = {
      Id: Math.max(...this.sharedLinks.map(l => l.Id)) + 1,
      ...linkData,
      url: `https://vault.example.com/share/${Math.random().toString(36).substr(2, 12)}`,
      accessCount: 0,
      createdAt: new Date().toISOString()
    }
    
    this.sharedLinks.push(newLink)
    return { ...newLink }
  }
  
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.sharedLinks.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Shared link not found')
    }
    
    this.sharedLinks[index] = {
      ...this.sharedLinks[index],
      ...updates
    }
    
    return { ...this.sharedLinks[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.sharedLinks.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Shared link not found')
    }
    
    this.sharedLinks.splice(index, 1)
    return true
  }
}

export const sharedLinkService = new SharedLinkService()