"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DRAIS_VERSION, DRAIS_INFO } from "@/lib/version";
import {
  Calendar, Clock, User, ArrowRight, Search, BookOpen, 
  TrendingUp, Users, Lightbulb, Zap, Target, Globe,
  Moon, Sun, ChevronRight, Eye, MessageCircle, Share2,
  Filter, Star, Award, BarChart, Shield, Heart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "All Posts", count: 47 },
  { name: "Product Updates", count: 12 },
  { name: "Best Practices", count: 15 },
  { name: "Case Studies", count: 8 },
  { name: "Industry Insights", count: 7 },
  { name: "Technology", count: 5 },
];

const featuredPost = {
  title: "The Future of School Management: AI-Powered Insights That Transform Education",
  excerpt: "Discover how artificial intelligence is revolutionizing educational administration, from predictive analytics that improve student outcomes to automated workflows that free up educators to focus on what matters most - teaching.",
  author: "Dr. Sarah Mitchell",
  date: "2024-12-15",
  readTime: "8 min read",
  category: "Industry Insights",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  views: 2847,
  comments: 23,
  featured: true,
};

const blogPosts = [
  {
    title: "5 Ways DRAIS Helped Springfield Elementary Increase Student Engagement by 40%",
    excerpt: "A comprehensive case study showing how one school district transformed their educational outcomes using data-driven insights and streamlined administrative processes.",
    author: "Marcus Chen",
    date: "2024-12-10",
    readTime: "6 min read",
    category: "Case Studies",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    views: 1923,
    comments: 15,
  },
  {
    title: "The Complete Guide to Digital Transformation in K-12 Education",
    excerpt: "Everything you need to know about modernizing your school's technology infrastructure, from planning and implementation to measuring success.",
    author: "Emma Rodriguez",
    date: "2024-12-05", 
    readTime: "12 min read",
    category: "Best Practices",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80",
    views: 3156,
    comments: 28,
  },
  {
    title: "New Features: Advanced Analytics Dashboard & Parent Communication Hub",
    excerpt: "We're excited to announce two major feature releases that will help schools gain deeper insights into student performance and strengthen parent-school relationships.",
    author: "DRAIS Team",
    date: "2024-11-28",
    readTime: "4 min read", 
    category: "Product Updates",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    views: 2743,
    comments: 31,
  },
  {
    title: "Building Inclusive Learning Environments: Technology's Role in Accessibility",
    excerpt: "Exploring how modern school management systems can support diverse learning needs and create more inclusive educational experiences for all students.",
    author: "Dr. Aisha Patel",
    date: "2024-11-20",
    readTime: "7 min read",
    category: "Best Practices", 
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80",
    views: 1567,
    comments: 19,
  },
  {
    title: "Data Privacy in Education: A School Administrator's Guide to Compliance",
    excerpt: "Navigate the complex landscape of educational data protection, FERPA compliance, and best practices for keeping student information secure.",
    author: "James Thompson",
    date: "2024-11-15",
    readTime: "9 min read",
    category: "Industry Insights",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    views: 2234,
    comments: 17,
  },
  {
    title: "Streamlining Student Enrollment: From Paper Forms to Digital Excellence",
    excerpt: "Learn how schools are reducing enrollment time by 75% and improving data accuracy with modern digital enrollment systems.",
    author: "Lisa Wong",
    date: "2024-11-08",
    readTime: "5 min read",
    category: "Best Practices",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    views: 1834,
    comments: 22,
  },
];

const popularTags = [
  "School Management", "EdTech", "Digital Transformation", "Student Analytics",
  "Parent Engagement", "Data Security", "Best Practices", "Case Studies",
  "Product Updates", "AI in Education", "Workflow Automation", "Compliance",
];

export default function Blog() {
  const { theme, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = selectedCategory === "All Posts" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

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
              <BookOpen className="w-4 h-4 mr-2" />
              The DRAIS Blog
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Insights for Modern Educators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover best practices, product updates, case studies, and industry insights 
              that help schools transform their operations and improve student outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Featured Article
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 hover:shadow-2xl transition-shadow duration-300">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {featuredPost.category}
                    </Badge>
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {featuredPost.views.toLocaleString()} views
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {featuredPost.comments} comments
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Read Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="space-y-8 sticky top-24">
                {/* Categories */}
                <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full text-left flex items-center justify-between p-2 rounded-lg transition-colors ${
                            selectedCategory === category.name
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>{category.name}</span>
                          <Badge variant={selectedCategory === category.name ? "outline" : "secondary"}>
                            {category.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Popular Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Stay Updated
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Get the latest insights delivered to your inbox
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Enter your email"
                      className="mb-4 bg-white/20 border-white/30 text-white placeholder:text-blue-100"
                    />
                    <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Blog Posts Grid */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold mb-4">
                  {selectedCategory} 
                  <span className="text-gray-500 text-lg ml-2">
                    ({filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''})
                  </span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/50 hover:shadow-xl transition-shadow duration-300 group">
                      <div className="overflow-hidden rounded-t-lg">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{post.category}</Badge>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            {post.views.toLocaleString()}
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.comments}
                            </div>
                            <Share2 className="w-3 h-3 cursor-pointer hover:text-blue-600" />
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            Read More <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Load More Articles
                </Button>
              </motion.div>
            </div>
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
              Join thousands of educators who use DRAIS to streamline operations 
              and focus on what matters most - student success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Try DRAIS Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                  Contact Sales
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