"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const searchableRoutes = [
  // AI Features
  { name: "AI Copilot Dashboard", route: "/ai-copilot", category: "AI Features", keywords: ["ai", "copilot", "predictions", "insights"] },
  { name: "AI Decision Insights", route: "/ai-copilot/insights", category: "AI Features", keywords: ["ai", "insights", "recommendations", "decisions"] },
  { name: "AI Teacher Assistant", route: "/ai-teacher", category: "AI Features", keywords: ["ai", "teacher", "assistant", "lessons"] },
  { name: "AI Analytics", route: "/ai-insights", category: "AI Features", keywords: ["ai", "analytics", "insights"] },
  
  // Students
  { name: "All Students", route: "/students", category: "Students", keywords: ["students", "pupils", "learners"] },
  { name: "Student Admissions", route: "/students/admission", category: "Students", keywords: ["admission", "enrollment", "register"] },
  { name: "ID Cards", route: "/students/id-cards", category: "Students", keywords: ["id", "cards", "badges"] },
  { name: "Promote Students", route: "/students/promote", category: "Students", keywords: ["promote", "advance", "progression"] },
  { name: "Alumni", route: "/students/alumni", category: "Students", keywords: ["alumni", "graduated", "former"] },
  
  // Attendance
  { name: "Mark Attendance", route: "/attendance", category: "Attendance", keywords: ["attendance", "present", "absent", "roll call"] },
  { name: "Biometric Attendance", route: "/attendance/biometric", category: "Attendance", keywords: ["biometric", "fingerprint", "face id", "scanner"] },
  { name: "Attendance Reports", route: "/attendance-reports", category: "Attendance", keywords: ["attendance", "reports", "statistics"] },
  
  // Financial
  { name: "Fees Management", route: "/fees", category: "Financial", keywords: ["fees", "tuition", "payments"] },
  { name: "Payments", route: "/payments", category: "Financial", keywords: ["payments", "collections", "money"] },
  { name: "MTN Mobile Money", route: "/payments/mtn-momo", category: "Financial", keywords: ["mtn", "mobile money", "momo"] },
  { name: "Airtel Money", route: "/payments/airtel-momo", category: "Financial", keywords: ["airtel", "money", "mobile"] },
  { name: "Financial Reports", route: "/reports/finance", category: "Financial", keywords: ["financial", "reports", "income", "expenses"] },
  
  // Academic
  { name: "Classes", route: "/classes", category: "Academic", keywords: ["classes", "grades", "levels"] },
  { name: "Subjects", route: "/subjects", category: "Academic", keywords: ["subjects", "courses"] },
  { name: "Exams", route: "/exams", category: "Academic", keywords: ["exams", "tests", "assessments"] },
  { name: "Timetable", route: "/timetable", category: "Academic", keywords: ["timetable", "schedule", "roster"] },
  { name: "Academic Reports", route: "/reports/academic", category: "Academic", keywords: ["academic", "reports", "performance"] },
  
  // Library
  { name: "Library Categories", route: "/library/categories", category: "Library", keywords: ["library", "categories", "genres"] },
  { name: "All Books", route: "/library/books", category: "Library", keywords: ["books", "library", "catalog"] },
  { name: "Borrowed Books", route: "/library/borrow", category: "Library", keywords: ["borrowed", "lending", "checkout"] },
  
  // Communication
  { name: "Messaging Inbox", route: "/messaging/inbox", category: "Communication", keywords: ["messages", "inbox", "mail"] },
  { name: "Compose Message", route: "/messaging/compose", category: "Communication", keywords: ["compose", "send", "write"] },
  { name: "Announcements", route: "/communication", category: "Communication", keywords: ["announcements", "notices", "broadcast"] },
  
  // Reports
  { name: "All Reports", route: "/reports", category: "Reports", keywords: ["reports", "analytics"] },
  { name: "Analytics Dashboard", route: "/analytics", category: "Reports", keywords: ["analytics", "dashboard", "metrics"] },
  { name: "Advanced Analytics", route: "/analytics/advanced", category: "Reports", keywords: ["advanced", "analytics", "deep dive"] },
  { name: "Operations Dashboard", route: "/operations/dashboard", category: "Reports", keywords: ["operations", "ops", "management"] },
  
  // Administration
  { name: "Staff Management", route: "/staff", category: "Administration", keywords: ["staff", "teachers", "employees"] },
  { name: "Roles & Permissions", route: "/roles", category: "Administration", keywords: ["roles", "permissions", "access"] },
  { name: "Audit Logs", route: "/audit-logs", category: "Administration", keywords: ["audit", "logs", "history"] },
  { name: "School Onboarding", route: "/onboarding", category: "Administration", keywords: ["onboarding", "setup", "configuration"] },
  { name: "Settings", route: "/settings", category: "Administration", keywords: ["settings", "preferences", "configuration"] },
  
  // Resources
  { name: "Documentation", route: "/docs", category: "Resources", keywords: ["docs", "documentation", "guides", "help"] },
  { name: "Dashboard", route: "/dashboard", category: "Overview", keywords: ["dashboard", "home", "overview"] },
];

export default function EnhancedSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const results = searchableRoutes.filter((route) => {
      return (
        route.name.toLowerCase().includes(lowerQuery) ||
        route.category.toLowerCase().includes(lowerQuery) ||
        route.keywords.some((keyword) => keyword.includes(lowerQuery))
      );
    });

    setSearchResults(results.slice(0, 5)); // Top 5 matches
    setShowResults(results.length > 0);
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % searchResults.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
        break;
      case "Enter":
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          router.push(searchResults[selectedIndex].route);
          setSearchQuery("");
          setShowResults(false);
        }
        break;
      case "Escape":
        setShowResults(false);
        break;
    }
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          placeholder="Search features, pages, modules..."
          className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                Top {searchResults.length} results for "{searchQuery}"
              </div>
              {searchResults.map((result, index) => (
                <Link key={result.route} href={result.route}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => {
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      index === selectedIndex
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`font-medium mb-1 ${index === selectedIndex ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
                        {highlightMatch(result.name, searchQuery)}
                      </div>
                      <div className={`text-xs ${index === selectedIndex ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                        {result.category} • {result.route}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${index === selectedIndex ? "text-white" : "text-gray-400"}`} />
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 mr-2">↑↓</kbd>
              Navigate
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 ml-4 mr-2">Enter</kbd>
              Select
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 ml-4 mr-2">Esc</kbd>
              Close
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {showResults && searchQuery.trim() && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6 text-center z-50"
          >
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">No results found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Try searching for features, pages, or modules
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
