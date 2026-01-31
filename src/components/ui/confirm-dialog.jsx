import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './button';

/**
 * ConfirmDialog Component
 * Destructive action confirmation with warning
 */
export function ConfirmDialog({ 
  isOpen, 
  title = 'Confirm Action', 
  description, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm, 
  onCancel 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onCancel}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {isDestructive && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <h2 className={`text-lg font-semibold ${
                    isDestructive 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              {description && (
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 justify-end">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  variant={isDestructive ? 'destructive' : 'default'}
                >
                  {isLoading ? 'Processing...' : confirmText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
