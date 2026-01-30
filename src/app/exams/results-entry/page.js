'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Download, Save, Check, X, AlertCircle, FileSpreadsheet,
  Users, BookOpen, Calendar, Filter, Search, Edit3, Trash2,
  CheckCircle, Clock, RefreshCw, Send, Eye, FileText, Database
} from 'lucide-react';

export default function ResultsEntryUI() {
  const [entryMode, setEntryMode] = useState('manual'); // manual or bulk
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error

  // Mock data
  const classes = ['Grade 9A', 'Grade 9B', 'Grade 10A', 'Grade 10B', 'Grade 11A'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];
  const examTypes = [
    { id: 1, name: 'Mid-Term Examination', totalMarks: 100 },
    { id: 2, name: 'Final Examination', totalMarks: 150 },
    { id: 3, name: 'Quiz', totalMarks: 50 },
    { id: 4, name: 'Assignment', totalMarks: 30 }
  ];

  // Student data will be fetched from database - no hardcoded mock data
  const mockStudents = [];

  const loadStudents = () => {
    if (selectedClass && selectedExam) {
      // Fetch students from database instead of using mock data
      setStudents([]);
      // Initialize marks from localStorage
      const savedMarks = localStorage.getItem(`marks_${selectedClass}_${selectedExam}_${selectedTerm}`);
      if (savedMarks) {
        setMarks(JSON.parse(savedMarks));
      }
    }
  };

  const handleMarkChange = (studentId, value) => {
    const exam = examTypes.find(e => e.id === parseInt(selectedExam));
    const numValue = parseFloat(value);
    
    // Real-time validation
    const errors = { ...validationErrors };
    if (isNaN(numValue) || numValue < 0) {
      errors[studentId] = 'Invalid marks';
    } else if (numValue > exam?.totalMarks) {
      errors[studentId] = `Max ${exam.totalMarks} marks`;
    } else {
      delete errors[studentId];
    }
    
    setValidationErrors(errors);
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const saveToLocalStorage = () => {
    setSaveStatus('saving');
    const key = `marks_${selectedClass}_${selectedExam}_${selectedTerm}`;
    localStorage.setItem(key, JSON.stringify(marks));
    
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const submitMarks = () => {
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix validation errors before submitting');
      return;
    }
    
    setSaveStatus('saving');
    // Save to localStorage (placeholder for API call)
    saveToLocalStorage();
    
    // Mock API submission
    setTimeout(() => {
      setSaveStatus('saved');
      alert('Marks submitted successfully! (Stored in localStorage for demo)');
    }, 1000);
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Mock CSV/Excel parsing
      alert(`File "${file.name}" uploaded. In production, this would parse the file and populate marks.`);
      // Placeholder: Parse CSV and populate marks state
    }
  };

  const exportTemplate = () => {
    // Generate CSV template
    const exam = examTypes.find(e => e.id === parseInt(selectedExam));
    const csv = [
      ['Student ID', 'Name', 'Roll Number', `Marks (out of ${exam?.totalMarks})`],
      ...students.map(s => [s.id, s.name, s.rollNumber, ''])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_template_${selectedClass}_${selectedExam}.csv`;
    a.click();
  };

  const selectedExamData = examTypes.find(e => e.id === parseInt(selectedExam));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Results Entry</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter examination marks for students</p>
        </div>

        {/* Entry Mode Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg mb-6 inline-flex gap-2">
          <button
            onClick={() => setEntryMode('manual')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              entryMode === 'manual'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Edit3 className="w-5 h-5" />
            Manual Entry
          </button>
          <button
            onClick={() => setEntryMode('bulk')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              entryMode === 'bulk'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Upload className="w-5 h-5" />
            Bulk Upload
          </button>
        </div>

        {/* Selection Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Examination Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class/Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Term/Period
              </label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Term</option>
                {terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exam Type
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Exam Type</option>
                {examTypes.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name} ({exam.totalMarks} marks)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={loadStudents}
              disabled={!selectedClass || !selectedExam || !selectedTerm}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Load Students
            </button>

            {entryMode === 'bulk' && (
              <button
                onClick={exportTemplate}
                disabled={!selectedClass || !selectedExam}
                className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                Download Template
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {entryMode === 'manual' && students.length > 0 && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Manual Entry Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Enter Marks ({selectedExamData?.totalMarks} marks)
                    </h2>
                    <div className="flex items-center gap-3">
                      {saveStatus === 'saved' && (
                        <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="w-5 h-5" />
                          Saved
                        </span>
                      )}
                      {saveStatus === 'saving' && (
                        <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Saving...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Roll No.</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Student ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Previous</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Marks Obtained</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Percentage</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {students.map((student, idx) => {
                        const mark = marks[student.id] || '';
                        const numMark = parseFloat(mark);
                        const percentage = !isNaN(numMark) ? ((numMark / selectedExamData?.totalMarks) * 100).toFixed(1) : '';
                        const hasError = validationErrors[student.id];

                        return (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                          >
                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{student.rollNumber}</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{student.id}</td>
                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{student.name}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{student.previousMarks || '-'}</td>
                            <td className="px-6 py-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  max={selectedExamData?.totalMarks}
                                  step="0.5"
                                  value={mark}
                                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                  className={`w-32 px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none ${
                                    hasError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                  }`}
                                  placeholder="0"
                                />
                                {hasError && (
                                  <div className="absolute top-full left-0 mt-1 text-xs text-red-600 dark:text-red-400">
                                    {hasError}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {percentage && (
                                <span className={`font-bold ${
                                  parseFloat(percentage) >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                                  parseFloat(percentage) >= 60 ? 'text-blue-600 dark:text-blue-400' :
                                  parseFloat(percentage) >= 40 ? 'text-amber-600 dark:text-amber-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {percentage}%
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {mark && !hasError ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              ) : hasError ? (
                                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                              ) : (
                                <Clock className="w-5 h-5 text-gray-400" />
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Database className="w-4 h-4 inline mr-2" />
                      Data stored in localStorage (demo mode)
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={saveToLocalStorage}
                        className="px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Save Draft
                      </button>
                      <button
                        onClick={submitMarks}
                        disabled={Object.keys(marks).length === 0 || Object.keys(validationErrors).length > 0}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Submit Marks
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {entryMode === 'bulk' && (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Bulk Upload UI */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <FileSpreadsheet className="w-20 h-20 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bulk Upload Marks</h2>
                  <p className="text-gray-600 dark:text-gray-400">Upload CSV or Excel file with student marks</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      id="bulk-upload"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleBulkUpload}
                      className="hidden"
                    />
                    <label htmlFor="bulk-upload" className="cursor-pointer">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        CSV or Excel files (MAX. 5MB)
                      </p>
                    </label>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Upload Instructions
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>• Download the template using the button above</li>
                      <li>• Fill in marks for each student</li>
                      <li>• Do not modify Student ID or Name columns</li>
                      <li>• Marks must be numeric and within the valid range</li>
                      <li>• Save as CSV or Excel format</li>
                      <li>• Upload the completed file</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
