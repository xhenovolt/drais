'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Book, Search, Moon, Sun, ChevronDown, ChevronRight, Home, FileText,
  DollarSign, BookOpen, Bus, Users, GraduationCap, Award, Building,
  Calendar, MessageSquare, Settings, BarChart3, Shield, Zap, CheckCircle,
  AlertCircle, Info, Play, Download, ExternalLink, Copy, Star, Target
} from 'lucide-react';

// Version 0.0.0039

const docCategories = [
  {
    name: "Getting Started",
    icon: Home,
    color: "blue",
    docs: [
      { title: "Introduction to DRAIS", slug: "introduction", readTime: "5 min", level: "Beginner" },
      { title: "Quick Start Guide", slug: "quick-start", readTime: "10 min", level: "Beginner" },
      { title: "System Requirements", slug: "requirements", readTime: "3 min", level: "Beginner" },
      { title: "User Roles & Permissions", slug: "roles-overview", readTime: "8 min", level: "Intermediate" },
    ]
  },
  {
    name: "Core Features",
    icon: Target,
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    docs: [
      { title: "Dashboard Overview", slug: "dashboard", readTime: "7 min", level: "Beginner" },
      { title: "Student Management", slug: "students", readTime: "12 min", level: "Intermediate" },
      { title: "Attendance Tracking", slug: "attendance", readTime: "10 min", level: "Intermediate" },
      { title: "Examination System", slug: "exams", readTime: "15 min", level: "Advanced" },
      { title: "Fee Management", slug: "fees", readTime: "12 min", level: "Intermediate" },
      { title: "Discipline Management", slug: "discipline", readTime: "8 min", level: "Intermediate" },
    ]
  },
  {
    name: "Communication",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    docs: [
      { title: "Messaging System", slug: "messaging", readTime: "10 min", level: "Beginner" },
      { title: "Announcements", slug: "announcements", readTime: "6 min", level: "Beginner" },
      { title: "Parent Portal", slug: "parent-portal", readTime: "8 min", level: "Intermediate" },
    ]
  },
  {
    name: "Advanced Features",
    icon: Brain,
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
    docs: [
      { title: "AI Teacher Assistant", slug: "ai-teacher", readTime: "15 min", level: "Advanced" },
      { title: "AI Copilot & Predictions", slug: "ai-copilot", readTime: "18 min", level: "Advanced" },
      { title: "Analytics Dashboard", slug: "analytics", readTime: "12 min", level: "Advanced" },
      { title: "Biometric Attendance", slug: "biometric", readTime: "10 min", level: "Advanced" },
    ]
  },
  {
    name: "Administration",
    icon: Shield,
    color: "from-orange-500 to-amber-600",
    bgColor: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
    docs: [
      { title: "Library Management", slug: "library", readTime: "10 min", level: "Intermediate" },
      { title: "Timetable System", slug: "timetable", readTime: "12 min", level: "Intermediate" },
      { title: "Payment Processing", slug: "payments", readTime: "15 min", level: "Advanced" },
      { title: "Audit Logs", slug: "audit", readTime: "8 min", level: "Advanced" },
      { title: "School Onboarding", slug: "onboarding", readTime: "20 min", level: "Advanced" },
    ]
  },
  {
    name: "Reports & Analytics",
    icon: BarChart3,
    color: "from-violet-500 to-purple-600",
    bgColor: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    docs: [
      { title: "Financial Reports", slug: "reports-finance", readTime: "10 min", level: "Intermediate" },
      { title: "Academic Reports", slug: "reports-academic", readTime: "12 min", level: "Intermediate" },
      { title: "Operations Dashboard", slug: "operations", readTime: "10 min", level: "Advanced" },
    ]
  },
];

const popularDocs = [
  { title: "Quick Start Guide", slug: "quick-start", icon: Zap, color: "text-yellow-600" },
  { title: "Student Management", slug: "students", icon: Users, color: "text-blue-600" },
  { title: "AI Copilot & Predictions", slug: "ai-copilot", icon: Brain, color: "text-purple-600" },
  { title: "Biometric Attendance", slug: "biometric", icon: Fingerprint, color: "text-green-600" },
  { title: "Payment Processing", slug: "payments", icon: CreditCard, color: "text-pink-600" },
  { title: "Analytics Dashboard", slug: "analytics", icon: BarChart3, color: "text-indigo-600" },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter docs based on search
  const filteredCategories = searchQuery.trim() === "" 
    ? docCategories 
    : docCategories.map(cat => ({
        ...cat,
        docs: cat.docs.filter(doc => 
          doc.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.docs.length > 0);

  const getLevelBadge = (level) => {
    const styles = {
      "Beginner": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      "Intermediate": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      "Advanced": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
    };
    return styles[level] || styles["Beginner"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">DRAIS Documentation</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8">
              Everything you need to master school management with DRAIS
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documentation... (e.g., attendance, payments, AI)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 border-none shadow-2xl"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                {docCategories.reduce((acc, cat) => acc + cat.docs.length, 0)} Guides
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Lightbulb className="w-4 h-4 mr-2" />
                Step-by-Step Tutorials
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Play className="w-4 h-4 mr-2" />
                Interactive Examples
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Popular Docs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Popular Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularDocs.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <Link href={`/docs/${doc.slug}`}>
                  <Card className="h-full bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doc.color === 'text-blue-600' ? 'from-blue-500 to-blue-600' : doc.color === 'text-purple-600' ? 'from-purple-500 to-purple-600' : doc.color === 'text-green-600' ? 'from-green-500 to-green-600' : doc.color === 'text-pink-600' ? 'from-pink-500 to-pink-600' : doc.color === 'text-indigo-600' ? 'from-indigo-500 to-indigo-600' : 'from-yellow-500 to-yellow-600'} flex items-center justify-center shadow-lg`}>
                          <doc.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{doc.title}</h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Documentation Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${category.bgColor} border-2 border-transparent hover:border-opacity-50`}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{category.name}</CardTitle>
                      <CardDescription className="text-base">
                        {category.docs.length} documentation {category.docs.length === 1 ? 'guide' : 'guides'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.docs.map((doc, docIndex) => (
                      <motion.div
                        key={docIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: docIndex * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <Link href={`/docs/${doc.slug}`}>
                          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer group">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {doc.title}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getLevelBadge(doc.level)}>
                                {doc.level}
                              </Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {doc.readTime}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No documentation found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try searching with different keywords
            </p>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <Lightbulb className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Need More Help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our AI-powered chatbot can help you navigate DRAIS features 
            and answer your questions in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat with AI Assistant
            </Button>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        DRAIS {DRAIS_VERSION} • Documentation Hub • Powered by Xhenvolt
      </div>
    </div>
  );
}
