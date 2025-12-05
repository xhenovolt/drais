"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { DRAIS_VERSION, DRAIS_INFO, DRAIS_METRICS } from "@/lib/version";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FloatingChatbot from "@/components/floating-chatbot";
import {
  Users,
  UserCheck,
  ClipboardList,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  MessageSquare,
  Clock,
  BarChart3,
  Moon,
  Sun,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Brain,
  Target,
  Lightbulb,
  TrendingDown,
  BellRing,
  Fingerprint,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Complete student lifecycle management from admission to graduation.",
    pitch: "Transform chaos into clarity. Track every student's journey with precision, empowering your institution to deliver personalized education at scale.",
  },
  {
    icon: UserCheck,
    title: "Staff Management",
    description: "Comprehensive staff records, roles, and performance tracking.",
    pitch: "Your people are your greatest asset. Equip your team with tools that maximize their impact and streamline administrative burden.",
  },
  {
    icon: ClipboardList,
    title: "Examination System",
    description: "Create, manage, and analyze exams with automated grading and reporting.",
    pitch: "Turn assessments into insights. Make data-driven decisions that elevate academic standards and identify opportunities for improvement.",
  },
  {
    icon: Calendar,
    title: "Attendance Tracking",
    description: "Real-time attendance for students and staff with analytics.",
    pitch: "Presence drives performance. Monitor attendance patterns that predict success and intervene before small absences become big problems.",
  },
  {
    icon: DollarSign,
    title: "Fee Management",
    description: "Automated billing, payment collection, and financial reporting.",
    pitch: "Cash flow is the lifeblood of your institution. Eliminate revenue leakage with automated billing that ensures every dollar is collected on time.",
  },
  {
    icon: FileText,
    title: "Report Generation",
    description: "Comprehensive reports and transcripts with custom templates.",
    pitch: "Information is power when it's actionable. Generate insights that inform strategy and demonstrate value to stakeholders instantly.",
  },
  {
    icon: AlertTriangle,
    title: "Discipline Management",
    description: "Track incidents, interventions, and behavioral patterns.",
    pitch: "Prevention beats punishment. Identify patterns early and create environments where students thrive through proactive intervention.",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Unified messaging for parents, students, and staff.",
    pitch: "Connection creates community. Bridge the gap between school and home with seamless communication that keeps everyone informed.",
  },
  {
    icon: Clock,
    title: "Timetable Management",
    description: "Smart scheduling and conflict-free timetable generation.",
    pitch: "Time is your scarcest resource. Optimize every minute with intelligent scheduling that maximizes learning opportunities.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Data-driven insights and predictive analytics for better decisions.",
    pitch: "Winners make decisions based on data, not guesswork. Harness the power of analytics to stay ahead of trends and outperform competitors.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
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
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DRAIS
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Features
              </Link>
              <Link href="/pricing-plans" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/documentation" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Docs
              </Link>
              <Link href="/about-xhenvolt" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
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
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Version {DRAIS_VERSION} — Built by {DRAIS_INFO.company}
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              School Management Made Easy
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              DRAIS empowers educational institutions with intelligent automation, 
              real-time insights, and seamless collaboration — all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-blue-600 dark:border-blue-400"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Proven Results</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools designed for modern educational institutions
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-4 rounded-lg border-l-4 border-blue-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{feature.pitch}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Copilot Preview Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:bg-gradient-to-br dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6"
            >
              <Brain className="w-5 h-5" />
              AI-Powered Intelligence
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Meet Your AI Copilot
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Harness the power of artificial intelligence to predict outcomes, prevent problems, 
              and optimize every aspect of your institution — before issues arise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Brain,
                title: "Predictive Insights",
                description: "AI analyzes patterns to predict student performance, attendance risks, and financial forecasts with 94% accuracy.",
                color: "from-purple-500 to-purple-700",
                bgColor: "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50",
                stat: "94%",
                statLabel: "Accuracy"
              },
              {
                icon: Target,
                title: "Smart Interventions",
                description: "Identify at-risk students early and receive AI-generated intervention plans tailored to each situation.",
                color: "from-pink-500 to-pink-700",
                bgColor: "from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50",
                stat: "47",
                statLabel: "Students Monitored"
              },
              {
                icon: Lightbulb,
                title: "Resource Optimization",
                description: "Get intelligent recommendations for budget allocation, staff deployment, and infrastructure improvements.",
                color: "from-blue-500 to-blue-700",
                bgColor: "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50",
                stat: "UGX 2.1B",
                statLabel: "Projected Revenue"
              },
              {
                icon: BellRing,
                title: "Automated Alerts",
                description: "Real-time notifications for critical issues with recommended actions, so you never miss what matters.",
                color: "from-indigo-500 to-indigo-700",
                bgColor: "from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50",
                stat: "24/7",
                statLabel: "Monitoring"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className={`h-full bg-gradient-to-br ${feature.bgColor} border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300`}>
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 backdrop-blur-sm">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        {feature.stat}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {feature.statLabel}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Copilot Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-1 shadow-2xl"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    AI That Thinks Ahead
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Student Risk Analysis",
                        description: "Machine learning models analyze attendance, performance, fees, and behavior to identify students who need support before they fall behind."
                      },
                      {
                        title: "Financial Forecasting",
                        description: "Predict fee collection rates, budget requirements, and revenue projections with data-driven confidence scores."
                      },
                      {
                        title: "Automated Recommendations",
                        description: "Receive actionable suggestions for interventions, resource allocation, and strategic decisions backed by AI analysis."
                      },
                      {
                        title: "Real-Time Decision Support",
                        description: "Floating AI alerts notify you of critical situations with recommended actions, ensuring you never miss an opportunity to intervene."
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 }}
                        className="flex gap-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/50 dark:to-blue-950/50 rounded-xl p-8 border-2 border-purple-200 dark:border-purple-800"
                  >
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">High Priority Alert</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Fees Collection Risk</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded">
                            HIGH
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          47 students identified with payment delays. AI recommends immediate follow-up.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">AI Confidence: 94%</span>
                          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">Performance Prediction</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Term Results Forecast</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded">
                            POSITIVE
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          S6 class projected to achieve 97% pass rate — highest in 3 years.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">AI Confidence: 91%</span>
                          <Button size="sm" variant="outline" className="text-sm">
                            View Insights
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">Resource Allocation</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Budget Recommendation</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded">
                            MEDIUM
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          Science lab upgrade recommended: UGX 25M investment, 22% impact on performance.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">AI Confidence: 88%</span>
                          <Button size="sm" variant="outline" className="text-sm">
                            Review Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link href="/ai-copilot">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-lg px-10 py-6"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Explore AI Copilot Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  AI-powered insights • Automated recommendations • 94% prediction accuracy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Why DRAIS is Unmatched
              </h2>
              <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-blue-600 dark:text-blue-400">DRAIS 2.0</strong> represents the pinnacle of school management technology. 
                  Built from the ground up by <strong className="text-purple-600 dark:text-purple-400">Xhenvolt</strong>, 
                  a brand synonymous with innovation and excellence.
                </p>
                <p>
                  We don't just digitize processes — we transform them. Every feature is crafted with one goal: 
                  to free educators from administrative burden so they can focus on what truly matters — teaching.
                </p>
                <div className="space-y-3 mt-8">
                  {[
                    "10x faster than traditional systems",
                    "99.9% uptime guarantee",
                    "AI-powered insights and predictions",
                    "Unlimited scalability",
                    "World-class support team",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-4">The Xhenvolt Promise</h3>
                <p className="text-lg mb-6">
                  Innovation that drives results. Technology that transforms institutions. 
                  Support that never sleeps.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-4xl font-bold mb-1">{DRAIS_METRICS.schools}</div>
                    <div className="text-sm">Schools Trust Us</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-4xl font-bold mb-1">{DRAIS_METRICS.students.toLocaleString()}</div>
                    <div className="text-sm">Students Managed</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-4xl font-bold mb-1">{DRAIS_METRICS.uptime}</div>
                    <div className="text-sm">Uptime</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-4xl font-bold mb-1">{DRAIS_METRICS.staff}</div>
                    <div className="text-sm">Staff Members</div>
                  </div>
                </div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of forward-thinking schools already using DRAIS to deliver excellence.
            </p>
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-12 py-6"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <DraisLogo className="w-8 h-8" variant="dark" />
                <span className="text-xl font-bold text-white">DRAIS</span>
              </div>
              <p className="text-sm">
                School Management Made Easy by Xhenvolt
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link></li>
                <li><Link href="/ai-copilot" className="hover:text-purple-400 transition">AI Copilot</Link></li>
                <li><Link href="/attendance/biometric" className="hover:text-green-400 transition">Biometric Attendance</Link></li>
                <li><Link href="/payments" className="hover:text-blue-400 transition">Payments</Link></li>
                <li><Link href="/ai-teacher" className="hover:text-blue-400 transition">AI Teacher</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Setup & Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-blue-400 transition">Documentation</Link></li>
                <li><Link href="/onboarding" className="hover:text-blue-400 transition">School Setup</Link></li>
                <li><Link href="/students/import" className="hover:text-blue-400 transition">Import Students</Link></li>
                <li><Link href="/audit-logs" className="hover:text-blue-400 transition">Audit Logs</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-blue-400 transition">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>{DRAIS_INFO.copyright} Version {DRAIS_VERSION}</p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}
