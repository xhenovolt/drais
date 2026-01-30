'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Building, MapPin, Users, BookOpen, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SchoolSetupPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    school_name: '',
    school_address: '',
    school_city: '',
    school_region: '',
    school_type: '',
    student_count: '',
    staff_count: '',
  });

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push('/auth/login');
    return null;
  }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = formData.school_name && formData.school_address;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill in all required fields: School Name and Address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/school/setup', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to save school setup');
      }

      const data = await response.json();
      toast.success('School setup completed!');
      setCompleted(true);

      // Refresh user state from backend before redirecting
      // This updates AuthContext with new school data
      try {
        await refreshUser();
      } catch (err) {
        console.error('Failed to refresh user state:', err);
        // Continue anyway - redirect will trigger refresh
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Failed to complete setup');
      setIsSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:bg-gradient-to-bl dark:from-blue-950 dark:via-gray-950 dark:to-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Setup Complete! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your DRAIS system is ready to use. Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:bg-gradient-to-bl dark:from-blue-950 dark:via-gray-950 dark:to-black px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your School Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us about your school so we can customize DRAIS for your needs
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Fields marked with * are required. Other fields are optional.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* School Name */}
                <div className="space-y-2">
                  <Label htmlFor="school_name" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    School Name *
                  </Label>
                  <Input
                    id="school_name"
                    name="school_name"
                    value={formData.school_name}
                    onChange={handleChange}
                    placeholder="e.g., Springfield High School"
                    required
                  />
                </div>

                {/* School Type */}
                <div className="space-y-2">
                  <Label htmlFor="school_type" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    School Type
                  </Label>
                  <Select value={formData.school_type} onValueChange={(value) => handleSelectChange('school_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary">Primary School</SelectItem>
                      <SelectItem value="Secondary">Secondary School</SelectItem>
                      <SelectItem value="Primary and Secondary">Both Primary & Secondary</SelectItem>
                      <SelectItem value="Tertiary">Tertiary/University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address Fields */}
                <div className="space-y-2">
                  <Label htmlFor="school_address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    School Address *
                  </Label>
                  <Input
                    id="school_address"
                    name="school_address"
                    value={formData.school_address}
                    onChange={handleChange}
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school_city">City</Label>
                    <Input
                      id="school_city"
                      name="school_city"
                      value={formData.school_city}
                      onChange={handleChange}
                      placeholder="e.g., Kampala"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school_region">Region/State</Label>
                    <Input
                      id="school_region"
                      name="school_region"
                      value={formData.school_region}
                      onChange={handleChange}
                      placeholder="e.g., Central Region"
                    />
                  </div>
                </div>

                {/* Student & Staff Count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_count" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Students
                    </Label>
                    <Input
                      id="student_count"
                      name="student_count"
                      type="number"
                      value={formData.student_count}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff_count">Number of Staff</Label>
                    <Input
                      id="staff_count"
                      name="staff_count"
                      type="number"
                      value={formData.staff_count}
                      onChange={handleChange}
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Tip:</strong> You can update this information anytime in Settings. These details help us customize reports and features for your school.
                  </p>
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 h-auto text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Setting up...' : 'Complete Setup & Go to Dashboard'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Skip for now link */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
            >
              I'll set this up later
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
