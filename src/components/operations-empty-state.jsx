'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Users, DollarSign, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OperationsEmptyState() {
  const steps = [
    {
      icon: Users,
      title: 'Register Classes & Staff',
      description: 'Set up your school structure with class divisions and staff assignments',
      link: '/settings/classes'
    },
    {
      icon: DollarSign,
      title: 'Configure Fee Plans',
      description: 'Define payment terms, fee amounts, and collection schedules',
      link: '/settings/fees'
    },
    {
      icon: Activity,
      title: 'Record Daily Activities',
      description: 'Log attendance, conduct, and other operational metrics',
      link: '/attendance'
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
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
          >
            <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Operations Data Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Operations data is loaded from your actual school records only. No demo or placeholder data is shown.
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
                className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Get Started with Setup
          </Button>
          <Button variant="outline" className="dark:border-gray-700">
            View Help Documentation
          </Button>
        </div>

        {/* Honest Message */}
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>✓ Data-Honest Mode:</strong> Your operations dashboard shows only real data from your school records. 
            This means no fabricated numbers, no demo metrics, and complete transparency about your actual operational status.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
