/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAuth } from '@/lib/auth-context';
import { pacifico } from '@/lib/fonts';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

// Global Loader Component
const GlobalLoader = ({ message = "Processing..." }: { message?: string }) => (
  <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Checking authentication...</p>
    </div>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord'>('tenant');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔐 User already logged in, redirecting from register...');
      handleRedirect();
    }
  }, [isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'tenant',
      phone: '',
    },
  });

  const currentRole = watch('role');

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneValue(value || '');
    setValue('phone', value || '', { shouldValidate: true });
  };

  const handleRedirect = () => {
    if (user?.role === 'landlord') {
      router.push('/dashboard');
    } else {
      router.push('/properties');
    }
  };

  type BackendErrorResponse = {
    success: boolean;
    error: string;
    stack?: string;
  };


  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      const submitData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone || undefined,
      };

      await registerUser(submitData);

      // Show success state before redirect
      setShowSuccess(true);

      // Redirect after a brief success display
      setTimeout(() => {
        handleRedirect();
      }, 1500);

    } catch (error) {
      setIsSubmitting(false);

      console.log('🔴 Registration Error:', error);

      let userFriendlyMessage = 'An unexpected error occurred. Please check your connection.';

      if (error && (error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError<any>;

        const responseData = axiosError.response?.data;

        if (axiosError.response?.status === 409) {
          userFriendlyMessage = responseData?.message || 'User already exists with this email.';
        }

        else if (responseData?.message) {
          userFriendlyMessage = responseData.message;
        }
        // Handle server errors
        else if (axiosError.response?.status >= 500) {
          userFriendlyMessage = 'A server error occurred. Please try again shortly.';
        }

        else if (axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ECONNREFUSED') {
          userFriendlyMessage = 'Network error. Please check your internet connection.';
        }
      } else {
        console.log('🔴 Non-Axios Error:', error);
        userFriendlyMessage = 'An unexpected error occurred. Please try again.';
      }

      toast.error(userFriendlyMessage);
    }
  };

  // Show loading while checking auth status
  if (isLoading) {
    return <GlobalLoader message="Checking authentication..." />;
  }

  // Don't render the form if user is already authenticated
  if (isAuthenticated) {
    return <GlobalLoader message="Redirecting to dashboard..." />;
  }

  return (
    <>
      {/* Global Loader Overlay */}
      {isSubmitting && (
        <GlobalLoader
          message={showSuccess ? "Registration Successful! Redirecting..." : "Creating your account..."}
        />
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4 min-w-[300px] animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Success!</h3>
            <p className="text-gray-600 text-center">Your account has been created successfully.</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <Card className="flex flex-col lg:flex-row shadow-2xl overflow-hidden border-0 py-0">
            {/* Left Side - Brand Section */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 bg-black/10"></div>

              {/* Floating Shapes */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-16 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full blur-md"></div>

              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                            linear-gradient(90deg, #fff 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">

                {/* Enhanced Logo Section */}
                <div className="mb-12 text-center lg:text-left">
                  <Link
                    href="/"
                    className={`${pacifico.className} text-4xl lg:text-5xl font-bold text-white inline-flex items-center space-x-3 hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <span className="text-2xl lg:text-3xl">🏠</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span>HomeConnect</span>
                  </Link>
                  <div className="mt-3 flex items-center justify-center lg:justify-start space-x-4">
                    <div className="flex items-center space-x-1 text-blue-100">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Trusted Platform</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="max-w-md">
                  {/* Main Heading */}
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    Your Dream Home
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                      Awaits You
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-xl text-blue-100 mb-8 leading-relaxed font-light">
                    Join <span className="font-semibold text-white">10,000+</span> satisfied customers who found their perfect home through our verified property listings.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-lg">✓</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Verified Properties</h3>
                        <p className="text-blue-100 text-sm">100% authentic listings</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-lg">🛡️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">24/7 Support</h3>
                        <p className="text-blue-100 text-sm">Always here to help you</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-lg">🔒</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Secure Transactions</h3>
                        <p className="text-blue-100 text-sm">Your safety is our priority</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">5K+</div>
                      <div className="text-xs text-blue-200">Properties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">98%</div>
                      <div className="text-xs text-blue-200">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">24h</div>
                      <div className="text-xs text-blue-200">Support</div>
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-8 flex items-center justify-center lg:justify-start space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                          {i}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-blue-100">
                      <span className="font-semibold text-white">4.9/5</span> rating from 2k+ reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white">
              <div className="w-full max-w-md">
                <CardHeader className="p-0 pb-8 text-center">
                  {/* Mobile Logo */}
                  <div className='flex lg:hidden items-center justify-center pb-6'>
                    <Link
                      href="/"
                      className={`${pacifico.className} text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
                    >
                      HomeConnect
                    </Link>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Join HomeConnect today
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          {...register('name')}
                          className={`h-12 px-4 text-base border-2 ${errors.name
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            } transition-all duration-200 bg-gray-50/50`}
                          disabled={isSubmitting}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{errors.name.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...register('email')}
                          className={`h-12 px-4 text-base border-2 ${errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            } transition-all duration-200 bg-gray-50/50`}
                          disabled={isSubmitting}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{errors.email.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                        I am a
                      </Label>
                      <Select
                        onValueChange={(value: 'tenant' | 'landlord') => {
                          setValue('role', value);
                          setSelectedRole(value);
                        }}
                        defaultValue="tenant"
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className={`h-12 text-base border-2 ${errors.role
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          } transition-all duration-200 bg-gray-50/50`}>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant" className="text-base py-3">Tenant 🎓</SelectItem>
                          <SelectItem value="landlord" className="text-base py-3">Landlord 🏠</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{errors.role.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Role-specific description */}
                    {currentRole === 'tenant' && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 font-medium">
                          🎓 As a tenant, you can browse properties, save favorites, and contact landlords.
                        </p>
                      </div>
                    )}

                    {currentRole === 'landlord' && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800 font-medium">
                          🏠 As a landlord, you can list properties, manage inquiries, and connect with tenants.
                        </p>
                      </div>
                    )}

                    {/* Phone Field with react-phone-number-input */}
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        Phone Number <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                      </Label>
                      <div className="react-phone-input-container">
                        <PhoneInput
                          international
                          defaultCountry="BD"
                          value={phoneValue}
                          onChange={handlePhoneChange}
                          placeholder="Enter phone number"
                          className={`phone-input ${errors.phone ? 'error' : ''
                            }`}
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Hidden input for form validation */}
                      <input type="hidden" {...register('phone')} />

                      {errors.phone && (
                        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{errors.phone.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          {...register('password')}
                          className={`h-12 px-4 pr-12 text-base border-2 ${errors.password
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            } transition-all duration-200 bg-gray-50/50`}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.83 3.83" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{errors.password.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          {...register('confirmPassword')}
                          className={`h-12 px-4 pr-12 text-base border-2 ${errors.confirmPassword
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            } transition-all duration-200 bg-gray-50/50`}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.83 3.83" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{errors.confirmPassword.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                      <span className="text-gray-600 text-sm">Already have an account? </span>
                      <Link
                        href="/signin"
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                      >
                        Sign in
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}