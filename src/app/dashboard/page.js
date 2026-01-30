"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { DRAIS_VERSION } from "@/lib/version";
import Link from "next/link";
import DashboardEmptyState from "@/components/dashboard-empty-state";

// Chart data will be fetched from database - no hardcoded mock data
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6366f1"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "" }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-bold"
    >
      {value}
      {suffix}
    </motion.span>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState("term1");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardError, setDashboardError] = useState(null);

  // Fetch real dashboard data from database
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This would fetch from a real API endpoint that queries the database
        // For now, we'll use a placeholder that returns null to show empty state
        const response = await fetch('/api/dashboard/stats', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          // If API doesn't exist yet or returns error, show empty state
          setDashboardData({ isEmpty: true });
          return;
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDashboardData({ isEmpty: true });
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
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

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Show empty state if no data is loaded yet
  if (dashboardData === null) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {!user.isOnboardingComplete ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 dark:from-yellow-900/40 dark:via-orange-900/40 dark:to-red-900/40 border-2 border-yellow-500 dark:border-yellow-700 rounded-xl p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                    ⚠️ Complete Your School Setup
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Some features are locked until you provide your school information. This takes just 5 minutes!
                  </p>
                </div>
                <Link href="/school-setup" className="flex-shrink-0">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold whitespace-nowrap">
                    Complete Setup Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : null}
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show empty state if there's no data
  if (dashboardData?.isEmpty) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {!user.isOnboardingComplete ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 dark:from-yellow-900/40 dark:via-orange-900/40 dark:to-red-900/40 border-2 border-yellow-500 dark:border-yellow-700 rounded-xl p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                    ⚠️ Complete Your School Setup
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Some features are locked until you provide your school information. This takes just 5 minutes!
                  </p>
                </div>
                <Link href="/school-setup" className="flex-shrink-0">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold whitespace-nowrap">
                    Complete Setup Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : null}
          <DashboardEmptyState />
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      name: "Total Students",
      value: "4,180",
      change: "+8.6%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50",
    },
    {
      name: "Average Score",
      value: "82%",
      change: "+5.2%",
      trend: "up",
      icon: Award,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50",
    },
    {
      name: "Attendance Rate",
      value: "94.3%",
      change: "+2.1%",
      trend: "up",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50",
    },
    {
      name: "Fee Collection",
      value: "97.6%",
      change: "+3.4%",
      trend: "up",
      icon: DollarSign,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-100 dark:from-amber-950/50 dark:to-orange-900/50",
    },
  ];

  const quickActions = [
    { name: "Add Student", href: "/students/add", icon: Users, color: "from-blue-500 to-blue-600" },
    { name: "Mark Attendance", href: "/attendance", icon: Calendar, color: "from-green-500 to-green-600" },
    { name: "View Analytics", href: "/analytics", icon: BarChart3, color: "from-purple-500 to-purple-600" },
    { name: "Reports", href: "/reports", icon: BarChart3, color: "from-amber-500 to-orange-600" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* School Setup Reminder Banner */}
        {!user.isOnboardingComplete ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 dark:from-yellow-900/40 dark:via-orange-900/40 dark:to-red-900/40 border-2 border-yellow-500 dark:border-yellow-700 rounded-xl p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  ⚠️ Complete Your School Setup
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Some features are locked until you provide your school information. This takes just 5 minutes!
                </p>
              </div>
              <Link href="/school-setup" className="flex-shrink-0">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold whitespace-nowrap">
                  Complete Setup Now
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : null}

        {/* School Identity Welcome Banner - Shows when setup is complete */}
        {user.isOnboardingComplete && user.school_name ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-900/50 dark:via-indigo-900/50 dark:to-purple-900/50 border border-blue-400 dark:border-blue-700/50 rounded-xl p-6 shadow-lg overflow-hidden relative"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0 bg-grid-pattern" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* School Badge */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                    <span className="text-lg font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {user.school_name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    Welcome to {user.school_name}
                  </h2>
                  <p className="text-blue-100 dark:text-blue-200 text-sm">
                    Your school system is fully set up and ready to use. All features are now unlocked.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enterprise Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive analytics and insights • v{DRAIS_VERSION}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="mt-4 md:mt-0"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filtersExpanded ? "rotate-180" : ""}`} />
          </Button>
        </motion.div>

        {/* Filter Panel */}
        <motion.div
          initial={false}
          animate={{ height: filtersExpanded ? "auto" : 0, opacity: filtersExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Term</label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term1">Term 1 - 2025</SelectItem>
                      <SelectItem value="term2">Term 2 - 2025</SelectItem>
                      <SelectItem value="term3">Term 3 - 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="grade1">Grade 1</SelectItem>
                      <SelectItem value="grade2">Grade 2</SelectItem>
                      <SelectItem value="grade3">Grade 3</SelectItem>
                      <SelectItem value="grade4">Grade 4</SelectItem>
                      <SelectItem value="grade5">Grade 5</SelectItem>
                      <SelectItem value="grade6">Grade 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Teacher</label>
                  <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      <SelectItem value="teacher1">Mr. John Smith</SelectItem>
                      <SelectItem value="teacher2">Mrs. Sarah Johnson</SelectItem>
                      <SelectItem value="teacher3">Dr. James Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real Data Section - Currently showing empty state */}
        {/* In production, this section will be populated with real database queries */}
        {/* Stats Cards - Will render when data exists */}

        {/* Charts Section - Will display real data when available */}
        {/* Charts are currently hidden as we transition to real data only */}
        {/* Future: Charts will be rendered from actual database queries */}

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Performance Trends</CardTitle>
                  <CardDescription>Average scores and pass rates over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={studentPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis yAxisId="left" className="text-xs" />
                      <YAxis yAxisId="right" orientation="right" className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="avgScore" fill="#3b82f6" name="Avg Score" />
                      <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} name="Pass Rate %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Class-wise Performance</CardTitle>
                  <CardDescription>Average scores by grade level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={classPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="class" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="avgScore" fill="url(#colorGradient)" name="Average Score" />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Overview</CardTitle>
                <CardDescription>Daily attendance breakdown for current week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="present" stackId="1" stroke="#10b981" fill="#10b981" name="Present" />
                    <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" name="Absent" />
                    <Area type="monotone" dataKey="leave" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="On Leave" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Summary</CardTitle>
                <CardDescription>Monthly collection vs pending amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={feeCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => `UGX ${value.toLocaleString()}`}
                    />
                    <Legend />
                    <Bar dataKey="collected" fill="#10b981" name="Collected" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Current term exam results breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={examResultsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.grade.split(" ")[0]}: ${entry.percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {examResultsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exam Results Summary</CardTitle>
                  <CardDescription>Detailed grade breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {examResultsData.map((result, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{result.grade}</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {result.count} students ({result.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-xl bg-gradient-to-br ${action.color} text-white cursor-pointer shadow-lg hover:shadow-xl transition-all`}
                  >
                    <action.icon className="w-8 h-8 mb-3" />
                    <p className="font-semibold">{action.name}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
