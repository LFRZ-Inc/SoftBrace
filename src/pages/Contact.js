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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    // Show success message (in a real app)
    alert('Thank you for your message. We will respond shortly!');
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
              <p>info@softbracestrips.com</p>
              <p>support@softbracestrips.com</p>
            </div>
            <div className="info-item">
              <h3>Call Us</h3>
              <p>(555) 123-4567</p>
              <p>Monday-Friday: 9am-5pm EST</p>
            </div>
            <div className="info-item">
              <h3>Visit Us</h3>
              <p>123 Support Street</p>
              <p>Health City, FL 12345</p>
              <p>United States</p>
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
              <button type="submit" className="btn">Send Message</button>
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