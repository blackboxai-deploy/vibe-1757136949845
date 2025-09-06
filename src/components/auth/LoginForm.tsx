'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: 'admin' | 'manager' | 'employee') => {
    const credentials = {
      admin: { email: 'admin@richezzamegavalue.com', password: 'demo123' },
      manager: { email: 'hr@richezzamegavalue.com', password: 'demo123' },
      employee: { email: 'john@richezzamegavalue.com', password: 'demo123' }
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Demo Login</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => quickLogin('admin')}
          className="text-xs"
          disabled={isLoading}
        >
          Login as Admin
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => quickLogin('manager')}
          className="text-xs"
          disabled={isLoading}
        >
          Login as HR Manager
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => quickLogin('employee')}
          className="text-xs"
          disabled={isLoading}
        >
          Login as Employee
        </Button>
      </div>
    </div>
  );
}