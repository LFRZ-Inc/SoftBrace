import React from 'react';
import { Helmet } from 'react-helmet';

function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SoftBrace",
    "url": "https://softbracestrips.com",
    "logo": "https://softbracestrips.com/images/softbrace-logos.jpg.png",
    "description": "SoftBrace is the #1 brand for brace comfort, offering gum protection strips that provide superior relief from orthodontic discomfort.",
    "sameAs": [
      "https://facebook.com/softbrace",
      "https://instagram.com/softbrace"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "coolipod0@gmail.com",
      "telephone": "+1-956-999-2944"
      // Future: "email": "support@SoftBraceStrips.com"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export default WebsiteSchema; 