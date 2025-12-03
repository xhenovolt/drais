"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Check, X, Star, ArrowRight, Moon, Sun, Zap, Shield, Heart,
  Users, Building, Crown, Rocket,
} from "lucide-react";
import Link from "next/link";

// Utility function to format Uganda Shillings
const formatUGX = (amount) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('UGX', 'UGX ');
};

const plans = [
  {
    name: XHENVOLT_DATA.pricing.professional.name,
    setupPrice: XHENVOLT_DATA.pricing.professional.setup,
    termPrice: XHENVOLT_DATA.pricing.professional.termSubscription,
    yearlyPrice: XHENVOLT_DATA.pricing.professional.yearlySubscription,
    gracePeriod: XHENVOLT_DATA.pricing.professional.gracePeriod,
    description: "Perfect for new schools and budget-sensitive institutions",
    target: XHENVOLT_DATA.pricing.professional.target,
    features: [
      "Complete student management system",
      "Attendance tracking & reporting", 
      "Exam management & grading",
      "Fees collection & tracking",
      "Basic parent communication",
      "Standard reports & analytics",
      "Email & phone support",
      "Mobile app access",
      "Data backup & security",
    ],
    limitations: [
      "Up to 3 administrative users",
      "Standard templates only", 
      "Basic customization",
      "Standard integrations",
    ],
    recommended: false,
    color: "from-blue-500 to-blue-600",
    icon: Users,
  },
  {
    name: XHENVOLT_DATA.pricing.premium.name,
    setupPrice: XHENVOLT_DATA.pricing.premium.setup,
    termPrice: XHENVOLT_DATA.pricing.premium.termSubscription,
    yearlyPrice: XHENVOLT_DATA.pricing.premium.yearlySubscription, 
    gracePeriod: XHENVOLT_DATA.pricing.premium.gracePeriod,
    description: "Best for mid-size schools seeking growth and efficiency",
    target: XHENVOLT_DATA.pricing.premium.target,
    features: [
      "Everything in Professional",
      "Advanced reporting & analytics",
      "Parent portal & communication",
      "SMS & email notifications",
      "Custom report templates",
      "Bulk data operations",
      "Priority technical support",
      "Advanced user management",
      "Custom school branding",
      "Integration with external systems",
    ],
    limitations: [
      "Up to 8 administrative users",
      "Standard API access",
    ],
    recommended: true,
    color: "from-green-500 to-green-600",
    icon: Building,
  },
  {
    name: XHENVOLT_DATA.pricing.gold.name,
    setupPrice: XHENVOLT_DATA.pricing.gold.setup,
    termPrice: XHENVOLT_DATA.pricing.gold.termSubscription,
    yearlyPrice: XHENVOLT_DATA.pricing.gold.yearlySubscription,
    gracePeriod: XHENVOLT_DATA.pricing.gold.gracePeriod,
    description: "Premium solution for large schools and institutions",
    target: XHENVOLT_DATA.pricing.gold.target,
    features: [
      "Everything in Premium",
      "Unlimited students & staff",
      "Multi-campus management",
      "Advanced AI-powered insights",
      "Full API access & integrations",
      "Custom workflow automation",
      "Dedicated account manager",
      "24/7 priority support",
      "On-site training & setup",
      "White-label branding options",
      "Advanced security features",
      "Custom module development",
    ],
    limitations: [],
    recommended: false,
    color: "from-yellow-500 to-orange-500",
    icon: Crown,
  },
];

const addons = [
  { name: "Additional Storage (100GB)", price: "UGX 50,000/month" },
  { name: "Premium SMS Credits (5000)", price: "UGX 80,000/month" },
  { name: "Custom Integration Setup", price: "UGX 500,000 one-time" },
  { name: "On-site Training (per day)", price: "UGX 300,000/day" },
  { name: "Additional Admin Users (per user)", price: "UGX 25,000/month" },
  { name: "Priority Support Upgrade", price: "UGX 100,000/month" },
];

export default function Pricing() {
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
              <Heart className="w-4 h-4 mr-2" />
              Uganda School Management Solutions
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Affordable Pricing for Uganda Schools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transparent pricing in Uganda Shillings. No hidden fees, flexible payment terms. 
              Choose the plan that fits your school's budget and needs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure data handling</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span>Quick setup & training</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-blue-600" />
                <span>On-site support in Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Local customer support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full ${plan.recommended ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border border-gray-200 dark:border-gray-700'} bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30`}>
                  <CardHeader className="text-center pb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                    <div className="mt-6 space-y-3">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Setup Fee</div>
                        <div className="text-xl font-bold text-blue-600">{formatUGX(plan.setupPrice)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Per Term</div>
                          <div className="text-lg font-semibold">{formatUGX(plan.termPrice)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Per Year</div>
                          <div className="text-lg font-semibold text-green-600">{formatUGX(plan.yearlyPrice)}</div>
                        </div>
                      </div>
                      <div className="text-center text-sm text-purple-600 dark:text-purple-400">
                        Grace Period: {plan.gracePeriod}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">What's Included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-600 dark:text-gray-400">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button 
                      className={`w-full mt-8 ${plan.recommended 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
                      }`}
                      size="lg"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Summary Table & Brian Tracy Style Sales Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Transform Your School Today - The Choice Is Yours
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              "Success in education is not about managing students - it's about empowering excellence. 
              Every day you wait to modernize your school is a day your competitors get ahead."
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Complete Pricing Summary</CardTitle>
                <CardDescription className="text-center text-white/80">
                  All prices in Uganda Shillings (UGX) - Compare and Choose
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-2">Package</th>
                        <th className="text-center py-4 px-2">Setup Fee</th>
                        <th className="text-center py-4 px-2">Per Term</th>
                        <th className="text-center py-4 px-2">Per Year</th>
                        <th className="text-center py-4 px-2">Grace Period</th>
                        <th className="text-center py-4 px-2">Best For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {plans.map((plan, index) => (
                        <tr key={index} className={plan.recommended ? "bg-white/10" : ""}>
                          <td className="py-4 px-2 font-semibold">
                            {plan.name} {plan.recommended && <Badge className="ml-2 bg-yellow-500 text-black">Recommended</Badge>}
                          </td>
                          <td className="py-4 px-2 text-center font-mono">{formatUGX(plan.setupPrice)}</td>
                          <td className="py-4 px-2 text-center font-mono">{formatUGX(plan.termPrice)}</td>
                          <td className="py-4 px-2 text-center font-mono text-green-300">{formatUGX(plan.yearlyPrice)}</td>
                          <td className="py-4 px-2 text-center">{plan.gracePeriod}</td>
                          <td className="py-4 px-2 text-center text-sm">{plan.target.split(',')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-lg mb-4 opacity-90">
                    "The cost of inaction is always greater than the cost of action. 
                    Choose excellence. Choose DRAIS."
                  </p>
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Get Started Today <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Optional Add-ons
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enhance your DRAIS experience with these optional services
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Available Add-ons</CardTitle>
                <CardDescription>Additional services to extend your plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addons.map((addon, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="font-medium">{addon.name}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{addon.price}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly."
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees ever. We also provide free data migration from your existing system and dedicated onboarding support."
              },
              {
                q: "What happens to my data if I cancel?",
                a: "You own your data completely. You can export all your data in standard formats (CSV, PDF) even after cancellation. We keep your data for 90 days after cancellation."
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes! Save 20% when you pay annually. We also offer special discounts for non-profits and educational institutions."
              },
              {
                q: "Is technical support included?",
                a: "All plans include technical support. Professional and Enterprise plans get priority support with faster response times."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your School?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of schools worldwide. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  Talk to Sales
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