"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
  Building,
  BookOpen,
  Activity,
} from "lucide-react";
import { DRAIS_VERSION } from "@/lib/version";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function OperationsDashboardPage() {
  const [selectedTerm, setSelectedTerm] = useState("Term 3, 2024");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Data loading state (will be fetched from database in Phase 3)
  const [operationsData, setOperationsData] = useState(null);

  // Placeholder for real data fetching
  // useEffect(() => {
  //   const fetchOperationsData = async () => {
  //     try {
  //       const response = await fetch('/api/operations/dashboard');
  //       const data = await response.json();
  //       setOperationsData(data);
  //     } catch (error) {
  //       setOperationsData({ isEmpty: true });
  //     }
  //   };
  //   fetchOperationsData();
  // }, []);

  // Empty state when no data available
  const metrics = [];
  const feesExpensesData = [];
  const attendanceTrends = [];
  const disciplinaryTrends = [];
  const departmentData = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Operations Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time overview of school operations and performance
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-sm">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-3 flex-1">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-800 text-sm"
              >
                <option>Term 3, 2024</option>
                <option>Term 2, 2024</option>
                <option>Term 1, 2024</option>
              </select>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-800 text-sm"
              >
                <option value="all">All Classes</option>
                <option value="p1">Primary 1</option>
                <option value="p2">Primary 2</option>
                <option value="s1">Senior 1</option>
                <option value="s2">Senior 2</option>
              </select>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-800 text-sm"
              >
                <option value="all">All Departments</option>
                <option value="sciences">Sciences</option>
                <option value="arts">Arts</option>
                <option value="languages">Languages</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${metric.bgColor} border-0 overflow-hidden relative`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-10 rounded-full -mr-16 -mt-16`} />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      metric.trend === "up"
                        ? "border-green-500 text-green-600"
                        : metric.trend === "down"
                        ? "border-red-500 text-red-600"
                        : "border-gray-500 text-gray-600"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : metric.trend === "down" ? (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    ) : null}
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.title}</p>
                <p className={`text-3xl font-bold ${metric.textColor}`}>{metric.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fees vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Fees vs Expenses (2024)
            </CardTitle>
            <CardDescription>Monthly comparison of income and expenditure</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feesExpensesData}>
                <defs>
                  <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value) => `UGX ${(value / 1000000).toFixed(1)}M`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="fees" fill="url(#colorFees)" name="Fees Collected" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="url(#colorExpenses)" name="Expenses" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Student Attendance Trends
            </CardTitle>
            <CardDescription>Weekly attendance rate vs target (95%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceTrends}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" />
                <YAxis domain={[90, 100]} />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#f59e0b"
                  fill="url(#colorAttendance)"
                  name="Actual Attendance"
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="target" stroke="#6b7280" strokeDasharray="5 5" name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disciplinary Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Disciplinary Cases Trends
            </CardTitle>
            <CardDescription>Monthly breakdown by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={disciplinaryTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="minor" stroke="#f59e0b" strokeWidth={2} name="Minor" />
                <Line type="monotone" dataKey="moderate" stroke="#ef4444" strokeWidth={2} name="Moderate" />
                <Line type="monotone" dataKey="severe" stroke="#991b1b" strokeWidth={2} name="Severe" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Department Distribution
            </CardTitle>
            <CardDescription>Student enrollment by department (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        DRAIS {DRAIS_VERSION} • Operations Dashboard
      </div>
    </div>
  );
}
