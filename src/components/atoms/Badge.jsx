import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  icon, 
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-success/10 to-green-600/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-600/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-600/10 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-cyan-600/10 text-info border border-info/20",
    encrypted: "bg-gradient-to-r from-success to-green-600 text-white shadow-lg"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2"
  }
  
  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16
  }
  
  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={iconSize[size]} />}
      {children}
    </span>
  )
}

export default Badge