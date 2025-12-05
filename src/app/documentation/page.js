'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Book, Search, Moon, Sun, ChevronDown, ChevronRight, Home, FileText,
  DollarSign, BookOpen, Bus, Users, GraduationCap, Award, Building,
  Calendar, MessageSquare, Settings, BarChart3, Shield, Zap, CheckCircle,
  AlertCircle, Info, Play, Download, ExternalLink, Copy, Star, TrendingUp,
  Package, Clock, Bell, Brain, CreditCard, Smartphone
} from 'lucide-react';

// Version 0.0.0039 - Comprehensive System Documentation Portal

export default function SystemDocumentation() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('0.0.0039');
  const [selectedModule, setSelectedModule] = useState('getting-started');
  const [expandedSections, setExpandedSections] = useState(['getting-started']);

  const versions = ['0.0.0039', '0.0.0038', '0.0.0037', '0.0.0036'];

  const documentation = {
    'getting-started': {
      title: 'Getting Started with DRAIS',
      icon: Home,
      color: 'blue',
      sections: [
        {
          title: 'What is DRAIS?',
          content: `DRAIS (Digital Resource Administration & Intelligence System) is a comprehensive school management platform designed for educational decision-makers. It provides complete visibility into every aspect of school operations - from finance and academics to parent engagement and infrastructure.

**Built for Decision-Makers:** Every feature is designed to help school administrators, principals, and board members make informed, data-driven decisions that improve student outcomes and operational efficiency.`,
          type: 'text'
        },
        {
          title: 'Key Benefits for Decision-Makers',
          content: [
            'Complete Financial Transparency: Real-time income statements, balance sheets, and cash flow analysis with actionable insights',
            'Academic Excellence Tracking: Student performance analytics, examination management, and progress monitoring across all programs',
            'Operational Efficiency: Save 20+ hours/week through automated fee collection, transport management, and library systems',
            'Parent Engagement: Direct communication channels, real-time updates, and transparent fee tracking strengthen relationships',
            'Data-Driven Decisions: Comprehensive reports and intelligence insights across all 13+ modules',
            'Compliance & Security: Role-based access controls, complete audit trails, and enterprise-grade data protection',
            'Scalability: Supports single-campus operations to multi-school networks with centralized reporting',
            'Mobile Access: Full system access via web browser on any device - no app installation required'
          ],
          type: 'list'
        },
        {
          title: 'Quick Start Guide (First 7 Days)',
          content: `**Day 1-2: Initial Setup**
1. Configure your school profile (name, logo, contact information)
2. Set up academic year calendar (terms, holidays, exam periods)
3. Create administrative user accounts with appropriate roles

**Day 3-4: Core Data Entry**
4. Import or manually add student records
5. Set up fee structure and payment schedules
6. Configure grading scales and pass marks
7. Create class structures and subject assignments

**Day 5-6: Module Activation**
8. Enable modules relevant to your school (Tahfiz, Boarding, Transport, etc.)
9. Set up fee categories specific to each module
10. Configure role-based permissions for staff

**Day 7: Start Operations**
11. Begin daily operations with full system support
12. Train staff on their respective modules
13. Start collecting fees and tracking student data

✅ **You're now ready to use DRAIS for complete school management!**`,
          type: 'steps'
        },
        {
          title: 'System Requirements',
          content: `**For Administrators & Staff:**
- Modern web browser (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Internet connection (minimum 2 Mbps recommended)
- Screen resolution: 1280x720 or higher
- No software installation required

**For Optimal Experience:**
- Dedicated computer/laptop for fee collection desk
- Printer for reports and certificates
- Scanner for document uploads (optional)
- Backup internet connection (mobile hotspot) for reliability`,
          type: 'text'
        }
      ]
    },
    'finance': {
      title: 'Finance Module - Complete Financial Control',
      icon: DollarSign,
      color: 'emerald',
      sections: [
        {
          title: 'Module Overview',
          content: 'The Finance Module provides comprehensive financial management including fee collection, expense tracking, income statements, balance sheets, and financial analytics. Designed for school administrators who need complete financial control with real-time visibility into every transaction.',
          type: 'text'
        },
        {
          title: 'Core Features',
          content: [
            'Income Statement: Monthly, quarterly, and yearly revenue vs expense analysis with trend visualization',
            'Balance Sheet: Real-time assets, liabilities, and equity tracking with financial ratio analysis',
            'Fee Management: Student fee tracking, payment collection, discount/scholarship management, overdue alerts',
            'Expense Tracking: Categorized expense recording with approval workflows and vendor management',
            'Cash Flow Analysis: Monitor liquidity, working capital, and cash position forecasting',
            'Financial Reports: Exportable PDF, Excel, and CSV reports for board meetings and audits',
            'Revenue Breakdown: Track income by category (Tuition, Transport, Boarding, Library, Exams, Other)',
            'Budget Management: Set department budgets, track spending against targets, variance analysis',
            'Payment Methods: Support for cash, mobile money (MTN/Airtel), bank transfers, checks',
            'Automated Alerts: Overdue fees notifications, low balance warnings, unusual expense flagging'
          ],
          type: 'list'
        },
        {
          title: 'How to Access and Interpret Financial Reports',
          content: `**Accessing Income Statement:**
1. Navigate to Finance → Reports → Income Statement
2. Select date range (monthly, quarterly, yearly)
3. Apply filters (department, revenue/expense category)
4. Review key metrics at top: Total Revenue, Total Expenses, Net Profit, Profit Margin
5. Check "Actionable Insights" panel for critical takeaways
6. Export to PDF/Excel for board presentations

**Reading the Income Statement:**
📊 **Total Revenue**: All income from tuition, fees, transport, boarding, library, etc.
📊 **Total Expenses**: All costs including salaries, infrastructure, academic resources, admin
📊 **Net Profit**: Revenue minus Expenses (your school's profitability)
📊 **Profit Margin**: Net Profit ÷ Total Revenue × 100 (target: 18-25% is healthy)

**Understanding Growth Indicators:**
- Green ↑ with positive % = Growing revenue or controlled expenses (good)
- Red ↓ with negative % = Declining revenue or rising expenses (attention needed)
- Monthly Trends Chart shows 12-month pattern to spot seasonal variations

**Accessing Balance Sheet:**
1. Navigate to Finance → Reports → Balance Sheet
2. Select "As of Date" to view financial position on specific date
3. Review three main sections: Assets, Liabilities, Equity
4. Check Financial Ratios dashboard for health indicators
5. Export for auditors or board review`,
          type: 'steps',
          screenshot: '/screenshots/finance-reports.png'
        },
        {
          title: 'Key Financial Metrics Explained',
          content: `**Current Ratio** (Current Assets ÷ Current Liabilities)
- Measures ability to pay short-term obligations
- **Good**: > 2.0 | **Acceptable**: 1.5-2.0 | **Concern**: < 1.5
- Example: Ratio of 3.42 means you have UGX 3.42 in assets for every UGX 1.00 in liabilities

**Quick Ratio** (Liquid Assets ÷ Current Liabilities)
- Similar to Current Ratio but excludes inventory
- **Good**: > 1.5 | **Acceptable**: 1.0-1.5 | **Concern**: < 1.0
- Tests immediate liquidity without selling physical items

**Debt-to-Equity Ratio** (Total Liabilities ÷ Total Equity)
- Indicates financial leverage and risk exposure
- **Healthy**: < 0.5 | **Moderate**: 0.5-1.0 | **High Risk**: > 1.0
- Lower is better - means less dependence on borrowed funds

**Debt-to-Assets Ratio** (Total Liabilities ÷ Total Assets)
- Shows what percentage of assets are financed by debt
- **Good**: < 0.4 | **Acceptable**: 0.4-0.6 | **Concern**: > 0.6
- Lower percentage indicates stronger financial position

**Working Capital** (Current Assets - Current Liabilities)
- Available funds for day-to-day operations
- Should be positive and growing
- Target: At least 3-6 months of operating expenses

**Profit Margin** (Net Profit ÷ Total Revenue × 100)
- Profitability efficiency percentage
- **Excellent**: > 25% | **Good**: 18-25% | **Needs Improvement**: < 18%
- Shows how much profit you keep from each shilling earned`,
          type: 'text'
        },
        {
          title: 'Fee Collection Best Practices',
          content: [
            'Set Clear Payment Schedules: Define term-based payment deadlines and communicate early',
            'Offer Multiple Payment Methods: Cash, Mobile Money, Bank Transfer to maximize convenience',
            'Implement Graduated Late Fees: Small initial penalty increasing over time',
            'Send Automated Reminders: 7 days before due date, on due date, 3 days after',
            'Provide Payment Plans: Allow struggling parents to pay in installments with agreement',
            'Track Overdue Fees Proactively: Weekly review of outstanding balances with follow-up',
            'Recognize Prompt Payers: Small discounts or recognition for early/on-time payment',
            'Maintain Payment History: Complete records for parent reference and dispute resolution'
          ],
          type: 'list'
        }
      ]
    },
    'library': {
      title: 'Library Management System',
      icon: BookOpen,
      color: 'purple',
      sections: [
        {
          title: 'Library System Overview',
          content: 'Comprehensive library management system including book cataloging, borrowing/return tracking, fine management, inventory control, and circulation analytics. Transform your library into a data-driven resource center.',
          type: 'text'
        },
        {
          title: 'Key Features',
          content: [
            'Book Cataloging: ISBN-based system with categories, authors, publishers, edition tracking',
            'Borrow/Return Tracking: Automated due date calculations, renewal management, overdue alerts',
            'Fine Management: Automated late fee calculations with payment tracking',
            'Inventory Management: Stock levels, book conditions, replacement cost tracking',
            'Member Management: Student and staff library cards with borrowing limits',
            'Search Functionality: Find books by title, author, ISBN, category, or keywords',
            'Circulation Reports: Most borrowed books, active readers, peak borrowing times',
            'Reservation System: Allow students to reserve books currently on loan',
            'Lost Book Tracking: Record lost/damaged books with replacement fee assessment',
            'Digital Resources: Link to e-books and online resources'
          ],
          type: 'list'
        },
        {
          title: 'Setting Up Your Library',
          content: `**Step 1: Initial Cataloging**
1. Gather all books in your library
2. Use ISBN scanner or manual entry
3. Create categories (Fiction, Non-Fiction, Reference, Tahfiz, etc.)
4. Assign shelf locations for easy retrieval

**Step 2: Configure Borrowing Rules**
5. Set borrowing limits (e.g., 3 books per student)
6. Define loan periods (e.g., 14 days for fiction, 7 for reference)
7. Set fine rates (e.g., UGX 500 per day overdue)
8. Configure renewal policies

**Step 3: Member Setup**
9. Import student list from academics module
10. Generate library card numbers
11. Set student borrowing limits by class level
12. Add staff members with extended privileges`,
          type: 'steps'
        },
        {
          title: 'Maximizing Library Usage',
          content: [
            'Reading Campaigns: Track books read per class, award reading champions',
            'Book Recommendations: Suggest books based on student interests and reading level',
            'New Arrivals Showcase: Highlight recently added books to generate interest',
            'Reading Analytics: Identify most popular genres to guide future purchases',
            'Parent Access: Allow parents to see what their children are reading',
            'Teacher Integration: Link required reading to class curricula'
          ],
          type: 'list'
        }
      ]
    },
    'transport': {
      title: 'Transport Management System',
      icon: Bus,
      color: 'amber',
      sections: [
        {
          title: 'Transport System',
          content: 'Comprehensive transport operations management including route planning, vehicle tracking, driver management, student assignment, transport fee collection, and safety monitoring. Ensure safe, efficient, and accountable student transportation.',
          type: 'text'
        },
        {
          title: 'Core Capabilities',
          content: [
            'Route Management: Define routes with stops, distances, and estimated times',
            'Vehicle Tracking: Maintain vehicle records, registration, insurance, maintenance schedules',
            'Student Assignment: Assign students to routes and specific buses with seat management',
            'Driver Management: Driver profiles, licenses, contact information, performance tracking',
            'Fee Collection: Route-based transport fee management integrated with finance module',
            'Safety Tracking: Emergency contacts, student check-in/check-out on buses',
            'Maintenance Scheduling: Preventive maintenance reminders, service history',
            'Fuel Management: Track fuel consumption, costs per route, efficiency metrics',
            'Incident Reporting: Record and track any transport-related incidents',
            'Parent Notifications: SMS/email alerts for pickup/drop-off times'
          ],
          type: 'list'
        },
        {
          title: 'Transport Safety Best Practices',
          content: [
            'Daily Vehicle Inspections: Check brakes, tires, lights before each route',
            'Driver Background Checks: Verify licenses, conduct background screening',
            'Student Attendance on Bus: Track which students board/disembark at each stop',
            'Emergency Protocols: Train drivers and attendants on emergency procedures',
            'Route Monitoring: GPS tracking for real-time location awareness (if available)',
            'Parent Communication: Provide parents with route schedules and driver contacts',
            'Regular Maintenance: Follow manufacturer service schedules strictly',
            'Insurance Compliance: Maintain valid insurance for all vehicles and passengers'
          ],
          type: 'list'
        }
      ]
    },
    'academics': {
      title: 'Academic Management System',
      icon: GraduationCap,
      color: 'indigo',
      sections: [
        {
          title: 'Academic Excellence Tracking',
          content: 'Complete academic management system for curriculum planning, class scheduling, subject assignment, teacher workload management, attendance tracking, and performance monitoring. Drive academic excellence through data-driven insights.',
          type: 'text'
        },
        {
          title: 'Features',
          content: [
            'Class Management: Create classes, assign teachers, manage student rosters, set capacity limits',
            'Subject Assignment: Link subjects to classes and teachers with workload balancing',
            'Timetable Management: Visual schedule builder with automatic conflict detection',
            'Attendance Tracking: Daily attendance with absence reasons, late arrivals, parent notifications',
            'Performance Monitoring: Grade tracking, GPA calculations, progress reports',
            'Teacher Workload: Track teaching hours, class assignments, contact periods',
            'Curriculum Mapping: Align subjects with national curriculum standards',
            'Homework Management: Assign, track, and grade homework electronically',
            'Parent-Teacher Conferences: Schedule and manage meeting appointments',
            'Academic Calendar: Term dates, exam periods, holidays, school events'
          ],
          type: 'list'
        },
        {
          title: 'Improving Academic Performance',
          content: `**Identify At-Risk Students:**
- Use performance analytics to flag students scoring below 50%
- Track attendance patterns - poor attendance correlates with poor performance
- Monitor subject-specific struggles

**Intervention Strategies:**
- Assign peer tutors or remedial classes for struggling students
- Communicate with parents about specific improvement areas
- Set measurable improvement goals with regular check-ins

**Recognize Excellence:**
- Award certificates for academic achievement
- Publish honor roll lists (with parent consent)
- Provide leadership opportunities to top performers`,
          type: 'text'
        }
      ]
    },
    'tahfiz': {
      title: 'Tahfiz Program Management',
      icon: Star,
      color: 'teal',
      sections: [
        {
          title: 'Tahfiz Module Overview',
          content: 'Specialized module for managing Quran memorization programs with verse-level tracking, accuracy scoring, memorization milestones, teacher assignment, progress analytics, and completion certificates. Purpose-built for Islamic schools running Tahfiz programs.',
          type: 'text'
        },
        {
          title: 'Tahfiz Features',
          content: [
            'Verse-Level Tracking: Track memorization progress by Juz, Surah, and individual verses',
            'Accuracy Scoring: Record memorization accuracy percentages for each session',
            'Milestone Tracking: Automatic Juz completion detection with certificate generation',
            'Teacher Assignment: Assign Tahfiz teachers to student groups with progress oversight',
            'Progress Reports: Detailed memorization analytics showing verses completed, accuracy trends',
            'Session Logging: Record daily memorization sessions with date, verses, accuracy',
            'Tajweed Evaluation: Track Tajweed accuracy separately from memorization',
            'Revision Tracking: Monitor revision schedules to prevent forgetting',
            'Parent Updates: Send progress reports to parents regularly',
            'Certificates: Generate Juz completion and full Quran completion certificates'
          ],
          type: 'list'
        },
        {
          title: 'How to Track Tahfiz Student Progress',
          content: `**Recording Memorization Sessions:**
1. Navigate to Tahfiz → Student Progress
2. Select student from list or search by name
3. View current progress dashboard (Juz completed, verses memorized, accuracy %)
4. Click "Record New Session"
5. Enter session details:
   - Date of session
   - Surah and verse range (e.g., Al-Baqarah 1-5)
   - Accuracy percentage (0-100%)
   - Tajweed accuracy (optional)
   - Teacher notes/observations
6. Save session

**Automatic Milestone Detection:**
✅ System automatically detects Juz completion
✅ Generates completion certificate when Juz finished
✅ Sends notification to parents and student
✅ Updates overall progress dashboard

**Generating Progress Reports:**
1. Select reporting period (week, month, term, year)
2. View verses memorized, average accuracy, sessions completed
3. See graphical trends in memorization pace
4. Export report PDF for parent meetings
5. Compare student progress against class average`,
          type: 'steps'
        },
        {
          title: 'Tahfiz Best Practices',
          content: [
            'Daily Short Sessions: Encourage 15-30 minute daily sessions rather than long weekly sessions',
            'Regular Revision: Implement spaced repetition - review previously memorized sections regularly',
            'Accuracy Over Speed: Emphasize 90%+ accuracy before moving to new verses',
            'Group Recitation: Organize group sessions where students recite to each other',
            'Parent Involvement: Encourage parents to listen to home recitation',
            'Celebrate Milestones: Organize ceremonies for Juz completions to motivate students',
            'Track Tajweed Separately: Ensure students master correct pronunciation',
            'Progressive Goals: Set achievable short-term goals (e.g., 1 page per week)'
          ],
          type: 'list'
        }
      ]
    },
    'exams': {
      title: 'Examinations & Results Management',
      icon: FileText,
      color: 'blue',
      sections: [
        {
          title: 'Comprehensive Exam Management',
          content: 'End-to-end examination system from scheduling to results publishing. Includes exam timetable creation, marks entry (manual/bulk), grading automation, report card generation, performance analytics, and controlled results release.',
          type: 'text'
        },
        {
          title: 'Exam Module Features',
          content: [
            'Exam Scheduling: Create detailed exam timetables with automatic conflict detection',
            'Results Entry: Flexible marks entry via manual input or bulk CSV/Excel upload',
            'Grading System: Customizable grading scales, pass marks, grade boundaries',
            'Report Cards: Automated professional report card generation with school branding',
            'Performance Analytics: Class rankings, subject analysis, year-over-year trends',
            'Results Publishing: Staged release workflow with admin approval required',
            'Parent Notifications: Automated SMS/email when results are published',
            'Grade Distribution: Visual charts showing A, B, C, D, F distribution',
            'Subject Comparison: Compare student performance across subjects',
            'Historical Tracking: Multi-term progress tracking and trend analysis'
          ],
          type: 'list'
        },
        {
          title: 'How to Enter and Publish Exam Results',
          content: `**Method 1: Manual Entry** (Best for small classes or corrections)
1. Navigate to Exams → Results Entry
2. Select filters:
   - Class (e.g., S1A)
   - Term (e.g., Term 1, 2025)
   - Exam Type (e.g., Mid-Term, End of Term)
3. Click "Manual Entry" tab
4. System displays student list with subject columns
5. Enter marks for each student/subject
6. Real-time validation shows errors (e.g., marks > 100)
7. Save as draft frequently
8. Review all entries
9. Click "Submit for Review"

**Method 2: Bulk Upload** (Best for large classes)
1. Navigate to Exams → Results Entry
2. Select same filters (Class, Term, Exam Type)
3. Click "Bulk Upload" tab
4. Download CSV template
5. Fill template with student IDs and marks
6. Upload completed CSV file
7. System validates data and shows errors
8. Fix any errors and re-upload if needed
9. Preview imported data
10. Click "Import Marks"

**Results Publishing Workflow:**
📝 Draft → 👨‍🏫 Teacher Submits → 👨‍💼 Admin Reviews → ✅ Publish → 📧 Parents Notified

**Admin Review & Publishing:**
1. Navigate to Exams → Results Review
2. View submitted results awaiting approval
3. Check for anomalies (very low/high marks, missing entries)
4. Approve or send back for corrections
5. Once approved, click "Publish Results"
6. Parents receive automatic notifications
7. Results visible in student/parent portals

📍 **Find in:** Main Menu → Examinations → Results Entry`,
          type: 'steps',
          screenshot: '/screenshots/results-entry.png'
        },
        {
          title: 'Analyzing Exam Performance',
          content: `**Class Performance Metrics:**
- **Class Average:** Overall class mean score
- **Pass Rate:** Percentage of students scoring ≥ pass mark
- **Top Performers:** Students in top 10% of class
- **Subject Strengths:** Subjects with highest average scores
- **Subject Weaknesses:** Subjects needing teaching improvement

**Using Analytics for Improvement:**
1. Identify consistently low-performing subjects
2. Review teacher assignments for those subjects
3. Provide additional resources or teacher training
4. Implement remedial classes for struggling students
5. Monitor improvement in next exam cycle

**Trend Analysis:**
- Compare Term 1 vs Term 2 vs Term 3 performance
- Track individual student progress over academic year
- Identify seasonal patterns (e.g., dip after long holidays)
- Measure effectiveness of intervention programs`,
          type: 'text'
        }
      ]
    },
    'certificates': {
      title: 'Certificate Generation & Management',
      icon: Award,
      color: 'amber',
      sections: [
        {
          title: 'Professional Certificate System',
          content: 'Create, customize, and manage certificates for academic achievements, course completions, participation awards, and excellence recognition. Generate professional PDF certificates with school branding in minutes.',
          type: 'text'
        },
        {
          title: 'Certificate Types Supported',
          content: [
            'Academic Achievement: Top performers, honor roll, subject excellence',
            'Course Completion: Program completion, training certificates',
            'Participation: Event participation, club membership, competitions',
            'Excellence Awards: Subject-specific awards, overall excellence',
            'Tahfiz Certificates: Juz completion, Quran completion milestones',
            'Attendance Awards: Perfect attendance, punctuality recognition',
            'Leadership Certificates: Prefects, class monitors, club leaders',
            'Sports Certificates: Tournament participation, team awards',
            'Custom Certificates: Fully customizable for any purpose'
          ],
          type: 'list'
        },
        {
          title: 'Creating Certificates Step-by-Step',
          content: `**Certificate Generation Wizard:**

**Step 1: Select Certificate Type**
1. Navigate to Certificates → Generate New
2. Choose certificate category (Achievement, Completion, Participation, etc.)
3. Select specific type within category
4. Click "Next"

**Step 2: Select Recipients**
5. Choose selection method:
   - Individual Students: Pick students one by one
   - Bulk Selection: Upload CSV of student IDs
   - Class-based: Select entire class
   - Criteria-based: Auto-select based on performance (e.g., all students with ≥ 85%)
6. Review selected students list
7. Click "Next"

**Step 3: Customize Certificate**
8. Edit certificate title (e.g., "Certificate of Academic Excellence")
9. Modify description/citation text
10. Choose template design:
    - Classic: Traditional formal design
    - Modern: Contemporary minimalist style
    - Gold: Elegant gold border design
    - Islamic: Islamic patterns and motifs
11. Set orientation (Landscape/Portrait)
12. Upload school logo (if not already set)
13. Add digital signature images
14. Enable watermark for authenticity
15. Click "Next"

**Step 4: Preview & Generate**
16. Preview sample certificate
17. Make final adjustments if needed
18. Click "Generate Certificates"
19. System creates individual PDF for each student
20. Download all as ZIP file or individual PDFs
21. Print certificates on quality paper
22. Distribute to students

📍 **Location:** Main Menu → Certificates → Generate New

**Bulk Generation Tips:**
✅ Generate all term-end certificates at once
✅ Preview thoroughly before generating hundreds
✅ Use consistent template for same award type
✅ Store digital copies before printing`,
          type: 'steps',
          screenshot: '/screenshots/certificate-generation.png'
        },
        {
          title: 'Managing Generated Certificates',
          content: [
            'Certificate Database: All generated certificates stored with issue dates',
            'Search & Filter: Find certificates by student, type, date range',
            'Reprint Capability: Regenerate lost certificates with original issue date',
            'Verification System: Each certificate has unique ID for authenticity checks',
            'Batch Operations: Revoke, reissue, or update certificates in bulk',
            'Distribution Tracking: Mark certificates as printed, distributed, or collected',
            'Parent Access: Parents can view/download their child\'s certificates',
            'Export Options: Export certificate list to Excel for record-keeping'
          ],
          type: 'list'
        }
      ]
    },
    'messaging': {
      title: 'Communication & Messaging System',
      icon: MessageSquare,
      color: 'purple',
      sections: [
        {
          title: 'Internal Communication Platform',
          content: 'Built-in messaging system for staff-to-staff, teacher-to-student, admin-to-parent, and broadcast communications. Centralize all school communications with message tracking, attachments, and delivery confirmations.',
          type: 'text'
        },
        {
          title: 'Messaging Features',
          content: [
            'Direct Messaging: One-on-one private conversations between users',
            'Group Messages: Broadcast to classes, departments, or custom groups',
            'Attachments: Share documents, images, PDFs, and files up to 10MB',
            'Read Receipts: Track message delivery and reading status',
            'Real-time Notifications: Instant alerts for new messages (email/SMS/in-app)',
            'Message Archive: Searchable message history with date filters',
            'Templates: Save frequently sent messages as reusable templates',
            'Scheduled Messages: Compose now, send later functionality',
            'Parent Communication: Direct channel to parents with student context',
            'Announcement System: School-wide announcements with priority levels'
          ],
          type: 'list'
        },
        {
          title: 'Communication Best Practices',
          content: [
            'Professional Tone: Maintain formal, respectful communication always',
            'Clear Subject Lines: Use descriptive subjects for easy categorization',
            'Timely Responses: Aim to respond within 24 hours during school week',
            'Attachment Guidelines: Compress large files, use PDFs for documents',
            'Parent Communication: CC admin on sensitive parent communications',
            'Emergency Protocols: Use high-priority flag for urgent safety issues',
            'Archive Important Messages: Save critical communications for records',
            'Respect Privacy: Don\'t share student information inappropriately'
          ],
          type: 'list'
        }
      ]
    },
    'reports': {
      title: 'Reports & Analytics Hub',
      icon: BarChart3,
      color: 'emerald',
      sections: [
        {
          title: 'Comprehensive Reporting System',
          content: 'Generate detailed, decision-maker focused reports across all modules with customizable filters, date ranges, and export options. Every report includes actionable insights to drive improvement.',
          type: 'text'
        },
        {
          title: 'Available Report Categories',
          content: [
            'Financial Reports: Income Statement, Balance Sheet, Cash Flow, Fee Collection Status, Expense Analysis',
            'Academic Reports: Student performance, class analytics, subject trends, grade distribution',
            'Attendance Reports: Daily attendance, monthly summaries, term-wise analysis, absenteeism patterns',
            'Exam Reports: Results analysis, grade distribution, class rankings, subject comparisons',
            'Transport Reports: Route utilization, vehicle maintenance, driver performance, student assignments',
            'Library Reports: Circulation statistics, overdue books, popular titles, member activity',
            'Tahfiz Reports: Memorization progress, accuracy trends, Juz completions, student comparisons',
            'User Activity: Login history, module usage, system access patterns',
            'Compliance Reports: Role permissions audit, data access logs, security events'
          ],
          type: 'list'
        },
        {
          title: 'How to Interpret Financial Reports',
          content: `**Income Statement Insights:**

**What to Look For:**
🟢 **Green Indicators (↑)**: Positive growth - revenue increasing or expenses controlled
🔴 **Red Indicators (↓)**: Needs attention - revenue declining or expenses rising

**Key Metrics:**
1. **Profit Margin**: Should be 18-25% for healthy school operations
   - Above 25% = Excellent profitability
   - 18-25% = Healthy operations
   - Below 18% = Review expense structure

2. **Revenue Growth**: Year-over-year increase
   - Target: 10-15% annual growth
   - Consider enrollment trends, fee adjustments

3. **Expense Control**: Expenses should grow slower than revenue
   - If expenses grow faster, investigate specific categories
   - Major expense: Salaries (typically 55-65% of total)

4. **Actionable Insights Panel**: Always read this first!
   - System highlights critical trends automatically
   - Provides specific recommendations
   - Prioritized by impact level (high/medium/low)

**Balance Sheet Interpretation:**

**Financial Health Indicators:**
- **Current Ratio > 2.0**: Strong liquidity - can pay obligations easily
- **Debt-to-Equity < 0.5**: Low risk - minimal debt burden
- **Asset Growth**: Positive growth indicates investment in infrastructure
- **Equity Growth**: Shows profitability is being retained (good sign)

**Red Flags to Watch:**
⚠️ Current Ratio < 1.5: May struggle to pay short-term bills
⚠️ High Debt-to-Assets > 0.6: Heavy reliance on borrowed funds
⚠️ Negative Working Capital: Insufficient funds for operations
⚠️ Declining Equity: School losing money or distributing too much`,
          type: 'text'
        },
        {
          title: 'Creating Custom Reports',
          content: `**Report Builder:**
1. Navigate to Reports → Report Builder
2. Select base report type (Financial, Academic, etc.)
3. Choose specific metrics to include
4. Apply filters:
   - Date range (start date, end date)
   - Department/class/level filters
   - Category filters (revenue types, expense categories)
   - Student/staff filters
5. Select visualization style (tables, charts, graphs)
6. Preview report
7. Save as template for reuse
8. Export to PDF, Excel, or CSV
9. Schedule for automatic generation (daily, weekly, monthly)

**Export Options:**
📄 **PDF**: Best for printing and presentations (board meetings)
📊 **Excel**: Best for further analysis and manipulation
📋 **CSV**: Best for importing into other systems`,
          type: 'steps'
        }
      ]
    },
    'users': {
      title: 'User & Role Management',
      icon: Users,
      color: 'blue',
      sections: [
        {
          title: 'User Management System',
          content: 'Comprehensive user and role management with granular permissions, access controls, and activity monitoring. Ensure the right people have the right access levels.',
          type: 'text'
        },
        {
          title: 'System Roles Explained',
          content: [
            '**Super Admin**: Complete system access including settings, backups, user management across all schools',
            '**School Admin**: Full school management (all modules) but cannot modify system settings',
            '**Exam Coordinator**: Exam creation, timetable management, results entry, publishing (no finance access)',
            '**Head Teacher**: Academic oversight, staff management, student discipline, attendance monitoring',
            '**Teacher**: Class management, attendance, grading, parent communication (limited to own classes)',
            '**Assistant Teacher**: Read-only class access, can record attendance but not modify grades',
            '**Accountant/Bursar**: Finance module only - fee collection, expense entry, financial reports',
            '**Librarian**: Library module only - book management, borrowing, fines',
            '**Transport Manager**: Transport module only - routes, vehicles, drivers, student assignments',
            '**Student**: View own grades, attendance, assignments, certificates, fee status',
            '**Parent**: View child\'s academic progress, attendance, fees, communicate with teachers'
          ],
          type: 'list'
        },
        {
          title: 'Setting Up Users',
          content: `**Creating Staff Accounts:**
1. Navigate to Users → Manage Users → Add New
2. Enter user details:
   - Full name
   - Email address (used for login)
   - Phone number (for SMS notifications)
   - Employee/Staff ID
3. Assign role(s) from dropdown:
   - Can assign multiple roles if needed
   - E.g., Teacher + Exam Coordinator
4. Set department/subject assignments:
   - Link to classes they teach
   - Assign subjects they're responsible for
5. Generate initial password:
   - System creates random secure password
   - Send via email or SMS
   - User forced to change on first login
6. Click "Create User"

**User receives:**
✅ Welcome email with login credentials
✅ System access URL
✅ Role responsibilities overview
✅ Initial password (must change on first login)

**Creating Student/Parent Accounts:**
- Typically done during student enrollment
- Parent account auto-created with student
- Login: Parent email + auto-generated password
- Student login: Student ID + date of birth (default)`,
          type: 'steps'
        },
        {
          title: 'Permission Management',
          content: [
            'Module Access Control: Grant/revoke access to specific modules per role',
            'Data Access Levels: Limit users to own classes, departments, or school-wide',
            'Action Permissions: Control who can create, read, update, delete in each module',
            'Report Access: Define which reports each role can generate',
            'Financial Controls: Separate expense approval from entry permissions',
            'Student Data Privacy: Limit sensitive information to authorized roles only',
            'Audit Trail: Track who accessed what data and when',
            'Session Management: Auto-logout after inactivity, force password changes'
          ],
          type: 'list'
        }
      ]
    },
    'settings': {
      title: 'System Configuration',
      icon: Settings,
      color: 'gray',
      sections: [
        {
          title: 'System Settings Overview',
          content: 'Configure school-wide settings including academic calendar, grading scales, fee structures, system preferences, and operational parameters. Set once, use throughout the system.',
          type: 'text'
        },
        {
          title: 'Configuration Areas',
          content: [
            '**School Profile**: Name, logo, motto, contact information, physical address, registration numbers',
            '**Academic Calendar**: Term dates, holidays, examination periods, school events, closure dates',
            '**Grading Scales**: Grade boundaries (A, B, C, D, F), pass marks, GPA calculation method',
            '**Fee Structure**: Fee categories, amounts per class level, payment schedules, penalty rates',
            '**Module Activation**: Enable/disable modules relevant to your school (Tahfiz, Boarding, Transport)',
            '**Notification Settings**: Email, SMS, in-app notification preferences and templates',
            '**Theme Customization**: School colors, branding, dark mode, logo placement',
            '**Backup & Security**: Automated backup schedules, password policies, session timeouts',
            '**Integration Settings**: Mobile money APIs, SMS gateway, email server configuration',
            '**Report Templates**: Customize report card layouts, certificate templates, letterheads'
          ],
          type: 'list'
        },
        {
          title: 'Initial System Configuration',
          content: `**First-Time Setup Checklist:**

**1. School Profile**
□ Upload school logo (PNG, max 2MB)
□ Enter official school name
□ Set school motto/mission
□ Add contact details (phone, email, address)
□ Enter registration/license numbers

**2. Academic Year Setup**
□ Create current academic year
□ Define terms (Term 1, 2, 3 with start/end dates)
□ Set examination periods
□ Add public holidays
□ Mark school closure dates

**3. Grading Configuration**
□ Set grading scale:
   - A: 80-100
   - B: 70-79
   - C: 60-69
   - D: 50-59
   - F: 0-49
□ Define pass mark (e.g., 50%)
□ Configure GPA calculation if used

**4. Fee Structure**
□ Create fee categories (Tuition, Transport, Boarding, etc.)
□ Set amounts per class level
□ Define payment schedule (term-based, monthly)
□ Set late payment penalty rates
□ Configure discount rules

**5. User Roles**
□ Review default roles
□ Customize permissions if needed
□ Create first admin accounts
□ Set password policies

✅ **Configuration complete! Start enrolling students.**`,
          type: 'steps'
        }
      ]
    }
  };

  const toggleSection = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const renderContent = (section) => {
    if (section.type === 'text') {
      return <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</p>;
    }
    
    if (section.type === 'list') {
      return (
        <ul className="space-y-3">
          {section.content.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (section.type === 'steps') {
      return (
        <div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
          </div>
          {section.screenshot && (
            <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-gray-400 dark:text-gray-600 mb-2 text-lg">📸 Screenshot</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 font-mono">{section.screenshot}</div>
              <div className="text-xs text-gray-400 dark:text-gray-600 mt-2">(Visual reference placeholder)</div>
            </div>
          )}
        </div>
      );
    }
  };

  const selectedDoc = documentation[selectedModule];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">DRAIS Documentation</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Decision-Maker Guide</p>
              </div>
            </div>
            
            {/* Version Selector */}
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {versions.map(v => (
                <option key={v} value={v}>Version {v}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {Object.entries(documentation).map(([key, doc]) => {
                const Icon = doc.icon;
                const isActive = selectedModule === key;
                const isExpanded = expandedSections.includes(key);
                
                return (
                  <div key={key}>
                    <button
                      onClick={() => {
                        setSelectedModule(key);
                        if (!isExpanded) toggleSection(key);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left text-sm font-semibold">{doc.title}</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Dark Mode Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 pb-20">
            {selectedDoc && (
              <motion.div
                key={selectedModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    {React.createElement(selectedDoc.icon, {
                      className: `w-12 h-12 text-${selectedDoc.color}-600 dark:text-${selectedDoc.color}-400`
                    })}
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{selectedDoc.title}</h1>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold">
                      v{selectedVersion}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last updated: December 2025
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-semibold">
                      Decision-Maker Focused
                    </span>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                  {selectedDoc.sections.map((section, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        {section.type === 'steps' && <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        {section.type === 'list' && <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                        {section.type === 'text' && <Info className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                        {section.title}
                      </h2>
                      {renderContent(section)}
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm">
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                      Print Documentation
                    </button>
                  </div>
                </div>

                {/* Help Notice */}
                <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Need More Help?</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      Contact DRAIS Support at <span className="font-semibold">support@drais.com</span> or call <span className="font-semibold">+256 700 000 000</span> for assistance.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
