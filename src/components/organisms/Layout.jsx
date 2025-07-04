import { useState } from 'react'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'
import FileUploadModal from '@/components/organisms/FileUploadModal'
import { toast } from 'react-toastify'

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  
  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  const handleUpload = () => {
    setIsUploadModalOpen(true)
  }
  
  const handleSearch = (query) => {
    if (query.trim()) {
      toast.info(`Searching for: ${query}`)
    }
  }
  
  const handleUploadComplete = (files) => {
    toast.success(`${files.length} file(s) uploaded successfully`)
    setIsUploadModalOpen(false)
  }
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onUpload={handleUpload}
        onSearch={handleSearch}
        onMenuToggle={handleMenuToggle}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
      
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}

export default Layout