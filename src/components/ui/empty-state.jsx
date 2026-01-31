import { motion } from 'framer-motion';

/**
 * EmptyState Component
 * Shows when there's no data to display
 */
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        {Icon && <Icon className="w-16 h-16 mx-auto opacity-40" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm text-center">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </motion.div>
  );
}
