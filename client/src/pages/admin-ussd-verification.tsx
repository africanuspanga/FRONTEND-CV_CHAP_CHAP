import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, CheckCircle, AlertCircle, Clock, Search } from 'lucide-react';

interface USSDPayment {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  phone_number?: string;
  transaction_id?: string;
}

const AdminUSSDVerificationPage: React.FC = () => {
  const [pendingPayments, setPendingPayments] = useState<USSDPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<USSDPayment | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPendingUSSDPayments = async () => {
      try {
        setLoading(true);
        // This would be the real API call
        // const response = await fetch(`/api/admin/payments/ussd/pending?search=${searchQuery}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
        //   }
        // });
        // const data = await response.json();
        // setPendingPayments(data.payments);
        
        // Using mock data for now
        setTimeout(() => {
          setPendingPayments([]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching pending USSD payments:', error);
        setLoading(false);
      }
    };

    fetchPendingUSSDPayments();
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered by the useEffect when searchQuery changes
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
      const updatedPayments = pendingPayments.filter(
        payment => payment.id !== selectedPayment.id
      );
      setPendingPayments(updatedPayments);
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
          <h1 className="text-2xl font-bold tracking-tight">USSD Payment Verification</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Pending USSD Payments</CardTitle>
                <CardDescription className="mt-1">
                  Manually verify pending USSD payments by entering the transaction code
                </CardDescription>
              </div>
              <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by phone or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingPayments.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id.substring(0, 8)}...</TableCell>
                        <TableCell>{payment.user_email}</TableCell>
                        <TableCell>{payment.phone_number || 'N/A'}</TableCell>
                        <TableCell>
                          {payment.amount} {payment.currency}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No pending USSD payments found</p>
                {searchQuery && (
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>USSD Verification Instructions</CardTitle>
            <CardDescription>
              How to manually verify USSD payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Step 1: Receive Transaction ID</h3>
                <p className="text-sm text-muted-foreground">
                  Ask the user to provide the transaction ID they received from their mobile money provider.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Step 2: Verify the Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Verify" button next to the pending payment and enter the transaction ID.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Step 3: Confirm Completion</h3>
                <p className="text-sm text-muted-foreground">
                  Once verified, the payment status will be updated to "Completed" and the user will gain access to
                  premium features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Dialog */}
        <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify USSD Payment</DialogTitle>
              <DialogDescription>
                Enter the transaction ID from the user's mobile money payment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyPayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Transaction ID</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter transaction ID"
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
                  {selectedPayment.phone_number && (
                    <p>
                      <span className="font-medium">Phone:</span> {selectedPayment.phone_number}
                    </p>
                  )}
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

export default AdminUSSDVerificationPage;
