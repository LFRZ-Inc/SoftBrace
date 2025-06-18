import React, { useState } from 'react';
import './Contact.css';
import useTranslation from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { submitSupportMessage } from '../lib/supabase';

function Contact() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitSupportMessage({
        user_id: user?.id || null,
        name: formData.name.trim(),
        email: formData.email.trim(),
        inquiry_type: formData.inquiryType,
        message: formData.message.trim()
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        inquiryType: 'general',
        message: ''
      });

      // Show success message for 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError('Failed to send message. Please try again or email us directly at support@softbracestrips.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <h2>{t('contact.title')}</h2>
        <p className="contact-intro">
          Questions, support requests, or wholesale inquiries? Reach out to us—we're here to help.
        </p>

        <div className="contact-info mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-blue-800 dark:text-blue-100">
            📧 You can also email us directly at: <strong>support@softbracestrips.com</strong>
          </p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg">
            <p className="font-medium">✓ Message sent successfully!</p>
            <p className="text-sm">Thanks for reaching out to SoftBrace! We'll get back to you as soon as possible.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('contact.form.name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('contact.form.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inquiryType">{t('contact.form.inquiryType')}</label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
            >
              <option value="general">General Inquiry</option>
              <option value="wholesale">Wholesale Information</option>
              <option value="support">Product Support</option>
              <option value="order">Order Status / Shipping</option>
              <option value="returns">Returns & Safety Concerns</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">{t('contact.form.message')}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : t('contact.form.submit')}
          </button>
        </form>

        <p className="contact-note">
          {t('contact.note')}
        </p>
      </div>
    </section>
  );
}

export default Contact; 