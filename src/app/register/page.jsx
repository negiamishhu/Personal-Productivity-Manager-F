'use client';

import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation as user types
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        if (!value || value.trim() === '') {
          newErrors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters long';
        } else if (value.trim().length > 50) {
          newErrors.name = 'Name is too long (max 50 characters)';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          newErrors.name = 'Name can only contain letters, spaces, hyphens and apostrophes';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        if (!value || value.trim() === '') {
          newErrors.email = 'Email address is required';
        } else if (value.length > 255) {
          newErrors.email = 'Email address is too long';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.email = 'Email contains invalid characters';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        } else if (value.length > 128) {
          newErrors.password = 'Password is too long (max 128 characters)';
        } else if (/\s/.test(value)) {
          newErrors.password = 'Password cannot contain spaces';
        } else if (!/(?=.*[a-z])/.test(value)) {
          newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          newErrors.password = 'Password must contain at least one number';
        } else {
          delete newErrors.password;
        }
        
        // Also validate confirm password if it's been touched
        if (touched.confirmPassword && formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    const name = formData.name.trim();
    if (!name) {
      newErrors.name = 'Full name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (name.length > 50) {
      newErrors.name = 'Name is too long (max 50 characters)';
    } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      newErrors.name = 'Name can only contain letters, spaces, hyphens and apostrophes';
    }
    
    // Email validation
    const email = formData.email.trim();
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (email.length > 255) {
      newErrors.email = 'Email address is too long';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = 'Email contains invalid characters';
    }
    
    // Password validation
    const password = formData.password;
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (password.length > 128) {
      newErrors.password = 'Password is too long (max 128 characters)';
    } else if (/\s/.test(password)) {
      newErrors.password = 'Password cannot contain spaces';
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
      
      // Sanitize inputs before sending
      const sanitizedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (response.ok) {
        // Registration successful, redirect to login
        window.location.href = '/login?message=Registration successful! Please sign in.';
      } else {
        // Handle different error status codes
        if (response.status === 409) {
          setErrors({ general: 'An account with this email already exists' });
        } else if (response.status === 429) {
          setErrors({ general: 'Too many registration attempts. Please try again later.' });
        } else {
          setErrors({ general: data.message || 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setErrors({ general: 'Request timeout. Please check your connection and try again.' });
      } else if (error instanceof TypeError) {
        setErrors({ general: 'Network error. Please check your internet connection.' });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 33, label: 'Weak', color: '#ef4444' };
    if (strength <= 4) return { strength: 66, label: 'Medium', color: '#f59e0b' };
    return { strength: 100, label: 'Strong', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF9F5' }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#5D4037' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold mb-6">Join Us Today</h1>
            <p className="text-xl opacity-90 leading-relaxed mb-8">
              Start managing your productivity, expenses, and tasks efficiently
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <div className="font-semibold">Track Expenses</div>
                  <div className="text-sm opacity-75">Monitor your spending with detailed analytics</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <div className="font-semibold">Manage Tasks</div>
                  <div className="text-sm opacity-75">Stay organized with our task management system</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <div className="font-semibold">Dashboard Insights</div>
                  <div className="text-sm opacity-75">Get real-time insights into your productivity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#5D4037' }}>
              Productivity Manager
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#5D4037' }}>
                Create Account
              </h2>
              <p className="text-gray-600">
                Get started with your free account
              </p>
            </div>

            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={50}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  } focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={255}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  } focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    maxLength={128}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                    } focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all pr-10`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ 
                            width: `${passwordStrength.strength}%`,
                            backgroundColor: passwordStrength.color
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use 6+ characters with uppercase, lowercase & numbers
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    maxLength={128}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                    } focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all pr-10`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <span className="text-lg">⚠</span>
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: '#5D4037' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <a href="/login" className="font-semibold hover:underline" style={{ color: '#5D4037' }}>
                  Sign In
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}