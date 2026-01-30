'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Download, Filter, Calendar,
  FileText, PieChart, BarChart3, Activity, ArrowUp, ArrowDown,
  Eye, ChevronDown, Building, Users, Clock, Zap, CheckCircle
} from 'lucide-react';

export default function IncomeStatementPage() {
  const [period, setPeriod] = useState('monthly'); // monthly, quarterly, yearly
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-12-05' });
  const [department, setDepartment] = useState('all');
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState('summary'); // summary, detailed
  const [chartType, setChartType] = useState('bar'); // bar, line, area
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load from database in Phase 3
    // For now, show empty state when no data
    setData(null);
  }, [period, dateRange, department, category]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading financial data...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `UGX ${(amount / 1000000).toFixed(2)}M`;
  };

  const exportReport = (format) => {
    alert(`Exporting Income Statement as ${format.toUpperCase()}...`);
    // Placeholder for actual export functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Income Statement</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Financial Performance Overview • {dateRange.start} to {dateRange.end}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="monthly">Monthly View</option>
                <option value="quarterly">Quarterly View</option>
                <option value="yearly">Yearly View</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => exportReport('pdf')}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  PDF
                </button>
                <button
                  onClick={() => exportReport('excel')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Excel
                </button>
                <button
                  onClick={() => exportReport('csv')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold">
                <ArrowUp className="w-3 h-3" />
                +{data.summary.revenueGrowth}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(data.summary.totalRevenue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              vs Last Period: {formatCurrency(data.summary.comparison.lastPeriod.revenue)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-red-500/10 to-pink-600/10 border border-red-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-semibold">
                <ArrowUp className="w-3 h-3" />
                +{data.summary.expenseGrowth}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(data.summary.totalExpenses)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              vs Last Period: {formatCurrency(data.summary.comparison.lastPeriod.expenses)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold">
                <ArrowUp className="w-3 h-3" />
                +25.8%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(data.summary.netProfit)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Net Profit</div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              vs Last Period: {formatCurrency(data.summary.comparison.lastPeriod.profit)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-semibold">
                Healthy
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {data.summary.profitMargin}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              Industry Avg: 18-22%
            </div>
          </motion.div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Actionable Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border-l-4 ${
                  insight.type === 'positive' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' :
                  insight.type === 'attention' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {insight.type === 'positive' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : insight.type === 'attention' ? (
                    <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{insight.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Revenue & Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Revenue Breakdown</h2>
            <div className="space-y-4">
              {data.revenues.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.category}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.percentage}% of total revenue</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="w-3 h-3" />
                        +{item.growth}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-emerald-200 dark:bg-emerald-900/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  {viewMode === 'detailed' && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 space-y-2">
                      {item.subcategories.map((sub, subIdx) => (
                        <div key={subIdx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{sub.name}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(sub.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Expense Breakdown</h2>
            <div className="space-y-4">
              {data.expenses.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.category}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.percentage}% of total expenses</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                        <ArrowUp className="w-3 h-3" />
                        +{item.growth}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-red-200 dark:bg-red-900/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  {viewMode === 'detailed' && (
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800 space-y-2">
                      {item.subcategories.map((sub, subIdx) => (
                        <div key={subIdx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{sub.name}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(sub.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Trends</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'summary' ? 'detailed' : 'summary')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-all"
              >
                {viewMode === 'summary' ? 'Show Details' : 'Hide Details'}
              </button>
            </div>
          </div>
          <div className="h-96 flex items-end justify-between gap-2">
            {data.monthlyTrends.map((month, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-80 gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg hover:from-emerald-600 hover:to-emerald-500 transition-all cursor-pointer relative group"
                    style={{ height: `${(month.revenue / 260000000) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Revenue: {formatCurrency(month.revenue)}
                    </div>
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg hover:from-red-600 hover:to-red-500 transition-all cursor-pointer relative group"
                    style={{ height: `${(month.expenses / 260000000) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Expenses: {formatCurrency(month.expenses)}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{month.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-400 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">All Departments</option>
                <option value="academics">Academics</option>
                <option value="boarding">Boarding</option>
                <option value="tahfiz">Tahfiz</option>
                <option value="transport">Transport</option>
                <option value="library">Library</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">All Categories</option>
                <option value="revenue">Revenue Only</option>
                <option value="expenses">Expenses Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
