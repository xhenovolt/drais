'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Download, Eye, Printer, Share2, Calendar, User, FileText,
  CheckCircle, Settings, Sparkles, ChevronRight, Search, Filter,
  Grid, List, Plus, Edit, Trash2, Copy, Star
} from 'lucide-react';

export default function CertificateGeneration() {
  const [step, setStep] = useState(1); // 1: Type, 2: Student, 3: Customize, 4: Preview
  const [certificateType, setCertificateType] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [customizations, setCustomizations] = useState({
    title: '',
    description: '',
    issueDate: new Date().toISOString().split('T')[0],
    signatories: [],
    template: 'classic',
    orientation: 'landscape',
    logo: true,
    watermark: true,
    borderStyle: 'elegant'
  });
  const [previewData, setPreviewData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const certificateTypes = [
    { id: 'achievement', name: 'Academic Achievement', icon: Award, color: 'emerald', desc: 'For outstanding academic performance' },
    { id: 'completion', name: 'Course Completion', icon: CheckCircle, color: 'blue', desc: 'For completing a course or program' },
    { id: 'participation', name: 'Participation', icon: Star, color: 'amber', desc: 'For event or activity participation' },
    { id: 'excellence', name: 'Excellence Award', icon: Sparkles, color: 'purple', desc: 'For exceptional excellence in any field' },
    { id: 'tahfiz', name: 'Tahfiz Certificate', icon: FileText, color: 'indigo', desc: 'For Quran memorization milestones' },
    { id: 'custom', name: 'Custom Certificate', icon: Settings, color: 'gray', desc: 'Create a custom certificate' }
  ];

  // Student data will be fetched from database - no hardcoded mock data
  const mockStudents = [];

  const templates = [
    { id: 'classic', name: 'Classic Elegant', preview: 'Traditional border with formal layout' },
    { id: 'modern', name: 'Modern Minimal', preview: 'Clean design with modern typography' },
    { id: 'gold', name: 'Gold Premium', preview: 'Luxurious gold accents and ornate details' },
    { id: 'islamic', name: 'Islamic Pattern', preview: 'Beautiful Islamic geometric patterns' }
  ];

  const signatoryOptions = [
    { id: 'principal', name: 'Principal', title: 'School Principal' },
    { id: 'director', name: 'Academic Director', title: 'Director of Academics' },
    { id: 'coordinator', name: 'Exam Coordinator', title: 'Examinations Coordinator' }
  ];

  const handleTypeSelect = (type) => {
    setCertificateType(type);
    const selected = certificateTypes.find(t => t.id === type);
    setCustomizations({
      ...customizations,
      title: selected?.name || '',
      description: selected?.desc || ''
    });
    setStep(2);
  };

  const handleStudentToggle = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleGeneratePreview = () => {
    const preview = {
      type: certificateType,
      students: mockStudents.filter(s => selectedStudents.includes(s.id)),
      customizations,
      generatedAt: new Date().toISOString()
    };
    setPreviewData(preview);
    localStorage.setItem('certificate_preview', JSON.stringify(preview));
    setStep(4);
  };

  const handleGenerate = () => {
    const generatedCerts = {
      id: `CERT-${Date.now()}`,
      type: certificateType,
      students: selectedStudents,
      customizations,
      status: 'generated',
      generatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('generated_certificates') || '[]');
    existing.push(generatedCerts);
    localStorage.setItem('generated_certificates', JSON.stringify(existing));
    
    alert(`Successfully generated ${selectedStudents.length} certificate(s)!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Generate Certificates</h1>
          <p className="text-gray-600 dark:text-gray-400">Create professional certificates for your students</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Certificate Type', icon: Award },
              { num: 2, label: 'Select Students', icon: User },
              { num: 3, label: 'Customize', icon: Settings },
              { num: 4, label: 'Preview & Generate', icon: Eye }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s.num 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white scale-110 shadow-lg' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {step > s.num ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className={`font-semibold ${step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {s.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Step {s.num}</div>
                    </div>
                  </div>
                  {idx < 3 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${
                      step > s.num ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Certificate Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Certificate Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificateTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        certificateType === type.id
                          ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${type.color}-500 to-${type.color}-600 flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{type.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Students */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Students</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedStudents.length} selected
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {mockStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleStudentToggle(student.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStudents.includes(student.id)
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          selectedStudents.includes(student.id)
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{student.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{student.id} • {student.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold">
                          {student.achievements}
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedStudents.includes(student.id)
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedStudents.includes(student.id) && <CheckCircle className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedStudents.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to Customize
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Customize */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customize Certificate</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Certificate Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Certificate Title
                    </label>
                    <input
                      type="text"
                      value={customizations.title}
                      onChange={(e) => setCustomizations({ ...customizations, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="e.g., Certificate of Excellence"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={customizations.description}
                      onChange={(e) => setCustomizations({ ...customizations, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                      placeholder="Brief description or achievement details"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={customizations.issueDate}
                      onChange={(e) => setCustomizations({ ...customizations, issueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Template & Design */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Template Design
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setCustomizations({ ...customizations, template: template.id })}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            customizations.template === template.id
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{template.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{template.preview}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Orientation
                    </label>
                    <div className="flex gap-3">
                      {['landscape', 'portrait'].map((orient) => (
                        <button
                          key={orient}
                          onClick={() => setCustomizations({ ...customizations, orientation: orient })}
                          className={`flex-1 px-4 py-3 rounded-xl border-2 font-semibold capitalize transition-all ${
                            customizations.orientation === orient
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {orient}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'logo', label: 'Include School Logo' },
                      { key: 'watermark', label: 'Add Watermark' }
                    ].map((option) => (
                      <label key={option.key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customizations[option.key]}
                          onChange={(e) => setCustomizations({ ...customizations, [option.key]: e.target.checked })}
                          className="w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleGeneratePreview}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  Generate Preview
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Preview & Generate */}
          {step === 4 && previewData && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preview & Generate</h2>
              
              {/* Certificate Preview */}
              <div className="mb-6 p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-4 border-amber-500 rounded-2xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{customizations.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">{customizations.description}</p>
                  <div className="pt-4 text-gray-600 dark:text-gray-400">
                    <p className="font-semibold">Awarded to: {previewData.students.length} Student(s)</p>
                    <p className="text-sm mt-2">Issued on: {customizations.issueDate}</p>
                  </div>
                  <div className="pt-6 text-xs text-gray-500 dark:text-gray-500">
                    Template: {customizations.template} • {customizations.orientation}
                  </div>
                </div>
              </div>

              {/* Student List */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Recipients ({previewData.students.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {previewData.students.map((student) => (
                    <div key={student.id} className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm">
                      <div className="font-semibold text-gray-900 dark:text-white">{student.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{student.id}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Generate Certificates
                </button>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
