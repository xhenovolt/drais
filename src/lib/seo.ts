import { Metadata } from 'next';

// Base URL for your application
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://drais-demo.xhenvolt.com';

// Default SEO configuration
export const defaultSEO: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'DRAIS - Digital Resource & Academic Information System',
    template: '%s | DRAIS School Management System',
  },
  description: 'DRAIS is the most comprehensive school management system in East Africa. Manage students, teachers, fees, exams, attendance, library, transport, and more with AI-powered insights. Trusted by 23+ schools across Uganda, Kenya, and Tanzania.',
  keywords: [
    'school management system',
    'school management software',
    'best school management system',
    'DRAIS',
    'school ERP',
    'student management system',
    'fee management software',
    'examination management system',
    'attendance tracking system',
    'school administration software',
    'education management system',
    'school management system Uganda',
    'school management system Kenya',
    'school management system Tanzania',
    'school management system East Africa',
    'Islamic school management',
    'secondary school management',
    'primary school management',
    'AI school management',
    'xhenvolt school erp',
    'xhenvolt school sytem',,
    'school attendance system',
    'cloud school management',
    'school accounting software',
    'school library management',
    'school transport management',
    'school SMS system',
    'parent portal software',
    'academic management system',
    'school timetable software',
  ],
  authors: [{ name: 'Xhenvolt Uganda Limited', url: 'https://xhenvolt.com' }],
  creator: 'Xhenvolt Uganda Limited',
  publisher: 'Xhenvolt Uganda Limited',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: 'DRAIS - Best School Management System in East Africa',
    description: 'Transform your school administration with DRAIS - the AI-powered school management system trusted by 23+ institutions. Manage everything from admissions to graduation seamlessly.',
    siteName: 'DRAIS School Management System',
    images: [
      {
        url: `${BASE_URL}/og-image-default.png`,
        width: 1200,
        height: 630,
        alt: 'DRAIS School Management System Dashboard',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRAIS - Digital Resource & Academic Information System',
    description: 'The most comprehensive school management system in East Africa. Manage your entire school with AI-powered insights.',
    images: [`${BASE_URL}/twitter-image.png`],
    creator: '@xhenvolt',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#2563eb',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

// Page-specific SEO configurations
export const pageSEO = {
  dashboard: {
    title: 'Dashboard - Real-time School Analytics',
    description: 'Access your school\'s real-time dashboard with comprehensive analytics, attendance tracking, fee collection status, and AI-powered insights.',
    keywords: 'school dashboard, school analytics, real-time reporting, school statistics',
  },
  students: {
    title: 'Student Management - Complete Student Records',
    description: 'Comprehensive student management system for admissions, records, profiles, attendance, and academic performance tracking.',
    keywords: 'student management, student records, student database, admission system',
  },
  teachers: {
    title: 'Teacher Management - Staff Administration',
    description: 'Manage teacher profiles, qualifications, schedules, performance, and payroll in one centralized system.',
    keywords: 'teacher management, staff management, teacher records, HR system',
  },
  finance: {
    title: 'Finance Management - Fee Collection & Accounting',
    description: 'Complete financial management with fee collection, invoicing, payment tracking, income statements, and balance sheets.',
    keywords: 'school finance, fee management, school accounting, payment tracking, financial reports',
  },
  exams: {
    title: 'Examination Management - Results & Report Cards',
    description: 'Manage examinations, record marks, generate report cards, and track student academic performance with analytics.',
    keywords: 'exam management, report cards, marks entry, academic results, grading system',
  },
  attendance: {
    title: 'Attendance Tracking - Real-time Monitoring',
    description: 'Track student and staff attendance in real-time with biometric integration, SMS alerts, and comprehensive reports.',
    keywords: 'attendance tracking, biometric attendance, student attendance, staff attendance',
  },
  library: {
    title: 'Library Management - Digital Catalog System',
    description: 'Manage your school library with book cataloging, borrowing, returns, fines, and inventory tracking.',
    keywords: 'library management, book catalog, library system, book tracking',
  },
  transport: {
    title: 'Transport Management - Route & Vehicle Tracking',
    description: 'Manage school transport routes, vehicles, drivers, GPS tracking, and student transport assignments.',
    keywords: 'transport management, school bus, GPS tracking, route management',
  },
  messaging: {
    title: 'Communication Hub - SMS, Email & Notifications',
    description: 'Send bulk SMS, emails, and push notifications to parents, students, and staff. Parent portal for real-time updates.',
    keywords: 'school communication, SMS system, parent portal, school messaging',
  },
  reports: {
    title: 'Reports & Analytics - Data-driven Insights',
    description: 'Generate comprehensive reports for academics, finance, attendance, and operations with AI-powered analytics.',
    keywords: 'school reports, analytics, business intelligence, data insights',
  },
  settings: {
    title: 'System Settings - Configuration & Customization',
    description: 'Configure your school management system with custom settings, roles, permissions, and integrations.',
    keywords: 'system settings, school configuration, user permissions, system admin',
  },
  pricing: {
    title: 'Pricing Plans - Affordable School Management',
    description: 'Flexible pricing plans for schools of all sizes. Start with a free trial. Professional, Premium, and Gold plans available.',
    keywords: 'school management pricing, DRAIS pricing, school software cost, affordable school system',
  },
  features: {
    title: 'Features - Complete School Management Solution',
    description: 'Explore DRAIS features: student management, finance, exams, attendance, library, transport, AI insights, and more.',
    keywords: 'school management features, DRAIS features, school system capabilities',
  },
  about: {
    title: 'About DRAIS - Xhenvolt Technologies',
    description: 'Learn about DRAIS, the leading school management system by Xhenvolt Technologies. Our mission, vision, and commitment to education.',
    keywords: 'about DRAIS, Xhenvolt Technologies, school management company, education technology',
  },
  contact: {
    title: 'Contact Us - Get DRAIS for Your School',
    description: 'Get in touch with DRAIS team. Schedule a demo, request pricing, or get support. Available across Uganda, Kenya, and Tanzania.',
    keywords: 'contact DRAIS, school management support, DRAIS demo, get started',
  },
  docs: {
    title: 'Documentation - DRAIS User Guide',
    description: 'Complete documentation and user guides for DRAIS school management system. Learn how to use all features effectively.',
    keywords: 'DRAIS documentation, user guide, system manual, help center',
  },
};

// Generate JSON-LD structured data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DRAIS - Xhenvolt Technologies',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Leading school management system provider in East Africa',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UG',
      addressRegion: 'Bulubandi',
      addressLocality: 'Iganga',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+256-741-341-483',
      contactType: 'customer service',
      areaServed: ['UG', 'KE', 'TZ'],
      availableLanguage: ['en', 'sw', 'lg', 'ar'],
    },
    sameAs: [
      'https://twitter.com/xhenvolt',
      'https://facebook.com/xhenvolt',
      'https://linkedin.com/company/xhenvolt',
    ],
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DRAIS School Management System',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Education Management',
    operatingSystem: 'Web, Windows, macOS, Linux, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UGX',
      priceValidUntil: '2025-12-31',
      description: 'Free trial available. Paid plans start from UGX 150,000/month',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '247',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Comprehensive school management system with AI-powered insights for student management, finance, exams, attendance, and more.',
    screenshot: `${BASE_URL}/screenshots/dashboard.png`,
    featureList: [
      'Student Management',
      'Fee Management',
      'Examination System',
      'Attendance Tracking',
      'Library Management',
      'Transport Management',
      'SMS & Email Integration',
      'AI Analytics',
      'Parent Portal',
      'Mobile Apps',
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateWebPageSchema(page: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: `${BASE_URL}${page.url}`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      url: BASE_URL,
      name: 'DRAIS School Management System',
    },
  };
}
