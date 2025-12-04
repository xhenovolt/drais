"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Get time-based greeting
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

// Knowledge base for DRAIS with intelligent responses
const knowledgeBase = {
  greetings: {
    keywords: ["hello", "hi", "hey", "howdy", "greetings", "good morning", "good afternoon", "good evening"],
    responses: [
      `${getTimeBasedGreeting()}! 👋 I'm your DRAIS AI Assistant. How can I help you today?`,
      "Hello there! 😊 Ready to explore DRAIS? Ask me anything!",
      "Hey! Great to see you! I'm here to answer all your DRAIS questions.",
      `${getTimeBasedGreeting()}! ✨ Welcome to DRAIS. What would you like to know?`,
    ],
    tone: "cheerful",
  },
  identity: {
    keywords: ["who are you", "what are you", "your name", "introduce yourself", "about you"],
    responses: [
      "I'm the DRAIS AI Assistant! 🤖 I'm here to help you navigate the Digital Records and Information System. Think of me as your friendly guide to all things DRAIS.",
      "Great question! I'm an AI-powered chatbot built specifically for DRAIS. My purpose is to help you understand features, answer questions, and make your experience smooth and enjoyable!",
      "I'm your intelligent companion in DRAIS! I can explain features, guide you through workflows, and answer questions about school management. What would you like to explore?",
    ],
    tone: "explanatory",
  },
  capabilities: {
    keywords: ["what can you do", "how do you work", "your capabilities", "help me", "how can you help"],
    responses: [
      "I can help you with:\n✅ Explaining DRAIS features\n✅ Guiding you through workflows\n✅ Answering questions about student management, fees, attendance, AI tools, and more\n✅ Providing tips and best practices\n\nJust ask away!",
      "I'm designed to be your DRAIS expert! I can:\n• Explain how any feature works\n• Guide you step-by-step through tasks\n• Answer questions about AI Copilot, Biometric Attendance, Payments, and all modules\n• Share tips to maximize your efficiency\n\nWhat would you like to know?",
      "Think of me as your DRAIS encyclopedia! 📚 I know everything about student records, fee management, attendance tracking, AI predictions, reports, and more. Ask me anything specific, or say 'features' for an overview!",
    ],
    tone: "explanatory",
  },
  drais: {
    keywords: ["drais", "what is drais", "about drais", "school management", "tell me about drais"],
    responses: [
      "DRAIS (Digital Records and Information System) is an advanced school management platform designed to streamline educational administration. It handles student records, fees, attendance, assessments, timetables, and much more with AI-powered insights! 🎓",
      "DRAIS is your all-in-one solution for school management! From tracking 4000+ students to AI-driven predictions, biometric attendance, mobile money payments, and comprehensive analytics — everything you need in one powerful platform. ✨",
    ],
    tone: "formal",
  },
  xhenvolt: {
    keywords: ["xhenvolt", "developer", "who made", "creator", "company", "who built"],
    responses: [
      "DRAIS is developed by Xhenvolt, a software development company specializing in educational technology solutions for schools in Uganda and East Africa. 🚀",
      "Xhenvolt is the innovative team behind DRAIS! They're experts in building cutting-edge educational software that transforms how schools operate. Based in Uganda, serving East Africa. 🌍",
    ],
    tone: "formal",
  },
  features: {
    keywords: ["features", "what can", "capabilities", "functions", "modules", "what does drais do"],
    responses: [
      "DRAIS is packed with features! Here are the highlights:\n\n🎓 Student Management (4000+ students)\n💰 Fee Tracking & Mobile Money Payments\n📊 Attendance (Manual + Biometric)\n🤖 AI Copilot (94% prediction accuracy)\n📚 Library Management\n💬 Messaging & Communication\n📈 Advanced Analytics & Reports\n🧠 AI Teacher Assistant\n⏰ Timetable Management\n🔒 Audit Logs & Security\n\nWhat would you like to explore first?",
      "DRAIS has everything you need:\n✅ Complete student lifecycle management\n✅ Automated fee collection (MTN, Airtel)\n✅ Biometric attendance (99.8% accuracy)\n✅ AI-powered predictions & insights\n✅ Real-time analytics dashboards\n✅ Library, timetables, exams, discipline\n✅ Messaging for parents, students, staff\n\nWhich feature interests you most?",
    ],
    tone: "enthusiastic",
  },
  pricing: {
    keywords: ["price", "cost", "pricing", "how much", "payment plans", "subscription"],
    responses: [
      "DRAIS offers flexible pricing plans starting from UGX 500,000/term for small schools. The pricing scales based on student count and features needed. Contact Xhenvolt for a customized quote tailored to your school! 💼",
      "Pricing is flexible and fair! 💰\n• Small schools (up to 500 students): UGX 500,000/term\n• Medium schools (500-2000): Custom pricing\n• Large schools (2000+): Enterprise plans\n\nReach out to Xhenvolt for a personalized quote based on your specific needs!",
    ],
    tone: "formal",
  },
  demo: {
    keywords: ["demo", "trial", "test", "try", "how to start", "get started"],
    responses: [
      "You're currently exploring the DRAIS demo interface! 🎉 This is a fully functional UI showcase. Like what you see? Contact Xhenvolt for a personalized demo with your school's actual data.",
      "Great news — you're IN the demo right now! This entire interface showcases DRAIS capabilities. Want to see it with your school's data? Reach out to Xhenvolt for a custom demo setup! 🚀",
    ],
    tone: "cheerful",
  },
  support: {
    keywords: ["support", "help", "contact", "assistance", "phone", "email", "reach out"],
    responses: [
      "Our support team is available 24/7! 📞\n\n📧 Email: support@xhenvolt.com\n☎️ Phone: +256 700 000000\n\nWe also offer in-school training and onboarding to ensure your team is fully equipped. How can we help?",
      "Need assistance? We've got you covered! 🛟\n\nContact Xhenvolt:\n• Email: support@xhenvolt.com\n• Phone: +256 700 000000\n• Available 24/7 for urgent issues\n• Free training sessions for new schools\n\nWhat do you need help with?",
    ],
    tone: "formal",
  },
  aiCopilot: {
    keywords: ["ai copilot", "ai predictions", "predictions", "ai insights", "copilot"],
    responses: [
      "AI Copilot is DRAIS's most powerful feature! 🤖\n\nIt uses machine learning to:\n✅ Predict student performance (94% accuracy)\n✅ Forecast fee collection rates\n✅ Identify at-risk students early\n✅ Recommend interventions & resource allocation\n✅ Send automated alerts for critical issues\n\nWant to explore the AI Copilot dashboard?",
      "The AI Copilot is like having a data scientist on your team! 📊 It analyzes patterns across attendance, performance, fees, and behavior to give you actionable insights. Check out /ai-copilot to see it in action!",
    ],
    tone: "enthusiastic",
  },
  biometric: {
    keywords: ["biometric", "fingerprint", "face id", "attendance scanner", "biometric attendance"],
    responses: [
      "Biometric Attendance is cutting-edge! 👆\n\n✅ Fingerprint scanning (99.8% accuracy)\n✅ Face ID recognition (touchless)\n✅ Eliminates proxy attendance\n✅ Real-time sync to dashboards\n✅ 0.4s average scan time\n\nWant to see the biometric simulator? Check /attendance/biometric!",
      "DRAIS supports advanced biometric attendance using fingerprint and facial recognition. No more manual registers or buddy punching! The system achieves 99.8% accuracy and syncs instantly. Visit /attendance/biometric to try the simulator! 🔐",
    ],
    tone: "explanatory",
  },
  documentation: {
    keywords: ["documentation", "docs", "guides", "tutorials", "how to", "learn more"],
    responses: [
      "DRAIS has comprehensive documentation! 📚\n\nWe have 28 detailed guides covering:\n• Getting Started (Quick Start, Requirements)\n• Core Features (Students, Attendance, Exams, Fees)\n• Advanced Features (AI Copilot, Biometric, Analytics)\n• Administration (Library, Timetables, Payments)\n\nVisit /docs to explore all guides with step-by-step workflows!",
      "Looking to learn more? Head to /docs for our full documentation hub! You'll find beginner-friendly quick starts, intermediate guides, and advanced tutorials — all with interactive examples. 🎓",
    ],
    tone: "helpful",
  },
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: `${getTimeBasedGreeting()}! 👋 I'm the DRAIS AI Assistant. Ask me anything about DRAIS features, AI Copilot, biometric attendance, or how to get started!`,
    },
  ]);
  const [input, setInput] = useState("");

  const findResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase().trim();
    
    // Check each knowledge category
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => lowerInput.includes(keyword))) {
        // Return random response from array for variety
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Fallback responses with variety
    const fallbacks = [
      "I'm still learning... 🤔 Could you rephrase that? I'm great at answering questions about DRAIS features, AI Copilot, biometric attendance, payments, documentation, or Xhenvolt!",
      "Hmm, I didn't quite catch that! 😅 Try asking about:\n• DRAIS features\n• AI Copilot predictions\n• Biometric attendance\n• Payment systems\n• Documentation guides\n• Pricing or support",
      "I'm not sure about that one yet! 🤷‍♂️ But I'm an expert on DRAIS! Ask me about student management, AI insights, attendance tracking, or any other feature.",
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: input };
    setMessages([...messages, userMessage]);

    const response = findResponse(input);
    
    setTimeout(() => {
      const botMessage = { id: Date.now() + 1, role: "bot", text: response };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 lg:bottom-6 lg:right-6 sm:bottom-24 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl hover:shadow-3xl transition-all hover:scale-110"
              size="icon"
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </Button>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-6 right-6 lg:bottom-6 lg:right-6 sm:bottom-24 z-50 w-full sm:w-96 h-[600px] max-h-[80vh] sm:h-[600px] shadow-2xl mx-4 sm:mx-0"
          >
            <Card className="h-full flex flex-col overflow-hidden border-2 border-blue-200 dark:border-blue-800">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">DRAIS Assistant</h3>
                      <p className="text-xs text-blue-100">Always here to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-white dark:bg-gray-800 shadow-md"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Quick Questions */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {["Hi!", "What can you do?", "AI Copilot?", "Biometric?"].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="text-xs h-7"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about DRAIS..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
