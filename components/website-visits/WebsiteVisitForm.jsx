'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export default function WebsiteVisitForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    user_id: '',
    page_url: '',
    visit_date: '',
    duration_seconds: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        visit_date: initialData.visit_date ? new Date(initialData.visit_date).toISOString().slice(0, 16) : ''
      });
    }
  }, [initialData]);

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
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.user_id.trim()) {
      newErrors.user_id = 'User ID is required';
    }
    
    if (!formData.page_url.trim()) {
      newErrors.page_url = 'Page URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.page_url)) {
      newErrors.page_url = 'Please enter a valid URL';
    }
    
    if (!formData.visit_date) {
      newErrors.visit_date = 'Visit date is required';
    }
    
    if (!formData.duration_seconds) {
      newErrors.duration_seconds = 'Duration is required';
    } else if (isNaN(formData.duration_seconds) || formData.duration_seconds <= 0) {
      newErrors.duration_seconds = 'Duration must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        duration_seconds: parseInt(formData.duration_seconds)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Website Visit' : 'Add New Website Visit'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium mb-1">
              User ID
            </label>
            <Input
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="Enter user ID"
              className={errors.user_id ? 'border-red-500' : ''}
            />
            {errors.user_id && (
              <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="page_url" className="block text-sm font-medium mb-1">
              Page URL
            </label>
            <Input
              id="page_url"
              name="page_url"
              type="url"
              value={formData.page_url}
              onChange={handleChange}
              placeholder="https://example.com/page"
              className={errors.page_url ? 'border-red-500' : ''}
            />
            {errors.page_url && (
              <p className="text-red-500 text-xs mt-1">{errors.page_url}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="visit_date" className="block text-sm font-medium mb-1">
              Visit Date
            </label>
            <Input
              id="visit_date"
              name="visit_date"
              type="datetime-local"
              value={formData.visit_date}
              onChange={handleChange}
              className={errors.visit_date ? 'border-red-500' : ''}
            />
            {errors.visit_date && (
              <p className="text-red-500 text-xs mt-1">{errors.visit_date}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="duration_seconds" className="block text-sm font-medium mb-1">
              Duration (seconds)
            </label>
            <Input
              id="duration_seconds"
              name="duration_seconds"
              type="number"
              min="0"
              value={formData.duration_seconds}
              onChange={handleChange}
              placeholder="30"
              className={errors.duration_seconds ? 'border-red-500' : ''}
            />
            {errors.duration_seconds && (
              <p className="text-red-500 text-xs mt-1">{errors.duration_seconds}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Visit' : 'Add Visit'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}