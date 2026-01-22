import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface Translations {
  // Navigation
  nav: {
    home: string;
    menu: string;
    about: string;
    contact: string;
    reserve: string;
  };
  // Hero
  hero: {
    title: string;
    subtitle: string;
    location: string;
    description: string;
    ctaMenu: string;
    ctaReserve: string;
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
  };
  // Menu Page
  menuPage: {
    title: string;
    mainMenu: string;
    drinks: string;
    chefsTable: string;
    chefsTableNote: string;
  };
  // Contact
  contactPage: {
    title: string;
    address: string;
    phone: string;
    email: string;
    getDirections: string;
    hoursTitle: string;
  };
}

const translations: Record<Language, Translations> = {
  es: {
    nav: {
      home: 'Inicio',
      menu: 'Menú',
      about: 'Nosotros',
      contact: 'Contacto',
      reserve: 'Reservar',
    },
    hero: {
      title: 'Cocina Honesta',
      subtitle: 'Fine-Casual Costarricense',
      location: 'Barrio Escalante, San José',
      description: 'Ingredientes frescos, técnicas modernas, sabores auténticos. Una experiencia gastronómica sin pretensiones.',
      ctaMenu: 'Nuestro Menú',
      ctaReserve: 'Reservar Ahora',
    },
    concept: {
      title: 'Cocina con Intención',
      subtitle: 'Ubicado en el corazón de Barrio Escalante',
      description: 'En Amana creemos que la buena cocina nace de ingredientes de calidad, preparados con cuidado y respeto. Nuestra propuesta fine-casual te invita a disfrutar de una experiencia gastronómica relajada pero memorable.',
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
      lunchDinner: 'Almuerzo 12-4 PM, Cena 6-10 PM',
      lunch: 'Almuerzo 12-4 PM',
    },
    about: {
      heroTitle: 'Cocina Honesta',
      heroSubtitle: 'Nuestra historia, nuestra pasión',
      storyTitle: 'Un poco sobre nosotros',
      storyText: 'En Amana, cada plato cuenta una historia. Creemos en el poder de los ingredientes frescos, las técnicas cuidadas y el balance perfecto de texturas y sabores. Nuestro concepto fine-casual elimina las pretensiones pero mantiene la excelencia.',
      chefTitle: 'Chef Kenneth',
      chefBio: 'Nacido en San José en 1996, el Chef Kenneth ha consolidado una trayectoria impresionante en la escena gastronómica costarricense e internacional.',
      achievements: 'Logros Destacados',
      achievement1: '2024: Finalista San Pellegrino Young Chef Award (Latinoamérica y Caribe)',
      achievement2: '2023: Cofundador de Amana Escalante',
      achievement3: '2019: Ganador Jeunes Chefs Rôtisseurs Costa Rica',
    },
    menuPage: {
      title: 'Nuestro Menú',
      mainMenu: 'Menú Principal',
      drinks: 'Vinos y Cócteles',
      chefsTable: "Chef's Table",
      chefsTableNote: 'Menú de 7 tiempos • Martes a Sábado, cena • 3 mesas por noche',
    },
    contactPage: {
      title: 'Visítanos',
      address: '125m oeste del Fresh Market de Barrio Escalante',
      phone: '+506 6143-6871',
      email: 'info@amanacr.com',
      getDirections: 'Obtener direcciones',
      hoursTitle: 'Horario de Atención',
    },
  },
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      about: 'About',
      contact: 'Contact',
      reserve: 'Reserve',
    },
    hero: {
      title: 'Honest Cooking',
      subtitle: 'Costa Rican Fine-Casual',
      location: 'Barrio Escalante, San José',
      description: 'Fresh ingredients, modern techniques, authentic flavors. A gastronomic experience without pretension.',
      ctaMenu: 'Our Menu',
      ctaReserve: 'Reserve Now',
    },
    concept: {
      title: 'Cooking with Intention',
      subtitle: 'Located in the heart of Barrio Escalante',
      description: 'At Amana we believe that good cooking comes from quality ingredients, prepared with care and respect. Our fine-casual concept invites you to enjoy a relaxed yet memorable dining experience.',
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
      lunchDinner: 'Lunch 12-4 PM, Dinner 6-10 PM',
      lunch: 'Lunch 12-4 PM',
    },
    about: {
      heroTitle: 'Honest Cooking',
      heroSubtitle: 'Our story, our passion',
      storyTitle: 'A bit about us',
      storyText: 'At Amana, every dish tells a story. We believe in the power of fresh ingredients, careful techniques and the perfect balance of textures and flavors. Our fine-casual concept eliminates pretension while maintaining excellence.',
      chefTitle: 'Chef Kenneth',
      chefBio: 'Born in San José in 1996, Chef Kenneth has built an impressive career in the Costa Rican and international culinary scene.',
      achievements: 'Notable Achievements',
      achievement1: '2024: Finalist San Pellegrino Young Chef Award (Latin America & Caribbean)',
      achievement2: '2023: Co-founder of Amana Escalante',
      achievement3: '2019: Winner Jeunes Chefs Rôtisseurs Costa Rica',
    },
    menuPage: {
      title: 'Our Menu',
      mainMenu: 'Main Menu',
      drinks: 'Wine & Cocktails',
      chefsTable: "Chef's Table",
      chefsTableNote: '7-course menu • Tuesday to Saturday, dinner • 3 tables per night',
    },
    contactPage: {
      title: 'Visit Us',
      address: '125m west of Fresh Market, Barrio Escalante',
      phone: '+506 6143-6871',
      email: 'info@amanacr.com',
      getDirections: 'Get directions',
      hoursTitle: 'Opening Hours',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('amana-language');
    return (saved as Language) || 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('amana-language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
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
