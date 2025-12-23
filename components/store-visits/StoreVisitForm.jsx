'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

export default function StoreVisitForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    user_id: '',
    store_name: '',
    location: '',
    visit_date: '',
    visit_purpose: ''
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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user makes selection
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
    
    if (!formData.store_name.trim()) {
      newErrors.store_name = 'Store name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.visit_date) {
      newErrors.visit_date = 'Visit date is required';
    }
    
    if (!formData.visit_purpose) {
      newErrors.visit_purpose = 'Visit purpose is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Store Visit' : 'Add New Store Visit'}
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
            <label htmlFor="store_name" className="block text-sm font-medium mb-1">
              Store Name
            </label>
            <Input
              id="store_name"
              name="store_name"
              value={formData.store_name}
              onChange={handleChange}
              placeholder="Enter store name"
              className={errors.store_name ? 'border-red-500' : ''}
            />
            {errors.store_name && (
              <p className="text-red-500 text-xs mt-1">{errors.store_name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter store location"
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
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
            <label htmlFor="visit_purpose" className="block text-sm font-medium mb-1">
              Visit Purpose
            </label>
            <Select
              value={formData.visit_purpose}
              onValueChange={(value) => handleSelectChange('visit_purpose', value)}
            >
              <SelectTrigger className={errors.visit_purpose ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.visit_purpose && (
              <p className="text-red-500 text-xs mt-1">{errors.visit_purpose}</p>
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