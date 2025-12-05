'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BarChart3, TrendingUp, DollarSign, Users, Building, Calendar,
  Download, Filter, ArrowLeft, PieChart, Activity, MapPin, Clock
} from 'lucide-react';

// Version 0.0.0043 - Super Admin Analytics Dashboard

export default function SuperAdminAnalytics() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const stats = [
    { label: 'Monthly Recurring Revenue', value: 'UGX 186.5M', change: '+23.5%', trend: 'up' },
    { label: 'New Schools (30d)', value: '34', change: '+18.2%', trend: 'up' },
    { label: 'Churn Rate', value: '2.4%', change: '-0.8%', trend: 'down' },
    { label: 'Avg Revenue per School', value: 'UGX 754K', change: '+12.1%', trend: 'up' }
  ];

  const schoolsByRegion = [
    { region: 'Central', schools: 98, percentage: 39.8, color: 'blue' },
    { region: 'Eastern', schools: 64, percentage: 25.9, color: 'emerald' },
    { region: 'Western', schools: 52, percentage: 21.1, color: 'purple' },
    { region: 'Northern', schools: 33, percentage: 13.4, color: 'amber' }
  ];

  const planDistribution = [
    { plan: 'Professional', count: 128, revenue: 44.8, color: 'blue' },
    { plan: 'Premium', count: 87, revenue: 56.6, color: 'purple' },
    { plan: 'Gold', count: 32, revenue: 38.4, color: 'amber' }
  ];

  const revenueData = [
    { month: 'Jul', revenue: 124.5 },
    { month: 'Aug', revenue: 138.2 },
    { month: 'Sep', revenue: 145.8 },
    { month: 'Oct', revenue: 156.3 },
    { month: 'Nov', revenue: 171.7 },
    { month: 'Dec', revenue: 186.5 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  const topSchools = [
    { name: 'Kampala Islamic Academy', students: 2300, revenue: 6.8, growth: '+24%' },
    { name: 'Royal Kings College', students: 1850, revenue: 5.2, growth: '+18%' },
    { name: 'Crescent Secondary School', students: 1620, revenue: 4.9, growth: '+22%' },
    { name: 'St. Mary\'s International', students: 1500, revenue: 4.5, growth: '+15%' },
    { name: 'Victory Christian School', students: 1340, revenue: 4.1, growth: '+19%' }
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
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive insights and performance metrics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                <span className={`text-sm font-semibold ${
                  (stat.trend === 'up' && stat.change.startsWith('+')) || (stat.trend === 'down' && stat.change.startsWith('-'))
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
              <div className="flex items-center gap-2 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">+23.5%</span>
              </div>
            </div>

            <div className="space-y-4">
              {revenueData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    {item.month}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                          transition={{ delay: idx * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"
                        />
                      </div>
                      <span className="w-20 text-right text-sm font-bold text-gray-900 dark:text-white">
                        {item.revenue}M
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schools by Region */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Schools by Region</h2>
            <div className="space-y-4">
              {schoolsByRegion.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 text-${item.color}-600`} />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.region}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.schools} schools
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={`h-full bg-${item.color}-600 rounded-full`}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Plan Distribution</h2>
            <div className="space-y-6">
              {planDistribution.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{item.plan}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.count} schools
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        UGX {item.revenue}M/mo
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 247) * 100}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Schools */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Performing Schools</h2>
            <div className="space-y-4">
              {topSchools.map((school, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {school.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {school.students.toLocaleString()} students
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      UGX {school.revenue}M
                    </div>
                    <div className="text-xs text-emerald-600">
                      {school.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
