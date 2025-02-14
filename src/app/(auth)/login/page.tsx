"use client";

import { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const verification = searchParams.get('verification');
  const message = searchParams.get('message');

  useEffect(() => {
    if (verification === 'pending') {
      toast.info('Please verify your email before logging in');
    } else if (verification === 'success') {
      toast.success('Email verified successfully! You can now log in');
    }
  }, [verification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", { 
        redirect: false, 
        email, 
        password,
        callbackUrl: '/dashboard'
      });

      if (!res?.ok || res?.error) {
        const errorMessage = 'Invalid email or password';
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }

      // Login successful
      toast.success('Login successful');
      
      // Use the callback URL from the response, fallback to dashboard
      const callbackUrl = res?.url || '/dashboard';
      router.push(callbackUrl);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(registered || message) && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>
                {registered ? "Registration successful! Please login with your credentials." : message}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mb-6 bg-red-50 text-red-700 border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6">
            <GoogleAuthButton />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>
          </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-1">
            <span>Don't have an account?</span>
            <Link 
              href="/register" 
              className="text-primary hover:text-primary/90 font-medium"
            >
              Sign up
            </Link>
          </div>
          <Link 
            href="/password-reset" 
            className="text-primary hover:text-primary/90 font-medium text-center"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
