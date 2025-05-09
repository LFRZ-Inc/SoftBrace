import React from 'react';
import { Helmet } from 'react-helmet';

function ProductSchema({ product }) {
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": window.location.origin + product.image,
    "description": product.longDescription || product.description,
    "brand": {
      "@type": "Brand",
      "name": "SoftBrace"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "SoftBrace LLC"
      }
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

export default ProductSchema; 