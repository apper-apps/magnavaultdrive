import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Breadcrumb = ({ path = [], className = "" }) => {
  return (
    <motion.nav
      className={`breadcrumb ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to="/" className="breadcrumb-item">
        <ApperIcon name="Home" size={16} />
        <span>My Files</span>
      </Link>
      
      {path.map((item, index) => (
        <div key={item.Id} className="flex items-center gap-2">
          <ApperIcon name="ChevronRight" size={14} className="breadcrumb-separator" />
          {index === path.length - 1 ? (
            <span className="breadcrumb-item current">
              {item.name}
            </span>
          ) : (
            <Link to={`/folder/${item.Id}`} className="breadcrumb-item">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </motion.nav>
  )
}

export default Breadcrumb