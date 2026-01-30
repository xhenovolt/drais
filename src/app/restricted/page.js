'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Settings, Zap } from 'lucide-react';
import Link from 'next/link';

export default function RestrictedAccessPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:bg-gradient-to-bl dark:from-blue-950 dark:via-gray-950 dark:to-black px-4 py-20">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-white dark:bg-gray-800 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Lock className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl">Feature Locked</CardTitle>
              <CardDescription className="text-base mt-2">
                Complete your school setup to unlock all features
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Explanation */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Why is this locked?</strong> We need some essential information about your school to set up your DRAIS system properly. This ensures you get the best experience and accurate data management.
                </p>
              </div>

              {/* What's needed */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  To unlock, please provide:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    School name
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    School address
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    School type (Primary/Secondary)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Number of students
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/school-setup" className="w-full block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 h-auto flex items-center justify-center gap-2">
                      <Settings className="w-5 h-5" />
                      Complete School Setup
                    </Button>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full flex items-center justify-center gap-2 border-gray-300 dark:border-gray-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/pricing" className="w-full block">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400"
                    >
                      <Zap className="w-5 h-5" />
                      Upgrade Plan (Optional)
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Help Text */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                <p>Typical setup takes 5-10 minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Optional: Learn More Link */}
          <div className="text-center mt-6">
            <Link
              href="/contact"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Need help? Contact support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
