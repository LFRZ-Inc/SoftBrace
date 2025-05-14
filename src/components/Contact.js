import React, { useState } from 'react';
import './Contact.css';
import useTranslation from '../hooks/useTranslation';

function Contact() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission will be implemented later
    alert('Contact form functionality coming soon!');
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

          <button type="submit" className="submit-button">
            {t('contact.form.submit')}
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