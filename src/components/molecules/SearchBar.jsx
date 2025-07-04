import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import AppIcon from "@/components/atoms/AppIcon";
const SearchBar = ({ onSearch, placeholder = "Search files and folders...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("")
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }
  
  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="Search"
          iconPosition="left"
          className="pr-10"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <AppIcon name="X" size={20} />
          </button>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        icon="Search"
        disabled={!searchTerm.trim()}
      >
        Search
      </Button>
    </motion.form>
  )
}

export default SearchBar