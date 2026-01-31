import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { Button } from './button';

/**
 * SuccessModal Component
 * Shows success state with optional action buttons
 */
export function SuccessModal({ 
  isOpen, 
  title = 'Success!', 
  description,
  icon: Icon = CheckCircle,
  actions = [], // Array of { label: string, onClick: function, variant?: string }
  onClose 
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Body */}
              <div className="flex flex-col items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <Icon className="w-16 h-16 text-green-500 mb-4" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                  {title}
                </h2>

                {description && (
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    {description}
                  </p>
                )}

                {/* Actions */}
                {actions.length > 0 && (
                  <div className="flex flex-col gap-3 w-full">
                    {actions.map((action, idx) => (
                      <Button
                        key={idx}
                        onClick={action.onClick}
                        variant={action.variant || 'default'}
                        className="w-full"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}

                {actions.length === 0 && (
                  <Button onClick={onClose} className="w-full">
                    Close
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
