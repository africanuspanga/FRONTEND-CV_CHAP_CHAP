import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/contexts/admin-auth-context';

const AdminSettingsPage: React.FC = () => {
  const { admin } = useAdminAuth();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingSystemSettings, setIsSavingSystemSettings] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'CV Chap Chap',
    siteDescription: 'Professional CV Building Platform',
    contactEmail: 'support@cvchapchap.com',
    maxCVsPerUser: '5',
    defaultCurrency: 'TSh',
  });
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setIsUpdatingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password updated successfully');
    }, 1500);
  };
  
  const handleSystemSettingsChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSystemSettings(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSavingSystemSettings(false);
      alert('System settings updated successfully');
    }, 1500);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system settings</p>
        </div>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Account</CardTitle>
                <CardDescription>View and manage your admin account details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input disabled value={admin?.email || ''} />
                </div>
                <div className="space-y-1">
                  <Label>Admin ID</Label>
                  <Input disabled value={admin?.id || ''} />
                </div>
                <div className="space-y-1">
                  <Label>Created On</Label>
                  <Input disabled value={admin?.created_at ? new Date(admin.created_at).toLocaleString() : ''} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your admin account password.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system settings for CV Chap Chap.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSystemSettingsChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input
                      id="site-name"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="site-description">Site Description</Label>
                    <Input
                      id="site-description"
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={systemSettings.contactEmail}
                      onChange={(e) => setSystemSettings({ ...systemSettings, contactEmail: e.target.value })}
                      required
                    />
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <Label htmlFor="max-cvs">Maximum CVs Per User</Label>
                    <Input
                      id="max-cvs"
                      type="number"
                      value={systemSettings.maxCVsPerUser}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maxCVsPerUser: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Input
                      id="default-currency"
                      value={systemSettings.defaultCurrency}
                      onChange={(e) => setSystemSettings({ ...systemSettings, defaultCurrency: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSavingSystemSettings}>
                    {isSavingSystemSettings ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
