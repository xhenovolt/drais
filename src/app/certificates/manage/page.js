'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Download, Eye, Printer, Search, Filter, Calendar, User,
  CheckCircle, XCircle, Clock, MoreVertical, Edit, Trash2, Share2,
  Grid, List, Plus, FileText, TrendingUp, BarChart3
} from 'lucide-react';

export default function CertificateManagement() {
  const [certificates, setCertificates] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filter, setFilter] = useState('all'); // all, pending, issued, cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, type, status

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('generated_certificates');
    if (saved) {
      setCertificates(JSON.parse(saved));
    } else {
      // No certificates exist yet - show empty state
      setCertificates([]);
          type: 'excellence',
          title: 'Excellence in Mathematics',
          students: ['ST001'],
          status: 'issued',
          issuedDate: '2025-11-15',
          issuedBy: 'Dr. Ahmed Khalil',
          template: 'gold',
          count: 1
        }
      ];
      // Don't auto-create mock data - wait for real certificates from database
    }
  }, []);

  const stats = {
    total: certificates.length,
    issued: certificates.filter(c => c.status === 'issued').length,
    pending: certificates.filter(c => c.status === 'pending').length,
    students: certificates.reduce((sum, c) => sum + c.count, 0)
  };

  const filteredCerts = certificates
    .filter(c => {
      if (filter !== 'all' && c.status !== filter) return false;
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.issuedDate) - new Date(a.issuedDate);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const getTypeColor = (type) => {
    const colors = {
      achievement: 'emerald',
      completion: 'blue',
      participation: 'amber',
      excellence: 'purple',
      tahfiz: 'indigo',
      custom: 'gray'
    };
    return colors[type] || 'gray';
  };

  const getStatusBadge = (status) => {
    const badges = {
      issued: { color: 'emerald', icon: CheckCircle, label: 'Issued' },
      pending: { color: 'amber', icon: Clock, label: 'Pending' },
      cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950 p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Certificate Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and track all issued certificates</p>
            </div>
            <a
              href="/certificates/generate"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Generate New
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Certificates</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.issued}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Issued</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</div>
          </motion.div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-80 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="issued">Issued</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="type">Sort by Type</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Certificates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert, idx) => {
              const typeColor = getTypeColor(cert.type);
              const statusBadge = getStatusBadge(cert.status);
              const StatusIcon = statusBadge.icon;
              
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${typeColor}-500 to-${typeColor}-600 flex items-center justify-center`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold bg-${statusBadge.color}-100 dark:bg-${statusBadge.color}-900/30 text-${statusBadge.color}-600 dark:text-${statusBadge.color}-400 flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{cert.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Certificate ID: {cert.id}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{cert.count} recipient{cert.count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{cert.issuedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>Template: {cert.template}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                      <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Certificate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Recipients</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.map((cert, idx) => {
                  const typeColor = getTypeColor(cert.type);
                  const statusBadge = getStatusBadge(cert.status);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <motion.tr
                      key={cert.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{cert.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{cert.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold bg-${typeColor}-100 dark:bg-${typeColor}-900/30 text-${typeColor}-600 dark:text-${typeColor}-400 capitalize`}>
                          {cert.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{cert.count}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{cert.issuedDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold bg-${statusBadge.color}-100 dark:bg-${statusBadge.color}-900/30 text-${statusBadge.color}-600 dark:text-${statusBadge.color}-400 flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredCerts.length === 0 && (
          <div className="text-center py-16">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No certificates found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search query</p>
            <a
              href="/certificates/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Generate First Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
