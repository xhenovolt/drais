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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Shield, Search, Filter, Download, Eye, Calendar, Clock,
  User, AlertTriangle, CheckCircle2, XCircle, Info, Moon, Sun, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock audit log data
const auditLogs = [
  {
    id: "LOG-2025001",
    timestamp: "2025-12-03 14:30:22",
    user: "John Mukama",
    userRole: "Head Teacher",
    action: "Student Record Updated",
    resource: "Students Database",
    details: "Updated contact information for Sarah Nalwoga (ID: STU-001234)",
    severity: "info",
    ipAddress: "192.168.1.105",
    userAgent: "Chrome/120.0.0.0",
    result: "Success"
  },
  {
    id: "LOG-2025002", 
    timestamp: "2025-12-03 14:25:15",
    user: "Mary Nakato",
    userRole: "Teacher",
    action: "Attendance Marked",
    resource: "Attendance System",
    details: "Marked attendance for Primary 5A - 28/32 students present",
    severity: "info",
    ipAddress: "192.168.1.112",
    userAgent: "Chrome/120.0.0.0",
    result: "Success"
  },
  {
    id: "LOG-2025003",
    timestamp: "2025-12-03 14:20:33",
    user: "System",
    userRole: "Automated Process",
    action: "Failed Login Attempt",
    resource: "Authentication System",
    details: "Multiple failed login attempts from IP 41.202.175.23",
    severity: "warning",
    ipAddress: "41.202.175.23",
    userAgent: "Unknown",
    result: "Blocked"
  },
  {
    id: "LOG-2025004",
    timestamp: "2025-12-03 13:45:17",
    user: "Peter Kiprotich",
    userRole: "Administrator",
    action: "Fee Structure Updated",
    resource: "Financial Management",
    details: "Updated tuition fees for Senior 3 - Old: 300,000 UGX, New: 320,000 UGX",
    severity: "warning",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/119.0",
    result: "Success"
  },
  {
    id: "LOG-2025005",
    timestamp: "2025-12-03 13:30:44",
    user: "Grace Atuhaire",
    userRole: "Teacher",
    action: "Exam Results Published",
    resource: "Academic Management",
    details: "Published Mathematics exam results for Senior 2A - 35 students affected",
    severity: "info",
    ipAddress: "192.168.1.118",
    userAgent: "Safari/17.1",
    result: "Success"
  },
  {
    id: "LOG-2025006",
    timestamp: "2025-12-03 12:15:28",
    user: "Unknown User",
    userRole: "N/A",
    action: "Unauthorized Access Attempt",
    resource: "Admin Panel",
    details: "Attempted access to admin panel without proper credentials",
    severity: "critical",
    ipAddress: "203.128.45.67",
    userAgent: "curl/7.68.0",
    result: "Blocked"
  },
  {
    id: "LOG-2025007",
    timestamp: "2025-12-03 11:30:15",
    user: "David Ssebunya",
    userRole: "Accountant", 
    action: "Payment Processed",
    resource: "Payment System",
    details: "Processed fee payment: 200,000 UGX for John Okello (STU-005678) via MTN Mobile Money",
    severity: "info",
    ipAddress: "192.168.1.125",
    userAgent: "Chrome/120.0.0.0",
    result: "Success"
  },
  {
    id: "LOG-2025008",
    timestamp: "2025-12-03 10:45:33",
    user: "System",
    userRole: "Automated Process",
    action: "Database Backup",
    resource: "System Maintenance",
    details: "Daily database backup completed successfully - 2.4GB archived",
    severity: "info",
    ipAddress: "127.0.0.1",
    userAgent: "System Process",
    result: "Success"
  }
];

const severityColors = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", 
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
};

const severityIcons = {
  info: Info,
  warning: AlertTriangle,
  critical: XCircle,
  success: CheckCircle2
};

export default function AuditLogs() {
  const { theme, toggleTheme } = useTheme();
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterUser, setFilterUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logs based on search and filters
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    const matchesUser = filterUser === "" || log.user.toLowerCase().includes(filterUser.toLowerCase());
    
    return matchesSearch && matchesSeverity && matchesUser;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    // UI only - simulate export
    console.log("Exporting audit logs...");
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
                  System Audit Logs
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Complete activity tracking and security monitoring for your DRAIS system
                </p>
              </div>
              <Button onClick={handleExport} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
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
                    <p className="text-blue-100">Total Logs</p>
                    <p className="text-3xl font-bold">{auditLogs.length}</p>
                  </div>
                  <Shield className="w-12 h-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Successful Actions</p>
                    <p className="text-3xl font-bold">{auditLogs.filter(log => log.result === 'Success').length}</p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Warnings</p>
                    <p className="text-3xl font-bold">{auditLogs.filter(log => log.severity === 'warning').length}</p>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Critical Events</p>
                    <p className="text-3xl font-bold">{auditLogs.filter(log => log.severity === 'critical').length}</p>
                  </div>
                  <XCircle className="w-12 h-12 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input
                      placeholder="Search actions, users, details..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                    <Input
                      placeholder="Filter by User"
                      value={filterUser}
                      onChange={(e) => setFilterUser(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setFilterSeverity("all");
                      setFilterUser("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Audit Logs Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Audit Log Entries
                </CardTitle>
                <CardDescription>
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => {
                      const SeverityIcon = severityIcons[log.severity];
                      return (
                        <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium">{log.user}</div>
                                <div className="text-xs text-gray-500">{log.userRole}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{log.action}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{log.resource}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${severityColors[log.severity]} flex items-center gap-1`}>
                              <SeverityIcon className="w-3 h-3" />
                              {log.severity.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                          <TableCell>
                            <Badge className={
                              log.result === 'Success' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }>
                              {log.result}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedLog(log)}>
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:max-w-2xl">
                                {selectedLog && (
                                  <>
                                    <SheetHeader>
                                      <SheetTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Audit Log Details
                                      </SheetTitle>
                                      <SheetDescription>
                                        Complete information for log entry {selectedLog.id}
                                      </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold mb-2">Basic Information</h3>
                                          <div className="space-y-2">
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Log ID:</span>
                                              <p className="font-mono">{selectedLog.id}</p>
                                            </div>
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Timestamp:</span>
                                              <p>{new Date(selectedLog.timestamp).toLocaleString()}</p>
                                            </div>
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">User:</span>
                                              <p>{selectedLog.user} ({selectedLog.userRole})</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold mb-2">Action Details</h3>
                                          <div className="space-y-2">
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Action:</span>
                                              <p>{selectedLog.action}</p>
                                            </div>
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Resource:</span>
                                              <p>{selectedLog.resource}</p>
                                            </div>
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">Result:</span>
                                              <Badge className={
                                                selectedLog.result === 'Success'
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                              }>
                                                {selectedLog.result}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h3 className="font-semibold mb-2">Detailed Description</h3>
                                        <p className="text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                          {selectedLog.details}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold mb-2">Network Information</h3>
                                          <div className="space-y-2">
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">IP Address:</span>
                                              <p className="font-mono">{selectedLog.ipAddress}</p>
                                            </div>
                                            <div>
                                              <span className="text-sm text-gray-600 dark:text-gray-400">User Agent:</span>
                                              <p className="font-mono text-xs">{selectedLog.userAgent}</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold mb-2">Security Level</h3>
                                          <div className="flex items-center gap-2">
                                            {(() => {
                                              const SeverityIcon = severityIcons[selectedLog.severity];
                                              return (
                                                <Badge className={`${severityColors[selectedLog.severity]} flex items-center gap-2`}>
                                                  <SeverityIcon className="w-4 h-4" />
                                                  {selectedLog.severity.toUpperCase()}
                                                </Badge>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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