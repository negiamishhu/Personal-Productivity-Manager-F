'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Receipt, TrendingUp, CheckSquare, CheckCircle2, Clock } from 'lucide-react';


export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
        const headers = { 'Authorization': `Bearer ${token}` };
        const [summaryRes, expensesByCategoryRes, tasksByStatusRes, recentActivityRes] = await Promise.all([
          fetch(`${apiUrl}/api/dashboard/summary`, { headers }),
          fetch(`${apiUrl}/api/dashboard/expenses-by-category`, { headers }),
          fetch(`${apiUrl}/api/dashboard/tasks-by-status`, { headers }),
          fetch(`${apiUrl}/api/dashboard/recent-activity`, { headers }),
        ]);

        if (summaryRes.status === 401 || expensesByCategoryRes.status === 401 || tasksByStatusRes.status === 401 || recentActivityRes.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userEmail');
          router.push('/login');
          return;
        }

        const summary = await summaryRes.json();
        const expensesByCategory = await expensesByCategoryRes.json();
        const tasksByStatus = await tasksByStatusRes.json();
        const recentActivity = await recentActivityRes.json();

        setDashboardData({ summary, expensesByCategory, tasksByStatus, recentActivity });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-work-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-work-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-work-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { summary, expensesByCategory, tasksByStatus, recentActivity } = dashboardData;
  
   const safeSummary = {
    totalIncome: summary?.totalIncome || 0,
    totalExpense: summary?.totalExpense || 0,
    netBalance: summary?.netBalance || 0,
    totalTasks: summary?.totalTasks || 0,
    completedTasks: summary?.completedTasks || 0,
    pendingTasks: summary?.pendingTasks || 0,
  };
  
  const safeExpensesByCategory = expensesByCategory || [];
  const safeTasksByStatus = tasksByStatus || [];
  const safeRecentActivity = {
    expenses: recentActivity?.expenses || [],
    tasks: recentActivity?.tasks || [],
  };

  return (
    <div className="min-h-screen bg-work-bg">
      {/* Header */}
      <div className="bg-brown-m shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="mt-1 text-sm text-amber-100">Welcome back! Here&apos;s your productivity overview.</p>
            </div>
            <div className="flex space-x-5">
              <Link
                href="/expenses/add"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Expense
              </Link>
              <Link
                href="/tasks/add"
                className="inline-flex items-center px-4 py-2 border-2 border-white text-sm font-medium rounded-md text-white bg-amber-950 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl border-l-4 border-emerald-500 hover:shadow-lg transition-all hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Total Income</dt>
                    <dd className="text-2xl font-bold text-gray-900 mt-1">${safeSummary.totalIncome.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl border-l-4 border-rose-500 hover:shadow-lg transition-all hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Total Expenses</dt>
                    <dd className="text-2xl font-bold text-gray-900 mt-1">${safeSummary.totalExpense.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Net Balance Card */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Net Balance</dt>
                    <dd className={`text-2xl font-bold mt-1 ${safeSummary.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ${safeSummary.netBalance.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl border-l-4 border-violet-500 hover:shadow-lg transition-all hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-violet-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Total Tasks</dt>
                    <dd className="text-2xl font-bold text-gray-900 mt-1">{safeSummary.totalTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl border-l-4 border-emerald-500 hover:shadow-lg transition-all hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Completed</dt>
                    <dd className="text-2xl font-bold text-gray-900 mt-1">{safeSummary.completedTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl border-l-4 border-amber-500 hover:shadow-lg transition-all hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Pending</dt>
                    <dd className="text-2xl font-bold text-gray-900 mt-1">{safeSummary.pendingTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="bg-brown-m px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Expenses by Category</h3>
            </div>
            <div className="p-6">
              {safeExpensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={safeExpensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {safeExpensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-300 text-gray-500">
                  <p>No expense data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Tasks by Status Bar Chart */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="bg-brown-m px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Tasks by Status</h3>
            </div>
            <div className="p-6">
              {safeTasksByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={safeTasksByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-300 text-gray-500">
                  <p>No task data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> 
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="bg-brown-m px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Expenses</h3>
                <Link href="/expenses" className="text-sm text-amber-200 hover:text-white font-medium transition-colors">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {safeRecentActivity.expenses.length > 0 ? (
                safeRecentActivity.expenses.map((expense) => (
                  <div key={expense.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{expense.title}</p>
                        <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {expense.type === 'income' ? '+' : '-'}${expense.amount}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          expense.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {expense.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No recent expenses</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="bg-brown-m px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
                <Link href="/tasks" className="text-sm text-amber-200 hover:text-white font-medium transition-colors">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {safeRecentActivity.tasks.length > 0 ? (
                safeRecentActivity.tasks.map((task) => (
                  <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                        <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No recent tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}