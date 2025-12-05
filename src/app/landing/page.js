'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Check, Star, TrendingUp, Shield, Clock, Users, DollarSign,
  BookOpen, Bus, Award, MessageSquare, BarChart3, Smartphone, Zap,
  Target, Heart, Brain, Globe, Lock, CheckCircle, ChevronRight,
  Sparkles, TrendingDown, AlertCircle, Bell, Building
} from 'lucide-react';

// Version 0.0.0039 - DRAIS Marketing Landing Page

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const benefits = [
    {
      icon: Clock,
      title: 'Save 20+ Hours Weekly',
      description: 'Automate administrative tasks that consume your staff\'s time. Fee tracking, attendance, report cards, and certificate generation - all automated.',
      impact: 'Time Savings',
      color: 'blue'
    },
    {
      icon: DollarSign,
      title: 'Complete Financial Transparency',
      description: 'Real-time income statements, balance sheets, and cash flow analysis. Know your school\'s financial health at any moment with actionable insights.',
      impact: 'Financial Control',
      color: 'emerald'
    },
    {
      icon: TrendingUp,
      title: 'Improve Academic Performance',
      description: 'Data-driven student performance tracking helps identify struggling students early. Targeted interventions lead to measurable improvement.',
      impact: 'Academic Excellence',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Strengthen Parent Engagement',
      description: 'Direct communication channels, real-time progress updates, and transparent fee tracking build trust with parents.',
      impact: 'Parent Relations',
      color: 'amber'
    },
    {
      icon: Shield,
      title: 'Enhanced Security & Compliance',
      description: 'Role-based access controls, complete audit trails, and enterprise-grade data protection ensure regulatory compliance.',
      impact: 'Data Security',
      color: 'red'
    },
    {
      icon: BarChart3,
      title: 'Make Data-Driven Decisions',
      description: 'Comprehensive reports across all modules provide insights that drive strategic improvements and operational efficiency.',
      impact: 'Strategic Planning',
      color: 'indigo'
    }
  ];

  const modules = [
    {
      icon: DollarSign,
      name: 'Finance Management',
      description: 'Fee collection, expense tracking, income statements, balance sheets, and financial analytics',
      benefits: ['Automated fee tracking', 'Mobile money integration', 'Financial insights', 'Overdue alerts']
    },
    {
      icon: BookOpen,
      name: 'Library System',
      description: 'Book cataloging, borrowing tracking, fine management, and circulation analytics',
      benefits: ['ISBN cataloging', 'Automated fines', 'Member management', 'Popular books analytics']
    },
    {
      icon: Bus,
      name: 'Transport Management',
      description: 'Route planning, vehicle tracking, driver management, and transport fee collection',
      benefits: ['Route optimization', 'Safety tracking', 'Maintenance scheduling', 'Parent notifications']
    },
    {
      icon: Users,
      name: 'Parent Portal',
      description: 'Direct parent access to student progress, fees, attendance, and teacher communication',
      benefits: ['Real-time updates', 'Fee transparency', 'Message teachers', 'View certificates']
    },
    {
      icon: Award,
      name: 'Academic Management',
      description: 'Class scheduling, attendance, grading, performance monitoring, and curriculum planning',
      benefits: ['Automated timetables', 'Attendance analytics', 'Grade tracking', 'Progress reports']
    },
    {
      icon: Star,
      name: 'Tahfiz Program',
      description: 'Quran memorization tracking with verse-level progress, accuracy scoring, and certificates',
      benefits: ['Verse tracking', 'Accuracy scoring', 'Milestone alerts', 'Juz certificates']
    },
    {
      icon: MessageSquare,
      name: 'Messaging System',
      description: 'Internal communication for staff, teachers, students, and parents with attachments',
      benefits: ['Direct messaging', 'Group broadcasts', 'Read receipts', 'File attachments']
    },
    {
      icon: CheckCircle,
      name: 'Examinations',
      description: 'Exam scheduling, marks entry (manual/bulk), grading automation, and results publishing',
      benefits: ['Bulk upload', 'Auto-grading', 'Report cards', 'Performance analytics']
    },
    {
      icon: Award,
      name: 'Certificates',
      description: 'Generate professional certificates for achievements, completions, and excellence awards',
      benefits: ['Multiple templates', 'Bulk generation', 'Digital signatures', 'Unique verification']
    },
    {
      icon: Brain,
      name: 'Intelligence Module',
      description: 'AI-powered insights, predictive analytics, and automated recommendations (Premium/Gold)',
      benefits: ['Predictive insights', 'Risk detection', 'Auto-recommendations', 'Trend analysis'],
      premium: true
    }
  ];

  const testimonials = [
    {
      name: 'Sr. Aisha Nakato',
      role: 'Head Teacher, Kampala Islamic Academy',
      quote: 'DRAIS transformed our school operations. Fee collection that used to take days now takes hours. Our profit margin improved by 8% in the first year.',
      rating: 5,
      school: 'Kampala, Uganda'
    },
    {
      name: 'Mr. Ibrahim Ssemwanga',
      role: 'School Administrator, Crescent Secondary School',
      quote: 'The financial transparency alone is worth it. Board meetings now have real data, not estimates. Parents trust us more because everything is documented.',
      rating: 5,
      school: 'Entebbe, Uganda'
    },
    {
      name: 'Mrs. Fatuma Nambi',
      role: 'Finance Director, Al-Noor Schools Network',
      quote: 'Managing 5 campuses used to be overwhelming. DRAIS gave us centralized reporting across all schools. We identified UGX 45M in uncollected fees in the first month.',
      rating: 5,
      school: 'Mukono, Uganda'
    }
  ];

  const stats = [
    { label: 'Schools Using DRAIS', value: '250+', icon: Building },
    { label: 'Students Managed', value: '150K+', icon: Users },
    { label: 'Hours Saved Monthly', value: '80K+', icon: Clock },
    { label: 'Average Fee Collection Rate', value: '94%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Trusted by 250+ Schools Across Uganda
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              School Management<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Made Simple & Powerful
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Save 20+ hours weekly, improve fee collection by 15%, and gain complete visibility into your school operations. DRAIS is the all-in-one platform decision-makers trust.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/documentation">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 dark:border-gray-700 flex items-center gap-2"
                >
                  View Documentation
                  <BookOpen className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Cancel anytime
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-3">
                  {React.createElement(stat.icon, { className: 'w-8 h-8 text-blue-600 dark:text-blue-400' })}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Schools Choose DRAIS
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            More than software - a strategic partner in delivering educational excellence and operational efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-r from-${benefit.color}-100 to-${benefit.color}-200 dark:from-${benefit.color}-900/30 dark:to-${benefit.color}-800/30 rounded-xl flex items-center justify-center mb-4`}>
                {React.createElement(benefit.icon, { className: `w-6 h-6 text-${benefit.color}-600 dark:text-${benefit.color}-400` })}
              </div>
              <div className="mb-2">
                <span className={`text-xs font-semibold px-2 py-1 bg-${benefit.color}-100 dark:bg-${benefit.color}-900/30 text-${benefit.color}-600 dark:text-${benefit.color}-400 rounded`}>
                  {benefit.impact}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modules Showcase */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete School Management in One Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              13+ integrated modules covering every aspect of school operations - from finance to academics to parent engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 ${module.premium ? 'border-amber-300 dark:border-amber-700' : 'border-gray-200 dark:border-gray-700'} hover:shadow-xl transition-all relative`}
              >
                {module.premium && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full">
                      PREMIUM
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center">
                    {React.createElement(module.icon, { className: 'w-6 h-6 text-blue-600 dark:text-blue-400' })}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{module.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.benefits.map((benefit, bidx) => (
                    <li key={bidx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Educational Leaders
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Real results from schools like yours
          </p>
        </div>

        <div className="relative">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-12 border border-blue-200 dark:border-blue-800 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-6">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <blockquote className="text-2xl font-medium text-gray-900 dark:text-white mb-6 leading-relaxed">
              "{testimonials[activeTestimonial].quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {testimonials[activeTestimonial].name.split(' ')[0][0]}{testimonials[activeTestimonial].name.split(' ')[1][0]}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{testimonials[activeTestimonial].name}</div>
                <div className="text-gray-600 dark:text-gray-400">{testimonials[activeTestimonial].role}</div>
                <div className="text-sm text-gray-500 dark:text-gray-500">{testimonials[activeTestimonial].school}</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === idx ? 'bg-blue-600 w-8' : 'bg-gray-300 dark:bg-gray-700'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join 250+ schools saving 20+ hours weekly and improving operations with DRAIS. Start your free 14-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-started">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                View Pricing
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-75">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">DRAIS</h3>
              <p className="text-gray-400 text-sm">
                Digital Resource Administration & Intelligence System
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/documentation">Documentation</Link></li>
                <li><Link href="/demo">Request Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about-xhenvolt">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} DRAIS by Xhenvolt. All rights reserved. • Version 0.0.0039
          </div>
        </div>
      </footer>
    </div>
  );
}
