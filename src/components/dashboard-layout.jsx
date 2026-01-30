"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FloatingChatbot from "@/components/floating-chatbot";
import AIRecommendationModals from "@/components/ai-recommendation-modals";
import WhatsNewModal from "@/components/whats-new-modal";
import EnhancedSearchBar from "@/components/enhanced-search-bar";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import SchoolIdentityDisplay from "@/components/school-identity";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  CreditCard,
  UserPlus,
  Upload,
  Bot,
  Shield,
  Wallet,
  Receipt,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  Library,
  Cog,
  IdCard,
  ArrowUpCircle,
  UserCircle,
  BookMarked,
  ShieldCheck,
  UserCog,
  Briefcase,
  ShieldAlert,
  Grid3x3,
  Mail,
  Send,
  Lightbulb,
  Brain,
  Activity,
  FileEdit,
  Fingerprint,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Grouped Navigation Structure
const navigationGroups = [
  {
    name: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    name: "Students",
    icon: Users,
    items: [
      { name: "All Students", href: "/students", icon: Users },
      { name: "Admissions", href: "/students/admission", icon: UserPlus },
      { name: "ID Cards", href: "/students/id-cards", icon: IdCard },
      { name: "Pocket Money", href: "/students/pocket-money", icon: Wallet },
      { name: "Promote Students", href: "/students/promote", icon: ArrowUpCircle },
      { name: "Alumni", href: "/students/alumni", icon: UserCircle },
      { name: "Discipline", href: "/students/discipline", icon: AlertTriangle },
      { name: "Suspended", href: "/students/suspended", icon: ShieldAlert },
      { name: "Import Students", href: "/students/import", icon: Upload },
    ],
  },
  {
    name: "Financial",
    icon: DollarSign,
    items: [
      { name: "Fees Management", href: "/fees", icon: DollarSign },
      { name: "Payments", href: "/payments", icon: CreditCard },
      { name: "MTN Mobile Money", href: "/payments/mtn-momo", icon: CreditCard },
      { name: "Airtel Money", href: "/payments/airtel-momo", icon: CreditCard },
      { name: "Transactions", href: "/transactions", icon: Receipt },
      { name: "Financial Reports", href: "/financial-reports", icon: TrendingUp },
    ],
  },
  {
    name: "Academic",
    icon: GraduationCap,
    items: [
      { name: "Classes", href: "/classes", icon: GraduationCap },
      { name: "Subjects", href: "/subjects", icon: BookOpen },
      { name: "Exams", href: "/exams", icon: ClipboardList },
      { name: "Timetable", href: "/timetable", icon: Clock },
      { name: "Performance", href: "/performance", icon: Award },
    ],
  },
  {
    name: "Examinations",
    icon: ClipboardList,
    items: [
      { name: "Exams Dashboard", href: "/exams/dashboard", icon: LayoutDashboard },
      { name: "Create Exam", href: "/exams/create", icon: FileEdit },
      { name: "Question Bank", href: "/exams/question-bank", icon: BookOpen },
      { name: "Schedule Calendar", href: "/exams/schedule", icon: Calendar },
      { name: "Monitoring", href: "/exams/monitoring", icon: Activity },
      { name: "Results & Grading", href: "/exams/results", icon: Award },
      { name: "Advanced Settings", href: "/exams/settings", icon: Settings },
      { name: "Bulk Actions", href: "/exams/bulk-actions", icon: Upload },
      { name: "Analytics & Reports", href: "/exams/analytics", icon: BarChart3 },
      { name: "Notifications", href: "/exams/notifications", icon: Bell },
      { name: "Cloning & Reuse", href: "/exams/cloning", icon: FileText },
      { name: "Security & Permissions", href: "/exams/permissions", icon: Shield },
    ],
  },
  {
    name: "Grading & Feedback",
    icon: Award,
    items: [
      { name: "Grading Dashboard", href: "/exams/grading", icon: LayoutDashboard },
      { name: "Grade Analytics", href: "/exams/grade-analytics", icon: BarChart3 },
      { name: "Feedback Templates", href: "/exams/feedback-templates", icon: FileText },
      { name: "Student Results", href: "/exams/results/student-portal", icon: Users },
    ],
  },
  {
    name: "Tahfiz",
    icon: BookOpen,
    items: [
      { name: "Dashboard", href: "/tahfiz/dashboard", icon: LayoutDashboard },
      { name: "Recitation Practice", href: "/tahfiz/practice", icon: Activity },
      { name: "Interactive Quiz", href: "/tahfiz/quiz", icon: Brain },
      { name: "AI Feedback", href: "/tahfiz/ai-feedback", icon: Sparkles },
      { name: "History", href: "/tahfiz/history", icon: Clock },
      { name: "Progress & Rewards", href: "/tahfiz/progress", icon: Award },
      { name: "Leaderboards", href: "/tahfiz/leaderboards", icon: Target },
      { name: "Analytics", href: "/tahfiz/analytics", icon: BarChart3 },
      { name: "Students", href: "/tahfiz/students", icon: Users },
      { name: "Halaqa Sessions", href: "/tahfiz/halaqa", icon: UserCheck },
      { name: "Assessments", href: "/tahfiz/assessments", icon: ClipboardList },
      { name: "Settings", href: "/tahfiz/settings", icon: Settings },
    ],
  },
  {
    name: "Library",
    icon: Library,
    items: [
      { name: "Categories", href: "/library/categories", icon: Grid3x3 },
      { name: "All Books", href: "/library/books", icon: BookOpen },
      { name: "Borrowed Books", href: "/library/borrow", icon: Calendar },
    ],
  },
  {
    name: "Attendance",
    icon: Calendar,
    items: [
      { name: "Mark Attendance", href: "/attendance", icon: Calendar },
      { name: "Biometric Attendance", href: "/attendance/biometric", icon: UserCheck },
      { name: "Attendance Reports", href: "/attendance-reports", icon: FileText },
    ],
  },
  {
    name: "AI Insights",
    icon: Sparkles,
    items: [
      { name: "AI Dashboard", href: "/ai-insights", icon: Sparkles },
      { name: "Student Performance", href: "/ai-student-performance", icon: Target },
      { name: "Finance Predictions", href: "/ai-finance", icon: TrendingUp },
      { name: "Attendance Analytics", href: "/ai-attendance", icon: Calendar },
    ],
  },
  {
    name: "AI Teacher",
    icon: Bot,
    items: [
      { name: "Assistant Dashboard", href: "/ai-teacher", icon: Bot },
      { name: "Lesson Plans", href: "/ai-teacher/lesson-plans", icon: BookMarked },
      { name: "Recommendations", href: "/ai-teacher/recommendations", icon: Lightbulb },
    ],
  },
  {
    name: "AI Copilot",
    icon: Brain,
    items: [
      { name: "Copilot Dashboard", href: "/ai-copilot", icon: Brain },
      { name: "Decision Insights", href: "/ai-copilot/insights", icon: Lightbulb },
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    items: [
      { name: "Announcements", href: "/communication", icon: Bell },
    ],
  },
  {
    name: "Messaging",
    icon: Mail,
    items: [
      { name: "Inbox", href: "/messaging/inbox", icon: Mail },
      { name: "Compose", href: "/messaging/compose", icon: Send },
      { name: "Groups", href: "/messaging/groups", icon: Users },
    ],
  },
  {
    name: "Reports",
    icon: FileText,
    items: [
      { name: "All Reports", href: "/reports", icon: FileText },
      { name: "Analytics Dashboard", href: "/analytics", icon: BarChart3 },
      { name: "Advanced Analytics", href: "/analytics/advanced", icon: Brain },
      { name: "Financial Reports", href: "/reports/finance", icon: DollarSign },
      { name: "Academic Reports", href: "/reports/academic", icon: GraduationCap },
      { name: "Student Performance", href: "/analytics/student-performance", icon: Target },
      { name: "Attendance Trends", href: "/analytics/attendance-trends", icon: Calendar },
    ],
  },
  {
    name: "Operations",
    icon: Activity,
    items: [
      { name: "Operations Dashboard", href: "/operations/dashboard", icon: Activity },
    ],
  },
  {
    name: "DRAIS Kitchen",
    icon: Sparkles,
    items: [
      { name: "Kitchen Home", href: "/kitchen", icon: Sparkles },
      { name: "Theme Builder", href: "/kitchen/themes", icon: Settings },
      { name: "Color Palettes", href: "/kitchen/palettes", icon: Lightbulb },
      { name: "Font Manager", href: "/kitchen/fonts", icon: FileText },
      { name: "Component Styler", href: "/kitchen/components", icon: Grid3x3 },
      { name: "Report Designer", href: "/kitchen/reports-designer", icon: FileText },
      { name: "Email Templates", href: "/kitchen/email-templates", icon: Mail },
      { name: "SMS Templates", href: "/kitchen/sms-templates", icon: MessageSquare },
      { name: "Export & Presets", href: "/kitchen/export", icon: Upload },
      { name: "History & Audit", href: "/kitchen/history", icon: Clock },
      { name: "Permissions", href: "/kitchen/permissions", icon: Shield },
      { name: "Tahfiz Styling", href: "/kitchen/tahfiz", icon: BookOpen },
      { name: "Live Preview", href: "/kitchen/live-preview", icon: Activity },
      { name: "Getting Started", href: "/kitchen/getting-started", icon: Brain },
    ],
  },
  {
    name: "Bulk Operations",
    icon: Upload,
    items: [
      { name: "Bulk Student Update", href: "/bulk/students", icon: Users },
      { name: "Bulk Fee Adjustments", href: "/bulk/fees", icon: DollarSign },
      { name: "Bulk Promotions", href: "/bulk/promotions", icon: ArrowUpCircle },
      { name: "Bulk Attendance Import", href: "/bulk/attendance", icon: UserCheck },
    ],
  },
  {
    name: "Teacher Portal",
    icon: GraduationCap,
    items: [
      { name: "Teacher Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
      { name: "My Classes", href: "/teacher/classes", icon: Users },
      { name: "Take Attendance", href: "/teacher/attendance", icon: UserCheck },
      { name: "Enter Marks", href: "/teacher/marks-entry", icon: FileEdit },
      { name: "Messages", href: "/teacher/messages", icon: MessageSquare },
      { name: "My Profile", href: "/teacher/profile", icon: User },
    ],
  },
  {
    name: "Parent Portal",
    icon: Users,
    items: [
      { name: "Parent Dashboard", href: "/parent/dashboard", icon: LayoutDashboard },
      { name: "My Children", href: "/parent/children", icon: Users },
      { name: "Fees & Payments", href: "/parent/fees", icon: DollarSign },
      { name: "Exam Results", href: "/parent/results", icon: Award },
      { name: "Attendance", href: "/parent/attendance", icon: Calendar },
      { name: "Messages", href: "/parent/messages", icon: MessageSquare },
    ],
  },
  {
    name: "Multi-School Admin",
    icon: Grid3x3,
    items: [
      { name: "Overview", href: "/multi-school/overview", icon: LayoutDashboard },
      { name: "Manage Schools", href: "/multi-school/schools", icon: GraduationCap },
      { name: "Consolidated Reports", href: "/multi-school/reports", icon: FileText },
    ],
  },
  {
    name: "Administration",
    icon: Settings,
    items: [
      { name: "Staff Management", href: "/staff", icon: UserCheck },
      { name: "Roles & Permissions", href: "/roles", icon: UserCog },
      { name: "Discipline", href: "/discipline", icon: AlertTriangle },
      { name: "Onboarding", href: "/onboarding", icon: Briefcase },
      { name: "Audit Logs", href: "/audit-logs", icon: Shield },
      { name: "Branding Center", href: "/settings/branding", icon: Sparkles },
      { name: "Settings", href: "/settings", icon: Cog },
    ],
  },
  {
    name: "Biometrics",
    icon: Fingerprint,
    items: [
      { name: "Face ID Setup", href: "/biometrics/face-id", icon: UserCheck },
      { name: "Fingerprint Setup", href: "/biometrics/fingerprint", icon: Fingerprint },
    ],
  },
  {
    name: "Help & Resources",
    icon: BookOpen,
    items: [
      { name: "Documentation", href: "/docs", icon: BookOpen },
      { name: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
];

const mobileNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Attendance", href: "/attendance", icon: Calendar },
  { name: "Payments", href: "/payments", icon: CreditCard },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(["Overview"]);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href) => pathname === href;
  
  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => {
      // If clicking the same group, close it
      if (prev.includes(groupName)) {
        return prev.filter((g) => g !== groupName);
      }
      // Otherwise, close all others and open this one (only one at a time)
      return [groupName];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:bg-gradient-to-bl dark:from-blue-950 dark:via-gray-950 dark:to-purple-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          {/* Logo & School Identity */}
          <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
            {/* DRAIS Logo */}
            <div className="flex items-center gap-3">
              <DraisLogo className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DRAIS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">v0.0.0018</p>
              </div>
            </div>

            {/* School Identity */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <SchoolIdentityDisplay />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.name} className="mb-2">
                {group.items.length === 1 ? (
                  // Single item groups (like Overview)
                  <Link href={group.items[0].href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive(group.items[0].href)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {(() => {
                        const Icon = group.items[0].icon;
                        return <Icon className="w-5 h-5" />;
                      })()}
                      {group.items[0].name}
                    </motion.div>
                  </Link>
                ) : (
                  // Multi-item groups with collapsible functionality
                  <>
                    <button
                      onClick={() => toggleGroup(group.name)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <group.icon className="w-5 h-5" />
                        {group.name}
                      </div>
                      <motion.div
                        animate={{ rotate: expandedGroups.includes(group.name) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedGroups.includes(group.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                            {group.items.map((item) => {
                              const active = isActive(item.href);
                              return (
                                <Link key={item.name} href={item.href}>
                                  <motion.div
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                      active
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                  </motion.div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <DraisLogo className="w-8 h-8" />
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    DRAIS
                  </h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="px-3 py-4 space-y-1">
                {navigationGroups.map((group) => (
                  <div key={group.name} className="mb-2">
                    {group.items.length === 1 ? (
                      <Link
                        href={group.items[0].href}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive(group.items[0].href)
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {(() => {
                            const Icon = group.items[0].icon;
                            return <Icon className="w-5 h-5" />;
                          })()}
                          {group.items[0].name}
                        </div>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleGroup(group.name)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <group.icon className="w-5 h-5" />
                            {group.name}
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              expandedGroups.includes(group.name) ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        {expandedGroups.includes(group.name) && (
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                            {group.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <div
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive(item.href)
                                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                  }`}
                                >
                                  <item.icon className="w-4 h-4" />
                                  {item.name}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8 gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* School Identity Display - Desktop */}
            <div className="hidden lg:block flex-shrink-0">
              <SchoolIdentityDisplay />
            </div>

            {/* Enhanced Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <EnhancedSearchBar />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
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

              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm">Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* School Identity Display - Mobile (below header for visibility) */}
          <div className="lg:hidden px-4 pb-3 pt-2 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
            <SchoolIdentityDisplay />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Floating Chatbot */}
        <FloatingChatbot />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 py-2 ${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>

    {/* AI Recommendation Modals */}
    <AIRecommendationModals />

    {/* What's New Modal */}
    <WhatsNewModal />

    {/* Cookie Consent Banner */}
    <CookieConsentBanner />
  </div>
);
}