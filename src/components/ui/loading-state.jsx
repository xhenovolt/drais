import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

/**
 * LoadingState Component
 * Shows loading indicator with optional message
 */
export function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader className={`${sizeClasses[size]} text-blue-500`} />
      </motion.div>
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}
