import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Test component for verifying authentication
const AuthTest = () => {
  const { toast } = useToast();
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  // Test user registration form state
  const [regFormData, setRegFormData] = useState({
    username: 'testuser' + Math.floor(Math.random() * 1000),
    email: 'test' + Math.floor(Math.random() * 1000) + '@example.com',
    phone: '+255' + Math.floor(Math.random() * 1000000000),
    password: 'password123'
  });

  // Test user login form state
  const [loginFormData, setLoginFormData] = useState({
    identifier: '',
    password: 'password123'
  });

  // Handle test user registration form input changes
  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle test user login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fetch all registered users (admin only)
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/users/test');
      const data = await response.json();
      setRegisteredUsers(data);
      
      if (data.length > 0) {
        setTestResults(prev => [...prev, '✅ Database connection successful']);
        setTestResults(prev => [...prev, `✅ Found ${data.length} registered users in the database`]);
      } else {
        setTestResults(prev => [...prev, '⚠️ Database connected but no users found']);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setTestResults(prev => [...prev, '❌ Failed to fetch users: ' + (error as Error).message]);
    } finally {
      setIsLoading(false);
    }
  };

  // Test user registration
  const testRegistration = async () => {
    try {
      setIsLoading(true);
      setTestResults(prev => [...prev, '🔄 Testing registration with data: ' + JSON.stringify(regFormData)]);
      
      const response = await apiRequest('POST', '/api/auth/register', regFormData);
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => [...prev, '✅ Registration successful: ' + JSON.stringify(data)]);
        setLoginFormData(prev => ({ ...prev, identifier: regFormData.email }));
        
        toast({
          title: 'Registration Successful',
          description: `Created user ${regFormData.username}`,
        });
        
        // Auto-generate new random test credentials for next test
        setRegFormData({
          username: 'testuser' + Math.floor(Math.random() * 1000),
          email: 'test' + Math.floor(Math.random() * 1000) + '@example.com',
          phone: '+255' + Math.floor(Math.random() * 1000000000),
          password: 'password123'
        });
        
        // Refresh user list
        fetchUsers();
      } else {
        const errorData = await response.json();
        setTestResults(prev => [...prev, `❌ Registration failed: ${response.status} - ${errorData.message || 'Unknown error'}`]);
        
        toast({
          title: 'Registration Failed',
          description: errorData.message || 'Unknown error',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setTestResults(prev => [...prev, '❌ Registration error: ' + (error as Error).message]);
      
      toast({
        title: 'Registration Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test user login
  const testLogin = async () => {
    try {
      setIsLoading(true);
      setTestResults(prev => [...prev, '🔄 Testing login with: ' + loginFormData.identifier]);
      
      const response = await apiRequest('POST', '/api/auth/login', loginFormData);
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => [...prev, '✅ Login successful: User authenticated']);
        
        toast({
          title: 'Login Successful',
          description: `Logged in as ${data.username || loginFormData.identifier}`,
        });
      } else {
        const errorData = await response.json();
        setTestResults(prev => [...prev, `❌ Login failed: ${response.status} - ${errorData.message || 'Unknown error'}`]);
        
        toast({
          title: 'Login Failed',
          description: errorData.message || 'Unknown error',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setTestResults(prev => [...prev, '❌ Login error: ' + (error as Error).message]);
      
      toast({
        title: 'Login Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear test results
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[#313c75]">Authentication System Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database connection test */}
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
            <CardDescription>Check if the database connection is working</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={fetchUsers} 
              disabled={isLoading}
              className="w-full bg-[#4863c3] hover:bg-[#3a51a9]"
            >
              {isLoading ? 'Testing...' : 'Test Database Connection'}
            </Button>
          </CardFooter>
        </Card>

        {/* Registration test */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Test</CardTitle>
            <CardDescription>Test user registration flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username" 
                  value={regFormData.username} 
                  onChange={handleRegChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={regFormData.email} 
                  onChange={handleRegChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={regFormData.phone} 
                  onChange={handleRegChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={regFormData.password} 
                  onChange={handleRegChange} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={testRegistration} 
              disabled={isLoading}
              className="w-full bg-[#4863c3] hover:bg-[#3a51a9]"
            >
              {isLoading ? 'Testing...' : 'Test Registration'}
            </Button>
          </CardFooter>
        </Card>

        {/* Login test */}
        <Card>
          <CardHeader>
            <CardTitle>Login Test</CardTitle>
            <CardDescription>Test user login flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="identifier">Email or Phone</Label>
                <Input 
                  id="identifier" 
                  name="identifier" 
                  value={loginFormData.identifier} 
                  onChange={handleLoginChange} 
                  placeholder="Email or phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="loginPassword">Password</Label>
                <Input 
                  id="loginPassword" 
                  name="password" 
                  type="password" 
                  value={loginFormData.password} 
                  onChange={handleLoginChange} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={testLogin} 
              disabled={isLoading || !loginFormData.identifier}
              className="w-full bg-[#4863c3] hover:bg-[#3a51a9]"
            >
              {isLoading ? 'Testing...' : 'Test Login'}
            </Button>
          </CardFooter>
        </Card>

        {/* Registered users */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>Users currently in the database</CardDescription>
          </CardHeader>
          <CardContent>
            {registeredUsers.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Username</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((user, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{user.username}</td>
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">{user.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No users found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test results */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Test Results</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearResults}
          >
            Clear Results
          </Button>
        </CardHeader>
        <CardContent>
          {testResults.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md max-h-80 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="font-mono text-sm mb-1">
                  {result}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No test results yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;