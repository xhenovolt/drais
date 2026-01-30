'use client';

import { motion } from 'framer-motion';
import { BarChart3, BookOpen, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsEmptyState() {
  const steps = [
    {
      icon: BookOpen,
      title: 'Enter Academic Results',
      description: 'Record exam scores and grades for all students',
      link: '/exams/results-entry'
    },
    {
      icon: Clock,
      title: 'Track Student Attendance',
      description: 'Maintain daily attendance records for accurate reporting',
      link: '/attendance'
    },
    {
      icon: TrendingUp,
      title: 'Generate Reports',
      description: 'Reports are automatically generated from your actual academic data',
      link: '/reports'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-800 shadow-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Reports Generated Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Academic and operational reports are generated from your actual school data only. 
            Reports will appear here once you have entered student results and attendance records.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
          >
            Enter First Result
          </Button>
          <Button variant="outline" className="dark:border-gray-700">
            View Documentation
          </Button>
        </div>

        {/* Data Integrity Message */}
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">
            <strong>✓ Reports Are Real:</strong> Every report shown here is automatically generated 
            from your actual student data. No predictions, no placeholders, just facts from your database.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
