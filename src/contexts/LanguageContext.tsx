import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useTranslations, TranslationsMap, getTranslation } from '@/hooks/useTranslations';

type Language = 'es' | 'en';

interface Translations {
  // Navigation
  nav: {
    home: string;
    menu: string;
    about: string;
    contact: string;
    reserve: string;
    gift: string;
  };
  // Hero
  hero: {
    title: string;
    subtitle: string;
    location: string;
    description: string;
    ctaMenu: string;
    ctaReserve: string;
    ctaGift: string;
  };
  // Concept Section
  concept: {
    title: string;
    subtitle: string;
    description: string;
    cards: {
      menu: { title: string; description: string };
      drinks: { title: string; description: string };
      chefsTable: { title: string; description: string };
    };
  };
  // Reservation
  reservation: {
    title: string;
    subtitle: string;
    groupNote: string;
    whatsappCta: string;
  };
  // Reviews
  reviews: {
    title: string;
    subtitle: string;
    leaveReview: string;
    tripadvisorTitle: string;
    tripadvisorText: string;
  };
  // CTA
  cta: {
    title: string;
    subtitle: string;
    button: string;
    menuLink: string;
  };
  // Footer
  footer: {
    tagline: string;
    quickLinks: string;
    contact: string;
    hours: string;
    copyright: string;
  };
  // Hours
  hours: {
    monday: string;
    tuesdayWednesday: string;
    thursdaySaturday: string;
    sunday: string;
    closed: string;
    dinner: string;
    lunchDinner: string;
    lunch: string;
  };
  // About
  about: {
    heroTitle: string;
    heroSubtitle: string;
    storyTitle: string;
    storyText: string;
    chefTitle: string;
    chefBio: string;
    achievements: string;
    achievement1: string;
    achievement2: string;
    achievement3: string;
    teamTitle: string;
    teamSubtitle: string;
    teamDescription: string;
  };
  // Menu Page
  menuPage: {
    title: string;
    mainMenu: string;
    drinks: string;
    chefsTable: string;
    chefsTableNote: string;
    taxNote: string;
    // Chef's Table tab (editorial block)
    chefsTableTitle: string;
    chefsTableIntro: string;
    chefsTableQuote: string;
    chefsTableSchedule: string;
    chefsTablePrice: string;
    chefsTableWinePairing: string;
    chefsTableReservationNote: string;
    chefsTableInfoLabel: string;
    chefsTableInfoSuffix: string;
  };
  // Contact
  contactPage: {
    title: string;
    address: string;
    addressLine2: string;
    phone: string;
    email: string;
    getDirections: string;
    hoursTitle: string;
  };
  // Events
  events: {
    title: string;
  };
  // Gift page (Regala Amana)
  gift: {
    title: string;
    subtitle: string;
    heroNote: string;
    steps: {
      title: string;
      step1Title: string;
      step1Text: string;
      step2Title: string;
      step2Text: string;
      step3Title: string;
      step3Text: string;
    };
    chefsTable: {
      eyebrow: string;
      badge: string;
      title: string;
      description: string;
      perPerson: string;
      quantityLabel: string;
      pairingLabel: string;
      pairingHelp: string;
      noPairing: string;
      pairingError: string;
    };
    cards: {
      eyebrow: string;
      cardLabel: string;
      cardFooter: string;
      title: string;
      subtitle: string;
      quantityLabel: string;
      amountLabel: string;
      otherAmount: string;
      otherAmountPlaceholder: string;
      minAmount: string;
    };
    common: {
      total: string;
      order: string;
      summary: string;
      guests: string;
      pairings: string;
      cardsOf: string;
    };
    form: {
      title: string;
      firstName: string;
      lastName: string;
      email: string;
      paymentMethod: string;
      paymentPlaceholder: string;
      paymentLink: string;
      paypal: string;
      sinpe: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      note: string;
      successTitle: string;
      successText: string;
      newOrder: string;
      errorRequired: string;
      errorEmail: string;
      errorMinAmount: string;
      errorRateLimited: string;
      errorGeneric: string;
    };
  };
}

// Fallback translations (used while loading from DB)
const fallbackTranslations: Record<Language, Translations> = {
  es: {
    nav: {
      home: 'Inicio',
      menu: 'Menú',
      about: 'Nosotros',
      contact: 'Contacto',
      reserve: 'Reservar',
      gift: 'Regala',
    },
    hero: {
      title: 'Cocina Honesta',
      subtitle: 'Fine-Casual Costarricense',
      location: 'Barrio Escalante, San José',
      description: 'Ingredientes frescos, técnicas modernas y una experiencia fine-casual para disfrutar con calma.',
      ctaMenu: 'Nuestro Menú',
      ctaReserve: 'Reservar Ahora',
      ctaGift: 'Regala Amana',
    },
    concept: {
      title: 'Cocina con Intención',
      subtitle: 'Ubicado en el corazón de Barrio Escalante',
      description: 'Un concepto culinario moderno que busca combinar ingredientes locales con técnicas y preparaciones de alrededor del mundo.\nUna atmósfera casual y acogedora; combinada con platos creativos, atención al detalle y servicio excepcional.',
      cards: {
        menu: { title: 'Menú Principal', description: 'Ingredientes frescos. Técnicas modernas.' },
        drinks: { title: 'Vinos y Cócteles', description: 'Selección de vinos y cócteles insignia.' },
        chefsTable: { title: "Chef's Table", description: 'Menú de 7 tiempos, 3 mesas por noche.' },
      },
    },
    reservation: {
      title: 'Reserva tu Mesa',
      subtitle: 'Asegura tu experiencia en Amana',
      groupNote: 'Para grupos de 14 o más personas, contáctanos directamente.',
      whatsappCta: 'Escribir por WhatsApp',
    },
    reviews: {
      title: 'Palabras de Nuestros Comensales',
      subtitle: 'Lo que dicen quienes nos han visitado',
      leaveReview: 'Dejar una Reseña',
      tripadvisorTitle: 'Travelers’ Choice 2026',
      tripadvisorText: 'Reconocidos por Tripadvisor entre los restaurantes favoritos de los viajeros.',
    },
    cta: {
      title: '¿Listo para una experiencia única?',
      subtitle: 'Reserva tu mesa y déjate sorprender',
      button: 'Reservar Ahora',
      menuLink: 'Ver nuestro menú',
    },
    footer: {
      tagline: 'Cocina honesta',
      quickLinks: 'Enlaces',
      contact: 'Contacto',
      hours: 'Horario',
      copyright: '© 2026 Amana. Una marca de Gastronomía GCK S.A.',
    },
    hours: {
      monday: 'Lunes',
      tuesdayWednesday: 'Martes - Miércoles',
      thursdaySaturday: 'Jueves - Sábado',
      sunday: 'Domingo',
      closed: 'Cerrado',
      dinner: 'Cena 6-10 PM',
      lunchDinner: 'Almuerzo 12-4 PM\nCena 6-10 PM',
      lunch: 'Almuerzo 12-4 PM',
    },
    about: {
      heroTitle: 'Cocina Honesta',
      heroSubtitle: 'Nuestra historia, nuestra pasión',
      storyTitle: 'Un Poco Sobre Nosotros',
      storyText: 'Somos un restaurante cuyo eje está en la cocina. Ingredientes de calidad, tratados con respeto. Preparación cuidadosa. Platos con balance en sus texturas, sabores y presentación. Un menú pequeño, pero dinámico, en constante cambio y evolución.\n\nTodo esto apoyado por coctelería y vinos a la altura del producto, con intención, con buen trato. En un ambiente casual y acogedor, con un servicio amable y atento.\n\nAmana es Fine-Casual. Atención al detalle, sin pretensiones.',
      chefTitle: 'Chef Kenneth',
      chefBio: 'Nacido en 1996 en San José, Kenneth es un chef joven con una trayectoria ya consolidada. A lo largo de su carrera ha pasado por algunas de las cocinas más reconocidas del país y ha colaborado con chefs destacados de Costa Rica y del resto del continente.\n\n\nSu trabajo parte de una curiosidad constante por aprender, estudiar y experimentar con técnicas y tendencias globales, sumadas a un aprecio y respeto por la calidad y frescura de ingredientes, sabores y producto local de Costa Rica y Latinoamérica.',
      achievements: 'Logros Destacados',
      achievement1: '2024: Finalista San Pellegrino Young Chef Award (Latinoamérica y Caribe)',
      achievement2: '2023: Cofundador de Amana',
      achievement3: '2019: Ganador Jeunes Chefs Rôtisseurs Costa Rica, reconocimiento al mejor chef joven de Costa Rica por la Chaîne des Rôtisseurs',
      teamTitle: 'Nuestro Equipo',
      teamSubtitle: 'La familia Amana',
      teamDescription: 'Detrás de cada plato hay un equipo apasionado y dedicado. Juntos creamos experiencias memorables para nuestros comensales.',
    },
    menuPage: {
      title: 'Nuestro Menú',
      mainMenu: 'Menú Principal',
      drinks: 'Vinos y Cócteles',
      chefsTable: "Chef's Table",
      chefsTableNote: 'Menú de 7 tiempos • Martes a Sábado, cena • 3 mesas por noche',
      taxNote: 'impuestos incluidos',
      chefsTableTitle: "chef's table - menú de 7 tiempos",
      chefsTableIntro: 'Servido frente a nuestra cocina abierta, llevado a su mesa por nuestros cocineros.',
      chefsTableQuote: 'Lo cotidiano con otros ojos.',
      chefsTableSchedule: 'De martes a sábado, para la cena - 3 mesas por noche.',
      chefsTablePrice: '₡44.000 por persona',
      chefsTableWinePairing: 'Maridaje de vinos (opcional): ₡16.000 por persona.',
      chefsTableReservationNote: 'Recomendado reservar y comunicar restricciones alimentarias o alergias con al menos 12 h de anticipación.',
      chefsTableInfoLabel: 'Información adicional:',
      chefsTableInfoSuffix: '(WhatsApp).',
    },
    contactPage: {
      title: 'Visítanos',
      address: '125m oeste del Fresh Market, Barrio Escalante',
      addressLine2: 'Barrio Escalante, San José, Costa Rica',
      phone: '+506 6143-6871',
      email: 'info@amanacr.com',
      getDirections: 'Obtener direcciones',
      hoursTitle: 'Horario de Atención',
    },
    events: {
      title: 'Próximos Eventos',
    },
    gift: {
      title: 'Regala Amana',
      subtitle: 'Una experiencia para compartir',
      heroNote: 'Regala una noche frente a nuestra cocina abierta o una tarjeta para usar en todo Amana.',
      steps: {
        title: 'Cómo funciona',
        step1Title: 'Elige',
        step1Text: 'Escoge la experiencia o el monto de la tarjeta.',
        step2Title: 'Confirma',
        step2Text: 'Déjanos tus datos y el método de pago que prefieras.',
        step3Title: 'Te contactamos',
        step3Text: 'Coordinamos el pago y la entrega en 24-48h.',
      },
      chefsTable: {
        eyebrow: 'La experiencia',
        badge: 'Menú de 7 tiempos',
        title: "Chef's Table",
        description: 'Nuestro menú de degustación de 7 tiempos — servido de martes a sábado por la noche, frente a nuestra cocina abierta. Reserva requerida con mínimo 12h de anticipación.',
        perPerson: 'por persona',
        quantityLabel: 'Cantidad (personas)',
        pairingLabel: 'Maridaje',
        pairingHelp: 'Selección de vinos de nuestra sommelier',
        noPairing: 'Sin maridaje',
        pairingError: 'El maridaje no puede superar la cantidad de personas',
      },
      cards: {
        eyebrow: 'Tarjetas de regalo',
        cardLabel: 'Tarjeta de regalo',
        cardFooter: 'Válida en todo Amana · Barrio Escalante',
        title: 'Otras tarjetas de regalo',
        subtitle: "Aplicables al menú principal, Chef's Table, eventos especiales y demás.",
        quantityLabel: 'Cantidad',
        amountLabel: 'Monto',
        otherAmount: 'Otro monto',
        otherAmountPlaceholder: 'Ej: 25000',
        minAmount: 'Monto mínimo: {min}',
      },
      common: {
        total: 'Total',
        order: 'Ordenar',
        summary: 'Resumen del pedido',
        guests: 'personas',
        pairings: 'maridajes',
        cardsOf: 'tarjeta(s) de',
      },
      form: {
        title: 'Datos del pedido',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo electrónico',
        paymentMethod: 'Método de pago',
        paymentPlaceholder: 'Seleccione una opción',
        paymentLink: 'Link de pago',
        paypal: 'PayPal',
        sinpe: 'SINPE Móvil',
        message: '¿Quisiera incluir algún mensaje?',
        messagePlaceholder: 'Dedicatoria o comentario (opcional)',
        submit: 'Confirmar orden',
        submitting: 'Enviando...',
        note: 'Nuestro equipo le estará contactando para realizar y confirmar el pago en un periodo de 24-48h.',
        successTitle: '¡Gracias por su pedido!',
        successText: 'Hemos recibido su solicitud. Le contactaremos por correo en un plazo de 24-48h para coordinar el pago.',
        newOrder: 'Hacer otro pedido',
        errorRequired: 'Este campo es requerido',
        errorEmail: 'Ingrese un correo válido',
        errorMinAmount: 'El monto es menor al mínimo permitido',
        errorRateLimited: 'Ha enviado demasiados pedidos. Intente más tarde.',
        errorGeneric: 'No se pudo enviar el pedido. Intente de nuevo.',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      about: 'About',
      contact: 'Contact',
      reserve: 'Reserve',
      gift: 'Gift',
    },
    hero: {
      title: 'Honest Cooking',
      subtitle: 'Costa Rican Fine-Casual',
      location: 'Barrio Escalante, San José',
      description: 'Fresh ingredients, modern techniques, and a fine-casual experience to enjoy at your own pace.',
      ctaMenu: 'Our Menu',
      ctaReserve: 'Reserve Now',
      ctaGift: 'Gift Amana',
    },
    concept: {
      title: 'Cooking with Intention',
      subtitle: 'Located in the heart of Barrio Escalante',
      description: 'A modern culinary concept that combines local ingredients with techniques and preparations from around the world.\nA casual and welcoming atmosphere; paired with creative dishes, attention to detail, and exceptional service.',
      cards: {
        menu: { title: 'Main Menu', description: 'Fresh ingredients. Modern techniques.' },
        drinks: { title: 'Wine & Cocktails', description: 'Curated wines and signature cocktails.' },
        chefsTable: { title: "Chef's Table", description: '7-course menu, 3 tables per night.' },
      },
    },
    reservation: {
      title: 'Reserve Your Table',
      subtitle: 'Secure your Amana experience',
      groupNote: 'For groups of 14 or more, contact us directly.',
      whatsappCta: 'Message on WhatsApp',
    },
    reviews: {
      title: 'Words from Our Guests',
      subtitle: 'What our visitors have to say',
      leaveReview: 'Leave a Review',
      tripadvisorTitle: 'Travelers’ Choice 2026',
      tripadvisorText: 'Recognized by Tripadvisor among travelers’ favorite restaurants.',
    },
    cta: {
      title: 'Ready for a unique experience?',
      subtitle: 'Reserve your table and let yourself be surprised',
      button: 'Reserve Now',
      menuLink: 'View our menu',
    },
    footer: {
      tagline: 'Honest cooking',
      quickLinks: 'Links',
      contact: 'Contact',
      hours: 'Hours',
      copyright: '© 2026 Amana. A brand of Gastronomía GCK S.A.',
    },
    hours: {
      monday: 'Monday',
      tuesdayWednesday: 'Tuesday - Wednesday',
      thursdaySaturday: 'Thursday - Saturday',
      sunday: 'Sunday',
      closed: 'Closed',
      dinner: 'Dinner 6-10 PM',
      lunchDinner: 'Lunch 12-4 PM\nDinner 6-10 PM',
      lunch: 'Lunch 12-4 PM',
    },
    about: {
      heroTitle: 'Honest Cooking',
      heroSubtitle: 'Our story, our passion',
      storyTitle: 'A Bit About Us',
      storyText: 'We are a restaurant whose core is in the kitchen. Quality ingredients, treated with respect. Careful preparation. Dishes with balance in their textures, flavors and presentation. A small but dynamic menu, constantly changing and evolving.\n\nAll of this supported by cocktails and wines that match the product, with intention, with good care. In a casual and welcoming atmosphere, with friendly and attentive service.\n\nAmana is Fine-Casual. Attention to detail, without pretension.',
      chefTitle: 'Chef Kenneth',
      chefBio: 'Born in 1996 in San José, Kenneth is a young chef with an already established career. Throughout his journey, he has worked in some of the most renowned kitchens in the country and collaborated with distinguished chefs from Costa Rica and across the continent.\n\n\nHis work stems from a constant curiosity to learn, study, and experiment with global techniques and trends, combined with an appreciation and respect for the quality and freshness of local ingredients, flavors, and products from Costa Rica and Latin America.',
      achievements: 'Notable Achievements',
      achievement1: '2024: Finalist San Pellegrino Young Chef Award (Latin America & Caribbean)',
      achievement2: '2023: Co-founder of Amana',
      achievement3: '2019: Winner Jeunes Chefs Rôtisseurs Costa Rica, recognition as the best young chef in Costa Rica by the Chaîne des Rôtisseurs',
      teamTitle: 'Our Team',
      teamSubtitle: 'The Amana family',
      teamDescription: 'Behind every dish is a passionate and dedicated team. Together we create memorable experiences for our guests.',
    },
    menuPage: {
      title: 'Our Menu',
      mainMenu: 'Main Menu',
      drinks: 'Wine & Cocktails',
      chefsTable: "Chef's Table",
      chefsTableNote: '7-course menu • Tuesday to Saturday, dinner • 3 tables per night',
      taxNote: 'taxes and fees included',
      chefsTableTitle: "chef's table - 7 course menu",
      chefsTableIntro: 'Served in front of our open kitchen, brought to your table by our chefs.',
      chefsTableQuote: 'The everyday through different eyes.',
      chefsTableSchedule: 'Tuesday to Saturday, for dinner - 3 tables per night.',
      chefsTablePrice: '₡44,000 per person',
      chefsTableWinePairing: 'Wine pairing (optional): ₡16,000 per person.',
      chefsTableReservationNote: 'We recommend reserving and communicating dietary restrictions or allergies at least 12 hours in advance.',
      chefsTableInfoLabel: 'Additional information:',
      chefsTableInfoSuffix: '(WhatsApp).',
    },
    contactPage: {
      title: 'Visit Us',
      address: '125m west of Fresh Market, Barrio Escalante',
      addressLine2: 'Barrio Escalante, San José, Costa Rica',
      phone: '+506 6143-6871',
      email: 'info@amanacr.com',
      getDirections: 'Get directions',
      hoursTitle: 'Opening Hours',
    },
    events: {
      title: 'Upcoming Events',
    },
    gift: {
      title: 'Amana as a Gift',
      subtitle: 'An experience to share',
      heroNote: 'Gift a night in front of our open kitchen, or a card to use anywhere at Amana.',
      steps: {
        title: 'How it works',
        step1Title: 'Choose',
        step1Text: 'Pick the experience or the gift card amount.',
        step2Title: 'Confirm',
        step2Text: 'Leave us your details and preferred payment method.',
        step3Title: 'We reach out',
        step3Text: 'We arrange payment and delivery within 24-48h.',
      },
      chefsTable: {
        eyebrow: 'The experience',
        badge: '7-course menu',
        title: "Chef's Table",
        description: 'Our 7-course tasting menu — served Tuesday to Saturday evenings, in front of our open kitchen. Reservation required at least 12h in advance.',
        perPerson: 'per person',
        quantityLabel: 'Quantity (guests)',
        pairingLabel: 'Wine pairing',
        pairingHelp: 'Wine selection by our sommelier',
        noPairing: 'No pairing',
        pairingError: 'Pairing cannot exceed the number of guests',
      },
      cards: {
        eyebrow: 'Gift cards',
        cardLabel: 'Gift card',
        cardFooter: 'Valid across Amana · Barrio Escalante',
        title: 'Other gift cards',
        subtitle: "Valid for the main menu, Chef's Table, special events and more.",
        quantityLabel: 'Quantity',
        amountLabel: 'Amount',
        otherAmount: 'Other amount',
        otherAmountPlaceholder: 'E.g. 25000',
        minAmount: 'Minimum amount: {min}',
      },
      common: {
        total: 'Total',
        order: 'Order',
        summary: 'Order summary',
        guests: 'guests',
        pairings: 'pairings',
        cardsOf: 'gift card(s) of',
      },
      form: {
        title: 'Your details',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        paymentMethod: 'Payment method',
        paymentPlaceholder: 'Select an option',
        paymentLink: 'Payment link',
        paypal: 'PayPal',
        sinpe: 'SINPE Móvil',
        message: 'Would you like to include a message?',
        messagePlaceholder: 'Dedication or comment (optional)',
        submit: 'Confirm order',
        submitting: 'Sending...',
        note: 'Our team will contact you to process and confirm payment within 24-48 hours.',
        successTitle: 'Thank you for your order!',
        successText: 'We have received your request. We will email you within 24-48 hours to arrange payment.',
        newOrder: 'Place another order',
        errorRequired: 'This field is required',
        errorEmail: 'Please enter a valid email',
        errorMinAmount: 'The amount is below the minimum',
        errorRateLimited: 'Too many orders sent. Please try again later.',
        errorGeneric: 'The order could not be sent. Please try again.',
      },
    },
  },
};

// Helper to build translations object from DB data
const buildTranslationsFromDB = (
  dbTranslations: TranslationsMap | undefined,
  language: Language,
  fallback: Translations
): Translations => {
  if (!dbTranslations) return fallback;

  const get = (section: string, key: string, fb: string) =>
    getTranslation(dbTranslations, section, key, language, fb);

  return {
    nav: {
      home: get('nav', 'home', fallback.nav.home),
      menu: get('nav', 'menu', fallback.nav.menu),
      about: get('nav', 'about', fallback.nav.about),
      contact: get('nav', 'contact', fallback.nav.contact),
      reserve: get('nav', 'reserve', fallback.nav.reserve),
      gift: get('nav', 'gift', fallback.nav.gift),
    },
    hero: {
      title: get('hero', 'title', fallback.hero.title),
      subtitle: get('hero', 'subtitle', fallback.hero.subtitle),
      location: get('hero', 'location', fallback.hero.location),
      description: get('hero', 'description', fallback.hero.description),
      ctaMenu: get('hero', 'ctaMenu', fallback.hero.ctaMenu),
      ctaReserve: get('hero', 'ctaReserve', fallback.hero.ctaReserve),
      ctaGift: get('hero', 'ctaGift', fallback.hero.ctaGift),
    },
    concept: {
      title: get('concept', 'title', fallback.concept.title),
      subtitle: get('concept', 'subtitle', fallback.concept.subtitle),
      description: get('concept', 'description', fallback.concept.description),
      cards: {
        menu: {
          title: get('concept', 'cards.menu.title', fallback.concept.cards.menu.title),
          description: get('concept', 'cards.menu.description', fallback.concept.cards.menu.description),
        },
        drinks: {
          title: get('concept', 'cards.drinks.title', fallback.concept.cards.drinks.title),
          description: get('concept', 'cards.drinks.description', fallback.concept.cards.drinks.description),
        },
        chefsTable: {
          title: get('concept', 'cards.chefsTable.title', fallback.concept.cards.chefsTable.title),
          description: get('concept', 'cards.chefsTable.description', fallback.concept.cards.chefsTable.description),
        },
      },
    },
    reservation: {
      title: get('reservation', 'title', fallback.reservation.title),
      subtitle: get('reservation', 'subtitle', fallback.reservation.subtitle),
      groupNote: get('reservation', 'groupNote', fallback.reservation.groupNote),
      whatsappCta: get('reservation', 'whatsappCta', fallback.reservation.whatsappCta),
    },
    reviews: {
      title: get('reviews', 'title', fallback.reviews.title),
      subtitle: get('reviews', 'subtitle', fallback.reviews.subtitle),
      leaveReview: get('reviews', 'leaveReview', fallback.reviews.leaveReview),
      tripadvisorTitle: get('reviews', 'tripadvisorTitle', fallback.reviews.tripadvisorTitle),
      tripadvisorText: get('reviews', 'tripadvisorText', fallback.reviews.tripadvisorText),
    },
    cta: {
      title: get('cta', 'title', fallback.cta.title),
      subtitle: get('cta', 'subtitle', fallback.cta.subtitle),
      button: get('cta', 'button', fallback.cta.button),
      menuLink: get('cta', 'menuLink', fallback.cta.menuLink),
    },
    footer: {
      tagline: get('footer', 'tagline', fallback.footer.tagline),
      quickLinks: get('footer', 'quickLinks', fallback.footer.quickLinks),
      contact: get('footer', 'contact', fallback.footer.contact),
      hours: get('footer', 'hours', fallback.footer.hours),
      copyright: get('footer', 'copyright', fallback.footer.copyright),
    },
    hours: {
      monday: get('hours', 'monday', fallback.hours.monday),
      tuesdayWednesday: get('hours', 'tuesdayWednesday', fallback.hours.tuesdayWednesday),
      thursdaySaturday: get('hours', 'thursdaySaturday', fallback.hours.thursdaySaturday),
      sunday: get('hours', 'sunday', fallback.hours.sunday),
      closed: get('hours', 'closed', fallback.hours.closed),
      dinner: get('hours', 'dinner', fallback.hours.dinner),
      lunchDinner: get('hours', 'lunchDinner', fallback.hours.lunchDinner),
      lunch: get('hours', 'lunch', fallback.hours.lunch),
    },
    about: {
      heroTitle: get('about', 'heroTitle', fallback.about.heroTitle),
      heroSubtitle: get('about', 'heroSubtitle', fallback.about.heroSubtitle),
      storyTitle: get('about', 'storyTitle', fallback.about.storyTitle),
      storyText: get('about', 'storyText', fallback.about.storyText),
      chefTitle: get('about', 'chefTitle', fallback.about.chefTitle),
      chefBio: get('about', 'chefBio', fallback.about.chefBio),
      achievements: get('about', 'achievements', fallback.about.achievements),
      achievement1: get('about', 'achievement1', fallback.about.achievement1),
      achievement2: get('about', 'achievement2', fallback.about.achievement2),
      achievement3: get('about', 'achievement3', fallback.about.achievement3),
      teamTitle: get('about', 'teamTitle', fallback.about.teamTitle),
      teamSubtitle: get('about', 'teamSubtitle', fallback.about.teamSubtitle),
      teamDescription: get('about', 'teamDescription', fallback.about.teamDescription),
    },
    menuPage: {
      title: get('menuPage', 'title', fallback.menuPage.title),
      mainMenu: get('menuPage', 'mainMenu', fallback.menuPage.mainMenu),
      drinks: get('menuPage', 'drinks', fallback.menuPage.drinks),
      chefsTable: get('menuPage', 'chefsTable', fallback.menuPage.chefsTable),
      chefsTableNote: get('menuPage', 'chefsTableNote', fallback.menuPage.chefsTableNote),
      taxNote: get('menuPage', 'taxNote', fallback.menuPage.taxNote),
      chefsTableTitle: get('menuPage', 'chefsTableTitle', fallback.menuPage.chefsTableTitle),
      chefsTableIntro: get('menuPage', 'chefsTableIntro', fallback.menuPage.chefsTableIntro),
      chefsTableQuote: get('menuPage', 'chefsTableQuote', fallback.menuPage.chefsTableQuote),
      chefsTableSchedule: get('menuPage', 'chefsTableSchedule', fallback.menuPage.chefsTableSchedule),
      chefsTablePrice: get('menuPage', 'chefsTablePrice', fallback.menuPage.chefsTablePrice),
      chefsTableWinePairing: get('menuPage', 'chefsTableWinePairing', fallback.menuPage.chefsTableWinePairing),
      chefsTableReservationNote: get('menuPage', 'chefsTableReservationNote', fallback.menuPage.chefsTableReservationNote),
      chefsTableInfoLabel: get('menuPage', 'chefsTableInfoLabel', fallback.menuPage.chefsTableInfoLabel),
      chefsTableInfoSuffix: get('menuPage', 'chefsTableInfoSuffix', fallback.menuPage.chefsTableInfoSuffix),
    },
    contactPage: {
      title: get('contactPage', 'title', fallback.contactPage.title),
      address: get('contactPage', 'address', fallback.contactPage.address),
      addressLine2: get('contactPage', 'addressLine2', fallback.contactPage.addressLine2),
      phone: get('contactPage', 'phone', fallback.contactPage.phone),
      email: get('contactPage', 'email', fallback.contactPage.email),
      getDirections: get('contactPage', 'getDirections', fallback.contactPage.getDirections),
      hoursTitle: get('contactPage', 'hoursTitle', fallback.contactPage.hoursTitle),
    },
    events: {
      title: get('events', 'title', fallback.events.title),
    },
    gift: {
      title: get('gift', 'title', fallback.gift.title),
      subtitle: get('gift', 'subtitle', fallback.gift.subtitle),
      heroNote: get('gift', 'heroNote', fallback.gift.heroNote),
      steps: {
        title: get('gift', 'steps.title', fallback.gift.steps.title),
        step1Title: get('gift', 'steps.step1Title', fallback.gift.steps.step1Title),
        step1Text: get('gift', 'steps.step1Text', fallback.gift.steps.step1Text),
        step2Title: get('gift', 'steps.step2Title', fallback.gift.steps.step2Title),
        step2Text: get('gift', 'steps.step2Text', fallback.gift.steps.step2Text),
        step3Title: get('gift', 'steps.step3Title', fallback.gift.steps.step3Title),
        step3Text: get('gift', 'steps.step3Text', fallback.gift.steps.step3Text),
      },
      chefsTable: {
        eyebrow: get('gift', 'chefsTable.eyebrow', fallback.gift.chefsTable.eyebrow),
        badge: get('gift', 'chefsTable.badge', fallback.gift.chefsTable.badge),
        title: get('gift', 'chefsTable.title', fallback.gift.chefsTable.title),
        description: get('gift', 'chefsTable.description', fallback.gift.chefsTable.description),
        perPerson: get('gift', 'chefsTable.perPerson', fallback.gift.chefsTable.perPerson),
        quantityLabel: get('gift', 'chefsTable.quantityLabel', fallback.gift.chefsTable.quantityLabel),
        pairingLabel: get('gift', 'chefsTable.pairingLabel', fallback.gift.chefsTable.pairingLabel),
        pairingHelp: get('gift', 'chefsTable.pairingHelp', fallback.gift.chefsTable.pairingHelp),
        noPairing: get('gift', 'chefsTable.noPairing', fallback.gift.chefsTable.noPairing),
        pairingError: get('gift', 'chefsTable.pairingError', fallback.gift.chefsTable.pairingError),
      },
      cards: {
        eyebrow: get('gift', 'cards.eyebrow', fallback.gift.cards.eyebrow),
        cardLabel: get('gift', 'cards.cardLabel', fallback.gift.cards.cardLabel),
        cardFooter: get('gift', 'cards.cardFooter', fallback.gift.cards.cardFooter),
        title: get('gift', 'cards.title', fallback.gift.cards.title),
        subtitle: get('gift', 'cards.subtitle', fallback.gift.cards.subtitle),
        quantityLabel: get('gift', 'cards.quantityLabel', fallback.gift.cards.quantityLabel),
        amountLabel: get('gift', 'cards.amountLabel', fallback.gift.cards.amountLabel),
        otherAmount: get('gift', 'cards.otherAmount', fallback.gift.cards.otherAmount),
        otherAmountPlaceholder: get('gift', 'cards.otherAmountPlaceholder', fallback.gift.cards.otherAmountPlaceholder),
        minAmount: get('gift', 'cards.minAmount', fallback.gift.cards.minAmount),
      },
      common: {
        total: get('gift', 'common.total', fallback.gift.common.total),
        order: get('gift', 'common.order', fallback.gift.common.order),
        summary: get('gift', 'common.summary', fallback.gift.common.summary),
        guests: get('gift', 'common.guests', fallback.gift.common.guests),
        pairings: get('gift', 'common.pairings', fallback.gift.common.pairings),
        cardsOf: get('gift', 'common.cardsOf', fallback.gift.common.cardsOf),
      },
      form: {
        title: get('gift', 'form.title', fallback.gift.form.title),
        firstName: get('gift', 'form.firstName', fallback.gift.form.firstName),
        lastName: get('gift', 'form.lastName', fallback.gift.form.lastName),
        email: get('gift', 'form.email', fallback.gift.form.email),
        paymentMethod: get('gift', 'form.paymentMethod', fallback.gift.form.paymentMethod),
        paymentPlaceholder: get('gift', 'form.paymentPlaceholder', fallback.gift.form.paymentPlaceholder),
        paymentLink: get('gift', 'form.paymentLink', fallback.gift.form.paymentLink),
        paypal: get('gift', 'form.paypal', fallback.gift.form.paypal),
        sinpe: get('gift', 'form.sinpe', fallback.gift.form.sinpe),
        message: get('gift', 'form.message', fallback.gift.form.message),
        messagePlaceholder: get('gift', 'form.messagePlaceholder', fallback.gift.form.messagePlaceholder),
        submit: get('gift', 'form.submit', fallback.gift.form.submit),
        submitting: get('gift', 'form.submitting', fallback.gift.form.submitting),
        note: get('gift', 'form.note', fallback.gift.form.note),
        successTitle: get('gift', 'form.successTitle', fallback.gift.form.successTitle),
        successText: get('gift', 'form.successText', fallback.gift.form.successText),
        newOrder: get('gift', 'form.newOrder', fallback.gift.form.newOrder),
        errorRequired: get('gift', 'form.errorRequired', fallback.gift.form.errorRequired),
        errorEmail: get('gift', 'form.errorEmail', fallback.gift.form.errorEmail),
        errorMinAmount: get('gift', 'form.errorMinAmount', fallback.gift.form.errorMinAmount),
        errorRateLimited: get('gift', 'form.errorRateLimited', fallback.gift.form.errorRateLimited),
        errorGeneric: get('gift', 'form.errorGeneric', fallback.gift.form.errorGeneric),
      },
    },
  };
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      // Check URL: ?lang=en, ?lang=es, or path prefix /en, /es (case-insensitive)
      const params = new URLSearchParams(window.location.search);
      const queryLang = params.get('lang')?.toLowerCase();
      if (queryLang === 'en' || queryLang === 'es') return queryLang as Language;
      const firstSeg = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
      if (firstSeg === 'en' || firstSeg === 'es') return firstSeg as Language;
    }
    const saved = localStorage.getItem('amana-language');
    return (saved as Language) || 'es';
  });

  const { data: dbTranslations, isLoading: isLoadingTranslations } = useTranslations();
  const [fontsReady, setFontsReady] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('amana-language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) {
      setFontsReady(true);
      return;
    }
    let cancelled = false;
    Promise.all([
      document.fonts.load('1em "Quincy CF"'),
      document.fonts.load('700 1em "Quincy CF"'),
      document.fonts.load('1em "Maison Neue"'),
    ])
      .then(() => document.fonts.ready)
      .finally(() => {
        if (!cancelled) setFontsReady(true);
      });
    // Safety fallback in case fonts never resolve
    const timeout = setTimeout(() => setFontsReady(true), 2000);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const isLoading = isLoadingTranslations || !fontsReady;

  const t = useMemo(
    () => buildTranslationsFromDB(dbTranslations, language, fallbackTranslations[language]),
    [dbTranslations, language]
  );

  const value = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
