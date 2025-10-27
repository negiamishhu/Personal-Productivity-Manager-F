'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign } from 'lucide-react';

function AddEditExpenseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get('id');
  const isEdit = !!expenseId;

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const categories = ['Food', 'Bills', 'Travel', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Other'];
  const paymentMethods = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Digital Wallet', 'Other'];

  useEffect(() => {
    fetchAvailableBalance();
    if (isEdit) {
      fetchExpense();
    }
  }, [isEdit, expenseId]);

  const fetchAvailableBalance = async () => {
    setBalanceLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
      const response = await fetch(`${apiUrl}/api/dashboard/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const balance = (data.totalIncome || 0) - (data.totalExpense || 0);
        setAvailableBalance(balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchExpense = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
        const response = await fetch(`${apiUrl}/api/expenses/${expenseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const expense = await response.json();
        setFormData({
          title: expense.title || '',
          amount: expense.amount || '',
          type: expense.type || 'expense',
          category: expense.category || '',
          paymentMethod: expense.paymentMethod || '',
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
          description: expense.description || ''
        });
      } else {
        console.error('Failed to fetch expense');
        router.push('/expenses');
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      router.push('/expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (formData.type === 'expense' && !isEdit) {
      // Check if expense amount exceeds available balance (only for new expenses)
      const expenseAmount = parseFloat(formData.amount);
      if (expenseAmount > availableBalance) {
        newErrors.amount = `Not enough balance! Available: $${availableBalance.toFixed(2)}`;
      }
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
      const url = isEdit 
        ? `${apiUrl}/api/expenses/${expenseId}`
        : `${apiUrl}/api/expenses`;
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/expenses');
      } else {
        setErrors({ general: data.message || `${isEdit ? 'Update' : 'Creation'} failed` });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expense...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-work-bg">
      {/* Header */}
      <div className="bg-brown-m shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isEdit ? 'Edit Expense' : 'Add New Expense'}
              </h1>
              <p className="mt-1 text-sm text-amber-100">
                {isEdit ? 'Update your expense details.' : 'Track your spending by adding a new expense.'}
              </p>
            </div>
            <Link
              href="/expenses"
              className="inline-flex items-center px-4 py-2 border-2 border-white text-sm font-medium rounded-md text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Expenses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Available Balance Display - Only show for new expenses */}
        {!isEdit && !balanceLoading && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-green-800">
                  Available Balance
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${availableBalance.toFixed(2)}
                </p>
              </div>
              <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                Current Balance
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-md rounded-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter expense title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Amount and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 pr-3 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Category and Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.paymentMethod ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Add any additional details about this expense..."
              />
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href="/expenses"
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEdit ? 'Update Expense' : 'Create Expense'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddEditExpense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddEditExpenseContent />
    </Suspense>
  );
}
