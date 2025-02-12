'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Verification token is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          toast.success('Email verified successfully!');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login?verification=success');
          }, 3000);
        } else {
          setError(data.error);
          toast.error(data.error || 'Verification failed');
        }
      } catch (error) {
        setError('Failed to verify email. Please try again.');
        toast.error('Failed to verify email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isLoading ? 'Verifying your email' : success ? 'Email verified!' : 'Verification failed'}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? 'Please wait while we verify your email address'
              : success
              ? 'Your email has been verified successfully'
              : 'There was a problem verifying your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
          ) : success ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>
          ) : (
            <>
              <Alert className="bg-red-50 text-red-700 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Return to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
