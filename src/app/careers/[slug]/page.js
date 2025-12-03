"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  ArrowLeft, MapPin, Clock, DollarSign, Users, CheckCircle2, 
  Moon, Sun, ArrowRight, Calendar, Building2, Phone, Mail,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Job data - matching the careers page
const jobs = [
  {
    id: "secretary",
    title: "Secretary",
    department: "Administration",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time",
    salary: "UGX 700,000 - 1,200,000",
    posted: "2 days ago",
    requirements: [
      "Bachelor's degree in Business Administration or related field",
      "Excellent organizational and communication skills",
      "Proficiency in computer applications (MS Office, email)",
      "Attention to detail and ability to multitask",
      "Previous office experience preferred",
    ],
    responsibilities: [
      "Manage office correspondence and communications", 
      "Coordinate meetings and appointments",
      "Maintain filing systems and office organization",
      "Support management and staff with administrative tasks",
      "Handle phone calls and visitor reception",
    ],
    benefits: [
      "Competitive salary in Uganda Shillings",
      "Health insurance coverage",
      "Professional development opportunities",
      "Friendly work environment",
      "Career growth potential",
    ],
  },
  {
    id: "customer-success",
    title: "Customer Success Officer", 
    department: "Customer Support",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time",
    salary: "UGX 900,000 - 1,500,000",
    posted: "1 week ago",
    requirements: [
      "Degree in any field, preferably Education or Business",
      "Strong interpersonal and communication skills",
      "Experience in customer support or training",
      "Ability to train and onboard school staff",
      "Problem-solving and analytical thinking",
    ],
    responsibilities: [
      "Onboard new schools and train staff on DRAIS system",
      "Provide ongoing technical support to client schools",
      "Conduct training sessions and workshops",
      "Build strong relationships with school administrators",
      "Gather feedback and communicate with development team",
    ],
    benefits: [
      "Attractive salary with performance bonuses",
      "Travel opportunities across Uganda",
      "Skills development in EdTech sector",
      "Direct impact on education quality",
      "Collaborative team environment",
    ],
  },
  {
    id: "software-engineer",
    title: "Software Engineer (Full-stack)",
    department: "Development",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time", 
    salary: "UGX 2,000,000 - 4,500,000",
    posted: "3 days ago",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "Strong proficiency in JavaScript/TypeScript",
      "Experience with Next.js, React, and modern web technologies",
      "Knowledge of PHP, MySQL, and Linux server administration",
      "Experience with Git version control and collaborative development",
    ],
    responsibilities: [
      "Develop and maintain DRAIS modules and features",
      "Build robust APIs and database systems", 
      "Collaborate on system architecture and design decisions",
      "Implement security best practices and data protection",
      "Participate in code reviews and technical documentation",
    ],
    benefits: [
      "Highly competitive salary in Uganda",
      "Latest development tools and equipment",
      "Continuous learning and technology training",
      "Remote work flexibility",
      "Equity participation opportunities",
    ],
  },
  {
    id: "sales-manager",
    title: "Sales Manager",
    department: "Sales & Marketing",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time",
    salary: "UGX 1,500,000 - 3,000,000 + commissions",
    posted: "5 days ago", 
    requirements: [
      "Bachelor's degree in Business, Marketing, or related field",
      "Proven sales experience, preferably in education or technology",
      "Knowledge of Brian Tracy sales techniques and methodologies",
      "Strong presentation and negotiation skills",
      "Ability to travel within Uganda for client meetings",
    ],
    responsibilities: [
      "Manage and lead field sales teams across Uganda",
      "Identify and prospect new school clients",
      "Conduct product demonstrations and presentations",
      "Develop sales strategies and achieve revenue targets",
      "Build long-term relationships with school decision makers",
    ],
    benefits: [
      "Base salary plus attractive commission structure",
      "Company vehicle or travel allowances",
      "Sales training and professional development",
      "Performance bonuses and incentives",
      "Leadership development opportunities",
    ],
  },
];

export default function JobPage({ params }) {
  const { theme, toggleTheme } = useTheme();
  const job = jobs.find(j => j.id === params.slug);

  if (!job) {
    notFound();
  }

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

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/careers">
              <Button variant="ghost" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Careers
              </Button>
            </Link>
          </motion.div>

          {/* Job Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {job.department}
                    </Badge>
                    <CardTitle className="text-3xl lg:text-4xl mb-4">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{XHENVOLT_DATA.company.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-4">
                      {job.salary}
                    </div>
                    <Link href="/careers/apply">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Job Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>About This Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Join {XHENVOLT_DATA.company.name} as a {job.title} and play a crucial role in 
                      transforming education across Uganda. This position offers an exciting opportunity 
                      to work with cutting-edge technology while making a direct impact on schools and 
                      students throughout East Africa.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Responsibilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Key Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Apply */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle>Ready to Apply?</CardTitle>
                    <CardDescription className="text-white/80">
                      Join our growing team in Uganda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/careers/apply">
                      <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                        Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>About {XHENVOLT_DATA.company.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {XHENVOLT_DATA.company.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{XHENVOLT_DATA.contact.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4" />
                        <span>{XHENVOLT_DATA.contact.phones[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4" />
                        <span>{XHENVOLT_DATA.contact.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 lg:px-8 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            {DRAIS_INFO.copyright} • v{DRAIS_VERSION}
          </p>
        </div>
      </footer>
    </div>
  );
}