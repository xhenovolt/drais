'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Wallet,
  AlertCircle,
  Award,
  Calendar,
  User,
  Download,
  PrinterIcon,
  Camera,
  Trash2,
  Heart,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudentDetails();
    }
  }, [id]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/modules/students?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }
      const data = await response.json();
      setStudent(data.data || data[0]);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/modules/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete student');
      }

      toast.success('Student deleted successfully');
      router.push('/students');
    } catch (err) {
      toast.error(err.message);
      console.error('Error deleting student:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading student profile..." fullScreen />
      </DashboardLayout>
    );
  }

  if (error || !student) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={AlertCircle}
          title="Student Not Found"
          description={error || 'This student does not exist or has been deleted.'}
          action={<Button onClick={() => router.push('/students')}>Back to Students</Button>}
        />
      </DashboardLayout>
    );
  }

  const disciplineStatus = student.discipline_status || 'clean';
  const hasDisciplineIssues = disciplineStatus !== 'clean';

  return (
    <DashboardLayout>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Student"
        description="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteStudent}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <div className="space-y-6">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Student Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {student.admission_number}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/students/${id}/edit`)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:text-red-700"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </motion.div>

        {/* Main profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Photo section */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4 border-4 border-blue-100 dark:border-blue-900">
                      <AvatarImage src={student.photo_url} />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {student.first_name?.[0]}{student.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mb-3"
                      onClick={() => router.push(`/students/${id}/photo`)}
                    >
                      <Camera className="w-4 h-4" />
                      Change Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => router.push(`/students/id-cards?id=${id}`)}
                    >
                      <Download className="w-4 h-4" />
                      ID Card
                    </Button>
                  </div>
                </div>

                {/* Info section */}
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500" />
                        Personal Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Full Name</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {student.first_name} {student.last_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Date of Birth</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {student.dob ? new Date(student.dob).toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Gender</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {student.gender || '—'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-500" />
                        Contact Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {student.email || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {student.phone || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Address</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {student.address || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and dates */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</p>
                      <Badge className={`mt-1 ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {student.status || 'Active'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Admission Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1">
                        {new Date(student.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Class</p>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1">
                        {student.class_id ? `Class ${student.class_id}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for additional sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="discipline">Discipline</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Status</CardTitle>
                  <CardDescription>Current enrollment and performance information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">Current Class</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {student.class_name || 'P6'}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">Admission No.</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {student.admission_number}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Finances Tab */}
            <TabsContent value="finances" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    Pocket Money Account
                  </CardTitle>
                  <CardDescription>Student financial transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Balance</p>
                      <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                        KES {student.pocket_money_balance || 0}.00
                      </p>
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={() => router.push(`/students/${id}/pocket-money`)}
                    >
                      <Wallet className="w-4 h-4" />
                      View Transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Discipline Tab */}
            <TabsContent value="discipline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Discipline Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {hasDisciplineIssues ? (
                        <>
                          <div className="w-4 h-4 bg-red-500 rounded-full" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Active Cases</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">This student has discipline cases</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 bg-green-500 rounded-full" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Good Standing</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">No discipline cases on record</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment History</CardTitle>
                  <CardDescription>Important dates and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enrolled</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(student.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
