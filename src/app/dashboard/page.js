"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  GraduationCap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  {
    name: "Total Students",
    value: "2,847",
    change: "+12.5%",
    changeType: "increase",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Total Staff",
    value: "142",
    change: "+3.2%",
    changeType: "increase",
    icon: UserCheck,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Active Classes",
    value: "68",
    change: "0%",
    changeType: "neutral",
    icon: GraduationCap,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Revenue This Month",
    value: "$124,850",
    change: "+8.1%",
    changeType: "increase",
    icon: DollarSign,
    color: "from-amber-500 to-orange-600",
  },
];

const recentActivities = [
  { id: 1, type: "student", message: "New student admission: John Doe", time: "2 hours ago" },
  { id: 2, type: "fee", message: "Fee payment received from Grade 10-A", time: "4 hours ago" },
  { id: 3, type: "exam", message: "Mid-term exam results published", time: "6 hours ago" },
  { id: 4, type: "attendance", message: "Daily attendance marked for all classes", time: "1 day ago" },
];

const quickActions = [
  { name: "Add Student", href: "/students/add", icon: Users, color: "bg-blue-500" },
  { name: "Mark Attendance", href: "/attendance", icon: Calendar, color: "bg-green-500" },
  { name: "Import Students", href: "/students/import", icon: Users, color: "bg-purple-500" },
  { name: "Process Payments", href: "/payments", icon: DollarSign, color: "bg-orange-500" },
  { name: "AI Teacher", href: "/ai-teacher", icon: TrendingUp, color: "bg-emerald-500" },
  { name: "Setup School", href: "/onboarding", icon: Users, color: "bg-cyan-500" },
  { name: "View Audit Logs", href: "/audit-logs", icon: AlertTriangle, color: "bg-red-500" },
  { name: "View Reports", href: "/reports", icon: TrendingUp, color: "bg-amber-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-sm font-medium">
                      {stat.name}
                    </CardDescription>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600 dark:text-green-400"
                          : stat.changeType === "decrease"
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {stat.changeType === "increase" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : stat.changeType === "decrease" ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : null}
                      {stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions for faster workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-900 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600"
                    >
                      <div className={`${action.color} p-3 rounded-lg`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">{action.name}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your institution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  View All Activities
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Important Alerts
                </CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                    <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-100">
                      Fee Collection Due
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      45 students have pending fee payments for this term
                    </p>
                    <Button size="sm" className="mt-3 bg-orange-600 hover:bg-orange-700">
                      View Details
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                      Exam Schedule
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Final exams start in 7 days - Review schedule
                    </p>
                    <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                      View Schedule
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                    <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100">
                      Staff Meeting
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      Monthly staff meeting scheduled for tomorrow at 10 AM
                    </p>
                    <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
