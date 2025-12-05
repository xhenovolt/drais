'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Package, Search, Star, Download, CheckCircle, Settings, Code,
  TrendingUp, Users, Shield, Zap, Filter, Grid, List, ArrowLeft,
  Eye, MessageSquare, Calendar, DollarSign, Award, Heart
} from 'lucide-react';

// Version 0.0.0045 - Plugins & Extensions Marketplace

export default function PluginsMarketplace() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [installedPlugins, setInstalledPlugins] = useState([]);

  useEffect(() => {
    const installed = JSON.parse(localStorage.getItem('installed_plugins') || '[]');
    setInstalledPlugins(installed);
  }, []);

  const categories = [
    { id: 'all', label: 'All Extensions', count: 48 },
    { id: 'ai', label: 'AI & Automation', count: 12 },
    { id: 'finance', label: 'Finance & Billing', count: 8 },
    { id: 'communication', label: 'Communication', count: 10 },
    { id: 'analytics', label: 'Analytics & Reports', count: 9 },
    { id: 'integration', label: 'Integrations', count: 9 }
  ];

  const extensions = [
    {
      id: 'ai-attendance-predictor',
      name: 'AI Attendance Predictor',
      category: 'ai',
      description: 'Predict student attendance patterns using machine learning algorithms',
      version: '2.4.1',
      author: 'DRAIS Labs',
      price: 'Free',
      rating: 4.8,
      downloads: 2340,
      icon: '🤖',
      featured: true,
      tags: ['AI', 'Attendance', 'Analytics']
    },
    {
      id: 'mobile-money-gateway',
      name: 'Mobile Money Gateway',
      category: 'finance',
      description: 'Accept payments via MTN, Airtel, and other mobile money providers',
      version: '3.2.0',
      author: 'FinTech Solutions',
      price: 'UGX 150K/mo',
      rating: 4.9,
      downloads: 5680,
      icon: '💳',
      featured: true,
      tags: ['Payments', 'Mobile Money', 'MTN', 'Airtel']
    },
    {
      id: 'bulk-sms-pro',
      name: 'Bulk SMS Pro',
      category: 'communication',
      description: 'Send automated SMS notifications to parents, students, and staff',
      version: '1.8.3',
      author: 'Messaging Plus',
      price: 'UGX 80K/mo',
      rating: 4.6,
      downloads: 4120,
      icon: '📱',
      featured: false,
      tags: ['SMS', 'Notifications', 'Communication']
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics Suite',
      category: 'analytics',
      description: 'Comprehensive analytics and data visualization tools',
      version: '2.1.5',
      author: 'DataViz Inc',
      price: 'UGX 200K/mo',
      rating: 4.7,
      downloads: 1890,
      icon: '📊',
      featured: true,
      tags: ['Analytics', 'Reports', 'Data Viz']
    },
    {
      id: 'google-classroom-sync',
      name: 'Google Classroom Sync',
      category: 'integration',
      description: 'Synchronize classes, assignments, and grades with Google Classroom',
      version: '1.5.2',
      author: 'EduSync',
      price: 'Free',
      rating: 4.5,
      downloads: 3420,
      icon: '🔗',
      featured: false,
      tags: ['Google', 'Integration', 'Sync']
    },
    {
      id: 'chatbot-assistant',
      name: 'AI Chatbot Assistant',
      category: 'ai',
      description: 'Intelligent chatbot for answering parent and student queries 24/7',
      version: '3.0.1',
      author: 'DRAIS Labs',
      price: 'UGX 120K/mo',
      rating: 4.8,
      downloads: 2780,
      icon: '💬',
      featured: true,
      tags: ['AI', 'Chatbot', 'Support']
    },
    {
      id: 'biometric-attendance',
      name: 'Biometric Attendance Pro',
      category: 'integration',
      description: 'Fingerprint and facial recognition attendance system',
      version: '2.7.0',
      author: 'SecureTech',
      price: 'UGX 250K/mo',
      rating: 4.9,
      downloads: 1560,
      icon: '🔐',
      featured: false,
      tags: ['Biometric', 'Attendance', 'Security']
    },
    {
      id: 'transport-tracker',
      name: 'Transport GPS Tracker',
      category: 'integration',
      description: 'Real-time GPS tracking for school buses and vehicles',
      version: '1.9.4',
      author: 'FleetTrack',
      price: 'UGX 180K/mo',
      rating: 4.7,
      downloads: 980,
      icon: '🚌',
      featured: false,
      tags: ['GPS', 'Transport', 'Tracking']
    },
    {
      id: 'invoice-generator',
      name: 'Invoice Generator Pro',
      category: 'finance',
      description: 'Create professional invoices and receipts with custom templates',
      version: '2.3.1',
      author: 'BillSoft',
      price: 'UGX 60K/mo',
      rating: 4.6,
      downloads: 3210,
      icon: '📄',
      featured: false,
      tags: ['Finance', 'Invoices', 'Billing']
    },
    {
      id: 'parent-portal-plus',
      name: 'Parent Portal Plus',
      category: 'communication',
      description: 'Enhanced parent portal with real-time updates and notifications',
      version: '3.1.2',
      author: 'ParentConnect',
      price: 'UGX 90K/mo',
      rating: 4.8,
      downloads: 4560,
      icon: '👨‍👩‍👧',
      featured: true,
      tags: ['Parents', 'Portal', 'Communication']
    },
    {
      id: 'exam-proctoring',
      name: 'AI Exam Proctoring',
      category: 'ai',
      description: 'AI-powered online exam proctoring and monitoring',
      version: '1.6.0',
      author: 'ProctorAI',
      price: 'UGX 170K/mo',
      rating: 4.5,
      downloads: 1120,
      icon: '👁️',
      featured: false,
      tags: ['AI', 'Exams', 'Proctoring']
    },
    {
      id: 'certificate-designer',
      name: 'Certificate Designer Studio',
      category: 'analytics',
      description: 'Design and generate beautiful certificates with drag-and-drop editor',
      version: '2.0.8',
      author: 'CertPro',
      price: 'UGX 70K/mo',
      rating: 4.9,
      downloads: 2890,
      icon: '🏆',
      featured: false,
      tags: ['Certificates', 'Design', 'Awards']
    }
  ];

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ext.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isInstalled = (pluginId) => installedPlugins.includes(pluginId);

  const handleInstall = (plugin) => {
    const updated = [...installedPlugins, plugin.id];
    setInstalledPlugins(updated);
    localStorage.setItem('installed_plugins', JSON.stringify(updated));
    alert(`${plugin.name} installed successfully!`);
  };

  const handleUninstall = (pluginId) => {
    if (confirm('Are you sure you want to uninstall this extension?')) {
      const updated = installedPlugins.filter(id => id !== pluginId);
      setInstalledPlugins(updated);
      localStorage.setItem('installed_plugins', JSON.stringify(updated));
      alert('Extension uninstalled successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Extensions Marketplace
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and install extensions to enhance your DRAIS experience
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extensions..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label} <span className="text-sm opacity-75">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Extensions Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExtensions.map((ext, idx) => (
              <motion.div
                key={ext.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                {ext.featured && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mb-3">
                    <Award className="w-4 h-4" />
                    Featured
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl">
                    {ext.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {ext.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {ext.author}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {ext.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {ext.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {ext.downloads.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    v{ext.version}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {ext.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-gray-900 dark:text-white">{ext.price}</span>
                  {isInstalled(ext.id) ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUninstall(ext.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm"
                      >
                        Uninstall
                      </button>
                      <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInstall(ext)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all text-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Install
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExtensions.map((ext, idx) => (
              <motion.div
                key={ext.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                      {ext.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                          {ext.name}
                        </h3>
                        {ext.featured && (
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-lg">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        by {ext.author} • v{ext.version}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {ext.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {ext.rating} rating
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {ext.downloads.toLocaleString()} downloads
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {ext.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {isInstalled(ext.id) ? (
                      <>
                        <button className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                          <Settings className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleUninstall(ext.id)}
                          className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                        >
                          Uninstall
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleInstall(ext)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Install Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredExtensions.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No extensions found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
