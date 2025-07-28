import React from 'react';

function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-4xl mx-auto">
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">1. Introduction</h2>
        <p>
          Welcome to SoftBrace Strips. These Terms of Service ("Terms") govern your use of the SoftBrace Strips website and services, including the purchase of products offered by SoftBrace.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">2. Acceptance of Terms</h2>
        <p>
          By accessing our website and services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our website or services.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">3. Product Information</h2>
        <p>
          We strive to provide accurate product information, including descriptions, images, and pricing. We reserve the right to modify product information without notice.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">4. Ordering and Payment</h2>
        <p>
          All orders are subject to acceptance and availability. We reserve the right to refuse any order. Payment must be made at the time of ordering.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">5. Shipping and Delivery</h2>
        <p>
          <strong>Shipping Rates:</strong>
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Orders under $5.99: $2.00 standard shipping fee</li>
          <li>Orders of $5.99 or more: Free standard shipping</li>
          <li>Laredo, TX area: Free local delivery (1-2 business days)</li>
        </ul>
        
        <p>
          <strong>Delivery and Verification:</strong>
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Delivery times are estimates and not guaranteed</li>
          <li>All orders are subject to verification and approval before shipping</li>
          <li>We reserve the right to cancel orders that cannot be verified or fulfilled</li>
          <li>Customers will be notified of any shipping delays or issues</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-3">6. Charitable Giving Program - St. Jude Children's Research Hospital</h2>
        <p>
          <strong>Donation Commitment:</strong> SoftBrace is committed to supporting St. Jude Children's Research Hospital. With every product purchase, we donate $0.10 to St. Jude Children's Research Hospital.
        </p>
        <p>
          <strong>Fund Management and Transparency:</strong>
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Donation funds are accumulated and held by SoftBrace throughout each calendar month</li>
          <li>All accumulated charitable funds are donated to St. Jude Children's Research Hospital at the end of each month</li>
          <li>SoftBrace does not retain any portion of the designated charitable funds for company use</li>
          <li>Donation receipts and transparency documentation will be made available to customers (feature coming soon)</li>
          <li>Total monthly donations will be calculated based on verified, completed orders only</li>
        </ul>
        <p>
          <strong>Disclaimer:</strong> SoftBrace's charitable giving program is independent of St. Jude Children's Research Hospital. St. Jude does not endorse SoftBrace products. This donation commitment may be modified or discontinued at SoftBrace's discretion with advance notice to customers.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">7. Returns and Refunds</h2>
        <p>
          If you are not satisfied with your purchase, please contact our customer service within 30 days of receiving your order. Certain conditions apply to returns and refunds.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">8. Intellectual Property</h2>
        <p>
          All content on the SoftBrace Strips website, including text, graphics, logos, and images, is the property of SoftBrace and is protected by intellectual property laws.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">9. Limitation of Liability</h2>
        <p>
          SoftBrace shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Your continued use of our website and services after such changes constitutes your acceptance of the new Terms.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at support@softbracestrips.com or call (956) 999-2944.
          {/* Future: support@SoftBraceStrips.com */}
        </p>
      </div>
    </div>
  );
}

export default TermsPage; 