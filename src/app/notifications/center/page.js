'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, AlertCircle, Info, Award, Calendar, FileText,
  User, X, Filter, Search, Trash2, Archive, Eye, EyeOff, ChevronDown,
  Clock, Star, MessageSquare, TrendingUp, Download, Settings
} from 'lucide-react';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read, important
  const [typeFilter, setTypeFilter] = useState('all'); // all, exam, result, alert, announcement
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    // Load from database in Phase 3
    // For now, show empty state with no notifications
    setNotifications([]);
  }, []);

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    important: notifications.filter(n => n.important).length
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (filter === 'unread' && n.read) return false;
      if (filter === 'read' && !n.read) return false;
      if (filter === 'important' && !n.important) return false;
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;
      if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
    if (selectedNotif?.id === id) setSelectedNotif(null);
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Notification Center</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with all your notifications</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={markAllAsRead}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark All Read
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Notifications</div>
              </div>
              <Bell className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.unread}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Unread</div>
              </div>
              <EyeOff className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.important}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Important</div>
              </div>
              <Star className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="important">Important Only</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Types</option>
              <option value="exam">Exams</option>
              <option value="result">Results</option>
              <option value="alert">Alerts</option>
              <option value="announcement">Announcements</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notifications found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notif, idx) => {
                const Icon = notif.icon;
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedNotif(notif);
                      if (!notif.read) markAsRead(notif.id);
                    }}
                    className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors ${
                      !notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0" />
                      )}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${notif.color}-500 to-${notif.color}-600 flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold text-gray-900 dark:text-white ${!notif.read ? 'font-extrabold' : ''}`}>
                                {notif.title}
                              </h3>
                              {notif.important && (
                                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notif.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {getRelativeTime(notif.timestamp)}
                              </span>
                              <span className={`px-2 py-1 rounded-md font-semibold capitalize bg-${notif.color}-100 dark:bg-${notif.color}-900/30 text-${notif.color}-600 dark:text-${notif.color}-400`}>
                                {notif.type}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                        {notif.action && (
                          <a
                            href={notif.action.link}
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-${notif.color}-500 to-${notif.color}-600 hover:from-${notif.color}-600 hover:to-${notif.color}-700 text-white rounded-lg text-sm font-semibold transition-all`}
                          >
                            {notif.action.label}
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Detail Modal */}
        <AnimatePresence>
          {selectedNotif && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotif(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {React.createElement(selectedNotif.icon, {
                      className: `w-12 h-12 text-${selectedNotif.color}-600 dark:text-${selectedNotif.color}-400`
                    })}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedNotif.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{getRelativeTime(selectedNotif.timestamp)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotif(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedNotif.message}</p>
                {selectedNotif.action && (
                  <a
                    href={selectedNotif.action.link}
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-${selectedNotif.color}-500 to-${selectedNotif.color}-600 hover:from-${selectedNotif.color}-600 hover:to-${selectedNotif.color}-700 text-white rounded-xl font-semibold transition-all`}
                  >
                    {selectedNotif.action.label}
                  </a>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
