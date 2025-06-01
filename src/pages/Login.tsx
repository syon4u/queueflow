import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardCard from '@/components/ui/broward-card';
import BrowardInput from '@/components/ui/broward-input';
import BrowardButton from '@/components/ui/broward-button';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: t("auth.loginFailed"),
        description: "Google authentication is temporarily disabled. Please use email/password instead.",
      });
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (activeTab === 'login') {
        await signInWithEmail(data.email, data.password);
      } else {
        await signUpWithEmail(data.email, data.password);
        toast({
          title: t("auth.registrationSuccess"),
          description: t("auth.checkEmail"),
        });
      }
    } catch (error) {
      console.error(`${activeTab === 'login' ? 'Login' : 'Registration'} failed:`, error);
      toast({
        variant: "destructive",
        title: activeTab === 'login' ? t("auth.loginFailed") : t("auth.registrationFailed"),
        description: activeTab === 'login' ? t("auth.loginFailedDesc") : t("auth.registrationFailedDesc"),
      });
    }
  };

  return (
    <BrowardLayout>
      <BrowardHero 
        title="Welcome to Broward County" 
        subtitle="Consumer Protection Division"
        backgroundStyle="gradient"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <BrowardCard title="Account Access" elevation="lg">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'login' | 'register')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <BrowardInput
                    label={t("auth.email")}
                    id="email-login"
                    type="email"
                    {...form.register("email")}
                    error={form.formState.errors.email?.message}
                  />
                  
                  <BrowardInput
                    label={t("auth.password")}
                    id="password-login"
                    type="password"
                    {...form.register("password")}
                    error={form.formState.errors.password?.message}
                  />
                  
                  <BrowardButton type="submit" className="w-full">
                    {t("auth.login")}
                  </BrowardButton>
                </form>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-300 dark:border-neutral-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-neutral-100 px-2 text-neutral-500">
                      {t("auth.orContinueWith")}
                    </span>
                  </div>
                </div>
                
                <BrowardButton 
                  onClick={handleGoogleSignIn}
                  className="w-full"
                  variant="outline"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="mr-2">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {t("auth.googleButton")}
                </BrowardButton>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <BrowardInput
                    label={t("auth.email")}
                    id="email-register"
                    type="email"
                    {...form.register("email")}
                    error={form.formState.errors.email?.message}
                  />
                  
                  <BrowardInput
                    label={t("auth.password")}
                    id="password-register"
                    type="password"
                    {...form.register("password")}
                    error={form.formState.errors.password?.message}
                  />
                  
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t("auth.passwordRequirements")}
                  </p>
                  
                  <BrowardButton type="submit" className="w-full">
                    {t("auth.register")}
                  </BrowardButton>
                </form>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-300 dark:border-neutral-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-neutral-100 px-2 text-neutral-500">
                      {t("auth.orContinueWith")}
                    </span>
                  </div>
                </div>
                
                <BrowardButton 
                  onClick={handleGoogleSignIn}
                  className="w-full"
                  variant="outline"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="mr-2">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {t("auth.googleButton")}
                </BrowardButton>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {activeTab === 'login' ? (
                  <>
                    {t("auth.dontHaveAccount")} 
                    <button 
                      className="text-bc-blue dark:text-bc-teal font-medium hover:underline ml-1"
                      onClick={() => setActiveTab('register')}
                    >
                      {t("auth.register")}
                    </button>
                  </>
                ) : (
                  <>
                    {t("auth.alreadyHaveAccount")} 
                    <button 
                      className="text-bc-blue dark:text-bc-teal font-medium hover:underline ml-1"
                      onClick={() => setActiveTab('login')}
                    >
                      {t("auth.login")}
                    </button>
                  </>
                )}
              </p>
            </div>
          </BrowardCard>
        </div>
      </div>
    </BrowardLayout>
  );
};

export default Login;