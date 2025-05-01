import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Loader2, CheckCircle, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Payment {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  created_at: string;
  transaction_id?: string;
}

const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // This would be the real API call
        // const response = await fetch(`/api/admin/payments?page=${page}&status=${activeTab !== 'all' ? activeTab : ''}&search=${searchTerm}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
        //   }
        // });
        // const data = await response.json();
        // setPayments(data.payments);
        // setTotalPages(Math.ceil(data.total / data.per_page));
        
        // Using mock data for now
        setTimeout(() => {
          setPayments([]);
          setTotalPages(1);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [page, activeTab, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment || !verificationCode) return;

    try {
      // This would be the real API call
      // const response = await fetch(`/api/admin/payments/${selectedPayment.id}/verify`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
      //   },
      //   body: JSON.stringify({ verification_code: verificationCode })
      // });
      // const data = await response.json();
      
      // Simulating the API call
      const updatedPayments = payments.map(payment =>
        payment.id === selectedPayment.id
          ? { ...payment, status: 'completed' as const }
          : payment
      );
      setPayments(updatedPayments);
      setSelectedPayment(null);
      setVerificationCode('');
      setIsVerifyDialogOpen(false);
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">Completed</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-yellow-600">Pending</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600">Failed</span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription className="mt-1">
                  View and manage all payment transactions
                </CardDescription>
              </div>
              <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <Button type="submit" variant="default" className="ml-2">
                  Search
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : payments.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id.substring(0, 8)}...</TableCell>
                          <TableCell>{payment.user_email}</TableCell>
                          <TableCell>
                            {payment.amount} {payment.currency}
                          </TableCell>
                          <TableCell>{payment.payment_method}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {payment.status === 'pending' && payment.payment_method === 'USSD' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setIsVerifyDialogOpen(true);
                                }}
                              >
                                Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                      Page {page} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No payments found</p>
                {searchTerm && (
                  <Button
                    variant="link"
                    onClick={() => setSearchTerm('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* USSD Verification Dialog */}
        <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify USSD Payment</DialogTitle>
              <DialogDescription>
                Enter the verification code from the payment transaction.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyPayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code"
                  required
                />
              </div>
              {selectedPayment && (
                <div className="text-sm space-y-2 bg-gray-50 p-3 rounded-md">
                  <p>
                    <span className="font-medium">Payment ID:</span> {selectedPayment.id}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span> {selectedPayment.amount} {selectedPayment.currency}
                  </p>
                  <p>
                    <span className="font-medium">User:</span> {selectedPayment.user_email}
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!verificationCode.trim()}>
                  Verify Payment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentsPage;
