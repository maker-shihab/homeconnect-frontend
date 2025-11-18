'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth-api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const sent = searchParams.get('sent');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    setStatus('verifying');
    try {
      await authApi.verifyEmail(token);
      setStatus('success');
      setMessage('Email verified successfully! You can now log in.');
      toast.success('Email verified!');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Verification failed');
      toast.error('Verification failed');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We have sent a verification link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl">📧</div>
            <p className="text-gray-600">
              Please check your inbox and click the verification link to activate your account.
            </p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p>Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="text-6xl text-green-500">✅</div>
              <p className="text-green-600 font-medium">{message}</p>
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-6xl text-red-500">❌</div>
              <p className="text-red-600 font-medium">{message}</p>
              <Button asChild>
                <Link href="/register">Try Again</Link>
              </Button>
            </>
          )}
          {status === 'idle' && !token && (
            <>
              <div className="text-6xl">🔍</div>
              <p>No verification token found.</p>
              <Button asChild>
                <Link href="/register">Go to Registration</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}