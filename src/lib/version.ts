export const DRAIS_VERSION = "0.0.0041";

// Version increment rules:
// 0.0.0001 → 0.0.0002 → ... → 0.0.9999 → 0.1.0001 → ... → 0.9.9999 → 1.0.0000 → 1.0.0001

export const DRAIS_INFO = {
  name: "DRAIS",
  fullName: "DRAIS School Management System",
  description: "School Management Made Easy by Xhenvolt",
  company: "Xhenvolt",
  copyright: `© ${new Date().getFullYear()} DRAIS by Xhenvolt. All rights reserved.`,
  buildDate: new Date().toISOString().split('T')[0],
} as const;

// Realistic metrics for the system
export const DRAIS_METRICS = {
  schools: 23,
  students: 4284,
  staff: 187,
  reports: 32847,
  attendance: "99.4%",
  uptime: "99.99%",
} as const;

// Official Xhenvolt Uganda Company Data
export const XHENVOLT_DATA = {
  company: {
    name: "Xhenvolt Uganda",
    fullName: "Xhenvolt Uganda Limited",
    tagline: "Building intelligent digital infrastructure for African schools",
    mission: "To build intelligent digital infrastructure for African schools.",
    vision: "To empower institutions with speed, accuracy and intelligent tools.",
    values: ["Excellence", "Innovation", "Integrity", "Customer Success"],
    description: "Xhenvolt specializes in education solutions, automation, and innovation for modern institutions.",
  },
  contact: {
    address: "Bulubandi, Iganga, Uganda",
    phones: ["0741341483", "0760700954", "0745726350"],
    email: "info@xhenvolt.com",
    website: "xhenvolt.com",
  },
  social: {
    facebook: "https://facebook.com/xhenvolt",
    twitter: "https://twitter.com/xhenvolt",
    linkedin: "https://linkedin.com/company/xhenvolt",
    instagram: "https://instagram.com/xhenvolt",
  },
  pricing: {
    professional: {
      name: "Professional",
      setup: 1000000,
      termSubscription: 350000,
      yearlySubscription: 900000,
      oneTimePrice: 1490000, // 4 terms + 10% annual subscription
      gracePeriod: "2 weeks",
      target: "new schools, small schools, budget-sensitive schools",
      savings: {
        yearly: 150000, // Save 150K vs 3 terms (3×350K = 1.05M)
        oneTime: 760000, // Save vs paying yearly for first year + subscription
      }
    },
    premium: {
      name: "Premium", 
      setup: 1800000,
      termSubscription: 600000,
      yearlySubscription: 1300000,
      oneTimePrice: 2530000, // 4 terms + 10% annual subscription
      gracePeriod: "1 month",
      target: "mid-size schools, growing institutions, high accuracy needs",
      savings: {
        yearly: 500000, // Save 500K vs 3 terms (3×600K = 1.8M)
        oneTime: 1370000, // Save vs paying yearly for first year + subscription
      }
    },
    gold: {
      name: "Gold",
      setup: 2500000,
      termSubscription: 850000,
      yearlySubscription: 1500000,
      oneTimePrice: 3550000, // 4 terms + 10% annual subscription
      gracePeriod: "6 weeks",
      target: "large schools, premium infrastructure, automation-focused clients",
      savings: {
        yearly: 1050000, // Save 1.05M vs 3 terms (3×850K = 2.55M)
        oneTime: 2000000, // Save vs paying yearly for first year + subscription
      }
    },
  },
} as const;