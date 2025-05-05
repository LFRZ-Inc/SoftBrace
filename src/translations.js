const translations = {
  en: {
    // Header
    nav: {
      home: 'Home',
      product: 'Product',
      usage: 'How to Use',
      contact: 'Contact',
      shop: 'Shop',
      cart: 'Cart'
    },
    
    // Hero
    hero: {
      title: 'SoftBrace',
      comingSoon: 'Coming Late May',
      tagline: 'The next-gen comfort solution for braces wearers',
      learnMore: 'Learn More'
    },
    
    // Product
    product: {
      title: 'Experience Next-Level Comfort',
      intro: 'SoftBrace strips provide a revolutionary solution for braces wearers, offering superior protection against irritation and discomfort with our innovative silicone barrier technology.',
      packOptions: {
        small: {
          title: '5-Pair Pack',
          quantity: '10 strips',
          price: '$3.99',
          description: 'Perfect starter pack for first-time users',
          longDescription: 'Our 5-pair pack is the perfect introduction to SoftBrace comfort. Each strip is made with medical-grade silicone, designed to create a protective barrier between your braces and the inside of your mouth, reducing irritation and discomfort.'
        },
        medium: {
          title: '15-Pair Pack',
          quantity: '30 strips',
          price: '$8.99',
          description: 'Most popular choice for regular users',
          longDescription: 'Our most popular option! The 15-pair pack gives you enough strips for over 2 weeks of continuous use. Perfect for regular wearers who want lasting comfort throughout their orthodontic treatment.'
        },
        large: {
          title: '31-Pair Pack',
          quantity: '62 strips',
          price: '$16.99',
          description: 'Best value for long-term comfort',
          longDescription: 'Maximum comfort at the best value. Our 31-pair pack contains over a month\'s supply of SoftBrace strips, ensuring you never have to experience bracket irritation again. Save more with our largest pack!'
        }
      },
      shopButton: 'Shop Coming Soon',
      quantity: 'Quantity',
      inStock: 'in stock',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      addedToCart: 'Added to cart!',
      features: {
        title: 'Features',
        feature1: 'Medical-grade silicone for safety and comfort',
        feature2: 'Transparent design is barely visible when worn',
        feature3: 'Easy to apply and remove without damaging braces'
      }
    },
    
    // Usage
    usage: {
      title: 'How to Use SoftBrace',
      steps: {
        step1: {
          title: 'Preparation',
          description: '— Clean and dry your braces thoroughly —'
        },
        step2: {
          title: 'Application',
          description: '— Carefully place strip over brackets —'
        },
        step3: {
          title: 'Positioning',
          description: '— Ensure proper alignment and coverage —'
        },
        step4: {
          title: 'Duration',
          description: '— Replace as needed throughout the day —'
        }
      },
      note: '* Detailed instructions will be included with your order'
    },
    
    // Legal Notice
    legal: {
      title: 'Legal Notice',
      disclaimer: {
        title: 'Product Disclaimer',
        content: [
          'SoftBrace strips are intended for temporary use as a soft barrier between orthodontic braces and the inside of the mouth to help reduce gum and cheek irritation.',
          'This product is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or oral condition.',
          'Do not use SoftBrace if you have open wounds, active infections, or known silicone allergies. Discontinue use immediately if irritation occurs and consult your orthodontist or dentist.',
          'SoftBrace is designed for single-use only. Reuse may pose hygiene risks.',
          'Do not sleep with SoftBrace strips in your mouth.',
          'Patent Pending.'
        ],
        feedback: [
          'This is the first version of the SoftBrace product, and we are committed to improving comfort and performance.',
          'We welcome your feedback to help shape future versions and ensure the best experience possible.'
        ]
      },
      warning: {
        title: 'Usage Warning',
        content: [
          'For external oral use only.',
          'Do not swallow.',
          'Do not use on broken or bleeding gums.',
          'Do not wear while sleeping.',
          'SoftBrace is not a substitute for professional orthodontic or dental care.',
          'Keep out of reach of small children and pets.',
          'Use under adult supervision if under the age of 13.',
          'If irritation or discomfort occurs, discontinue use and consult a dental professional.',
          'SoftBrace LLC is not responsible for misuse or failure to follow instructions.',
          'Patent Pending.'
        ]
      }
    },
    
    // Contact
    contact: {
      title: 'Contact Us',
      intro: 'Have questions or interested in wholesale opportunities? We\'d love to hear from you.',
      form: {
        name: 'Name',
        email: 'Email',
        inquiryType: 'Inquiry Type',
        inquiryOptions: {
          general: 'General Inquiry',
          wholesale: 'Wholesale Information',
          support: 'Product Support'
        },
        message: 'Message',
        submit: 'Send Message'
      },
      note: '* Business email setup in progress. Form submissions will be enabled soon.'
    },
    
    // Footer
    footer: {
      links: {
        terms: 'Terms',
        privacy: 'Privacy',
        contact: 'Contact'
      },
      legal: 'SoftBrace LLC – Patent Pending – All Rights Reserved'
    },

    // Shop Page
    shop: {
      title: 'Shop SoftBrace',
      allCategories: 'All Products',
      smallPacks: 'Small Packs',
      mediumPacks: 'Medium Packs',
      largePacks: 'Large Packs',
      viewDetails: 'View Details',
      noProductsFound: 'No products found in this category.'
    },

    // Cart Page
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      emptyMessage: 'Looks like you haven\'t added any items to your cart yet.',
      continueShopping: 'Continue Shopping',
      items: 'Cart Items',
      remove: 'Remove',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      tax: 'Tax (8%)',
      total: 'Total',
      orderSummary: 'Order Summary',
      proceedToCheckout: 'Proceed to Checkout'
    },

    // Checkout Page
    checkout: {
      title: 'Checkout',
      shippingInfo: 'Shipping Information',
      paymentInfo: 'Payment Information',
      orderSummary: 'Order Summary',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      address: 'Street Address',
      city: 'City',
      state: 'State/Province',
      zipCode: 'ZIP/Postal Code',
      country: 'Country',
      selectCountry: 'Select a country',
      nameOnCard: 'Name on Card',
      cardDetails: 'Card Details',
      expMonth: 'Expiration Month',
      expYear: 'Expiration Year',
      month: 'Month',
      year: 'Year',
      cvv: 'CVV',
      requiredFields: 'Required fields',
      backToCart: 'Back to Cart',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      quantity: 'Quantity',
      paymentSuccess: 'Payment Successful!',
      paymentSuccessMessage: 'Thank you for your order. We\'ve received your payment and will process your order shortly.',
      paymentCancelled: 'Payment Cancelled',
      paymentCancelledMessage: 'Your payment process was cancelled. If you encountered any issues, please try again or contact us for assistance.',
      backToHome: 'Back to Home',
      stripeMessage: 'Your payment will be securely processed by Stripe. We do not store your payment details.',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      emailConfirmation: 'You will receive a confirmation email with your order details shortly.',
      needHelp: 'Need help with your order?',
      orderDetails: 'Order Details',
      loadingOrderDetails: 'Loading order details...',
      items: 'Items',
      orderError: 'Error Loading Order',
      continueShopping: 'Continue Shopping',
      errors: {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        invalidCardNumber: 'Please enter a valid 16-digit card number',
        invalidCvv: 'Please enter a valid CVV (3-4 digits)',
        emptyCart: 'Your cart is empty. Please add items before checkout.',
        paymentFailed: 'Payment failed. Please try again or use a different payment method.'
      },
      shippingAndTaxCalculated: 'Shipping and taxes will be calculated at the next step'
    },

    // 404 Not Found Page
    notFound: {
      title: 'Page Not Found',
      message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      backToHome: 'Back to Home'
    },

    // Common words/phrases
    common: {
      loading: 'Loading...',
      productNotFound: 'Product Not Found',
      productNotFoundMessage: 'Sorry, we couldn\'t find the product you were looking for.',
      backToShop: 'Back to Shop'
    }
  },
  
  // Spanish translations
  es: {
    // Header
    nav: {
      home: 'Inicio',
      product: 'Producto',
      usage: 'Cómo Usar',
      contact: 'Contacto',
      shop: 'Tienda',
      cart: 'Carrito'
    },
    
    // Hero
    hero: {
      title: 'SoftBrace',
      comingSoon: 'Próximamente a fines de mayo',
      tagline: 'La solución de confort de nueva generación para usuarios de brackets',
      learnMore: 'Saber Más'
    },
    
    // Product
    product: {
      title: 'Experimenta un Confort de Nivel Superior',
      intro: 'Las tiras SoftBrace proporcionan una solución revolucionaria para quienes usan brackets, ofreciendo protección superior contra la irritación y molestias con nuestra innovadora tecnología de barrera de silicona.',
      packOptions: {
        small: {
          title: 'Paquete de 5 pares',
          quantity: '10 tiras',
          price: '$3.99',
          description: 'Paquete ideal para usuarios por primera vez',
          longDescription: 'Nuestro paquete de 5 pares es la introducción perfecta a la comodidad de SoftBrace. Cada tira está hecha con silicona de grado médico, diseñada para crear una barrera protectora entre tus brackets y el interior de tu boca, reduciendo la irritación y las molestias.'
        },
        medium: {
          title: 'Paquete de 15 pares',
          quantity: '30 tiras',
          price: '$8.99',
          description: 'Opción más popular para usuarios regulares',
          longDescription: '¡Nuestra opción más popular! El paquete de 15 pares te da suficientes tiras para más de 2 semanas de uso continuo. Perfecto para usuarios regulares que desean comodidad duradera durante su tratamiento de ortodoncia.'
        },
        large: {
          title: 'Paquete de 31 pares',
          quantity: '62 tiras',
          price: '$16.99',
          description: 'Mejor valor para comodidad a largo plazo',
          longDescription: 'Máxima comodidad al mejor valor. Nuestro paquete de 31 pares contiene más de un mes de suministro de tiras SoftBrace, asegurando que nunca tengas que experimentar irritación por brackets nuevamente. ¡Ahorra más con nuestro paquete más grande!'
        }
      },
      shopButton: 'Tienda Próximamente',
      quantity: 'Cantidad',
      inStock: 'en stock',
      addToCart: 'Añadir al Carrito',
      buyNow: 'Comprar Ahora',
      addedToCart: '¡Añadido al carrito!',
      features: {
        title: 'Características',
        feature1: 'Silicona de grado médico para seguridad y comodidad',
        feature2: 'Diseño transparente apenas visible cuando se usa',
        feature3: 'Fácil de aplicar y quitar sin dañar los brackets'
      }
    },
    
    // Usage
    usage: {
      title: 'Cómo Usar SoftBrace',
      steps: {
        step1: {
          title: 'Preparación',
          description: '— Limpia y seca tus brackets completamente —'
        },
        step2: {
          title: 'Aplicación',
          description: '— Coloca la tira cuidadosamente sobre los brackets —'
        },
        step3: {
          title: 'Posicionamiento',
          description: '— Asegura un alineamiento y cobertura adecuados —'
        },
        step4: {
          title: 'Duración',
          description: '— Reemplaza según sea necesario durante el día —'
        }
      },
      note: '* Instrucciones detalladas se incluirán con tu pedido'
    },
    
    // Legal Notice
    legal: {
      title: 'Aviso Legal',
      disclaimer: {
        title: 'Descargo de Responsabilidad del Producto',
        content: [
          'Las tiras SoftBrace están destinadas para uso temporal como barrera suave entre los brackets ortodónticos y el interior de la boca para ayudar a reducir la irritación de encías y mejillas.',
          'Este producto no es un dispositivo médico y no está destinado a diagnosticar, tratar, curar o prevenir ninguna enfermedad o condición oral.',
          'No use SoftBrace si tiene heridas abiertas, infecciones activas o alergias conocidas a la silicona. Suspenda el uso inmediatamente si se produce irritación y consulte a su ortodoncista o dentista.',
          'SoftBrace está diseñado para un solo uso. La reutilización puede suponer riesgos de higiene.',
          'No duerma con tiras SoftBrace en la boca.',
          'Patente en trámite.'
        ],
        feedback: [
          'Esta es la primera versión del producto SoftBrace, y estamos comprometidos a mejorar la comodidad y el rendimiento.',
          'Agradecemos sus comentarios para ayudar a dar forma a futuras versiones y garantizar la mejor experiencia posible.'
        ]
      },
      warning: {
        title: 'Advertencia de Uso',
        content: [
          'Solo para uso oral externo.',
          'No ingerir.',
          'No usar en encías rotas o sangrantes.',
          'No usar mientras duerme.',
          'SoftBrace no es un sustituto de la atención ortodóntica o dental profesional.',
          'Mantener fuera del alcance de niños pequeños y mascotas.',
          'Usar bajo supervisión de un adulto si es menor de 13 años.',
          'Si se produce irritación o molestia, suspenda el uso y consulte a un profesional dental.',
          'SoftBrace LLC no se hace responsable del mal uso o incumplimiento de las instrucciones.',
          'Patente en trámite.'
        ]
      }
    },
    
    // Contact
    contact: {
      title: 'Contáctenos',
      intro: '¿Tiene preguntas o está interesado en oportunidades de venta al por mayor? Nos encantaría saber de usted.',
      form: {
        name: 'Nombre',
        email: 'Correo Electrónico',
        inquiryType: 'Tipo de Consulta',
        inquiryOptions: {
          general: 'Consulta General',
          wholesale: 'Información de Venta al por Mayor',
          support: 'Soporte de Producto'
        },
        message: 'Mensaje',
        submit: 'Enviar Mensaje'
      },
      note: '* Configuración de correo electrónico de negocios en progreso. El envío de formularios se habilitará pronto.'
    },
    
    // Footer
    footer: {
      links: {
        terms: 'Términos',
        privacy: 'Privacidad',
        contact: 'Contacto'
      },
      legal: 'SoftBrace LLC – Patente en Trámite – Todos los Derechos Reservados'
    },

    // Shop Page
    shop: {
      title: 'Tienda SoftBrace',
      allCategories: 'Todos los Productos',
      smallPacks: 'Paquetes Pequeños',
      mediumPacks: 'Paquetes Medianos',
      largePacks: 'Paquetes Grandes',
      viewDetails: 'Ver Detalles',
      noProductsFound: 'No se encontraron productos en esta categoría.'
    },

    // Cart Page
    cart: {
      title: 'Tu Carrito',
      empty: 'Tu carrito está vacío',
      emptyMessage: 'Parece que aún no has añadido ningún artículo a tu carrito.',
      continueShopping: 'Continuar Comprando',
      items: 'Artículos del Carrito',
      remove: 'Eliminar',
      quantity: 'Cantidad',
      subtotal: 'Subtotal',
      tax: 'Impuesto (8%)',
      total: 'Total',
      orderSummary: 'Resumen del Pedido',
      proceedToCheckout: 'Proceder al Pago'
    },

    // Checkout Page
    checkout: {
      title: 'Pago',
      shippingInfo: 'Información de Envío',
      paymentInfo: 'Información de Pago',
      orderSummary: 'Resumen del Pedido',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electrónico',
      address: 'Dirección',
      city: 'Ciudad',
      state: 'Estado/Provincia',
      zipCode: 'Código Postal',
      country: 'País',
      selectCountry: 'Selecciona un país',
      nameOnCard: 'Nombre en la Tarjeta',
      cardDetails: 'Detalles de la Tarjeta',
      expMonth: 'Mes de Expiración',
      expYear: 'Año de Expiración',
      month: 'Mes',
      year: 'Año',
      cvv: 'CVV',
      requiredFields: 'Campos obligatorios',
      backToCart: 'Volver al Carrito',
      placeOrder: 'Realizar Pedido',
      processing: 'Procesando...',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      tax: 'Impuestos',
      total: 'Total',
      quantity: 'Cantidad',
      paymentSuccess: '¡Pago Exitoso!',
      paymentSuccessMessage: 'Gracias por tu pedido. Hemos recibido tu pago y procesaremos tu pedido pronto.',
      paymentCancelled: 'Pago Cancelado',
      paymentCancelledMessage: 'El proceso de pago fue cancelado. Si encontraste algún problema, por favor intenta de nuevo o contáctanos para obtener ayuda.',
      backToHome: 'Volver al Inicio',
      stripeMessage: 'Tu pago será procesado de forma segura por Stripe. No almacenamos tus datos de pago.',
      orderNumber: 'Número de Pedido',
      orderDate: 'Fecha del Pedido',
      emailConfirmation: 'Recibirás un correo electrónico de confirmación con los detalles de tu pedido en breve.',
      needHelp: '¿Necesitas ayuda con tu pedido?',
      orderDetails: 'Detalles del Pedido',
      loadingOrderDetails: 'Cargando detalles del pedido...',
      items: 'Artículos',
      orderError: 'Error al Cargar el Pedido',
      continueShopping: 'Continuar Comprando',
      errors: {
        required: 'Este campo es obligatorio',
        invalidEmail: 'Por favor, introduce un correo electrónico válido',
        invalidCardNumber: 'Por favor, introduce un número de tarjeta válido de 16 dígitos',
        invalidCvv: 'Por favor, introduce un CVV válido (3-4 dígitos)',
        emptyCart: 'Tu carrito está vacío. Por favor, añade artículos antes de proceder al pago.',
        paymentFailed: 'El pago falló. Por favor, intenta de nuevo o utiliza otro método de pago.'
      },
      shippingAndTaxCalculated: 'El envío e impuestos se calcularán en el siguiente paso'
    },

    // 404 Not Found Page
    notFound: {
      title: 'Página No Encontrada',
      message: 'La página que estás buscando puede haber sido eliminada, su nombre ha cambiado o no está disponible temporalmente.',
      backToHome: 'Volver al Inicio'
    },

    // Common words/phrases
    common: {
      loading: 'Cargando...',
      productNotFound: 'Producto No Encontrado',
      productNotFoundMessage: 'Lo sentimos, no pudimos encontrar el producto que estabas buscando.',
      backToShop: 'Volver a la Tienda'
    }
  }
};

export default translations; 