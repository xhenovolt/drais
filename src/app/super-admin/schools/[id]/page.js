'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  Building, Users, DollarSign, Calendar, Mail, Phone, MapPin,
  Activity, TrendingUp, TrendingDown, CheckCircle, AlertCircle,
  Edit, Trash, Power, ChevronRight, ArrowLeft, BarChart3,
  GraduationCap, BookOpen, Bus, Home, MessageCircle
} from 'lucide-react';

// Version 0.0.0041 - School Detail View

export default function SchoolDetailView() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const schools = JSON.parse(localStorage.getItem('super_admin_schools') || '[]');
    const found = schools.find(s => s.id === params.id);
    setSchool(found);
    setLoading(false);
  }, [params.id]);

  const handleSuspend = () => {
    if (confirm('Are you sure you want to suspend this school?')) {
      const schools = JSON.parse(localStorage.getItem('super_admin_schools') || '[]');
      const updated = schools.map(s => 
        s.id === params.id ? { ...s, status: 'suspended' } : s
      );
      localStorage.setItem('super_admin_schools', JSON.stringify(updated));
      setSchool({ ...school, status: 'suspended' });
      alert('School suspended successfully');
    }
  };

  const handleActivate = () => {
    const schools = JSON.parse(localStorage.getItem('super_admin_schools') || '[]');
    const updated = schools.map(s => 
      s.id === params.id ? { ...s, status: 'active' } : s
    );
    localStorage.setItem('super_admin_schools', JSON.stringify(updated));
    setSchool({ ...school, status: 'active' });
    alert('School activated successfully');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      const schools = JSON.parse(localStorage.getItem('super_admin_schools') || '[]');
      const updated = schools.filter(s => s.id !== params.id);
      localStorage.setItem('super_admin_schools', JSON.stringify(updated));
      alert('School deleted successfully');
      router.push('/super-admin/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">School not found</div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: school.students.toLocaleString(), icon: Users, color: 'blue', trend: '+12.5%' },
    { label: 'Staff Members', value: school.staff.toLocaleString(), icon: GraduationCap, color: 'purple', trend: '+4.2%' },
    { label: 'Monthly Revenue', value: `UGX ${(school.revenue / 1000000).toFixed(2)}M`, icon: DollarSign, color: 'emerald', trend: '+18.3%' },
    { label: 'Active Modules', value: school.enabledModules?.length || 6, icon: Activity, color: 'amber', trend: '100%' }
  ];

  const modules = [
    { name: 'Finance', icon: DollarSign, active: true, usage: '89%' },
    { name: 'Academics', icon: BookOpen, active: true, usage: '95%' },
    { name: 'Library', icon: BookOpen, active: true, usage: '67%' },
    { name: 'Transport', icon: Bus, active: false, usage: '0%' },
    { name: 'Boarding', icon: Home, active: false, usage: '0%' },
    { name: 'Messaging', icon: MessageCircle, active: true, usage: '78%' }
  ];

  const recentActivity = [
    { action: 'New student registered', time: '2 hours ago', icon: Users },
    { action: 'Fee payment received', time: '5 hours ago', icon: DollarSign },
    { action: 'Staff member added', time: '1 day ago', icon: GraduationCap },
    { action: 'Report generated', time: '2 days ago', icon: BarChart3 },
    { action: 'Settings updated', time: '3 days ago', icon: Edit }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/super-admin/dashboard')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {school.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {school.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {school.id}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {school.region}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    school.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : school.status === 'trial'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {school.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    school.plan === 'professional'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : school.plan === 'premium'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {school.plan.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/super-admin/schools/${school.id}/edit`)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              {school.status === 'active' ? (
                <button
                  onClick={handleSuspend}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  <Power className="w-4 h-4" />
                  Suspend
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                  <Power className="w-4 h-4" />
                  Activate
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  {React.createElement(stat.icon, { className: `w-6 h-6 text-${stat.color}-600` })}
                </div>
                <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* School Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">School Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Email</label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Mail className="w-4 h-4" />
                    {school.email}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Phone</label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Phone className="w-4 h-4" />
                    {school.phone}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Owner</label>
                  <div className="text-gray-900 dark:text-white">{school.ownerName || school.owner}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Registration</label>
                  <div className="text-gray-900 dark:text-white">{school.registrationNumber || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Created</label>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(school.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Last Active</label>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(school.lastActive).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Module Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Module Usage</h2>
              <div className="space-y-4">
                {modules.map((module, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${module.active ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        {React.createElement(module.icon, { 
                          className: `w-5 h-5 ${module.active ? 'text-emerald-600' : 'text-gray-400'}` 
                        })}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{module.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {module.active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">{module.usage}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Usage</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      {React.createElement(activity.icon, { className: 'w-4 h-4 text-blue-600' })}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {activity.action}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-between">
                  <span>View Analytics</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-between">
                  <span>Contact Owner</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-between">
                  <span>View Invoices</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-between">
                  <span>System Logs</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
