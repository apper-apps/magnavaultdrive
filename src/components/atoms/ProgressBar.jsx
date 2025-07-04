const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  variant = 'primary', 
  size = 'md',
  showLabel = false,
  className = '',
  ...props 
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600",
    success: "bg-gradient-to-r from-success to-green-600",
    warning: "bg-gradient-to-r from-warning to-yellow-600",
    error: "bg-gradient-to-r from-error to-red-600",
    info: "bg-gradient-to-r from-info to-cyan-600"
  }
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }
  
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]} ${className}`} {...props}>
        <div 
          className={`h-full transition-all duration-300 ease-out ${variants[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar