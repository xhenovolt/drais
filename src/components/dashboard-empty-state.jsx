'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  ClipboardList,
  AlertCircle 
} from 'lucide-react';

/**
 * DashboardEmptyState Component
 * 
 * Displays when there's insufficient data for charts/stats.
 * Provides clear, actionable CTAs to help user get started.
 */
export default function DashboardEmptyState() {
  const emptyStateActions = [
    {
      title: 'Add Students',
      description: 'Start by adding your student records to the system',
      icon: Users,
      href: '/students/add',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Record Attendance',
      description: 'Mark attendance to track student presence and engagement',
      icon: Calendar,
      href: '/attendance',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Enter Results',
      description: 'Create exams and enter student performance data',
      icon: TrendingUp,
      href: '/exams',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Process Payments',
      description: 'Record fee payments and manage financial transactions',
      icon: BarChart3,
      href: '/payments',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Main Empty State Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-xl p-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mt-1" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to DRAIS
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your school dashboard is ready. Start by adding data to see analytics, charts, and insights.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 Data is loaded from your actual school records only. No demo or placeholder data is shown.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Start Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emptyStateActions.map((action, index) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color}`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {action.description}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Get Started →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Data Loading Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          What happens next?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
            <span>Add your first student and other basic school data</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
            <span>Once you have data, charts and statistics will appear automatically</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
            <span>All data is sourced from your actual database records</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold">4.</span>
            <span>Analytics update in real-time as you add and modify records</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
