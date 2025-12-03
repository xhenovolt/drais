"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRAIS_VERSION, DRAIS_INFO } from "@/lib/version";
import {
  Scale, FileText, Shield, Users, AlertTriangle, Clock, 
  CreditCard, Ban, RefreshCw, ExternalLink, Download,
  Moon, Sun, ArrowRight, Mail, CheckCircle2, XCircle,
} from "lucide-react";
import Link from "next/link";

const tableOfContents = [
  { id: "acceptance", title: "Acceptance of Terms", icon: CheckCircle2 },
  { id: "definitions", title: "Definitions", icon: FileText },
  { id: "services", title: "Description of Services", icon: Users },
  { id: "accounts", title: "User Accounts & Registration", icon: Shield },
  { id: "acceptable-use", title: "Acceptable Use Policy", icon: Scale },
  { id: "prohibited", title: "Prohibited Activities", icon: Ban },
  { id: "content", title: "Content & Intellectual Property", icon: FileText },
  { id: "privacy", title: "Privacy & Data Protection", icon: Shield },
  { id: "payment", title: "Payment Terms", icon: CreditCard },
  { id: "termination", title: "Termination & Suspension", icon: XCircle },
  { id: "liability", title: "Disclaimers & Liability", icon: AlertTriangle },
  { id: "changes", title: "Modifications to Terms", icon: RefreshCw },
  { id: "governing-law", title: "Governing Law", icon: Scale },
  { id: "contact", title: "Contact Information", icon: Mail },
];

const keyTerms = [
  {
    icon: Users,
    title: "Educational Use Only",
    description: "DRAIS is designed exclusively for legitimate educational purposes and school administration",
  },
  {
    icon: Shield,
    title: "Data Protection",
    description: "We maintain strict data security standards and comply with FERPA, COPPA, and GDPR regulations",
  },
  {
    icon: Scale,
    title: "Fair Use",
    description: "Users must comply with our acceptable use policy and respect intellectual property rights",
  },
  {
    icon: RefreshCw,
    title: "Service Availability",
    description: "We strive for 99.9% uptime with scheduled maintenance windows and transparent status updates",
  },
];

export default function TermsOfService() {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:bg-gradient-to-bl dark:from-blue-950 dark:via-gray-950 dark:to-black text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
      >
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <DraisLogo className="w-10 h-10" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {DRAIS_INFO.name}
                </span>
                <div className="text-xs text-gray-500">v{DRAIS_VERSION}</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Scale className="w-4 h-4 mr-2" />
              Terms of Service
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              These terms govern your use of the DRAIS platform and outline the rights and 
              responsibilities of both users and Xhenvolt as we work together to improve education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Link href="/privacy-policy">
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Privacy Policy
                </Button>
              </Link>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Last updated: December 15, 2024 • Effective: January 1, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Terms Summary */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Key Terms at a Glance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Essential points about using DRAIS and our educational platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyTerms.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <term.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{term.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {term.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSection(item.id)}
                        className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm"
                      >
                        <item.icon className="w-4 h-4 text-blue-600" />
                        <span>{item.title}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Terms Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 mb-8">
                  <CardContent className="p-8">
                    {/* Acceptance */}
                    <section id="acceptance" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          Acceptance of Terms
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        By accessing or using the DRAIS platform, you agree to be bound by these Terms of Service 
                        and all applicable laws and regulations. If you do not agree with any of these terms, 
                        you are prohibited from using or accessing this platform.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        These terms apply to all users of the platform, including but not limited to school 
                        administrators, teachers, students, parents, and other authorized users. Your school 
                        or educational institution must have a valid subscription agreement with Xhenvolt 
                        for you to access the platform.
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          <strong>Important:</strong> These terms constitute a legally binding agreement. 
                          Please read them carefully before using DRAIS.
                        </p>
                      </div>
                    </section>

                    {/* Definitions */}
                    <section id="definitions" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Definitions
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">"Platform" or "DRAIS"</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            The Digital Resource Administration and Information System software, including all 
                            associated websites, applications, services, and features provided by Xhenvolt.
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">"Educational Institution" or "School"</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Any educational organization that has entered into a subscription agreement with 
                            Xhenvolt to use DRAIS for their school management needs.
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">"User" or "You"</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Any individual authorized by an Educational Institution to access and use the DRAIS platform.
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">"Educational Data"</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Any data or information input, uploaded, or generated through the use of DRAIS, 
                            including student records, grades, attendance, and other school-related information.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Services */}
                    <section id="services" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                          Description of Services
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        DRAIS provides comprehensive school management software designed to help educational 
                        institutions streamline their operations, manage student information, and improve 
                        educational outcomes.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Core Services Include:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                          <li>• Student information management</li>
                          <li>• Attendance tracking and reporting</li>
                          <li>• Grade management and transcripts</li>
                          <li>• Parent-teacher communication tools</li>
                          <li>• Class and schedule management</li>
                          <li>• Fee management and billing</li>
                        </ul>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                          <li>• Disciplinary record management</li>
                          <li>• Examination and assessment tools</li>
                          <li>• Staff management and payroll</li>
                          <li>• Analytics and reporting dashboard</li>
                          <li>• Mobile access and notifications</li>
                          <li>• Integration capabilities</li>
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-950/50 p-4 rounded-lg">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          <strong>Service Availability:</strong> We strive to maintain 99.9% uptime but may 
                          occasionally need to perform maintenance. We will provide advance notice of scheduled downtime.
                        </p>
                      </div>
                    </section>

                    {/* User Accounts */}
                    <section id="accounts" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          User Accounts & Registration
                        </h2>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4">Account Creation</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        User accounts are created and managed by your educational institution's authorized 
                        administrators. Individual users cannot directly create accounts without institutional approval.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Account Responsibilities</h3>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>You are responsible for maintaining the confidentiality of your login credentials</li>
                        <li>You must notify your administrator immediately of any unauthorized account access</li>
                        <li>You agree to provide accurate and complete information when using the platform</li>
                        <li>You are responsible for all activities that occur under your account</li>
                        <li>You must comply with your institution's policies regarding platform usage</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mb-4">Account Security</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Required Security Measures</h4>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• Strong, unique passwords</li>
                            <li>• Enable multi-factor authentication (MFA)</li>
                            <li>• Regular password updates</li>
                            <li>• Secure logout from shared devices</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-red-800 dark:text-red-200">Security Violations</h4>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Sharing login credentials</li>
                            <li>• Using compromised passwords</li>
                            <li>• Accessing others' accounts</li>
                            <li>• Bypassing security measures</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Acceptable Use */}
                    <section id="acceptable-use" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                          <Scale className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                          Acceptable Use Policy
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        DRAIS must be used solely for legitimate educational and administrative purposes. 
                        You agree to use the platform responsibly and in accordance with applicable laws and regulations.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Acceptable Uses</h3>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Managing student information and academic records</li>
                        <li>Facilitating communication between educators, students, and parents</li>
                        <li>Tracking attendance, grades, and academic progress</li>
                        <li>Generating reports and analytics for educational improvement</li>
                        <li>Administering school operations and processes</li>
                        <li>Conducting legitimate educational research (with proper authorization)</li>
                      </ul>
                    </section>

                    {/* Prohibited Activities */}
                    <section id="prohibited" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
                          <Ban className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                          Prohibited Activities
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        The following activities are strictly prohibited and may result in immediate account 
                        suspension or termination:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Security Violations</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• Attempting to breach system security</li>
                            <li>• Unauthorized access to data or accounts</li>
                            <li>• Sharing login credentials with others</li>
                            <li>• Installing malware or harmful software</li>
                            <li>• Reverse engineering the platform</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Data Misuse</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• Using educational data for commercial purposes</li>
                            <li>• Sharing student information inappropriately</li>
                            <li>• Violating privacy and confidentiality rules</li>
                            <li>• Creating false or misleading records</li>
                            <li>• Bulk downloading sensitive data</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Payment Terms */}
                    <section id="payment" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Payment Terms
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Payment terms are established through separate subscription agreements between Xhenvolt 
                        and educational institutions. Individual users do not have direct payment obligations.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Institutional Billing</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Annual or monthly subscription options</li>
                            <li>• Pricing based on student enrollment</li>
                            <li>• Volume discounts for large institutions</li>
                            <li>• 30-day payment terms for invoices</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Service Interruption</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• 30-day grace period for overdue payments</li>
                            <li>• Service suspension after grace period</li>
                            <li>• Data retention during suspension period</li>
                            <li>• Full restoration upon payment</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Termination */}
                    <section id="termination" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                          <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          Termination & Suspension
                        </h2>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4">Grounds for Termination</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        We may suspend or terminate your access to DRAIS immediately, without prior notice, for:
                      </p>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Violation of these Terms of Service</li>
                        <li>Breach of your institution's subscription agreement</li>
                        <li>Suspected fraudulent, abusive, or illegal activity</li>
                        <li>Failure to comply with data protection regulations</li>
                        <li>Unauthorized access attempts or security violations</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mb-4">Effect of Termination</h3>
                      <div className="bg-yellow-50 dark:bg-yellow-950/50 p-4 rounded-lg">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          Upon termination, your right to access DRAIS ceases immediately. Your institution 
                          may export their data within 90 days of termination, after which data may be deleted 
                          according to our retention policy.
                        </p>
                      </div>
                    </section>

                    {/* Liability */}
                    <section id="liability" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-600 rounded-lg">
                          <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
                          Disclaimers & Limitation of Liability
                        </h2>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4">Service Disclaimers</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        DRAIS is provided "as is" without warranties of any kind. While we strive for excellence, 
                        we cannot guarantee that the service will be error-free or uninterrupted.
                      </p>
                      
                      <h3 className="text-xl font-semibold mb-4">Limitation of Liability</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        To the maximum extent permitted by law, Xhenvolt's total liability for any claims 
                        arising from or related to DRAIS shall not exceed the amount paid by your institution 
                        for the service in the 12 months preceding the claim.
                      </p>
                      
                      <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-lg">
                        <p className="text-red-800 dark:text-red-200 text-sm">
                          <strong>Important:</strong> We are not liable for indirect, incidental, special, 
                          consequential, or punitive damages, including loss of profits, data, or business opportunities.
                        </p>
                      </div>
                    </section>

                    {/* Contact Information */}
                    <section id="contact" className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          Contact Information
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Questions about these Terms of Service? Contact our legal team:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Legal Department
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Email: legal@xhenvolt.com
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Response time: Within 5 business days
                          </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Mailing Address</h4>
                          <address className="text-sm text-gray-600 dark:text-gray-300 not-italic">
                            Xhenvolt Legal Department<br />
                            350 5th Avenue, Suite 2500<br />
                            New York, NY 10118<br />
                            United States
                          </address>
                        </div>
                      </div>
                    </section>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Questions About Our Terms?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our legal team is available to clarify any aspects of these terms 
              and help ensure compliance with your institutional needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Contact Legal Team <Mail className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/privacy-policy">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  View Privacy Policy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-8 px-4 lg:px-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">{DRAIS_INFO.copyright} Version {DRAIS_VERSION}</p>
        </div>
      </footer>
    </div>
  );
}