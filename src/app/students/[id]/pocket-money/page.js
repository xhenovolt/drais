'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Minus,
  TrendingDown,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PocketMoneyPage() {
  const router = useRouter();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(null); // 'topup', 'purchase', 'borrow'
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch student
      const studentRes = await fetch(`/api/modules/students?id=${id}`);
      if (studentRes.ok) {
        const data = await studentRes.json();
        setStudent(data.data || data[0]);
      }

      // Fetch transactions
      const transRes = await fetch(`/api/modules/students/pocket-money-ledger?student_id=${id}`);
      if (transRes.ok) {
        const data = await transRes.json();
        setTransactions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load pocket money data');
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (type) => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/modules/students/pocket-money-ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: id,
          transaction_type: type,
          amount: parseFloat(formData.amount),
          description: formData.description || type,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to record transaction');
      }

      toast.success(`${type} recorded successfully`);
      setFormData({ amount: '', description: '' });
      setOpenDialog(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading pocket money details..." fullScreen />
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={AlertCircle}
          title="Student Not Found"
          action={<Button onClick={() => router.back()}>Go Back</Button>}
        />
      </DashboardLayout>
    );
  }

  const balance = student.pocket_money_balance || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Pocket Money</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {student.first_name} {student.last_name}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available Balance</p>
                  <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    KES {balance.toFixed(2)}
                  </h2>
                </div>
                <Wallet className="w-16 h-16 text-blue-300 dark:text-blue-700 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Dialog open={openDialog === 'topup'} onOpenChange={(open) => setOpenDialog(open ? 'topup' : null)}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-green-600 hover:bg-green-700 h-12">
                <Plus className="w-5 h-5" />
                Top Up
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Top Up Pocket Money</DialogTitle>
                <DialogDescription>Add funds to the student's account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="topup-amount">Amount (KES)</Label>
                  <Input
                    id="topup-amount"
                    type="number"
                    placeholder="1000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="topup-desc">Description (Optional)</Label>
                  <Input
                    id="topup-desc"
                    placeholder="e.g., Parent deposit"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <Button
                  onClick={() => handleTransaction('topup')}
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Processing...' : 'Confirm Top Up'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openDialog === 'purchase'} onOpenChange={(open) => setOpenDialog(open ? 'purchase' : null)}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-orange-600 hover:bg-orange-700 h-12" variant="default">
                <Minus className="w-5 h-5" />
                Record Purchase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Purchase</DialogTitle>
                <DialogDescription>Log a purchase or transaction</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="purchase-amount">Amount (KES)</Label>
                  <Input
                    id="purchase-amount"
                    type="number"
                    placeholder="500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="purchase-desc">Item / Description</Label>
                  <Input
                    id="purchase-desc"
                    placeholder="e.g., Lunch, Books"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <Button
                  onClick={() => handleTransaction('purchase')}
                  disabled={submitting}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {submitting ? 'Processing...' : 'Record Purchase'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openDialog === 'borrow'} onOpenChange={(open) => setOpenDialog(open ? 'borrow' : null)}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-red-600 hover:bg-red-700 h-12" variant="default">
                <TrendingDown className="w-5 h-5" />
                Record Borrow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Borrowed Funds</DialogTitle>
                <DialogDescription>Log borrowed amount (must be repaid)</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="borrow-amount">Amount (KES)</Label>
                  <Input
                    id="borrow-amount"
                    type="number"
                    placeholder="500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="borrow-desc">Reason</Label>
                  <Input
                    id="borrow-desc"
                    placeholder="e.g., Emergency loan"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <Button
                  onClick={() => handleTransaction('borrow')}
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {submitting ? 'Processing...' : 'Record Borrow'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <EmptyState
                  icon={AlertCircle}
                  title="No Transactions"
                  description="No pocket money transactions yet"
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${
                              transaction.transaction_type === 'topup'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : transaction.transaction_type === 'purchase'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {transaction.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {transaction.transaction_type === 'topup' ? '+' : '-'}
                            KES {transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{transaction.description || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
