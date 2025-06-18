import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // For now, simulate sending the email by logging the data
      console.log('Form submitted:', formData);
      
      // Create a mailto link as a fallback solution
      const subject = encodeURIComponent(`Contact Form: ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `Sent from SoftBraceStrips.com contact form`
      );
      
      // Open default email client
      window.location.href = `mailto:support@softbracestrips.com?subject=${subject}&body=${body}`;
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="subtitle">
            We'd love to hear from you! Reach out with any questions or feedback.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <h3>Email Us</h3>
              <p>support@softbracestrips.com</p>
              {/* Future: <p>support@SoftBraceStrips.com</p> */}
            </div>
            <div className="info-item">
              <h3>Call Us</h3>
              <p>(956) 999-2944</p>
              <p>Monday-Friday: 9am-5pm CST</p>
              {/* Personal line (956) 482-3122 is for family/friends only */}
            </div>
            <div className="info-item">
              <h3>Contact Info</h3>
              <p>Email: support@softbracestrips.com</p>
              <p>Phone: (956) 999-2944</p>
              <p>Based in Laredo, TX</p>
            </div>
            <div className="info-item">
              <h3>Connect With Us</h3>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              {submitStatus === 'success' && (
                <div className="success-message" style={{
                  background: '#d4edda',
                  color: '#155724',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  border: '1px solid #c3e6cb'
                }}>
                  ✅ Thank you for your message! Your default email client should open to send the message to support@softbracestrips.com.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="error-message" style={{
                  background: '#f8d7da',
                  color: '#721c24',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  border: '1px solid #f5c6cb'
                }}>
                  ❌ There was an error submitting your message. Please try again or email us directly at support@softbracestrips.com.
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
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
                <label htmlFor="email">Email</label>
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
                <label htmlFor="phone">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="map-container">
          <h2>Find Us</h2>
          {/* Placeholder for map */}
          <div className="map-placeholder">
            <p>Map Placeholder - Would integrate Google Maps API here</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I apply SoftBrace Strips?</h3>
              <p>Clean and dry the area, remove the backing, and apply directly to skin. Detailed instructions are included with each purchase.</p>
            </div>
            <div className="faq-item">
              <h3>How long do the strips last?</h3>
              <p>Depending on activity level and care, SoftBrace Strips typically last for 3-5 days before needing replacement.</p>
            </div>
            <div className="faq-item">
              <h3>Are SoftBrace Strips waterproof?</h3>
              <p>Our strips are water-resistant and can be worn during showers and light water activities, but prolonged submersion may affect adhesion.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer international shipping?</h3>
              <p>Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 