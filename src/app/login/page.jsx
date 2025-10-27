'use client';

import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

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
        if (!value || value.trim() === '') {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        } else if (value.length > 128) {
          newErrors.password = 'Password is too long (max 128 characters)';
        } else if (/\s/.test(value)) {
          newErrors.password = 'Password cannot contain spaces';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
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
    }
    
    setErrors(newErrors);
    setTouched({
      email: true,
      password: true
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Sanitize inputs before sending
      const sanitizedData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sanitizedData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (response.ok) {
        // Validate response data before storing
        if (!data.accessToken || typeof data.accessToken !== 'string') {
          throw new Error('Invalid response from server');
        }
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userEmail', sanitizedData.email);
        
        // Redirect based on user role
        if (sanitizedData.email === 'anegi@admin.com') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
         if (response.status === 401) {
          setErrors({ general: 'Invalid email or password' });
        } else if (response.status === 429) {
          setErrors({ general: 'Too many login attempts. Please try again later.' });
        } else if (response.status === 403) {
          setErrors({ general: 'Account has been locked. Please contact support.' });
        } else {
          setErrors({ general: data.message || 'Login failed. Please try again.' });
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
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-5xl font-semibold mb-6 whitespace-nowrap">Productivity Manager</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Streamline your workflow, track expenses, and manage tasks all in one place
            </p>
         
          </div>
        </div>
      </div>

       <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
           <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#5D4037' }}>
              Productivity Manager
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#5D4037' }}>
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to continue to your account
              </p>
              
              {/* Demo Accounts */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Try Demo Accounts:</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        email: 'anegi@admin.com',
                        password: 'Admin1234'
                      });
                      setErrors({});
                      setTouched({});
                    }}
                    disabled={loading}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all hover:shadow-md disabled:opacity-50"
                    style={{ 
                      borderColor: '#5D4037',
                      color: '#5D4037',
                      backgroundColor: 'white'
                    }}
                  >
                    👤 Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        email: 'alice@user.com',
                        password: 'User1234'
                      });
                      setErrors({});
                      setTouched({});
                    }}
                    disabled={loading}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all hover:shadow-md disabled:opacity-50"
                    style={{ 
                      borderColor: '#5D4037',
                      color: '#5D4037',
                      backgroundColor: 'white'
                    }}
                  >
                    👥 User
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  } focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <span className="text-lg">⚠</span>
                    {errors.general}
                  </p>
                </div>
              )}

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
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <a href="/register" className="font-semibold hover:underline" style={{ color: '#5D4037' }}>
                  Create Account
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}