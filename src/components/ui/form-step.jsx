import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

/**
 * FormStep Component
 * Step indicator for multi-step forms
 */
export function FormStep({ 
  currentStep = 1, 
  totalSteps = 3, 
  steps = [], // Array of { number, title, description? }
}) {
  return (
    <div className="mb-8">
      {/* Step indicator bar */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;

          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold relative z-10 mb-2 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </motion.div>

              {/* Step label */}
              <div className="text-center">
                <p className={`text-sm font-semibold ${
                  isCurrent
                    ? 'text-blue-600 dark:text-blue-400'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-1 ${
                  isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                  style={{
                    width: 'calc(100% - 2rem)',
                    left: 'calc(50% + 1.25rem)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ type: 'spring', stiffness: 50 }}
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
        />
      </div>
    </div>
  );
}
