import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [, navigate] = useLocation();
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setIsSubmitting(true);
    
    try {
      // Use the updated register function with the correct parameter order
      await register(email, password, fullName, phoneNumber);
      
      toast({
        title: "Registration successful",
        description: "Welcome to CV Chap Chap!",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create an Account - CV Chap Chap</title>
        <meta 
          name="description" 
          content="Create your account on CV Chap Chap to start building professional CVs and manage your job applications." 
        />
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-950 mb-2">Create an Account</h1>
              <p className="text-gray-500">Get started with CV Chap Chap</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+255 123 456 789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-500 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;