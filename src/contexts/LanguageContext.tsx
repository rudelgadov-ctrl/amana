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
    events: string;
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
      events: { title: string; description: string };
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
  // Events page (/eventos). Separate from `events` (home "Próximos Eventos").
  eventsPage: {
    meta: {
      title: string;
      description: string;
    };
    hero: {
      title: string;
      text: string;
      cta: string;
      imageAlt: string;
    };
    types: {
      title: string;
      type1Title: string;
      type1Text: string;
      type2Title: string;
      type2Text: string;
      type3Title: string;
      type3Text: string;
    };
    spaces: {
      title: string;
      azulName: string;
      azulTag: string;
      azulCapacity: string;
      verdeName: string;
      verdeTag: string;
      verdeCapacity: string;
      principalName: string;
      principalTag: string;
      principalCapacity: string;
      chefsName: string;
      chefsTag: string;
      chefsCapacity: string;
      fullTitle: string;
      fullText: string;
    };
    menus: {
      title: string;
      menu1Title: string;
      menu1Text: string;
      menu1Price: string;
      menu2Title: string;
      menu2Text: string;
      menu2Price: string;
      menu3Title: string;
      menu3Text: string;
      menu3Price: string;
      pricesNote: string;
      conditionsTitle: string;
      conditionsText: string;
      customBudget: string;
      invoiceNote: string;
    };
    steps: {
      title: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
    form: {
      title: string;
      name: string;
      company: string;
      email: string;
      phone: string;
      eventType: string;
      typeCorporate: string;
      typeCelebration: string;
      typeLaunch: string;
      typeOther: string;
      date: string;
      datePlaceholder: string;
      guests: string;
      space: string;
      spaceAzul: string;
      spaceVerde: string;
      spacePrincipal: string;
      spaceChefs: string;
      spaceFull: string;
      spaceCombination: string;
      menu: string;
      menuPlaceholder: string;
      menuOther: string;
      budget: string;
      budgetAmount: string;
      budgetPerPerson: string;
      budgetTotal: string;
      comments: string;
      customQuoteNote: string;
      capacityNote: string;
      submit: string;
      submitting: string;
      success: string;
      errorRequired: string;
      errorEmail: string;
      errorPhone: string;
      errorDate: string;
      errorGuests: string;
      errorBudget: string;
      errorRateLimited: string;
      errorGeneric: string;
    };
    faq: {
      title: string;
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
      q4: string;
      a4: string;
      q5: string;
      a5: string;
    };
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
      events: 'Eventos',
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
        events: { title: 'Eventos Privados', description: 'Cenas corporativas. Celebraciones familiares.' },
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
    eventsPage: {
      meta: {
        title: 'Eventos en Amana | Barrio Escalante',
        description: 'Cenas corporativas, celebraciones y lanzamientos en Barrio Escalante. Salones privados de 8 a 42 personas.',
      },
      hero: {
        title: 'Eventos en Amana',
        text: 'Cenas corporativas, celebraciones y lanzamientos en Barrio Escalante, con la cocina de todos los días.',
        cta: 'Cotiza tu evento',
        imageAlt: 'Salón montado para un evento',
      },
      types: {
        title: 'Tipos de evento',
        type1Title: 'Cenas corporativas',
        type1Text: 'Cierres de año, cenas con clientes, equipos de trabajo.',
        type2Title: 'Celebraciones',
        type2Text: 'Cumpleaños, aniversarios, compromisos, graduaciones, reuniones familiares.',
        type3Title: 'Lanzamientos y presentaciones',
        type3Text: 'Lanzamiento de marcas y productos, conferencias, exposiciones.',
      },
      spaces: {
        title: 'Espacios',
        azulName: 'Salón Azul',
        azulTag: 'Privado',
        azulCapacity: 'Hasta 8 personas sentadas',
        verdeName: 'Salón Verde',
        verdeTag: 'Privado',
        verdeCapacity: 'Hasta 12 personas sentadas',
        principalName: 'Salón principal',
        principalTag: '',
        principalCapacity: 'Hasta 22 personas sentadas',
        chefsName: "Chef's Table",
        chefsTag: 'Degustación frente a la cocina abierta',
        chefsCapacity: 'Hasta 8 personas',
        fullTitle: 'Restaurante completo',
        fullText: 'Hasta 42 personas sentadas, distribuidas entre nuestros salones. Cotización a la medida.',
      },
      menus: {
        title: 'Menús',
        menu1Title: 'Menú de 3 tiempos',
        menu1Text: 'Entrada, plato fuerte y postre.',
        menu1Price: 'Desde ₡25.000 por persona',
        menu2Title: 'Menú de 5 a 6 tiempos',
        menu2Text: '',
        menu2Price: 'Desde ₡35.000 por persona',
        menu3Title: "Chef's Table",
        menu3Text: 'Degustación de 7 tiempos.',
        menu3Price: '₡44.000 por persona',
        pricesNote: 'Precios incluyen impuestos. Bebidas aparte: opciones con o sin alcohol, vinos o cocteles; el costo depende de la cantidad y la elección.',
        conditionsTitle: 'Condiciones',
        conditionsText: 'Eventos podrían requerir de un adelanto del 15-25% según fecha y cantidad de personas. Consumo mínimo puede variar según fecha y temporada.',
        customBudget: '¿Tienes otro presupuesto o necesidades? Cuéntanos los detalles y te hacemos una propuesta a la medida.',
        invoiceNote: 'Emitimos factura electrónica a nombre de tu empresa.',
      },
      steps: {
        title: 'Cómo funciona',
        step1: 'Cuéntanos fecha, número de personas y tipo de evento.',
        step2: 'Te enviamos una propuesta en menos de 48 horas.',
        step3: 'Confirmas estar de acuerdo con la propuesta y haces el adelanto de ser requerido.',
        step4: 'Nos encargamos del resto.',
      },
      form: {
        title: 'Cotiza tu evento',
        name: 'Nombre',
        company: 'Empresa (opcional)',
        email: 'Correo',
        phone: 'Teléfono',
        eventType: 'Tipo de evento',
        typeCorporate: 'Corporativo',
        typeCelebration: 'Celebración',
        typeLaunch: 'Lanzamiento',
        typeOther: 'Otro',
        date: 'Fecha deseada',
        datePlaceholder: 'Elige una fecha (martes a sábado)',
        guests: 'Número de personas',
        space: 'Espacio de interés',
        spaceAzul: 'Salón Azul (hasta 8)',
        spaceVerde: 'Salón Verde (hasta 12)',
        spacePrincipal: 'Salón principal (hasta 22)',
        spaceChefs: "Chef's Table (hasta 8)",
        spaceFull: 'Restaurante completo',
        spaceCombination: 'Combinación de salones',
        menu: 'Preferencia de menú',
        menuPlaceholder: 'Elige un menú',
        menuOther: 'Otro - Especificar en comentarios',
        budget: 'Presupuesto (opcional)',
        budgetAmount: 'Monto',
        budgetPerPerson: 'por persona',
        budgetTotal: 'total',
        comments: 'Comentarios',
        customQuoteNote: 'Este evento se cotiza a la medida. Te enviaremos una propuesta con el consumo mínimo para esa fecha.',
        capacityNote: 'Ese espacio recibe hasta {capacity} personas. Te sugeriremos la mejor opción en la propuesta.',
        submit: 'Enviar solicitud',
        submitting: 'Enviando…',
        success: 'Recibimos tu solicitud. Te respondemos en menos de 48 horas.',
        errorRequired: 'Requerido',
        errorEmail: 'Correo inválido',
        errorPhone: 'Ingresa un teléfono válido',
        errorDate: 'Elige una fecha',
        errorGuests: 'Indica el número de personas',
        errorBudget: 'Ingresa un monto válido',
        errorRateLimited: 'Has enviado demasiadas solicitudes. Intenta más tarde.',
        errorGeneric: 'No pudimos enviar la solicitud. Prueba de nuevo o escríbenos por WhatsApp.',
      },
      faq: {
        title: 'Preguntas frecuentes',
        q1: '¿Puedo reservar un salón privado sin cerrar el restaurante?',
        a1: 'Sí. El Salón Azul (hasta 8 personas) y el Salón Verde (hasta 12) son privados y funcionan durante el servicio normal.',
        q2: '¿Puedo reservar el restaurante completo?',
        a2: 'Sí, hasta 42 personas sentadas, distribuidas entre los salones. Se cotiza a la medida.',
        q3: '¿Tienen opciones vegetarianas o para alergias?',
        a3: 'Sí, adaptamos el menú; indícalo al cotizar.',
        q4: '¿Puedo traer decoración o pastel?',
        a4: 'Sí. Especifica tus necesidades al cotizar para coordinarlo.',
        q5: '¿Cuál es la política de cancelación?',
        a5: 'Grupos de hasta 14 personas: cancelación con devolución del depósito hasta 72 horas antes de la reservación.\nGrupos de 15 personas o más: cancelación con devolución del depósito hasta 1 semana antes de la reservación.',
      },
    },
    gift: {
      title: 'Amana como regalo',
      subtitle: 'Comparte la experiencia',
      heroNote: "Obsequia una noche memorable en nuestro Chef's Table o una tarjeta de regalo para disfrutar a su ritmo, cuándo y cómo prefieran.",
      steps: {
        title: 'Cómo funciona',
        step1Title: 'Elige',
        step1Text: 'Escoge una experiencia o el monto de la tarjeta de regalo.',
        step2Title: 'Confirmar',
        step2Text: 'Compártenos tus datos de contacto y método de pago preferido.',
        step3Title: 'Te contactamos',
        step3Text: 'Nuestro equipo te contacta, confirmando pago y entrega entre 24-48h.',
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
        title: 'Elige el monto',
        subtitle: "Válidas para nuestro menú principal, Chef's Table y eventos especiales.",
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
      events: 'Events',
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
        events: { title: 'Private Events', description: 'Corporate dinners. Family celebrations.' },
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
    eventsPage: {
      meta: {
        title: 'Events at Amana | Barrio Escalante',
        description: 'Corporate dinners, celebrations and launches in Barrio Escalante. Private rooms for 8 to 42 guests.',
      },
      hero: {
        title: 'Events at Amana',
        text: 'Corporate dinners, celebrations and launches in Barrio Escalante, with the same cooking we serve every day.',
        cta: 'Get a quote',
        imageAlt: 'Room set up for an event',
      },
      types: {
        title: 'Types of events',
        type1Title: 'Corporate dinners',
        type1Text: 'Year-end parties, client dinners, team gatherings.',
        type2Title: 'Celebrations',
        type2Text: 'Birthdays, anniversaries, engagements, graduations, family gatherings.',
        type3Title: 'Launches and presentations',
        type3Text: 'Brand and product launches, conferences, exhibitions.',
      },
      spaces: {
        title: 'Spaces',
        azulName: 'Blue Room',
        azulTag: 'Private',
        azulCapacity: 'Up to 8 seated guests',
        verdeName: 'Green Room',
        verdeTag: 'Private',
        verdeCapacity: 'Up to 12 seated guests',
        principalName: 'Main dining room',
        principalTag: '',
        principalCapacity: 'Up to 22 seated guests',
        chefsName: "Chef's Table",
        chefsTag: 'Tasting menu in front of the open kitchen',
        chefsCapacity: 'Up to 8 guests',
        fullTitle: 'Full restaurant',
        fullText: 'Up to 42 seated guests across our rooms. Custom quote.',
      },
      menus: {
        title: 'Menus',
        menu1Title: '3-course menu',
        menu1Text: 'Starter, main course and dessert.',
        menu1Price: 'From ₡25,000 per person',
        menu2Title: '5 to 6-course menu',
        menu2Text: '',
        menu2Price: 'From ₡35,000 per person',
        menu3Title: "Chef's Table",
        menu3Text: '7-course tasting menu.',
        menu3Price: '₡44,000 per person',
        pricesNote: 'Prices include taxes. Drinks are extra: alcoholic or non-alcoholic options, wines or cocktails; the cost depends on quantity and selection.',
        conditionsTitle: 'Conditions',
        conditionsText: 'Events may require a 15–25% advance payment depending on the date and number of guests. Minimum spend may vary by date and season.',
        customBudget: "Have a different budget or needs? Tell us the details and we'll put together a tailored proposal.",
        invoiceNote: "We issue electronic invoices in your company's name.",
      },
      steps: {
        title: 'How it works',
        step1: 'Tell us the date, number of guests and type of event.',
        step2: 'We send you a proposal within 48 hours.',
        step3: 'You approve the proposal and make the advance payment if required.',
        step4: 'We take care of the rest.',
      },
      form: {
        title: 'Request a quote',
        name: 'Name',
        company: 'Company (optional)',
        email: 'Email',
        phone: 'Phone',
        eventType: 'Type of event',
        typeCorporate: 'Corporate',
        typeCelebration: 'Celebration',
        typeLaunch: 'Launch',
        typeOther: 'Other',
        date: 'Preferred date',
        datePlaceholder: 'Choose a date (Tuesday to Saturday)',
        guests: 'Number of guests',
        space: 'Preferred space',
        spaceAzul: 'Blue Room (up to 8)',
        spaceVerde: 'Green Room (up to 12)',
        spacePrincipal: 'Main dining room (up to 22)',
        spaceChefs: "Chef's Table (up to 8)",
        spaceFull: 'Full restaurant',
        spaceCombination: 'Combination of rooms',
        menu: 'Menu preference',
        menuPlaceholder: 'Choose a menu',
        menuOther: 'Other – specify in comments',
        budget: 'Budget (optional)',
        budgetAmount: 'Amount',
        budgetPerPerson: 'per person',
        budgetTotal: 'total',
        comments: 'Comments',
        customQuoteNote: "This event is quoted on a custom basis. We'll send you a proposal with the minimum spend for that date.",
        capacityNote: "That space holds up to {capacity} guests. We'll suggest the best option in our proposal.",
        submit: 'Send request',
        submitting: 'Sending…',
        success: "We've received your request. We'll get back to you within 48 hours.",
        errorRequired: 'Required',
        errorEmail: 'Invalid email',
        errorPhone: 'Enter a valid phone number',
        errorDate: 'Choose a date',
        errorGuests: 'Enter the number of guests',
        errorBudget: 'Enter a valid amount',
        errorRateLimited: "You've sent too many requests. Please try again later.",
        errorGeneric: "We couldn't send your request. Please try again or message us on WhatsApp.",
      },
      faq: {
        title: 'Frequently asked questions',
        q1: 'Can I book a private room without closing the restaurant?',
        a1: 'Yes. The Blue Room (up to 8 guests) and the Green Room (up to 12) are private and operate during regular service.',
        q2: 'Can I book the entire restaurant?',
        a2: 'Yes, up to 42 seated guests across our rooms. It is quoted on a custom basis.',
        q3: 'Do you have vegetarian or allergy-friendly options?',
        a3: 'Yes, we adapt the menu; just let us know when you request your quote.',
        q4: 'Can I bring decorations or a cake?',
        a4: 'Yes. Tell us what you need when you request your quote so we can coordinate.',
        q5: 'What is the cancellation policy?',
        a5: 'Groups of up to 14 guests: cancellation with a full deposit refund up to 72 hours before the reservation.\nGroups of 15 or more: cancellation with a full deposit refund up to 1 week before the reservation.',
      },
    },
    gift: {
      title: 'Amana as a Gift',
      subtitle: 'Share the experience',
      heroNote: "Give the gift of a memorable evening at our Chef's Table, or a flexible card to enjoy at their own pace, whenever and however they prefer.",
      steps: {
        title: 'How it works',
        step1Title: 'Choose',
        step1Text: 'Pick the experience or the gift card amount.',
        step2Title: 'Confirm',
        step2Text: 'Share your contact info and preferred payment method.',
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
        title: 'Choose your amount',
        subtitle: "Valid for our main menu, Chef's Table, and special events.",
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
      events: get('nav', 'events', fallback.nav.events),
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
        events: {
          title: get('concept', 'cards.events.title', fallback.concept.cards.events.title),
          description: get('concept', 'cards.events.description', fallback.concept.cards.events.description),
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
    eventsPage: {
      meta: {
        title: get('eventsPage', 'meta.title', fallback.eventsPage.meta.title),
        description: get('eventsPage', 'meta.description', fallback.eventsPage.meta.description),
      },
      hero: {
        title: get('eventsPage', 'hero.title', fallback.eventsPage.hero.title),
        text: get('eventsPage', 'hero.text', fallback.eventsPage.hero.text),
        cta: get('eventsPage', 'hero.cta', fallback.eventsPage.hero.cta),
        imageAlt: get('eventsPage', 'hero.imageAlt', fallback.eventsPage.hero.imageAlt),
      },
      types: {
        title: get('eventsPage', 'types.title', fallback.eventsPage.types.title),
        type1Title: get('eventsPage', 'types.type1Title', fallback.eventsPage.types.type1Title),
        type1Text: get('eventsPage', 'types.type1Text', fallback.eventsPage.types.type1Text),
        type2Title: get('eventsPage', 'types.type2Title', fallback.eventsPage.types.type2Title),
        type2Text: get('eventsPage', 'types.type2Text', fallback.eventsPage.types.type2Text),
        type3Title: get('eventsPage', 'types.type3Title', fallback.eventsPage.types.type3Title),
        type3Text: get('eventsPage', 'types.type3Text', fallback.eventsPage.types.type3Text),
      },
      spaces: {
        title: get('eventsPage', 'spaces.title', fallback.eventsPage.spaces.title),
        azulName: get('eventsPage', 'spaces.azulName', fallback.eventsPage.spaces.azulName),
        azulTag: get('eventsPage', 'spaces.azulTag', fallback.eventsPage.spaces.azulTag),
        azulCapacity: get('eventsPage', 'spaces.azulCapacity', fallback.eventsPage.spaces.azulCapacity),
        verdeName: get('eventsPage', 'spaces.verdeName', fallback.eventsPage.spaces.verdeName),
        verdeTag: get('eventsPage', 'spaces.verdeTag', fallback.eventsPage.spaces.verdeTag),
        verdeCapacity: get('eventsPage', 'spaces.verdeCapacity', fallback.eventsPage.spaces.verdeCapacity),
        principalName: get('eventsPage', 'spaces.principalName', fallback.eventsPage.spaces.principalName),
        principalTag: get('eventsPage', 'spaces.principalTag', fallback.eventsPage.spaces.principalTag),
        principalCapacity: get('eventsPage', 'spaces.principalCapacity', fallback.eventsPage.spaces.principalCapacity),
        chefsName: get('eventsPage', 'spaces.chefsName', fallback.eventsPage.spaces.chefsName),
        chefsTag: get('eventsPage', 'spaces.chefsTag', fallback.eventsPage.spaces.chefsTag),
        chefsCapacity: get('eventsPage', 'spaces.chefsCapacity', fallback.eventsPage.spaces.chefsCapacity),
        fullTitle: get('eventsPage', 'spaces.fullTitle', fallback.eventsPage.spaces.fullTitle),
        fullText: get('eventsPage', 'spaces.fullText', fallback.eventsPage.spaces.fullText),
      },
      menus: {
        title: get('eventsPage', 'menus.title', fallback.eventsPage.menus.title),
        menu1Title: get('eventsPage', 'menus.menu1Title', fallback.eventsPage.menus.menu1Title),
        menu1Text: get('eventsPage', 'menus.menu1Text', fallback.eventsPage.menus.menu1Text),
        menu1Price: get('eventsPage', 'menus.menu1Price', fallback.eventsPage.menus.menu1Price),
        menu2Title: get('eventsPage', 'menus.menu2Title', fallback.eventsPage.menus.menu2Title),
        menu2Text: get('eventsPage', 'menus.menu2Text', fallback.eventsPage.menus.menu2Text),
        menu2Price: get('eventsPage', 'menus.menu2Price', fallback.eventsPage.menus.menu2Price),
        menu3Title: get('eventsPage', 'menus.menu3Title', fallback.eventsPage.menus.menu3Title),
        menu3Text: get('eventsPage', 'menus.menu3Text', fallback.eventsPage.menus.menu3Text),
        menu3Price: get('eventsPage', 'menus.menu3Price', fallback.eventsPage.menus.menu3Price),
        pricesNote: get('eventsPage', 'menus.pricesNote', fallback.eventsPage.menus.pricesNote),
        conditionsTitle: get('eventsPage', 'menus.conditionsTitle', fallback.eventsPage.menus.conditionsTitle),
        conditionsText: get('eventsPage', 'menus.conditionsText', fallback.eventsPage.menus.conditionsText),
        customBudget: get('eventsPage', 'menus.customBudget', fallback.eventsPage.menus.customBudget),
        invoiceNote: get('eventsPage', 'menus.invoiceNote', fallback.eventsPage.menus.invoiceNote),
      },
      steps: {
        title: get('eventsPage', 'steps.title', fallback.eventsPage.steps.title),
        step1: get('eventsPage', 'steps.step1', fallback.eventsPage.steps.step1),
        step2: get('eventsPage', 'steps.step2', fallback.eventsPage.steps.step2),
        step3: get('eventsPage', 'steps.step3', fallback.eventsPage.steps.step3),
        step4: get('eventsPage', 'steps.step4', fallback.eventsPage.steps.step4),
      },
      form: {
        title: get('eventsPage', 'form.title', fallback.eventsPage.form.title),
        name: get('eventsPage', 'form.name', fallback.eventsPage.form.name),
        company: get('eventsPage', 'form.company', fallback.eventsPage.form.company),
        email: get('eventsPage', 'form.email', fallback.eventsPage.form.email),
        phone: get('eventsPage', 'form.phone', fallback.eventsPage.form.phone),
        eventType: get('eventsPage', 'form.eventType', fallback.eventsPage.form.eventType),
        typeCorporate: get('eventsPage', 'form.typeCorporate', fallback.eventsPage.form.typeCorporate),
        typeCelebration: get('eventsPage', 'form.typeCelebration', fallback.eventsPage.form.typeCelebration),
        typeLaunch: get('eventsPage', 'form.typeLaunch', fallback.eventsPage.form.typeLaunch),
        typeOther: get('eventsPage', 'form.typeOther', fallback.eventsPage.form.typeOther),
        date: get('eventsPage', 'form.date', fallback.eventsPage.form.date),
        datePlaceholder: get('eventsPage', 'form.datePlaceholder', fallback.eventsPage.form.datePlaceholder),
        guests: get('eventsPage', 'form.guests', fallback.eventsPage.form.guests),
        space: get('eventsPage', 'form.space', fallback.eventsPage.form.space),
        spaceAzul: get('eventsPage', 'form.spaceAzul', fallback.eventsPage.form.spaceAzul),
        spaceVerde: get('eventsPage', 'form.spaceVerde', fallback.eventsPage.form.spaceVerde),
        spacePrincipal: get('eventsPage', 'form.spacePrincipal', fallback.eventsPage.form.spacePrincipal),
        spaceChefs: get('eventsPage', 'form.spaceChefs', fallback.eventsPage.form.spaceChefs),
        spaceFull: get('eventsPage', 'form.spaceFull', fallback.eventsPage.form.spaceFull),
        spaceCombination: get('eventsPage', 'form.spaceCombination', fallback.eventsPage.form.spaceCombination),
        menu: get('eventsPage', 'form.menu', fallback.eventsPage.form.menu),
        menuPlaceholder: get('eventsPage', 'form.menuPlaceholder', fallback.eventsPage.form.menuPlaceholder),
        menuOther: get('eventsPage', 'form.menuOther', fallback.eventsPage.form.menuOther),
        budget: get('eventsPage', 'form.budget', fallback.eventsPage.form.budget),
        budgetAmount: get('eventsPage', 'form.budgetAmount', fallback.eventsPage.form.budgetAmount),
        budgetPerPerson: get('eventsPage', 'form.budgetPerPerson', fallback.eventsPage.form.budgetPerPerson),
        budgetTotal: get('eventsPage', 'form.budgetTotal', fallback.eventsPage.form.budgetTotal),
        comments: get('eventsPage', 'form.comments', fallback.eventsPage.form.comments),
        customQuoteNote: get('eventsPage', 'form.customQuoteNote', fallback.eventsPage.form.customQuoteNote),
        capacityNote: get('eventsPage', 'form.capacityNote', fallback.eventsPage.form.capacityNote),
        submit: get('eventsPage', 'form.submit', fallback.eventsPage.form.submit),
        submitting: get('eventsPage', 'form.submitting', fallback.eventsPage.form.submitting),
        success: get('eventsPage', 'form.success', fallback.eventsPage.form.success),
        errorRequired: get('eventsPage', 'form.errorRequired', fallback.eventsPage.form.errorRequired),
        errorEmail: get('eventsPage', 'form.errorEmail', fallback.eventsPage.form.errorEmail),
        errorPhone: get('eventsPage', 'form.errorPhone', fallback.eventsPage.form.errorPhone),
        errorDate: get('eventsPage', 'form.errorDate', fallback.eventsPage.form.errorDate),
        errorGuests: get('eventsPage', 'form.errorGuests', fallback.eventsPage.form.errorGuests),
        errorBudget: get('eventsPage', 'form.errorBudget', fallback.eventsPage.form.errorBudget),
        errorRateLimited: get('eventsPage', 'form.errorRateLimited', fallback.eventsPage.form.errorRateLimited),
        errorGeneric: get('eventsPage', 'form.errorGeneric', fallback.eventsPage.form.errorGeneric),
      },
      faq: {
        title: get('eventsPage', 'faq.title', fallback.eventsPage.faq.title),
        q1: get('eventsPage', 'faq.q1', fallback.eventsPage.faq.q1),
        a1: get('eventsPage', 'faq.a1', fallback.eventsPage.faq.a1),
        q2: get('eventsPage', 'faq.q2', fallback.eventsPage.faq.q2),
        a2: get('eventsPage', 'faq.a2', fallback.eventsPage.faq.a2),
        q3: get('eventsPage', 'faq.q3', fallback.eventsPage.faq.q3),
        a3: get('eventsPage', 'faq.a3', fallback.eventsPage.faq.a3),
        q4: get('eventsPage', 'faq.q4', fallback.eventsPage.faq.q4),
        a4: get('eventsPage', 'faq.a4', fallback.eventsPage.faq.a4),
        q5: get('eventsPage', 'faq.q5', fallback.eventsPage.faq.q5),
        a5: get('eventsPage', 'faq.a5', fallback.eventsPage.faq.a5),
      },
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
