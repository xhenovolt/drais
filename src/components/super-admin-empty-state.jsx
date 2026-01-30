'use client';

import { motion } from 'framer-motion';
import { Building, Users, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuperAdminEmptyState() {
  const steps = [
    {
      icon: Building,
      title: 'Onboard Your First School',
      description: 'Help schools complete their registration and setup process',
      link: '/super-admin/schools/pending'
    },
    {
      icon: Users,
      title: 'Monitor School Progress',
      description: 'Track school onboarding, subscription status, and system usage',
      link: '/super-admin/schools'
    },
    {
      icon: BarChart3,
      title: 'View System Analytics',
      description: 'See real-time analytics about platform usage, revenue, and growth',
      link: '/super-admin/analytics'
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
            className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4"
          >
            <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Schools Registered Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            The super-admin dashboard displays real school data from your database only. 
            Get started by onboarding schools into the DRAIS platform.
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
                className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
          >
            Invite First School
          </Button>
          <Button variant="outline" className="dark:border-gray-700">
            View Admin Guide
          </Button>
        </div>

        {/* System Integrity Notice */}
        <div className="mt-8 p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <p className="text-sm text-cyan-800 dark:text-cyan-300">
            <strong>✓ Production Mode:</strong> This dashboard shows only verified school registrations 
            and real business data. All metrics are calculated from live school records, not estimates or demos.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
