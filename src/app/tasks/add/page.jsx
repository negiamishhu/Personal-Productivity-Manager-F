'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Info, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

function AddEditTaskContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');
  const isEdit = !!taskId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dateTasksInfo, setDateTasksInfo] = useState(null);
  const [checkingDate, setCheckingDate] = useState(false);

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];
  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  const categories = ['Work', 'Personal', 'Health', 'Finance', 'Education', 'Other'];

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    }
  }, [isEdit, taskId]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
        const response = await fetch(`${apiUrl}/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const task = await response.json();
        setFormData({
          title: task.title || '',
          description: task.description || '',
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          status: task.status || 'pending',
          priority: task.priority || 'medium',
          category: task.category || ''
        });
      } else {
        console.error('Failed to fetch task');
        router.push('/tasks');
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      router.push('/tasks');
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
     
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
     if (name === 'dueDate' && value) {
      checkTasksForDate(value);
    }
  };

  const checkTasksForDate = async (date) => {
    if (!date) return;
    
    setCheckingDate(true);
    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
      
       const response = await fetch(`${apiUrl}/api/tasks?startDue=${date}&endDue=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        let tasks = data.tasks || [];
        
         if (isEdit && taskId) {
          tasks = tasks.filter(t => t._id !== taskId);
        }
        
         if (tasks.length === 0) {
          setDateTasksInfo(null);
          return;
        }
        
         const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        
        setDateTasksInfo({
          total: tasks.length,
          pending,
          inProgress,
          completed,
          date
        });
      }
    } catch (error) {
      console.error('Error checking tasks for date:', error);
    } finally {
      setCheckingDate(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
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
        ? `${apiUrl}/api/tasks/${taskId}`
        : `${apiUrl}/api/tasks`;
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/tasks');
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
          <p className="mt-4 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-work-bg">
       <div className="bg-brown-m shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isEdit ? 'Edit Task' : 'Add New Task'}
              </h1>
              <p className="mt-1 text-sm text-amber-100">
                {isEdit ? 'Update your task details.' : 'Create a new task to stay organized.'}
              </p>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center px-4 py-2 border-2 border-white text-sm font-medium rounded-md text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {dateTasksInfo && dateTasksInfo.total > 0 && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Existing Tasks for {new Date(dateTasksInfo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="font-semibold">You have {dateTasksInfo.total} task{dateTasksInfo.total !== 1 ? 's' : ''} registered for this date:</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {dateTasksInfo.pending > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {dateTasksInfo.pending} Pending
                      </span>
                    )}
                    {dateTasksInfo.inProgress > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {dateTasksInfo.inProgress} In Progress
                      </span>
                    )}
                    {dateTasksInfo.completed > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {dateTasksInfo.completed} Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-md rounded-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6"> 
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
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
 
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
                placeholder="Add task description and details..."
              />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

             {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href="/tasks"
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
                  isEdit ? 'Update Task' : 'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddEditTask() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-600">Loading...</p></div></div>}>
      <AddEditTaskContent />
    </Suspense>
  );
}
