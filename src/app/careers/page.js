"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Users, MapPin, Clock, DollarSign, Briefcase, GraduationCap,
  Heart, Coffee, Plane, Shield, Zap, Target, Globe,
  Code, Palette, BarChart, HeadphonesIcon, Building,
  Moon, Sun, ArrowRight, ExternalLink, Calendar,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    icon: Heart,
    title: "Health Coverage",
    description: "Medical insurance and health benefits for all full-time employees",
  },
  {
    icon: Coffee,
    title: "Professional Growth",
    description: "Continuous learning opportunities and career advancement in Uganda's tech sector",
  },
  {
    icon: GraduationCap,
    title: "Skills Development",
    description: "Training programs, workshops, and technology certifications supported",
  },
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Market-leading compensation in Uganda Shillings with performance bonuses",
  },
  {
    icon: Shield,
    title: "Job Security",
    description: "Stable employment with a growing company in Uganda's education technology sector",
  },
  {
    icon: Building,
    title: "Office Environment",
    description: "Modern office facilities in Bulubandi, Iganga with collaborative workspaces",
  },
];

const jobs = [
  {
    id: "secretary",
    title: "Secretary",
    department: "Administration",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time",
    salary: "UGX 700,000 - 1,200,000",
    posted: "2 days ago",
    icon: Users,
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
  },
  {
    id: "customer-success",
    title: "Customer Success Officer", 
    department: "Customer Support",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time",
    salary: "UGX 900,000 - 1,500,000",
    posted: "1 week ago",
    icon: HeadphonesIcon,
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
  },
  {
    id: "software-engineer",
    title: "Software Engineer (Full-stack)",
    department: "Development",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time", 
    salary: "UGX 2,000,000 - 4,500,000",
    posted: "3 days ago",
    icon: Code,
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
  },
  {
    id: "sales-manager",
    title: "Sales Manager",
    department: "Sales & Marketing",
    location: XHENVOLT_DATA.contact.address,
    type: "Full-time",
    salary: "UGX 1,500,000 - 3,000,000 + commissions",
    posted: "5 days ago", 
    icon: Target,
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
  },
];

const departments = [
  {
    icon: Code,
    name: "Development",
    description: "Build innovative EdTech solutions for Uganda",
    openings: 1,
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Target,
    name: "Sales & Marketing",
    description: "Expand DRAIS across Ugandan schools",
    openings: 1,
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: HeadphonesIcon,
    name: "Customer Support",
    description: "Support schools with DRAIS implementation",
    openings: 1,
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Users,
    name: "Administration",
    description: "Manage office operations and coordination",
    openings: 1,
    color: "from-purple-500 to-purple-600",
  },
];

// Use the jobs array we defined earlier as jobListings for compatibility
const jobListings = jobs;

const values = [
  {
    icon: Target,
    title: "Impact-Driven",
    description: "Every line of code, every design decision, every customer interaction is focused on improving educational outcomes.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "We believe the best solutions come from diverse teams working together with trust, respect, and shared purpose.",
  },
  {
    icon: Zap,
    title: "Innovation Focused",
    description: "We embrace new technologies and approaches that can make education more effective and accessible.",
  },
  {
    icon: Globe,
    title: "Globally Minded",
    description: "Our solutions serve schools worldwide, and our team reflects the diversity of the communities we serve.",
  },
];

export default function Careers() {
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
              <Briefcase className="w-4 h-4 mr-2" />
              Join {XHENVOLT_DATA.company.name}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shape Uganda's Educational Future
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join our growing team in {XHENVOLT_DATA.contact.address} and help build the technology 
              that's transforming education across Uganda. Your work will directly impact schools 
              and students throughout East Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                View Open Positions <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn About Culture
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide how we work and grow together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Benefits & Perks
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We believe in taking care of our team members so they can do their best work
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
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
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {benefit.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Teams & Departments
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find your place in our growing organization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${dept.color} flex items-center justify-center`}>
                        <dept.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-2">{dept.name}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {dept.description}
                      </CardDescription>
                      <Badge className={`bg-gradient-to-r ${dept.color} text-white`}>
                        {dept.openings} Open Position{dept.openings !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join our mission to transform education technology
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-6">
            {jobListings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <Badge variant="outline">{job.department}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Posted {job.posted}
                          </div>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Don't see a position that matches your skills? We're always looking for exceptional talent.
            </p>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Send Us Your Resume
            </Button>
          </motion.div>
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
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our team and help us build technology that transforms education 
              for millions of students worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Browse All Jobs <Briefcase className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  Contact Recruiting Team
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