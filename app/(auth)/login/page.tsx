'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/config/app-config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('gyanendra@devmind.io');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  const autofillDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('demopassword123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-100">
              {APP_CONFIG.name}
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 pt-2">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage your digital marketing channels and publishing.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Work Email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me for 30 days</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold shadow-xs"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to SocialHub
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick 1-Click Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => autofillDemo('gyanendra@devmind.io')}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition-colors cursor-pointer"
              >
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  Marketing Lead
                </p>
                <p className="text-[10px] text-slate-400 font-mono">gyanendra@devmind.io</p>
              </button>

              <button
                type="button"
                onClick={() => autofillDemo('suman@devmind.io')}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition-colors cursor-pointer"
              >
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  Agency Admin
                </p>
                <p className="text-[10px] text-slate-400 font-mono">suman@devmind.io</p>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Enterprise OAuth 2.0 & SOC2 Ready Architecture</span>
        </div>
      </div>
    </div>
  );
}
