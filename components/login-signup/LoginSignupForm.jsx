'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

export default function LoginSignupForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    user_id: '',
    event_type: '',
    event_date: '',
    ip_address: '',
    user_agent: '',
    status: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        event_date: initialData.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : ''
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
    
    if (!formData.event_type) {
      newErrors.event_type = 'Event type is required';
    }
    
    if (!formData.event_date) {
      newErrors.event_date = 'Event date is required';
    }
    
    if (!formData.ip_address.trim()) {
      newErrors.ip_address = 'IP address is required';
    } else if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(formData.ip_address)) {
      newErrors.ip_address = 'Please enter a valid IP address';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
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
          {initialData ? 'Edit Login/Signup Event' : 'Add New Login/Signup Event'}
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
            <label htmlFor="event_type" className="block text-sm font-medium mb-1">
              Event Type
            </label>
            <Select
              value={formData.event_type}
              onValueChange={(value) => handleSelectChange('event_type', value)}
            >
              <SelectTrigger className={errors.event_type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="signup">Signup</SelectItem>
              </SelectContent>
            </Select>
            {errors.event_type && (
              <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="event_date" className="block text-sm font-medium mb-1">
              Event Date
            </label>
            <Input
              id="event_date"
              name="event_date"
              type="datetime-local"
              value={formData.event_date}
              onChange={handleChange}
              className={errors.event_date ? 'border-red-500' : ''}
            />
            {errors.event_date && (
              <p className="text-red-500 text-xs mt-1">{errors.event_date}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="ip_address" className="block text-sm font-medium mb-1">
              IP Address
            </label>
            <Input
              id="ip_address"
              name="ip_address"
              value={formData.ip_address}
              onChange={handleChange}
              placeholder="192.168.1.1"
              className={errors.ip_address ? 'border-red-500' : ''}
            />
            {errors.ip_address && (
              <p className="text-red-500 text-xs mt-1">{errors.ip_address}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="user_agent" className="block text-sm font-medium mb-1">
              User Agent
            </label>
            <Input
              id="user_agent"
              name="user_agent"
              value={formData.user_agent}
              onChange={handleChange}
              placeholder="Mozilla/5.0..."
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Event' : 'Add Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}