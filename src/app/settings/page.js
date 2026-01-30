"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Settings,
  School,
  Bell,
  Shield,
  Palette,
  Database,
  Users,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* School Identity Card */}
        {user?.isOnboardingComplete && user?.school_name ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* School Badge */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user.school_name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
              </div>

              {/* School Info */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Current School
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {user.school_name}
                </h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="gap-1">
                    <School className="w-3 h-3" />
                    Configured
                  </Badge>
                  <Badge variant="secondary" className="gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                    Active
                  </Badge>
                </div>
              </div>

              {/* Address Info */}
              {user.school_address ? (
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                    {user.school_address}
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure your school's settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="school" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-fit">
              <TabsTrigger value="school">School Info</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="school" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Configure your school's basic information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="schoolName">School Name</Label>
                      <Input
                        id="schoolName"
                        placeholder="Enter school name"
                        defaultValue="Greenfield High School"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter school address"
                        defaultValue="123 Education Street, Learning City, LC 12345"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          defaultValue="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="info@school.edu"
                          defaultValue="info@greenfield.edu"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Academic Configuration</CardTitle>
                    <CardDescription>
                      Set up academic year and grading system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Input
                        id="academicYear"
                        placeholder="2024-2025"
                        defaultValue="2024-2025"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradingSystem">Grading System</Label>
                      <Input
                        id="gradingSystem"
                        placeholder="A-F, Percentage, etc."
                        defaultValue="A-F Letter Grades"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingDays">Working Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                          <Badge key={day} variant="default">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Student Absence Alerts</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get notified when students are absent
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Fee Payment Reminders</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Send automatic fee payment reminders
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Exam Schedule Updates</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notify about exam schedule changes
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage security and access control settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Session Timeout</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically log out inactive users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        placeholder="30"
                        defaultValue="30"
                        className="w-32"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Login Audit Trail</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Keep logs of all login attempts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Password Policy</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Minimum password length: 8 characters</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Require special characters</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Password expiry (90 days)</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="theme" id="light" defaultChecked />
                          <Label htmlFor="light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="theme" id="dark" />
                          <Label htmlFor="dark">Dark</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="theme" id="auto" />
                          <Label htmlFor="auto">Auto</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        {[
                          "bg-blue-600",
                          "bg-purple-600", 
                          "bg-green-600",
                          "bg-orange-600",
                          "bg-red-600",
                          "bg-pink-600"
                        ].map((color, index) => (
                          <button
                            key={index}
                            className={`w-8 h-8 rounded-full ${color} border-2 border-white shadow-lg hover:scale-110 transition-transform`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Use smaller spacing and components
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Animations</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enable smooth animations and transitions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Third-Party Integrations</CardTitle>
                  <CardDescription>
                    Connect with external services and platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Email Service</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Gmail SMTP integration for sending emails
                      </p>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-green-600" />
                          <span className="font-medium">SMS Gateway</span>
                        </div>
                        <Badge variant="outline">
                          Not Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        SMS service for sending notifications
                      </p>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    System Information
                  </CardTitle>
                  <CardDescription>
                    View system status and version information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Application Version</Label>
                        <p className="text-lg font-bold">DRAIS v0.0.0010</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Database Status</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Connected</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Backup</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          December 2, 2025 at 3:00 AM
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Storage Usage</Label>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Used: 2.4 GB</span>
                            <span>Total: 10 GB</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "24%" }}></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Active Users</Label>
                        <p className="text-lg font-bold">847</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Maintenance Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm">
                        Backup Now
                      </Button>
                      <Button variant="outline" size="sm">
                        Clear Cache
                      </Button>
                      <Button variant="outline" size="sm">
                        System Check
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Factory Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}