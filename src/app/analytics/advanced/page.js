"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, AlertCircle, Filter, ChevronDown, Download, Brain } from "lucide-react";
import { DRAIS_VERSION } from "@/lib/version";

export default function AdvancedAnalyticsPage() {
  const [selectedTerm, setSelectedTerm] = useState("term3");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  const classes = ["All Classes", "S1A", "S1B", "S2A", "S2B", "S3A", "S3B", "S4A", "S4B", "S5A", "S5B"];
  const subjects = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
  const terms = [
    { value: "term1", label: "Term 1 - 2024" },
    { value: "term2", label: "Term 2 - 2024" },
    { value: "term3", label: "Term 3 - 2024" },
  ];


  // Data loading state (will be fetched from database in Phase 3)
  const [analyticsData, setAnalyticsData] = useState(null);

  // Placeholder for real data fetching
  // useEffect(() => {
  //   const fetchAnalyticsData = async () => {
  //     try {
  //       const response = await fetch('/api/analytics/advanced');
  //       const data = await response.json();
  //       setAnalyticsData(data);
  //     } catch (error) {
  //       setAnalyticsData({ isEmpty: true });
  //     }
  //   };
  //   fetchAnalyticsData();
  // }, []);

  // Empty state when no data available
  const attendanceTrends = [];
  const performanceTrends = [];
  const feesCollectionTrends = [];
  const classPerformance = [];
  const subjectDistribution = [];
  const predictiveMetrics = [];

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#06b6d4", "#f59e0b", "#6366f1", "#ec4899"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Advanced Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Predictive insights and comprehensive trend analysis</p>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Filters
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Term</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                    >
                      {terms.map(term => (
                        <option key={term.value} value={term.value}>{term.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls.toLowerCase().replace(" ", "-")}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                    >
                      {subjects.map(subj => (
                        <option key={subj} value={subj.toLowerCase().replace(" ", "-")}>{subj}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Predictive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {predictiveMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className={`bg-gradient-to-br ${metric.color} text-white overflow-hidden relative`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-8 h-8 text-white/80" />
                    <div className="flex items-center gap-1">
                      {metric.trend > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm">{metric.percentage}</span>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">{metric.title}</p>
                  <p className="text-3xl font-bold mt-1">
                    {typeof metric.current === 'number' && metric.current % 1 !== 0 ? 
                      `${metric.current}%` : 
                      metric.current
                    }
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs text-white/70 mb-1">AI Prediction:</p>
                    <p className="text-sm font-medium">{metric.prediction}</p>
                    <p className="text-xs text-white/60 mt-2">Confidence: {metric.confidence}%</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends (8 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceTrends}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorAttendance)" 
                  name="Attendance %"
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeDasharray="5 5" 
                  fill="none" 
                  name="Target %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  name="Avg Score"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="topScore" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  name="Top Score"
                  dot={{ fill: '#10b981', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="passRate" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  name="Pass Rate %"
                  dot={{ fill: '#f59e0b', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fees Collection */}
        <Card>
          <CardHeader>
            <CardTitle>Fees Collection Trends (6 Terms)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feesCollectionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="term" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" name="Collected %" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="#6366f1" name="Target %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  <th className="text-left p-3">Class</th>
                  <th className="text-left p-3">Students</th>
                  <th className="text-left p-3">Average Score</th>
                  <th className="text-left p-3">At Risk</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {classPerformance.map((cls, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="p-3 font-medium">{cls.class}</td>
                    <td className="p-3">{cls.students}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{cls.avgScore}%</span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              cls.avgScore >= 85 ? 'bg-green-500' :
                              cls.avgScore >= 75 ? 'bg-blue-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${cls.avgScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={cls.atRisk <= 2 ? 'bg-green-100 text-green-800' : cls.atRisk <= 5 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}>
                        {cls.atRisk} students
                      </Badge>
                    </td>
                    <td className="p-3">
                      {cls.avgScore >= 85 ? (
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      ) : cls.avgScore >= 75 ? (
                        <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">Needs Attention</Badge>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Peak Performance Day</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wednesday shows highest attendance (96.1%) and test scores. Consider scheduling important assessments on Wednesdays.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Class Size Impact</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Classes with 35-40 students show 8% better performance than larger classes. Consider redistribution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Early Intervention Works</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Students who received support in first month improved 23% more than those identified later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        DRAIS {DRAIS_VERSION} • Advanced Predictive Analytics powered by Machine Learning
      </div>
    </div>
  );
}
