"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Send, Mic, Moon, Sun, ArrowRight, Brain, BookOpen, 
  GraduationCap, ClipboardList, BarChart3, Users, MessageSquare,
  Lightbulb, Target, FileText, Calculator, Sparkles, Zap
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const quickActions = [
  {
    icon: FileText,
    title: "Generate Lesson Plan",
    description: "Create structured lesson plans for any subject",
    color: "from-blue-500 to-blue-600",
    prompt: "Help me create a lesson plan for Primary 5 Mathematics on fractions"
  },
  {
    icon: Users,
    title: "Suggest Class Activities", 
    description: "Get engaging activity ideas for your students",
    color: "from-green-500 to-green-600",
    prompt: "Suggest interactive activities for teaching English vocabulary to Primary 4 students"
  },
  {
    icon: BarChart3,
    title: "Analyze Performance",
    description: "Understand student performance patterns",
    color: "from-purple-500 to-purple-600",
    prompt: "Help me analyze why some students are struggling with science subjects"
  },
  {
    icon: ClipboardList,
    title: "Create Assessment",
    description: "Design tests and evaluation methods",
    color: "from-orange-500 to-orange-600",
    prompt: "Help me create a fair assessment for Senior 2 Biology on plant systems"
  }
];

const sampleConversation = [
  {
    role: "user",
    message: "How do I handle a student who is consistently late to class?",
    timestamp: "2 minutes ago"
  },
  {
    role: "assistant", 
    message: "Dealing with chronically late students requires a balanced approach combining understanding and structure. Here are evidence-based strategies:\n\n**1. Investigate Root Causes**\n- Have a private conversation with the student\n- Check if there are transportation, family, or health issues\n- Review their schedule for potential conflicts\n\n**2. Implement Positive Reinforcement**\n- Acknowledge when they arrive on time\n- Set small, achievable goals (e.g., 'arrive within 5 minutes of start time')\n- Consider incentives like preferred seating or small privileges\n\n**3. Establish Clear Expectations**\n- Create a classroom routine that starts immediately\n- Make the first few minutes valuable and engaging\n- Use consistent, calm consequences for tardiness\n\n**4. Collaborate with Parents**\n- Share the pattern with parents/guardians\n- Work together on morning routines\n- Ensure they understand the impact on learning\n\nWould you like me to help you draft a communication plan for parents or create a behavior modification chart?",
    timestamp: "1 minute ago"
  }
];

export default function AITeacher() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState(sampleConversation);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      role: "user",
      message: inputMessage,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        message: generateAIResponse(inputMessage),
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage) => {
    // Simple response generator for demo
    const responses = {
      "lesson plan": "I'd be happy to help you create a comprehensive lesson plan! Let me break this down into key components:\n\n**Learning Objectives:**\n- Students will understand the concept\n- Students will be able to apply the knowledge\n- Students will demonstrate mastery through practice\n\n**Materials Needed:**\n- Textbooks, worksheets, visual aids\n- Interactive tools or manipulatives\n\n**Lesson Structure:**\n1. **Introduction (5 mins)** - Hook and prior knowledge\n2. **Direct Instruction (15 mins)** - Core concept explanation\n3. **Guided Practice (10 mins)** - Work through examples together\n4. **Independent Practice (10 mins)** - Students work individually\n5. **Closure (5 mins)** - Summarize and preview next lesson\n\n**Assessment:**\n- Formative: Observation and questioning\n- Summative: Exit ticket or quick quiz\n\nWhat specific subject and topic would you like me to develop this for?",
      
      "discipline": "Effective classroom discipline focuses on building positive relationships while maintaining clear boundaries. Here's my recommended approach:\n\n**Preventive Strategies:**\n- Establish clear, consistent rules from day one\n- Create engaging lessons that minimize off-task behavior\n- Build positive relationships with all students\n\n**Response Strategies:**\n- Use proximity and non-verbal cues first\n- Implement logical consequences, not punishments\n- Address behavior privately when possible\n\n**Restorative Practices:**\n- Help students understand the impact of their actions\n- Provide opportunities to make amends\n- Focus on learning from mistakes\n\nWhat specific behavioral challenge are you facing? I can provide more targeted strategies.",
      
      "performance": "Analyzing student performance requires looking at multiple data points and factors. Here's a systematic approach:\n\n**Data Collection:**\n- Academic assessments (tests, assignments, projects)\n- Behavioral observations\n- Attendance and participation patterns\n- Student self-assessments\n\n**Analysis Framework:**\n- Identify patterns across different subjects\n- Look for correlations with external factors\n- Consider different learning styles and needs\n- Examine progress over time, not just current status\n\n**Intervention Strategies:**\n- Differentiated instruction based on findings\n- Additional support for struggling areas\n- Enrichment for advanced learners\n- Regular progress monitoring\n\nWhat specific performance concerns are you noticing? I can help you develop targeted intervention strategies.",
      
      "default": "That's a great question! As your AI teaching assistant, I'm here to help with various aspects of education:\n\n• **Curriculum Planning** - Lesson plans, unit designs, pacing guides\n• **Student Assessment** - Creating fair and effective evaluations\n• **Classroom Management** - Behavior strategies and environment design\n• **Differentiated Learning** - Adapting instruction for diverse needs\n• **Professional Development** - Teaching strategies and best practices\n\nI adapt my communication style based on your needs - whether you need practical solutions, theoretical background, or step-by-step guidance.\n\nCould you provide more details about what you'd like help with? The more specific you are, the more targeted and useful my assistance can be!"
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("lesson plan") || lowerMessage.includes("planning")) {
      return responses["lesson plan"];
    } else if (lowerMessage.includes("discipline") || lowerMessage.includes("behavior") || lowerMessage.includes("management")) {
      return responses["discipline"];
    } else if (lowerMessage.includes("performance") || lowerMessage.includes("assess") || lowerMessage.includes("grade")) {
      return responses["performance"];
    } else {
      return responses["default"];
    }
  };

  const handleQuickAction = (action) => {
    setInputMessage(action.prompt);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

      {/* Main Content */}
      <div className="pt-32 pb-6 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              AI Teaching Assistant
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Smart Teaching Companion
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get professional guidance on lesson planning, classroom management, student assessment, and teaching strategies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
            {/* Quick Actions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Click to get started with common teaching tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors p-3"
                        onClick={() => handleQuickAction(action)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{action.title}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    AI Teaching Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about teaching, classroom management, or student support
                  </CardDescription>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className={
                                message.role === 'user' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              }>
                                {message.role === 'user' ? 'T' : 'AI'}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`p-4 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.message}
                              </p>
                              <p className={`text-xs mt-2 ${
                                message.role === 'user' 
                                  ? 'text-blue-100' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex gap-3 max-w-[85%]">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={textareaRef}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me about lesson planning, classroom management, student assessment..."
                          className="min-h-[50px] pr-12 resize-none"
                          rows={2}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute bottom-2 right-2 h-8 w-8 p-0"
                        >
                          <Mic className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-auto px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Sparkles className="w-3 h-3" />
                      <span>Press Enter to send, Shift+Enter for new line</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Powered by {XHENVOLT_DATA.company.name} AI • {DRAIS_INFO.name} v{DRAIS_VERSION}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}