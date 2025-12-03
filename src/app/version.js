export const DRAIS_VERSION = "0.0.0011";

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
  schools: 47,
  students: 4284,
  staff: 187,
  reports: 32847,
  attendance: "99.4%",
  uptime: "99.99%",
} as const;