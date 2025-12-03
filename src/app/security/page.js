"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRAIS_VERSION, DRAIS_INFO } from "@/lib/version";
import {
  Shield, Lock, Server, Eye, AlertTriangle, CheckCircle2,
  FileText, Users, Globe, Clock, Award, Zap, Target,
  Moon, Sun, ArrowRight, ExternalLink, Download, Mail,
  Key, Database, Network, Smartphone, Monitor, Cloud,
} from "lucide-react";
import Link from "next/link";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
    details: "All sensitive data is encrypted using industry-standard encryption protocols",
  },
  {
    icon: Key,
    title: "Multi-Factor Authentication",
    description: "Required MFA with support for TOTP, SMS, and hardware tokens",
    details: "Adds an extra layer of security beyond just passwords",
  },
  {
    icon: Database,
    title: "Secure Data Storage",
    description: "SOC 2 Type II certified data centers with 24/7 monitoring",
    details: "Your educational data is stored in world-class secure facilities",
  },
  {
    icon: Network,
    title: "Network Security",
    description: "Advanced firewalls, DDoS protection, and intrusion detection",
    details: "Multi-layered network defense systems protect against cyber threats",
  },
  {
    icon: Eye,
    title: "Continuous Monitoring", 
    description: "24/7 security monitoring with real-time threat detection",
    details: "AI-powered systems monitor for suspicious activities around the clock",
  },
  {
    icon: Users,
    title: "Access Controls",
    description: "Role-based permissions with principle of least privilege",
    details: "Users only have access to data necessary for their educational roles",
  },
];

const compliances = [
  {
    icon: FileText,
    title: "FERPA Compliant",
    description: "Full compliance with Family Educational Rights and Privacy Act",
    status: "Certified",
    color: "text-green-600",
  },
  {
    icon: Shield,
    title: "COPPA Compliant", 
    description: "Children's Online Privacy Protection Act compliance",
    status: "Certified",
    color: "text-green-600",
  },
  {
    icon: Globe,
    title: "GDPR Ready",
    description: "General Data Protection Regulation compliance for EU users",
    status: "Certified", 
    color: "text-green-600",
  },
  {
    icon: Award,
    title: "SOC 2 Type II",
    description: "Service Organization Control 2 certification",
    status: "Certified",
    color: "text-green-600",
  },
  {
    icon: Database,
    title: "PIPEDA Compliant",
    description: "Personal Information Protection and Electronic Documents Act",
    status: "Certified",
    color: "text-green-600",
  },
  {
    icon: Lock,
    title: "ISO 27001",
    description: "International information security management standard",
    status: "In Progress",
    color: "text-yellow-600",
  },
];

const securityPractices = [
  {
    category: "Data Protection",
    icon: Database,
    practices: [
      "Data minimization - we only collect what's necessary",
      "Regular data audits and cleanup procedures", 
      "Encrypted backups with geographic distribution",
      "Data retention policies aligned with regulations",
      "Secure data disposal and deletion procedures",
    ],
  },
  {
    category: "Access Management",
    icon: Users,
    practices: [
      "Single Sign-On (SSO) integration available",
      "Regular access reviews and deprovisioning",
      "Password complexity requirements and rotation",
      "Session timeout and concurrent login controls",
      "Audit logging of all access and changes",
    ],
  },
  {
    category: "Infrastructure Security",
    icon: Server,
    practices: [
      "Regular security patches and system updates",
      "Vulnerability scanning and penetration testing",
      "Network segmentation and micro-segmentation",
      "Redundant systems for high availability",
      "Disaster recovery and business continuity plans",
    ],
  },
  {
    category: "Application Security",
    icon: Globe,
    practices: [
      "Secure coding practices and code reviews",
      "Regular security testing and OWASP compliance",
      "Input validation and output encoding",
      "SQL injection and XSS protection",
      "Third-party security assessments",
    ],
  },
];

const incidentResponse = [
  {
    step: "1. Detection",
    description: "Automated systems and security team detect potential security incidents",
    timeframe: "Within minutes",
  },
  {
    step: "2. Assessment", 
    description: "Security team assesses the severity and scope of the incident",
    timeframe: "Within 30 minutes",
  },
  {
    step: "3. Containment",
    description: "Immediate steps taken to contain and limit the impact",
    timeframe: "Within 1 hour",
  },
  {
    step: "4. Investigation",
    description: "Detailed forensic analysis to understand the root cause",
    timeframe: "Within 4 hours",
  },
  {
    step: "5. Recovery",
    description: "Systems restored and security measures strengthened",
    timeframe: "Within 24 hours",
  },
  {
    step: "6. Communication",
    description: "Affected parties and authorities notified as required",
    timeframe: "Within regulatory requirements",
  },
];

export default function Security() {
  const { theme, toggleTheme } = useTheme();

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
              Security & Compliance
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enterprise-Grade Security
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your educational data deserves the highest level of protection. We implement comprehensive 
              security measures, maintain strict compliance standards, and provide transparent reporting 
              on our security posture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Security Whitepaper
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Compliance Certificates
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                SOC 2 Type II
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                FERPA Compliant
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                99.99% Uptime
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Comprehensive Security Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Multi-layered security architecture protecting your educational data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {feature.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Compliance & Certifications
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We maintain the highest standards of compliance with educational data protection regulations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {compliances.map((compliance, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-950/50 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                      <compliance.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{compliance.title}</CardTitle>
                    <Badge className={`${compliance.color} bg-transparent border-current`}>
                      {compliance.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {compliance.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Security Practices & Procedures
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive security measures across all aspects of our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {securityPractices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-950/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                        <practice.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{practice.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {practice.practices.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Incident Response Protocol
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our proven process for rapidly detecting, containing, and resolving security incidents
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {incidentResponse.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-white to-red-50/50 dark:from-gray-800 dark:to-red-950/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold">{step.step}</h3>
                              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                            </div>
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-600 text-white w-fit">
                              {step.timeframe}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-r from-red-500 to-orange-600 text-white max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Report a Security Issue</h3>
                </div>
                <p className="mb-4 text-red-100">
                  If you discover a potential security vulnerability, please report it immediately 
                  to our security team. We take all reports seriously and respond promptly.
                </p>
                <Button className="bg-white text-red-600 hover:bg-gray-100">
                  Report Security Issue <Mail className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Security Transparency */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transparency & Communication
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We believe in complete transparency about our security posture and practices. 
                You have the right to know how we protect your educational data.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Regular Security Reports</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Monthly security posture reports and annual compliance summaries
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Incident Notifications</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Prompt notification of any security incidents affecting your data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Security Documentation</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Comprehensive security documentation and compliance certificates
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Third-Party Audits</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Regular independent security assessments and penetration testing
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-8 h-8" />
                    <div>
                      <CardTitle className="text-xl">Security Dashboard</CardTitle>
                      <CardDescription className="text-blue-100">
                        Real-time security metrics and status
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>System Status</span>
                      <Badge className="bg-green-500 text-white">Secure</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Security Scan</span>
                      <span className="text-blue-100">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Uptime</span>
                      <span className="text-blue-100">99.99%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Threats</span>
                      <Badge className="bg-green-500 text-white">0</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8" />
                    <div>
                      <CardTitle className="text-xl">Compliance Score</CardTitle>
                      <CardDescription className="text-green-100">
                        Current compliance rating
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">98.7%</div>
                    <p className="text-green-100 text-sm">
                      Exceeds industry standards for educational data protection
                    </p>
                  </div>
                </CardContent>
              </Card>
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
              Ready to Secure Your School Data?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educational institutions that trust DRAIS with their most sensitive data. 
              Experience enterprise-grade security with educational focus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Request Security Demo <Shield className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  Contact Security Team
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