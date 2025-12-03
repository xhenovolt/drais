"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRAIS_VERSION, DRAIS_INFO } from "@/lib/version";
import {
  Shield, Eye, Lock, Server, Users, FileText, AlertTriangle,
  Clock, Mail, Phone, ArrowRight, CheckCircle2, Globe,
  Moon, Sun, ExternalLink, Download, Scale,
} from "lucide-react";
import Link from "next/link";

const tableOfContents = [
  { id: "overview", title: "Privacy Policy Overview", icon: Eye },
  { id: "collection", title: "Information We Collect", icon: FileText },
  { id: "usage", title: "How We Use Information", icon: Users },
  { id: "sharing", title: "Information Sharing", icon: Globe },
  { id: "security", title: "Data Security", icon: Shield },
  { id: "storage", title: "Data Storage & Retention", icon: Server },
  { id: "rights", title: "Your Privacy Rights", icon: Scale },
  { id: "cookies", title: "Cookies & Tracking", icon: AlertTriangle },
  { id: "children", title: "Children's Privacy", icon: Users },
  { id: "updates", title: "Policy Updates", icon: Clock },
  { id: "contact", title: "Contact Information", icon: Mail },
];

const keyPoints = [
  {
    icon: Shield,
    title: "FERPA Compliant",
    description: "Full compliance with educational privacy regulations including FERPA, COPPA, and GDPR",
  },
  {
    icon: Lock,
    title: "Data Encryption",
    description: "End-to-end encryption for all data transmission and storage using industry standards",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "SOC 2 Type II certified data centers with 24/7 monitoring and security controls",
  },
  {
    icon: Users,
    title: "Minimal Data Collection",
    description: "We only collect data necessary to provide our educational services effectively",
  },
];

export default function PrivacyPolicy() {
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
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your educational data. 
              This policy explains how we collect, use, and safeguard your information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Terms of Service
              </Button>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Last updated: December 15, 2024 • Effective: January 1, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Privacy Points */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy at a Glance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Key commitments we make to protect your educational data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyPoints.map((point, index) => (
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
                      <point.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {point.description}
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

            {/* Privacy Policy Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 mb-8">
                  <CardContent className="p-8">
                    {/* Overview */}
                    <section id="overview" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Privacy Policy Overview
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        At Xhenvolt, we understand that educational institutions handle some of the most sensitive 
                        personal information - data about students, their families, and their educational journey. 
                        We take this responsibility seriously and are committed to maintaining the highest standards 
                        of data protection and privacy.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        This Privacy Policy applies to all users of the DRAIS platform, including school 
                        administrators, teachers, students, parents, and other authorized users. It covers how we 
                        collect, use, share, and protect personal information in connection with our services.
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          <strong>Important:</strong> We are fully compliant with FERPA, COPPA, GDPR, and other 
                          applicable privacy regulations. Educational records are never sold or used for commercial purposes.
                        </p>
                      </div>
                    </section>

                    {/* Information Collection */}
                    <section id="collection" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                          Information We Collect
                        </h2>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Educational Records</h3>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Student enrollment information (name, date of birth, grade level)</li>
                        <li>Academic records (grades, attendance, assignments, assessments)</li>
                        <li>Behavioral and disciplinary records</li>
                        <li>Special education and accommodation records</li>
                        <li>Parent/guardian contact information</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold mb-4">Account Information</h3>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>User login credentials (username, encrypted password)</li>
                        <li>User roles and permissions within the school system</li>
                        <li>Profile information and preferences</li>
                        <li>Communication preferences and settings</li>
                      </ul>

                      <h3 className="text-xl font-semibold mb-4">Technical Information</h3>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li>Device information (IP address, browser type, operating system)</li>
                        <li>Usage data (login times, features accessed, session duration)</li>
                        <li>Performance and error logs for system improvement</li>
                        <li>Security logs for fraud prevention and system protection</li>
                      </ul>
                    </section>

                    {/* How We Use Information */}
                    <section id="usage" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          How We Use Information
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        We use the information we collect solely for legitimate educational purposes and to provide 
                        our school management services effectively:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Service Provision
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Student information management</li>
                            <li>• Grade and attendance tracking</li>
                            <li>• Parent-teacher communication</li>
                            <li>• Report generation and analytics</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            System Improvement
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Platform performance optimization</li>
                            <li>• Security monitoring and enhancement</li>
                            <li>• Feature development and testing</li>
                            <li>• Customer support and troubleshooting</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Data Sharing */}
                    <section id="sharing" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          Information Sharing
                        </h2>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-lg mb-6">
                        <p className="text-red-800 dark:text-red-200 font-semibold">
                          We never sell, rent, or trade educational data for commercial purposes.
                        </p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        We may share information only in the following limited circumstances:
                      </p>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li><strong>With Your School:</strong> Information is accessible to authorized school personnel according to their assigned roles and permissions</li>
                        <li><strong>Service Providers:</strong> Trusted third-party vendors who help us operate our platform (all bound by strict data protection agreements)</li>
                        <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect safety and security</li>
                        <li><strong>Business Transfers:</strong> In connection with corporate transactions (with continued privacy protection guarantees)</li>
                      </ul>
                    </section>

                    {/* Data Security */}
                    <section id="security" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Data Security
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        We implement comprehensive security measures to protect your educational data:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold mb-3">Technical Safeguards</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• AES-256 encryption for data at rest</li>
                            <li>• TLS 1.3 encryption for data in transit</li>
                            <li>• Multi-factor authentication (MFA)</li>
                            <li>• Regular security audits and penetration testing</li>
                            <li>• SOC 2 Type II compliance</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Administrative Safeguards</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• Role-based access controls</li>
                            <li>• Employee background checks</li>
                            <li>• Privacy and security training</li>
                            <li>• Incident response procedures</li>
                            <li>• Regular security assessments</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Data Storage & Retention */}
                    <section id="storage" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                          <Server className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          Data Storage & Retention
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        Your data is stored securely in SOC 2 Type II certified data centers with appropriate 
                        geographic restrictions and backup procedures.
                      </p>
                      <h4 className="font-semibold mb-3">Retention Periods</h4>
                      <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                        <li><strong>Active Student Records:</strong> Retained while the student is enrolled and for the duration specified by school policy</li>
                        <li><strong>User Account Data:</strong> Retained while the account is active and for up to 90 days after closure</li>
                        <li><strong>System Logs:</strong> Retained for up to 13 months for security and performance monitoring</li>
                        <li><strong>Backup Data:</strong> Retained according to our disaster recovery procedures (maximum 7 years)</li>
                      </ul>
                    </section>

                    {/* Your Rights */}
                    <section id="rights" className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
                          <Scale className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                          Your Privacy Rights
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        You have important rights regarding your personal information. These rights may vary based 
                        on your location and applicable privacy laws:
                      </p>
                      
                      <div className="space-y-4">
                        {[
                          { title: "Access", description: "Request a copy of the personal information we hold about you" },
                          { title: "Correction", description: "Request correction of inaccurate or incomplete information" },
                          { title: "Deletion", description: "Request deletion of your personal information (subject to legal requirements)" },
                          { title: "Portability", description: "Request transfer of your data to another service provider" },
                          { title: "Restriction", description: "Request limitation of how we process your information" },
                          { title: "Objection", description: "Object to certain types of data processing" },
                        ].map((right, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">{right.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{right.description}</p>
                          </div>
                        ))}
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
                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Privacy Officer
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Email: privacy@xhenvolt.com
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Response time: Within 72 hours
                          </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Data Protection Team
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Phone: +1 (555) 123-PRIVACY
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Hours: Monday - Friday, 9 AM - 6 PM EST
                          </p>
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
              Questions About Privacy?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our privacy team is here to help you understand how we protect your educational data 
              and answer any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Contact Privacy Team <Mail className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/security">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  View Security Page
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