import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-primary shadow-lg",
    secondary: "bg-gradient-to-r from-secondary to-indigo-600 text-white hover:from-indigo-700 hover:to-indigo-800 focus:ring-secondary shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-700 hover:to-green-800 focus:ring-success shadow-lg",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-700 hover:to-red-800 focus:ring-error shadow-lg"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-md gap-2",
    lg: "px-6 py-3 text-base rounded-lg gap-2"
  }
  
  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize[size]} 
          className="animate-spin" 
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
    </motion.button>
  )
}

export default Button