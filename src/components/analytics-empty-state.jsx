'use client';

import { motion } from 'framer-motion';
import { LineChart, Users, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnalyticsEmptyState() {
  const steps = [
    {
      icon: Users,
      title: 'Add Students to Your Classes',
      description: 'Register students and assign them to classes and academic streams',
      link: '/students/admission'
    },
    {
      icon: BookOpen,
      title: 'Record Academic Performance',
      description: 'Enter exam results, test scores, and continuous assessment data',
      link: '/exams/results-entry'
    },
    {
      icon: Zap,
      title: 'View Analytics & Insights',
      description: 'Advanced analytics and predictive insights will appear as data accumulates',
      link: '/analytics'
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
            className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4"
          >
            <LineChart className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Waiting for Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Advanced analytics and insights are calculated from your real student and operational data. 
            No synthetic data is shown.
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
                className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            Start Entering Data
          </Button>
          <Button variant="outline" className="dark:border-gray-700">
            Learn About Analytics
          </Button>
        </div>

        {/* Transparency Message */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>✓ 100% Data-Driven:</strong> All analytics and insights are calculated in real-time 
            from your actual data. We never use estimated, predicted, or demo numbers in this view.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
