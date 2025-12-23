'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

export default function WebsiteVisitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    ip_address: '',
    contact_info: '',
    page_visited: '',
    duration_seconds: '',
    location: ''
  });

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/website-visits');
      if (!response.ok) throw new Error('Failed to fetch website visits');
      const data = await response.json();
      setVisits(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchVisits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/website-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration_seconds: parseInt(formData.duration_seconds) || 0
        })
      });
      if (!response.ok) throw new Error('Failed to create website visit');
      setIsModalOpen(false);
      setFormData({ ip_address: '', contact_info: '', page_visited: '', duration_seconds: '', location: '' });
      fetchVisits();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Website Visits</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Website Visit</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p>
        ) : visits.length === 0 ? (
          <p>No website visits recorded</p>
        ) : (
          visits.map((visit) => (
            <Card key={visit.id}>
              <CardHeader>
                <CardTitle>Website Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>IP:</strong> {visit.ip_address}</p>
                <p><strong>Page:</strong> {visit.page_visited}</p>
                <p><strong>Duration:</strong> {visit.duration_seconds}s</p>
                <p><strong>Location:</strong> {visit.location}</p>
                <p><strong>Date:</strong> {new Date(visit.visit_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(visit.visit_date).toLocaleTimeString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Record Website Visit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">IP Address</label>
            <input
              type="text"
              value={formData.ip_address}
              onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Info</label>
            <input
              type="text"
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Page Visited</label>
            <input
              type="text"
              value={formData.page_visited}
              onChange={(e) => setFormData({ ...formData, page_visited: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
            <input
              type="number"
              value={formData.duration_seconds}
              onChange={(e) => setFormData({ ...formData, duration_seconds: e.target.value })}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}