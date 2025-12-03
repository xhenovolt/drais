"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Phone, Mail, MapPin, Clock, Send, MessageSquare, HeadphonesIcon,
  Users, Calendar, Globe, ArrowRight, CheckCircle2, 
  Moon, Sun, Building2, Zap, Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our Uganda team",
    details: XHENVOLT_DATA.contact.phones.join(" / "),
    subtext: "Available Monday - Friday, 8 AM - 6 PM EAT",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get detailed help via email",
    details: XHENVOLT_DATA.contact.email,
    subtext: "Response within 24 hours",
    color: "from-green-500 to-green-600",
  },
  {
    icon: MapPin,
    title: "Office Location",
    description: "Visit us in Eastern Uganda", 
    details: XHENVOLT_DATA.contact.address,
    subtext: "Meetings by appointment",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Globe,
    title: "Website",
    description: "Learn more about our services",
    details: XHENVOLT_DATA.contact.website,
    subtext: "Online resources and documentation",
    color: "from-orange-500 to-orange-600",
  },
];

const offices = [
  {
    city: "Bulubandi", 
    country: "Uganda",
    address: XHENVOLT_DATA.contact.address,
    phone: XHENVOLT_DATA.contact.phones[0],
    email: XHENVOLT_DATA.contact.email,
    isHeadquarters: true,
  },
];

const faqs = [
  {
    question: "How quickly can we get started with DRAIS?",
    answer: "Most schools can be up and running within 2-3 business days. Our implementation team provides full setup, data migration, and training to ensure a smooth transition.",
  },
  {
    question: "Do you offer training for our staff?",
    answer: "Yes! We provide comprehensive training including live sessions, video tutorials, documentation, and ongoing support to ensure your team is confident using DRAIS.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer multiple support channels including phone, email, live chat, and a comprehensive knowledge base. Enterprise clients receive dedicated account management and priority support.",
  },
  {
    question: "Can DRAIS integrate with our existing systems?",
    answer: "DRAIS offers extensive integration capabilities with popular educational tools, accounting software, and third-party applications. Our team can help design custom integrations if needed.",
  },
];

export default function Contact() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // You would typically send this to your API
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Let's Connect
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Have questions about DRAIS? Want to schedule a demo? Our team is here to help 
              you transform your school's administrative processes and enhance educational outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get Support Your Way
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the communication method that works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{method.title}</CardTitle>
                    <CardDescription className="text-base">
                      {method.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold text-lg mb-2">{method.details}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{method.subtext}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Locations */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                <CardHeader>
                  <CardTitle className="text-3xl mb-2">Send Us a Message</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Smith"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@school.edu"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="school">School/Organization</Label>
                        <Input
                          id="school"
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          placeholder="Springfield Elementary"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="demo">Request Demo</option>
                        <option value="pricing">Pricing Information</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your needs..."
                        rows={5}
                        required
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                    >
                      Send Message <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Our Global Offices
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                    With offices around the world, we're always here to support your educational journey.
                  </p>
                </div>

                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <Card key={index} className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl">{office.city}</CardTitle>
                              {office.isHeadquarters && (
                                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                  HQ
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-base">{office.country}</CardDescription>
                          </div>
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
                              {office.address}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{office.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{office.email}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Quick answers to common questions about DRAIS
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
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
              Join thousands of educators who trust DRAIS to streamline their operations 
              and enhance student experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Schedule Demo <Calendar className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  View Pricing
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