"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  School, User, BookOpen, DollarSign, CheckCircle2, ArrowRight, 
  ArrowLeft, Moon, Sun, Building, Mail, Phone, MapPin, Save,
  Users, GraduationCap, Calculator, FileText, Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "School Information",
    description: "Basic details about your school",
    icon: School,
    gradient: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "Administrator Account",
    description: "Create your admin profile",
    icon: User,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    title: "Classes Setup",
    description: "Configure your school classes",
    icon: Users,
    gradient: "from-pink-500 to-red-600"
  },
  {
    id: 4,
    title: "Subjects Setup",
    description: "Add subjects and curriculum",
    icon: BookOpen,
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: 5,
    title: "Fees Structure",
    description: "Set up payment structure",
    icon: DollarSign,
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    id: 6,
    title: "Confirm & Finish",
    description: "Review and complete setup",
    icon: CheckCircle2,
    gradient: "from-green-500 to-emerald-600"
  }
];

const schoolTypes = [
  "Primary School",
  "Secondary School", 
  "Combined School",
  "Vocational School",
  "International School"
];

const defaultClasses = {
  primary: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
  secondary: ["S1", "S2", "S3", "S4", "S5", "S6"]
};

const defaultSubjects = {
  primary: ["Mathematics", "English", "Science", "Social Studies", "Religious Education"],
  secondary: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Geography", "Literature"]
};

export default function Onboarding() {
  const { theme, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    schoolName: "",
    schoolType: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    
    // Step 2
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminRole: "Head Teacher",
    
    // Step 3
    selectedClasses: [],
    
    // Step 4
    selectedSubjects: [],
    
    // Step 5
    tuitionFees: {},
    otherFees: {}
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.schoolName && formData.schoolType && formData.address;
      case 2:
        return formData.adminName && formData.adminEmail;
      case 3:
        return formData.selectedClasses.length > 0;
      case 4:
        return formData.selectedSubjects.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    const stepVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    };

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible" 
            exit="exit"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => updateFormData("schoolName", e.target.value)}
                  placeholder="e.g., Kampala Primary School"
                />
              </div>
              <div>
                <Label htmlFor="schoolType">School Type *</Label>
                <Select 
                  value={formData.schoolType}
                  onValueChange={(value) => updateFormData("schoolType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">School Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                placeholder="Full address including district and region"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="256XXXXXXXXX"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="info@school.com"
                />
              </div>
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                  placeholder="www.school.com"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="adminName">Full Name *</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => updateFormData("adminName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="adminRole">Role</Label>
                <Select
                  value={formData.adminRole}
                  onValueChange={(value) => updateFormData("adminRole", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Head Teacher">Head Teacher</SelectItem>
                    <SelectItem value="Deputy Head Teacher">Deputy Head Teacher</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="adminEmail">Email Address *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => updateFormData("adminEmail", e.target.value)}
                  placeholder="admin@school.com"
                />
              </div>
              <div>
                <Label htmlFor="adminPhone">Phone Number</Label>
                <Input
                  id="adminPhone"
                  value={formData.adminPhone}
                  onChange={(e) => updateFormData("adminPhone", e.target.value)}
                  placeholder="256XXXXXXXXX"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <User className="w-4 h-4 inline mr-2" />
                This account will have full administrative access to your DRAIS system.
              </p>
            </div>
          </motion.div>
        );

      case 3:
        const availableClasses = formData.schoolType?.includes("Primary") 
          ? defaultClasses.primary 
          : formData.schoolType?.includes("Secondary")
          ? defaultClasses.secondary
          : [...defaultClasses.primary, ...defaultClasses.secondary];

        return (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableClasses.map(className => (
                <Card 
                  key={className}
                  className={`cursor-pointer transition-colors ${
                    formData.selectedClasses.includes(className) 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const newClasses = formData.selectedClasses.includes(className)
                      ? formData.selectedClasses.filter(c => c !== className)
                      : [...formData.selectedClasses, className];
                    updateFormData("selectedClasses", newClasses);
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold">{className}</div>
                    {formData.selectedClasses.includes(className) && (
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <GraduationCap className="w-4 h-4 inline mr-2" />
                Selected: {formData.selectedClasses.length} class(es)
              </p>
            </div>
          </motion.div>
        );

      case 4:
        const availableSubjects = formData.schoolType?.includes("Primary")
          ? defaultSubjects.primary
          : formData.schoolType?.includes("Secondary")
          ? defaultSubjects.secondary
          : [...defaultSubjects.primary, ...defaultSubjects.secondary];

        return (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSubjects.map(subject => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={formData.selectedSubjects.includes(subject)}
                    onCheckedChange={(checked) => {
                      const newSubjects = checked
                        ? [...formData.selectedSubjects, subject]
                        : formData.selectedSubjects.filter(s => s !== subject);
                      updateFormData("selectedSubjects", newSubjects);
                    }}
                  />
                  <Label htmlFor={subject} className="cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Selected: {formData.selectedSubjects.length} subject(s)
              </p>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tuition Fees</CardTitle>
                  <CardDescription>Set fees per class per term</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.selectedClasses.map(className => (
                    <div key={className} className="flex items-center gap-4">
                      <Label className="w-12">{className}:</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">UGX</span>
                        <Input
                          placeholder="0"
                          className="flex-1"
                          onChange={(e) => {
                            updateFormData("tuitionFees", {
                              ...formData.tuitionFees,
                              [className]: e.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Fees</CardTitle>
                  <CardDescription>Additional fees and charges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Registration", "Library", "Sports", "Lunch", "Transport"].map(fee => (
                    <div key={fee} className="flex items-center gap-4">
                      <Label className="w-24">{fee}:</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">UGX</span>
                        <Input
                          placeholder="0"
                          className="flex-1"
                          onChange={(e) => {
                            updateFormData("otherFees", {
                              ...formData.otherFees,
                              [fee]: e.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <Calculator className="w-4 h-4 inline mr-2" />
                You can modify these fees anytime in the system after setup.
              </p>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Almost Ready!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Review your setup and complete the onboarding process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>School Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Name:</strong> {formData.schoolName}</p>
                  <p><strong>Type:</strong> {formData.schoolType}</p>
                  <p><strong>Classes:</strong> {formData.selectedClasses.join(", ")}</p>
                  <p><strong>Subjects:</strong> {formData.selectedSubjects.length} subjects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Administrator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Name:</strong> {formData.adminName}</p>
                  <p><strong>Role:</strong> {formData.adminRole}</p>
                  <p><strong>Email:</strong> {formData.adminEmail}</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Setup Complete</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your DRAIS system is configured and ready to use. You can start managing 
                    students, staff, and school operations immediately.
                  </p>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    Launch DRAIS Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:bg-gradient-to-bl dark:from-blue-950 dark:via-gray-950 dark:to-black">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              School Setup
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to DRAIS
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Let's set up your school management system in just a few steps
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 mb-6" />
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const StepIcon = step.icon;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isActive 
                          ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg` 
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </motion.div>
                    <div className="text-center">
                      <div className="text-xs font-medium hidden sm:block">{step.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const StepIcon = steps[currentStep - 1].icon;
                  return <StepIcon className="w-5 h-5" />;
                })()}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save & Continue Later
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center gap-2">
                    Complete Setup
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}