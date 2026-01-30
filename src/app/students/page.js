/**
 * Students Management Page
 * DRAIS v0.0.0046
 * 
 * Lists all students with search, filter, and admission functionality
 * Uses real API data - shows "No students found" if database is empty
 */

"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudentAdmissionWizard from '@/components/student-admission-wizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  UserPlus,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StudentsPage() {
  const router = useRouter();
  const [showAdmissionWizard, setShowAdmissionWizard] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, [page, searchQuery]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/modules/students/admissions?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      if (response.status === 403) {
        setError('School context not configured. Please contact administration.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to fetch students: ${response.statusText}`;
        console.error('Students fetch error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data: errorData
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch students');
      }

      setStudents(data.data || []);
      setTotalStudents(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 1);
      setActiveCount(data.data?.filter(s => s.status === 'active').length || 0);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdmitStudent = () => {
    router.push('/admissions');
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const formatStudentInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const stats = [
    { 
      name: "Total Students", 
      value: totalStudents, 
      icon: Users, 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      name: "Active Students", 
      value: activeCount, 
      icon: Users, 
      color: "from-green-500 to-green-600" 
    },
    { 
      name: "New Admission", 
      value: "Quick Add", 
      icon: UserPlus, 
      color: "from-purple-500 to-purple-600",
      action: true
    },
    { 
      name: "Management", 
      value: students.length > 0 ? `${students.length} shown` : "Empty", 
      icon: Filter, 
      color: "from-orange-500 to-orange-600" 
    },
  ];

  if (showAdmissionWizard) {
    return (
      <DashboardLayout>
        <StudentAdmissionWizard 
          onSuccess={handleAdmissionSuccess}
          onCancel={() => setShowAdmissionWizard(false)}
        />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Students Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {totalStudents === 0 
                ? "No students yet. Add your first student to get started." 
                : `Manage ${totalStudents} student${totalStudents !== 1 ? 's' : ''} and admissions`}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="gap-2" disabled>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              onClick={handleAdmitStudent}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold mt-2">{totalStudents}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Students
                  </p>
                  <p className="text-3xl font-bold mt-2">{activeCount}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={handleAdmitStudent}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Quick Action
                  </p>
                  <p className="text-lg font-bold mt-2">Add Student</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search students by name, ID..."
                      className="pl-10 bg-white dark:bg-gray-900"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2" disabled>
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {loading ? 'Loading...' : totalStudents === 0 ? 'No Students Yet' : 'All Students'}
              </CardTitle>
              <CardDescription>
                {totalStudents === 0 
                  ? "Start by adding a new student using the button above." 
                  : `Showing ${students.length} of ${totalStudents} student${totalStudents !== 1 ? 's' : ''}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                    <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
                  </div>
                </div>
              ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Students Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchQuery 
                      ? "No students match your search. Try a different search term." 
                      : "No students have been added yet. Create your first student record."}
                  </p>
                  <Button 
                    onClick={handleAdmitStudent}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Student
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead>Student</TableHead>
                        <TableHead>Admission No</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, index) => (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                                  {formatStudentInitials(
                                    student.first_name,
                                    student.last_name
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {student.first_name} {student.last_name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  ID: {student.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">
                            {student.admission_no || '-'}
                          </TableCell>
                          <TableCell>
                            {student.class_name || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={student.status === "active" ? "default" : "secondary"}
                              className={
                                student.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                              }
                            >
                              {student.status?.charAt(0).toUpperCase() + student.status?.slice(1) || 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(student.enrollment_date || student.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {!loading && students.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {students.length} of {totalStudents} students
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    {totalPages > 3 && <span className="text-gray-600">...</span>}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}