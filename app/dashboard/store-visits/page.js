'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

export default function StoreVisitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    contact_info: '',
    location: '',
    notes: ''
  });

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/store-visits');
      if (!response.ok) throw new Error('Failed to fetch store visits');
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
      const response = await fetch('/api/store-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create store visit');
      setIsModalOpen(false);
      setFormData({ contact_info: '', location: '', notes: '' });
      fetchVisits();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store Visits</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Store Visit</Button>
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
          <p>No store visits recorded</p>
        ) : (
          visits.map((visit) => (
            <Card key={visit.id}>
              <CardHeader>
                <CardTitle>Store Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Contact:</strong> {visit.contact_info}</p>
                <p><strong>Location:</strong> {visit.location}</p>
                <p><strong>Date:</strong> {new Date(visit.visit_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(visit.visit_date).toLocaleTimeString()}</p>
                {visit.notes && <p><strong>Notes:</strong> {visit.notes}</p>}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Record Store Visit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Info</label>
            <input
              type="text"
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border rounded-lg p-2"
              rows={3}
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