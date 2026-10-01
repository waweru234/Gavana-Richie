'use client';

import { useState } from 'react';

export default function JoinForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setSubmitError(null);

    try {
      const response = await fetch('/api/join-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit');
      }

      const data = await response.json();
      setSubmitStatus('success');
      // Optionally reset the form
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitStatus('error');
      setSubmitError(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Join Our Initiative</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#F6E9EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A2242]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-[#F6E9EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A2242]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number (optional)</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#F6E9EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A2242]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message (optional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-[#F6E9EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A2242]"
          />
        </div>
        <button
          type="submit"
          disabled={submitStatus === 'loading'}
          className="w-full bg-[#8A2242] text-white px-4 py-2 rounded-md hover:bg-[#3E0C1B] focus:outline-none focus:ring-2 focus:ring-[#FC9CA4] transition-colors disabled:opacity-50"
        >
          {submitStatus === 'loading' ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {submitStatus === 'success' && (
        <div className="mt-4 p-3 bg-[#F6E9EB] text-[#3E0C1B] rounded-md text-center">
          Thank you for joining! We will get back to you soon.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="mt-4 p-3 bg-[#FC9CA4] text-[#3E0C1B] rounded-md text-center">
          {submitError || 'Failed to submit. Please try again.'}
        </div>
      )}
    </div>
  );
}
