'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

export default function LoginSignupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('login');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/login-signup');
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setRecords(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchRecords();
  }, []);

  const openLoginModal = () => {
    setModalType('login');
    setIsModalOpen(true);
  };

  const openRegisterModal = () => {
    setModalType('register');
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Login & Signup Tracking</h1>
        <div className="space-x-2">
          <Button onClick={openLoginModal}>Record Login</Button>
          <Button onClick={openRegisterModal} variant="outline">Record Signup</Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p>No records found</p>
        ) : (
          records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <CardTitle>{record.type === 'login' ? 'Login' : 'Signup'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Email:</strong> {record.email}</p>
                <p><strong>Date:</strong> {new Date(record.created_at).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(record.created_at).toLocaleTimeString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalType === 'login' ? (
          <LoginForm onSuccess={() => { setIsModalOpen(false); fetchRecords(); }} />
        ) : (
          <RegisterForm onSuccess={() => { setIsModalOpen(false); fetchRecords(); }} />
        )}
      </Modal>
    </div>
  );
}