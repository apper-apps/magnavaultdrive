import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default', 
  hover = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "rounded-lg transition-all duration-200"
  
  const variants = {
    default: "bg-white border border-gray-200 shadow-card",
    elevated: "bg-white shadow-float",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-card",
    outlined: "bg-white border-2 border-gray-200"
  }
  
  const hoverClasses = hover ? "hover:shadow-float hover:scale-[1.02] cursor-pointer" : ""
  
  const CardComponent = onClick ? motion.div : 'div'
  
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    onClick
  } : {}
  
  return (
    <CardComponent
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  )
}

export default Card