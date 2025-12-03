"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  Upload, FileSpreadsheet, Download, Users, CheckCircle2, AlertCircle,
  ArrowRight, ArrowLeft, Moon, Sun, FileText, Trash2, Eye,
  RotateCcw, Settings, MapPin, RefreshCw, X
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

const sampleData = [
  { name: "John Doe", gender: "Male", class: "P5", parent_phone: "256701234567" },
  { name: "Jane Smith", gender: "Female", class: "P4", parent_phone: "256709876543" },
  { name: "David Wilson", gender: "Male", class: "P6", parent_phone: "256705555555" },
];

const columnMappings = {
  name: ["Name", "Student Name", "Full Name", "Student_Name"],
  gender: ["Gender", "Sex", "Student_Gender"],
  class: ["Class", "Grade", "Level", "Student_Class"],
  parent_phone: ["Parent Phone", "Contact", "Phone", "Parent_Contact", "Guardian_Phone"]
};

const importSteps = [
  { id: 1, title: "Upload File", description: "Select your Excel file" },
  { id: 2, title: "Map Columns", description: "Match columns to fields" },
  { id: 3, title: "Review Data", description: "Check for errors" },
  { id: 4, title: "Import", description: "Complete the import" }
];

export default function StudentImport() {
  const { theme, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [columnMap, setColumnMap] = useState({});
  const [importProgress, setImportProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    // Simulate file processing
    setTimeout(() => {
      setPreviewData({
        columns: ["Name", "Gender", "Class", "Parent Contact"],
        data: sampleData
      });
      setCurrentStep(2);
    }, 1000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const downloadSample = () => {
    // UI only - simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'student_import_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateData = () => {
    // Simulate validation
    const sampleErrors = [
      { row: 2, field: "Parent Phone", message: "Invalid phone number format" },
      { row: 5, field: "Class", message: "Class 'P8' not found in system" }
    ];
    setErrors(sampleErrors);
    setCurrentStep(3);
  };

  const startImport = () => {
    setCurrentStep(4);
    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const resetImport = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setPreviewData(null);
    setColumnMap({});
    setImportProgress(0);
    setErrors([]);
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
              <Link href="/students">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Students
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Upload className="w-4 h-4 mr-2" />
              Student Import
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Import Students from Excel
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload your student data from Excel or CSV files with automated column mapping and validation
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              {importSteps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <span className="font-semibold">{step.id}</span>
                        )}
                      </motion.div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{step.description}</div>
                      </div>
                    </div>
                    {index < importSteps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {/* Sample Download */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Download Template
                    </CardTitle>
                    <CardDescription>
                      Get the correct Excel format for importing students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">Student Import Template</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Excel file with correct column headers
                          </p>
                        </div>
                      </div>
                      <Button onClick={downloadSample}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Student Data
                    </CardTitle>
                    <CardDescription>
                      Drag and drop your Excel file or click to browse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={() => setIsDragging(true)}
                      onDragLeave={() => setIsDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      <motion.div
                        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                        className="cursor-pointer"
                      >
                        <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {isDragging ? 'Drop your file here' : 'Choose Excel file to upload'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Supports .xlsx, .xls, and .csv files up to 10MB
                        </p>
                        <Button className="mt-4" onClick={() => fileInputRef.current?.click()}>
                          Browse Files
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && previewData && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Column Mapping
                    </CardTitle>
                    <CardDescription>
                      Map your Excel columns to DRAIS fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(columnMappings).map(([field, suggestions]) => (
                        <div key={field}>
                          <label className="block text-sm font-medium mb-2 capitalize">
                            {field.replace('_', ' ')} *
                          </label>
                          <Select
                            value={columnMap[field] || ''}
                            onValueChange={(value) => setColumnMap({...columnMap, [field]: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field} column`} />
                            </SelectTrigger>
                            <SelectContent>
                              {previewData.columns.map(col => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Data Preview
                    </CardTitle>
                    <CardDescription>
                      Preview of your data with current mapping
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {previewData.columns.map(col => (
                            <TableHead key={col}>{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleData.slice(0, 3).map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.gender}</TableCell>
                            <TableCell>{row.class}</TableCell>
                            <TableCell>{row.parent_phone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Showing 3 of {sampleData.length} rows
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={validateData}
                    disabled={Object.keys(columnMap).length < 4}
                  >
                    Validate Data
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Validation Results
                    </CardTitle>
                    <CardDescription>
                      Review any errors before importing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {errors.length > 0 ? (
                      <div className="space-y-4">
                        <Alert>
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription>
                            Found {errors.length} error(s). Please review and fix before importing.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          {errors.map((error, index) => (
                            <div key={index} className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                              <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>Row {error.row}:</strong> {error.field} - {error.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Data Validated Successfully</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          All data looks good. Ready to import {sampleData.length} students.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Mapping
                  </Button>
                  <Button 
                    onClick={startImport}
                    disabled={errors.length > 0}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Import Students
                    <Users className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Import Progress
                    </CardTitle>
                    <CardDescription>
                      Importing your student data...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {importProgress}%
                          </span>
                        </div>
                        <Progress value={importProgress} className="h-3" />
                      </div>

                      {importProgress === 100 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-semibold mb-2">Import Completed!</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Successfully imported {sampleData.length} students into your system.
                          </p>
                          <div className="flex gap-4 justify-center">
                            <Link href="/students">
                              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                View Students
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                            <Button variant="outline" onClick={resetImport}>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Import More
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 lg:px-8 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2025 {DRAIS_INFO.name} v{DRAIS_VERSION}</span>
            <span>•</span>
            <span>by {XHENVOLT_DATA.company.name}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}