"use client";

import { motion } from "framer-motion";
import { DraisLogo } from "@/components/drais-logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DRAIS_VERSION, DRAIS_INFO, XHENVOLT_DATA } from "@/lib/version";
import {
  CreditCard, Smartphone, Calendar, Clock, ArrowRight, Download, 
  Plus, Filter, Search, Moon, Sun, CheckCircle2, AlertCircle, 
  Banknote, Shield, History, Receipt, Phone, Globe, User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock payment data
const currentPlan = {
  name: "Premium",
  price: "UGX 200,000",
  period: "per term",
  nextPayment: "2025-01-15",
  gracePeriod: "1 month",
  status: "active"
};

const invoices = [
  {
    id: "INV-2024-001",
    date: "2024-12-01",
    amount: "UGX 200,000",
    status: "paid",
    method: "MTN Mobile Money",
    description: "Premium Plan - Term 3 2024"
  },
  {
    id: "INV-2024-002", 
    date: "2024-09-01",
    amount: "UGX 200,000",
    status: "paid",
    method: "Airtel Money",
    description: "Premium Plan - Term 2 2024"
  },
  {
    id: "INV-2024-003",
    date: "2024-06-01", 
    amount: "UGX 200,000",
    status: "paid",
    method: "MTN Mobile Money",
    description: "Premium Plan - Term 1 2024"
  },
];

const paymentMethods = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    icon: Phone,
    color: "from-yellow-500 to-orange-500",
    description: "Pay using your MTN Mobile Money account",
    instructions: "Dial *165# or use MoMo app to complete payment"
  },
  {
    id: "airtel",
    name: "Airtel Money", 
    icon: Globe,
    color: "from-red-500 to-pink-500",
    description: "Pay using your Airtel Money account",
    instructions: "Dial *185# or use Airtel Money app to complete payment"
  }
];

export default function Payments() {
  const { theme, toggleTheme } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(currentPlan.price);

  const handlePayment = (method) => {
    setSelectedMethod(method);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // UI only - just close modal
    setShowPaymentModal(false);
    setPhoneNumber("");
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
      <section className="pt-32 pb-12 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Manage Your Payments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Secure payments with MTN Mobile Money and Airtel Money
            </p>
          </motion.div>

          {/* Current Plan Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{currentPlan.name}</div>
                  <div className="text-lg opacity-90">{currentPlan.price} {currentPlan.period}</div>
                  <Badge className="mt-2 bg-white/20 text-white">Active</Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Next Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">Jan 15, 2025</div>
                  <div className="text-lg opacity-90">{currentPlan.price}</div>
                  <Badge className="mt-2 bg-white/20 text-white">Due in 42 days</Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Grace Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{currentPlan.gracePeriod}</div>
                  <div className="text-lg opacity-90">Protection period</div>
                  <Badge className="mt-2 bg-white/20 text-white">Available</Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method, index) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors"
                        onClick={() => handlePayment(method)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                              <method.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{method.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {method.description}
                              </p>
                            </div>
                          </div>
                          <Button className="w-full">
                            Pay Now <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-auto py-6"
              onClick={() => setShowUpgradeModal(true)}
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="w-8 h-8" />
                <span>Upgrade Plan</span>
              </div>
            </Button>

            <Button variant="outline" size="lg" className="h-auto py-6">
              <div className="flex flex-col items-center gap-2">
                <Receipt className="w-8 h-8" />
                <span>Download Invoice</span>
              </div>
            </Button>

            <Button variant="outline" size="lg" className="h-auto py-6">
              <div className="flex flex-col items-center gap-2">
                <History className="w-8 h-8" />
                <span>View History</span>
              </div>
            </Button>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent payments and invoices</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono">{invoice.id}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {invoice.method}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMethod && (
                <>
                  <selectedMethod.icon className="w-5 h-5" />
                  {selectedMethod.name} Payment
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedMethod?.instructions}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="256XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                readOnly
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                You will receive a payment prompt on your phone. Complete the transaction to continue.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={processPayment} className="flex-1">
                Send Payment Request
              </Button>
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Plan Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Choose a higher plan to unlock more features
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(XHENVOLT_DATA.pricing).map((plan, index) => (
              <Card key={plan.name} className={plan.name === 'Premium' ? 'opacity-50' : 'cursor-pointer hover:shadow-lg transition-shadow'}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.target}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    UGX {plan.termSubscription.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    per term
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={plan.name === 'Premium'}
                    variant={plan.name === 'Premium' ? 'outline' : 'default'}
                  >
                    {plan.name === 'Premium' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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