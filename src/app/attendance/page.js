"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Calendar as CalendarIcon, Clock, Users, UserCheck, UserX, TrendingUp,
  Download, Filter, CheckCircle2, XCircle, Moon, Sun, ArrowRight,
  Brain, Zap, AlertTriangle, BarChart3, Eye, Plus, Search, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for attendance
const todayStats = {
  totalStudents: 847,
  present: 782,
  absent: 45,
  late: 20,
  percentage: 92.3
};

const classAttendance = [
  { 
    id: "P5A", 
    name: "Primary 5A", 
    present: 28, 
    total: 32, 
    percentage: 87.5,
    status: "completed",
    teacher: "Mrs. Nakato"
  },
  { 
    id: "P6B", 
    name: "Primary 6B", 
    present: 30, 
    total: 30, 
    percentage: 100,
    status: "completed",
    teacher: "Mr. Kiprotich"
  },
  { 
    id: "S2A", 
    name: "Senior 2A", 
    present: 35, 
    total: 40, 
    percentage: 87.5,
    status: "pending",
    teacher: "Ms. Atuhaire"
  },
];

const recentActivity = [
  { student: "John Mukisa", class: "P5A", action: "Marked Present", time: "8:15 AM", status: "present" },
  { student: "Sarah Nalwoga", class: "P6B", action: "Marked Absent", time: "8:20 AM", status: "absent" },
  { student: "David Ssali", class: "S2A", action: "Marked Late", time: "8:45 AM", status: "late" },
];

const aiPredictions = [
  { student: "Mary Akello", class: "P5A", probability: 85, reason: "Missed last 2 Mondays", type: "absence" },
  { student: "Peter Okello", class: "P6B", probability: 72, reason: "Often late on rainy days", type: "late" },
  { student: "Grace Nampijja", class: "S2A", probability: 68, reason: "Parent-teacher meeting today", type: "absence" },
];

export default function Attendance() {
  const { theme, toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("all");

  const CircularProgress = ({ value, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative inline-flex">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-500 transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{value}%</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:bg-gradient-to-bl dark:from-blue-950 dark:via-gray-950 dark:to-black text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
      >
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <DraisLogo className="w-10 h-10" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {DRAIS_INFO.name}
                </span>
                <div className="text-xs text-gray-500">v{DRAIS_VERSION}</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-12 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Attendance Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Automated attendance tracking with AI predictions
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Mark Attendance
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="P5A">Primary 5A</SelectItem>
                  <SelectItem value="P6B">Primary 6B</SelectItem>
                  <SelectItem value="S2A">Senior 2A</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">
                  {selectedDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Students</p>
                    <p className="text-3xl font-bold">{todayStats.totalStudents}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Present</p>
                    <p className="text-3xl font-bold">{todayStats.present}</p>
                  </div>
                  <UserCheck className="w-12 h-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Absent</p>
                    <p className="text-3xl font-bold">{todayStats.absent}</p>
                  </div>
                  <UserX className="w-12 h-12 text-red-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Late</p>
                    <p className="text-3xl font-bold">{todayStats.late}</p>
                  </div>
                  <Clock className="w-12 h-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Attendance Overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Today's Attendance
                        </CardTitle>
                        <CardDescription>Real-time attendance tracking by class</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <CircularProgress value={todayStats.percentage} size={80} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Present/Total</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classAttendance.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.teacher}</TableCell>
                            <TableCell>{item.present}/{item.total}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={item.percentage} className="w-16 h-2" />
                                <span className="text-sm">{item.percentage}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  item.status === 'completed' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                {item.status === 'pending' && (
                                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                    <CheckCircle2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest attendance updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Avatar>
                            <AvatarFallback>{activity.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{activity.student}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.action} - {activity.class}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={
                                activity.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                activity.status === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                              }
                            >
                              {activity.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* AI Predictions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Predictions
                    </CardTitle>
                    <CardDescription>Students likely to be absent or late today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiPredictions.map((prediction, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{prediction.student}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{prediction.class}</p>
                            </div>
                            <Badge className={
                              prediction.type === 'absence' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            }>
                              {prediction.probability}%
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{prediction.reason}</p>
                          <Progress value={prediction.probability} className="mt-2 h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Calendar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Attendance</span>
                        <span className="font-semibold">91.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Best Day</span>
                        <span className="font-semibold">Wednesday (94.2%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Absences</span>
                        <span className="font-semibold">127</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Trend</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          +2.1% ↑
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2025 {DRAIS_INFO.name} v{DRAIS_VERSION}</span>
            <span>•</span>
            <span>by {XHENVOLT_DATA.company.name}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}