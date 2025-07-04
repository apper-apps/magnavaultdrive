import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import StorageIndicator from '@/components/molecules/StorageIndicator'

const Header = ({ 
  onUpload, 
  onSearch, 
  onMenuToggle,
  className = "" 
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  
  return (
    <motion.header
      className={`bg-white border-b border-gray-200 px-4 py-4 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onMenuToggle}
            variant="ghost"
            size="md"
            icon="Menu"
            className="lg:hidden"
          />
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              VaultDrive
            </h1>
          </div>
        </div>
        
        {/* Center Section - Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search files and folders..."
          />
        </div>
        
        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <Button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            variant="ghost"
            size="md"
            icon="Search"
            className="md:hidden"
          />
          
          {/* Upload Button */}
          <Button
            onClick={onUpload}
            variant="primary"
            size="md"
            icon="Plus"
            className="hidden sm:inline-flex"
          >
            Upload
          </Button>
          
          <Button
            onClick={onUpload}
            variant="primary"
            size="md"
            icon="Plus"
            className="sm:hidden"
          />
          
          {/* Profile Menu */}
          <Button
            variant="ghost"
            size="md"
            icon="Settings"
            className="hidden lg:inline-flex"
          >
            Settings
          </Button>
        </div>
      </div>
      
      {/* Mobile Search Expanded */}
      {isSearchExpanded && (
        <motion.div
          className="mt-4 md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SearchBar
            onSearch={onSearch}
            placeholder="Search files and folders..."
          />
        </motion.div>
      )}
      
      {/* Storage Indicator - Mobile */}
      <div className="mt-4 lg:hidden">
        <StorageIndicator used={45.2} total={100} />
      </div>
    </motion.header>
  )
}

export default Header