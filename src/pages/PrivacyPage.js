import React from 'react';

function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-4xl mx-auto">
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">1. Information We Collect</h2>
        <p>
          We collect personal information that you provide to us, such as your name, email address, shipping address, and payment information when you place an order. We also collect certain information automatically when you visit our website, including your IP address, browser type, and how you interact with our website.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">2. How We Use Your Information</h2>
        <p>
          We use your information to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Process and fulfill your orders</li>
          <li>Provide customer service and respond to inquiries</li>
          <li>Improve our products and services</li>
          <li>Send you order confirmations and updates</li>
          <li>Communicate with you about products, services, and promotions (if you've opted in)</li>
          <li>Prevent fraud and enhance the security of our website</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-3">3. Information Sharing</h2>
        <p>
          We do not sell or rent your personal information to third parties. We may share your information with:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Service providers who assist us in operating our website and conducting our business (e.g., payment processors, shipping carriers)</li>
          <li>Legal authorities when required by law</li>
          <li>Affiliated businesses that provide services to us</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-3">4. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to enhance your experience on our website, analyze website traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">6. Your Rights</h2>
        <p>
          Depending on your location, you may have rights regarding your personal information, such as the right to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Delete your personal information</li>
          <li>Object to or restrict certain processing</li>
          <li>Data portability</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-3">7. Children's Privacy</h2>
        <p>
          Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">8. Changes to Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@softbracestrips.com.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage; 