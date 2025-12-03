"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Target, Users, Award, Rocket, Globe, Heart, Code, Lightbulb,
  Moon, Sun, ArrowRight, CheckCircle2, Star, Zap, Shield,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We deliver exceptional educational technology solutions that exceed expectations and drive measurable results for African schools.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We pioneer cutting-edge automation and intelligent tools specifically designed for the unique needs of Ugandan institutions.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We build trust through transparent practices, secure data handling, and honest communication with every client.",
  },
  {
    icon: Users,
    title: "Customer Success",
    description: "Our clients' success is our primary focus - we provide comprehensive support from setup to daily operations.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "Foundation in Uganda",
    description: "Xhenvolt Uganda established in Bulubandi, Iganga with a mission to transform African education through technology.",
  },
  {
    year: "2022", 
    title: "DRAIS Development",
    description: "Started building DRAIS - a comprehensive school management system tailored for Ugandan educational institutions.",
  },
  {
    year: "2023",
    title: "Local Market Entry",
    description: "Launched DRAIS in Uganda, serving our first schools with attendance, exams, and fees management solutions.",
  },
  {
    year: "2024",
    title: "Regional Expansion",
    description: "Expanded across Eastern Uganda, serving 47+ schools with localized features and Uganda-specific workflows.",
  },
  {
    year: "2025",
    title: "AI & Automation",
    description: "Introduced AI-powered insights and advanced automation features, positioning as Uganda's leading EdTech solution.",
  },
];

const team = [
  {
    name: "Leadership Team",
    role: "Founders & Directors",
    bio: "Experienced Ugandan educators and technologists committed to revolutionizing school management across Africa.",
    expertise: "Educational Technology, Business Strategy",
  },
  {
    name: "Development Team",
    role: "Software Engineers", 
    bio: "Skilled full-stack developers building robust, scalable solutions specifically for African educational institutions.",
    expertise: "System Architecture, Database Design, Security",
  },
  {
    name: "Customer Success Team",
    role: "Support & Training",
    bio: "Dedicated professionals ensuring seamless onboarding and ongoing success for every DRAIS client school.",
    expertise: "Training, Technical Support, Client Relations",
  },
  {
    name: "Sales & Marketing Team",
    role: "Business Development",
    bio: "Field experts who understand Ugandan schools' needs and help institutions optimize their educational operations.",
    expertise: "Sales Strategy, Market Research, Client Acquisition",
  },
];

export default function AboutXhenvolt() {
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
              About {XHENVOLT_DATA.company.name}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {XHENVOLT_DATA.company.tagline}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {XHENVOLT_DATA.company.description} Based in {XHENVOLT_DATA.contact.address}, 
              we're transforming how African schools manage their operations through intelligent automation and data-driven insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Target className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">
                    {XHENVOLT_DATA.company.mission}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Lightbulb className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">
                    {XHENVOLT_DATA.company.vision}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
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
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{value.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {value.description}
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

      {/* Company Timeline */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From vision to reality - the Xhenvolt story
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="flex-1">
                    <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            {item.year}
                          </Badge>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Passionate educators and technologists driving innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                  <CardHeader>
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">{member.role}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Expertise: {member.expertise}
                    </div>
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
              Join Us in Transforming Education
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Ready to be part of the educational revolution? Let's build the future of learning together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/careers">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  View Careers <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  Get In Touch
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