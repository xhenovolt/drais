'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building, Users, DollarSign, TrendingUp, Search, Plus, Filter,
  MoreVertical, Eye, Edit, Trash2, CheckCircle, XCircle, AlertCircle,
  ArrowUpRight, ArrowDownRight, Activity, Server, Database, Cpu,
  HardDrive, Wifi, WifiOff, Bell, Settings, Download, Upload,
  RefreshCw, BarChart3, PieChart, TrendingDown, Zap, Shield
} from 'lucide-react';

// Version 0.0.0040 - Super-Admin Multi-Tenant SaaS Dashboard

export default function SuperAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [schools, setSchools] = useState([]);
  const [stats, setStats] = useState({});
  const [systemHealth, setSystemHealth] = useState({});

  useEffect(() => {
    // Load from localStorage or generate mock data
    const storedSchools = localStorage.getItem('super_admin_schools');
    if (storedSchools) {
      setSchools(JSON.parse(storedSchools));
    } else {
      const mockSchools = generateMockSchools();
      setSchools(mockSchools);
      localStorage.setItem('super_admin_schools', JSON.stringify(mockSchools));
    }

    // Generate stats
    const mockStats = {
      totalSchools: 247,
      activeSchools: 231,
      trialSchools: 16,
      totalStudents: 156847,
      totalRevenue: 847650000,
      monthlyGrowth: 12.4,
      activeUsers: 1842,
      avgResponseTime: 145
    };
    setStats(mockStats);

    // System health
    const mockHealth = {
      apiStatus: 'healthy',
      databaseStatus: 'healthy',
      storageUsed: 67,
      cpuUsage: 34,
      memoryUsage: 58,
      uptime: 99.97,
      lastIncident: 'None in last 30 days'
    };
    setSystemHealth(mockHealth);
  }, []);

  const generateMockSchools = () => {
    const schools = [];
    const names = [
      'Kampala Islamic Academy', 'Crescent Secondary School', 'Al-Noor Schools',
      'Bright Future Academy', 'Green Valley School', 'Royal Kings College',
      'St. Mary\'s International', 'Victory Christian School', 'Noble Minds Academy',
      'Progressive Learning Center', 'Excel High School', 'Trinity College',
      'Wisdom Academy', 'Future Leaders School', 'Golden Stars Academy'
    ];
    const statuses = ['active', 'active', 'active', 'active', 'trial', 'suspended'];
    const plans = ['professional', 'premium', 'gold'];
    const regions = ['Kampala', 'Entebbe', 'Mukono', 'Jinja', 'Mbarara', 'Gulu'];

    for (let i = 0; i < 15; i++) {
      schools.push({
        id: `SCH${String(i + 1).padStart(4, '0')}`,
        name: names[i],
        region: regions[Math.floor(Math.random() * regions.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        plan: plans[Math.floor(Math.random() * plans.length)],
        students: Math.floor(Math.random() * 2000) + 300,
        staff: Math.floor(Math.random() * 80) + 20,
        revenue: Math.floor(Math.random() * 5000000) + 1000000,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        owner: `owner${i + 1}@school.com`,
        phone: `+256 7${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`
      });
    }
    return schools;
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || school.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'trial': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'professional': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'premium': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'gold': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage all schools and monitor system health
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/super-admin/schools/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add School
                </motion.button>
              </Link>
              <Link href="/super-admin/settings">
                <button className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.monthlyGrowth}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalSchools?.toLocaleString()}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Schools</p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                {stats.activeSchools} active • {stats.trialSchools} trial
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +8.2%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalStudents?.toLocaleString()}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Students</p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                Across all schools
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +15.3%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                UGX {(stats.totalRevenue / 1000000).toFixed(1)}M
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly Revenue</p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                From all subscriptions
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Healthy
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {systemHealth.uptime}%
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">System Uptime</p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                {systemHealth.lastIncident}
              </div>
            </motion.div>
          </div>

          {/* System Health Monitor */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                System Health Monitor
              </h2>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">CPU Usage</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{systemHealth.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${systemHealth.cpuUsage}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Cpu className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-500">Normal</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Memory Usage</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{systemHealth.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${systemHealth.memoryUsage}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-500">Normal</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Storage Used</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{systemHealth.storageUsed}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${systemHealth.storageUsed}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-500">Healthy</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">API Status</div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Healthy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Database</div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Healthy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Response Time</div>
                  <div className="text-sm font-bold text-blue-700 dark:text-blue-400">{systemHealth.avgResponseTime}ms</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
                  <div className="text-sm font-bold text-purple-700 dark:text-purple-400">{stats.activeUsers}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search schools by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
              </select>

              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <Link href="/super-admin/analytics">
                <button className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Analytics</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedSchools.map((school, idx) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {school.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{school.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{school.id}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(school.status)}`}>
                    {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Plan</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(school.plan)}`}>
                    {school.plan.charAt(0).toUpperCase() + school.plan.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{school.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Staff</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{school.staff}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    UGX {(school.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Link href={`/super-admin/schools/${school.id}`} className="flex-1">
                  <button className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </Link>
                <Link href={`/super-admin/schools/${school.id}/edit`}>
                  <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-semibold text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-semibold text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
