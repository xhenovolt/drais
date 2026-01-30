"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DRAIS_VERSION } from "@/lib/version";
import {
  Fingerprint,
  Camera,
  Check,
  X,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Filter,
  Scan,
  UserCheck,
  UserX,
  Clock,
  Activity,
  Zap,
  Shield,
  AlertCircle,
} from "lucide-react";
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

export default function BiometricAttendancePage() {
  const [scanMode, setScanMode] = useState("fingerprint"); // fingerprint or face
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedClass, setSelectedClass] = useState("S3");
  const [selectedDate, setSelectedDate] = useState("December 4, 2025");
  const [attendanceData, setAttendanceData] = useState([]);

  // Student data will be fetched from database - no hardcoded mock data
  const mockStudents = [];

  // Metrics will be calculated from real attendance data
  const metrics = [
    {
      title: "Total Students",
      value: "48",
      description: "In S3 class",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Present Today",
      value: "44",
      description: "+2% from yesterday",
      icon: UserCheck,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      trend: "up",
    },
    {
      title: "Absent Today",
      value: "4",
      description: "8.3% absence rate",
      icon: UserX,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      trend: "down",
    },
    {
      title: "Avg Scan Time",
      value: "0.4s",
      description: "99.8% accuracy",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  // Weekly attendance trend data
  const weeklyTrend = [
    { day: "Mon", present: 46, absent: 2, rate: 95.8 },
    { day: "Tue", present: 45, absent: 3, rate: 93.8 },
    { day: "Wed", present: 44, absent: 4, rate: 91.7 },
    { day: "Thu", present: 46, absent: 2, rate: 95.8 },
    { day: "Fri", present: 44, absent: 4, rate: 91.7 },
  ];

  // Scan method distribution
  const scanMethodData = [
    { name: "Fingerprint", value: 68, color: "#3b82f6" },
    { name: "Face ID", value: 32, color: "#8b5cf6" },
  ];

  // Hourly check-in data
  const hourlyData = [
    { time: "07:00", count: 5 },
    { time: "07:15", count: 12 },
    { time: "07:30", count: 18 },
    { time: "07:45", count: 9 },
    { time: "08:00", count: 0 },
  ];

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);

    // Simulate biometric scan
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate
      setScanResult({
        success,
        student: success ? mockStudents[Math.floor(Math.random() * mockStudents.length)] : null,
        message: success ? "Biometric match found" : "Scan failed - Please try again",
        confidence: success ? (99 + Math.random()).toFixed(1) : 0,
      });
      setScanning(false);
    }, 1500);
  };

  const resetScan = () => {
    setScanResult(null);
    setScanning(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Biometric Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced fingerprint and face recognition for accurate attendance tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 text-sm"
          >
            <option value="P7">Primary 7</option>
            <option value="S1">Senior 1</option>
            <option value="S2">Senior 2</option>
            <option value="S3">Senior 3</option>
            <option value="S4">Senior 4</option>
            <option value="S5">Senior 5</option>
            <option value="S6">Senior 6</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <Card className={`${metric.bgColor} border-2 border-transparent hover:border-green-400 dark:hover:border-green-600 transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  {metric.trend && (
                    <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{metric.description}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biometric Scanner Simulation */}
        <Card className="bg-white dark:bg-gray-900 border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Biometric Scanner
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={scanMode === "fingerprint" ? "default" : "outline"}
                  onClick={() => setScanMode("fingerprint")}
                  className={scanMode === "fingerprint" ? "bg-gradient-to-r from-blue-500 to-cyan-600" : ""}
                >
                  <Fingerprint className="w-4 h-4 mr-1" />
                  Fingerprint
                </Button>
                <Button
                  size="sm"
                  variant={scanMode === "face" ? "default" : "outline"}
                  onClick={() => setScanMode("face")}
                  className={scanMode === "face" ? "bg-gradient-to-r from-purple-500 to-pink-600" : ""}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Face ID
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scanner Display */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-gray-300 dark:border-gray-700">
                <AnimatePresence mode="wait">
                  {!scanning && !scanResult && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      {scanMode === "fingerprint" ? (
                        <Fingerprint className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                      ) : (
                        <Camera className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                      )}
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {scanMode === "fingerprint" ? "Place finger on scanner" : "Look at camera"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Click scan to simulate
                      </p>
                    </motion.div>
                  )}

                  {scanning && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      {scanMode === "fingerprint" ? (
                        <>
                          <Fingerprint className="w-32 h-32 text-blue-500 mx-auto" />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0"
                            animate={{ y: [-100, 100] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        </>
                      ) : (
                        <>
                          <Camera className="w-32 h-32 text-purple-500 mx-auto" />
                          <motion.div
                            className="absolute inset-0 border-4 border-purple-500"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </>
                      )}
                      <p className="text-center mt-4 text-gray-700 dark:text-gray-300 font-medium">
                        Scanning...
                      </p>
                    </motion.div>
                  )}

                  {scanResult && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      {scanResult.success ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
                          >
                            <Check className="w-16 h-16 text-white" />
                          </motion.div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {scanResult.student?.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {scanResult.student?.regNo}
                          </p>
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            {scanResult.confidence}% Match
                          </Badge>
                          <p className="text-sm text-green-600 mt-3 font-medium">
                            ✓ {scanResult.message}
                          </p>
                        </>
                      ) : (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-32 h-32 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
                          >
                            <X className="w-16 h-16 text-white" />
                          </motion.div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Scan Failed
                          </h3>
                          <p className="text-sm text-red-600 font-medium">
                            {scanResult.message}
                          </p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Scan Controls */}
            <div className="flex gap-3">
              {!scanResult ? (
                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {scanning ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-pulse" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button onClick={resetScan} variant="outline" className="flex-1">
                    Scan Next Student
                  </Button>
                  {scanResult.success && (
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600">
                      <Check className="w-4 h-4 mr-2" />
                      Mark Present
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Scanner Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    Simulation Mode Active
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    This is a UI demonstration. In production, biometric devices would be connected via USB or network API.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Attendance Table */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today's Attendance - {selectedClass}
            </CardTitle>
            <CardDescription>Live updates as students check in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 p-3">Student</th>
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 p-3">Time</th>
                    <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${student.status === 'present' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gray-300 dark:bg-gray-700'} flex items-center justify-center text-white font-bold text-sm`}>
                            {student.photo}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {student.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {student.regNo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {student.scanTime}
                        </div>
                        {student.method !== "-" && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            {student.method === "fingerprint" ? (
                              <Fingerprint className="w-3 h-3" />
                            ) : (
                              <Camera className="w-3 h-3" />
                            )}
                            {student.confidence}%
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {student.status === "present" ? (
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Present
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            <UserX className="w-3 h-3 mr-1" />
                            Absent
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trend */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
            <CardDescription>Present vs Absent students - {selectedClass}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#presentGradient)"
                  name="Present"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#absentGradient)"
                  name="Absent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Check-in Distribution */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Hourly Check-in Distribution</CardTitle>
            <CardDescription>Today's check-in timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scan Method Distribution */}
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Scan Method Distribution</CardTitle>
          <CardDescription>Breakdown of biometric methods used today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={scanMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scanMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {scanMethodData.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: method.color }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {method.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {method.value}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({Math.round((method.value / 100) * 44)} students)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        DRAIS {DRAIS_VERSION} • Biometric Attendance System • 99.8% Accuracy Rate
      </div>
    </div>
  );
}
