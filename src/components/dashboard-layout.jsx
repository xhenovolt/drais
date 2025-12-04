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
  BarChart3,
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
    name: "Administration",
    icon: Settings,
    items: [
      { name: "Staff Management", href: "/staff", icon: UserCheck },
      { name: "Roles & Permissions", href: "/roles", icon: UserCog },
      { name: "Discipline", href: "/discipline", icon: AlertTriangle },
      { name: "Onboarding", href: "/onboarding", icon: Briefcase },
      { name: "Audit Logs", href: "/audit-logs", icon: Shield },
      { name: "Settings", href: "/settings", icon: Cog },
    ],
  },
  {
    name: "Help & Resources",
    icon: BookOpen,
    items: [
      { name: "Documentation", href: "/docs", icon: BookOpen },
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
          {/* Logo */}
          <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <DraisLogo className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DRAIS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">v0.0.0018</p>
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
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Enhanced Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <EnhancedSearchBar />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
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