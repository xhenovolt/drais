"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Send, Bot, User, Moon, Sun, ArrowRight, Sparkles, MessageCircle,
  Zap, Brain, HelpCircle, Star, Clock, Phone, Mail, MapPin, DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// AI Knowledge Base
const AI_KNOWLEDGE = {
  drais: {
    name: DRAIS_INFO.name,
    description: DRAIS_INFO.description,
    version: DRAIS_VERSION,
    features: [
      "Student Management & Registration",
      "Attendance Tracking & Analytics", 
      "Examination & Grading System",
      "Fees Management & Payment Tracking",
      "Staff Management & Payroll",
      "Parent Communication Portal",
      "Academic Reporting & Analytics",
      "Timetable & Class Scheduling",
      "Library & Resource Management",
      "Security & Data Protection",
    ],
    modules: [
      "Attendance Module - Real-time tracking with mobile integration",
      "Exams Module - Automated grading and result processing", 
      "Fees Module - Complete financial management for schools",
      "Staff Module - Employee management and payroll integration",
      "Students Module - Comprehensive student lifecycle management",
      "Reports Module - Advanced analytics and insights",
    ],
  },
  xhenvolt: {
    ...XHENVOLT_DATA.company,
    contact: XHENVOLT_DATA.contact,
    pricing: XHENVOLT_DATA.pricing,
  },
  benefits: [
    "Reduce administrative workload by 70%",
    "Improve data accuracy and eliminate manual errors",
    "Enhance parent-school communication",
    "Real-time insights and analytics for better decision making",
    "Streamlined fee collection and financial management",
    "Automated attendance tracking with mobile integration",
    "Secure cloud-based data storage and backup",
    "24/7 technical support from Uganda-based team",
  ],
};

// AI Response Generator
const generateAIResponse = (message) => {
  const msg = message.toLowerCase();
  
  // Greetings
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("good")) {
    return {
      text: `Hello! 👋 I'm DRAIS AI Assistant. I'm here to help you learn about ${AI_KNOWLEDGE.xhenvolt.name} and our DRAIS school management system. What would you like to know?`,
      tone: "friendly"
    };
  }
  
  // About DRAIS
  if (msg.includes("what is drais") || msg.includes("about drais") || msg.includes("drais")) {
    return {
      text: `DRAIS is ${AI_KNOWLEDGE.drais.description}. We're currently on version ${AI_KNOWLEDGE.drais.version}. Our system helps Ugandan schools manage students, staff, attendance, exams, and fees all in one powerful platform. We've helped 47+ schools serve over 4,000 students across Uganda!`,
      tone: "informative"
    };
  }
  
  // About Xhenvolt
  if (msg.includes("xhenvolt") || msg.includes("company") || msg.includes("who made") || msg.includes("who built")) {
    return {
      text: `${AI_KNOWLEDGE.xhenvolt.name} is a leading educational technology company based in ${AI_KNOWLEDGE.xhenvolt.contact.address}. Our mission: "${AI_KNOWLEDGE.xhenvolt.mission}" We specialize in education solutions, automation, and innovation for modern institutions across Uganda and East Africa.`,
      tone: "professional"
    };
  }
  
  // Pricing
  if (msg.includes("price") || msg.includes("cost") || msg.includes("ugx") || msg.includes("payment") || msg.includes("fee")) {
    const pricing = AI_KNOWLEDGE.xhenvolt.pricing;
    return {
      text: `We offer 3 flexible pricing packages in Uganda Shillings:

**Professional**: Setup UGX ${pricing.professional.setup.toLocaleString()}, then UGX ${pricing.professional.termSubscription.toLocaleString()}/term - perfect for new schools!

**Premium**: Setup UGX ${pricing.premium.setup.toLocaleString()}, then UGX ${pricing.premium.termSubscription.toLocaleString()}/term - our most popular choice!

**Gold**: Setup UGX ${pricing.gold.setup.toLocaleString()}, then UGX ${pricing.gold.termSubscription.toLocaleString()}/term - for large institutions.

All packages include grace periods and no hidden fees! Would you like details about any specific package?`,
      tone: "sales"
    };
  }
  
  // Features
  if (msg.includes("feature") || msg.includes("what can") || msg.includes("capabilities") || msg.includes("modules")) {
    return {
      text: `DRAIS offers comprehensive features including:

${AI_KNOWLEDGE.drais.features.slice(0, 6).map(f => `✅ ${f}`).join('\n')}

Our key modules are:
📚 **Attendance** - Mobile tracking with analytics
📝 **Exams** - Automated grading and results  
💰 **Fees** - Complete financial management
👥 **Staff** - Employee and payroll management
🎓 **Students** - Full lifecycle management
📊 **Reports** - Advanced insights and analytics

Which module interests you most?`,
      tone: "technical"
    };
  }
  
  // Benefits
  if (msg.includes("benefit") || msg.includes("why choose") || msg.includes("advantage") || msg.includes("why drais")) {
    return {
      text: `Here's why schools choose DRAIS:

${AI_KNOWLEDGE.benefits.slice(0, 4).map(b => `🎯 ${b}`).join('\n')}

**"The best investment is in education technology that actually works."** - Brian Tracy would say. DRAIS doesn't just manage your school - it transforms it into a modern, efficient institution that parents and students love!

Ready to revolutionize your school? 🚀`,
      tone: "motivational"
    };
  }
  
  // Contact
  if (msg.includes("contact") || msg.includes("reach") || msg.includes("phone") || msg.includes("email") || msg.includes("office")) {
    return {
      text: `📞 **Phone**: ${AI_KNOWLEDGE.xhenvolt.contact.phones.join(' / ')}
📧 **Email**: ${AI_KNOWLEDGE.xhenvolt.contact.email}  
📍 **Office**: ${AI_KNOWLEDGE.xhenvolt.contact.address}
🌐 **Website**: ${AI_KNOWLEDGE.xhenvolt.contact.website}

Our Uganda-based team is ready to help you transform your school! We provide on-site training and support across Uganda. Contact us today! 📱`,
      tone: "helpful"
    };
  }
  
  // Careers/Jobs
  if (msg.includes("job") || msg.includes("career") || msg.includes("hiring") || msg.includes("work")) {
    return {
      text: `We're hiring in Uganda! 🇺🇬 Current openings:

💼 **Secretary** - UGX 700K - 1.2M
🤝 **Customer Success Officer** - UGX 900K - 1.5M  
💻 **Software Engineer** - UGX 2M - 4.5M
📈 **Sales Manager** - UGX 1.5M - 3M + commissions

All positions are based in ${AI_KNOWLEDGE.xhenvolt.contact.address}. We offer competitive salaries, health coverage, and professional growth opportunities. Ready to join Uganda's leading EdTech company?`,
      tone: "encouraging"
    };
  }
  
  // Demo
  if (msg.includes("demo") || msg.includes("trial") || msg.includes("test") || msg.includes("see system")) {
    return {
      text: `Absolutely! We'd love to show you DRAIS in action! 🎯

Our demo includes:
✨ Live system walkthrough
📱 Mobile app demonstration  
📊 Real school data examples
💡 Customization options for your school
🔧 Implementation roadmap

**"A picture is worth a thousand words, but a demo is worth a thousand students!"** 

Contact us at ${AI_KNOWLEDGE.xhenvolt.contact.phones[0]} to schedule your personalized demo today!`,
      tone: "enthusiastic"
    };
  }
  
  // Default response
  return {
    text: `I understand you're asking about "${message}". I can help you with information about:

🎓 **DRAIS System** - Features, modules, and capabilities  
🏢 **Xhenvolt Company** - About us, mission, and values
💰 **Pricing** - All packages in Uganda Shillings
📞 **Contact Info** - Phone, email, and office location  
💼 **Careers** - Current job openings in Uganda
🎯 **Demo** - Schedule a live system demonstration

Feel free to ask me anything specific! I'm here to help make your school management journey easier. 😊`,
    tone: "helpful"
  };
};

export default function AIAssistant() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: `Hello! 👋 I'm your DRAIS AI Assistant. I can help you learn about ${XHENVOLT_DATA.company.name}, our DRAIS school management system, pricing, features, and more. What would you like to know?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const response = generateAIResponse(input);
    const aiMessage = {
      id: messages.length + 2,
      type: "ai",
      content: response.text,
      timestamp: new Date(),
      tone: response.tone,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const getToneColor = (tone) => {
    const colors = {
      friendly: "from-green-500 to-teal-500",
      professional: "from-blue-500 to-indigo-500", 
      sales: "from-purple-500 to-pink-500",
      technical: "from-gray-600 to-gray-700",
      motivational: "from-orange-500 to-red-500",
      helpful: "from-cyan-500 to-blue-500",
      enthusiastic: "from-yellow-500 to-orange-500",
      encouraging: "from-emerald-500 to-green-600",
    };
    return colors[tone] || "from-blue-500 to-purple-500";
  };

  const quickQuestions = [
    "What is DRAIS?",
    "Show me pricing",
    "How can DRAIS help my school?",
    "Contact information",
    "Available jobs",
    "Schedule a demo",
  ];

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

      {/* Main Content */}
      <div className="pt-32 pb-8 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DRAIS AI Assistant
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get instant answers about DRAIS, pricing, features, and how we can transform your school.
            </p>
          </motion.div>

          {/* Quick Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Popular questions:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  DRAIS AI Assistant
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === "user" 
                              ? "bg-gradient-to-r from-green-500 to-teal-500" 
                              : `bg-gradient-to-r ${getToneColor(message.tone)}`
                          }`}>
                            {message.type === "user" ? 
                              <User className="w-4 h-4 text-white" /> : 
                              <Bot className="w-4 h-4 text-white" />
                            }
                          </div>
                          
                          {/* Message Bubble */}
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}>
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </div>
                            <div className={`text-xs mt-2 opacity-70 ${
                              message.type === "user" ? "text-white" : "text-gray-500"
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input Form */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <form onSubmit={sendMessage} className="flex gap-3">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about DRAIS, pricing, features..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 lg:px-8 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Powered by {XHENVOLT_DATA.company.name} AI</span>
          </div>
          <p className="text-gray-400 text-xs">
            {DRAIS_INFO.copyright} • v{DRAIS_VERSION}
          </p>
        </div>
      </footer>
    </div>
  );
}