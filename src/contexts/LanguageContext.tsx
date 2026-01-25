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
    leaveReview: string;
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

// Fallback translations (used while loading from DB)
const fallbackTranslations: Record<Language, Translations> = {
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
      description: 'Ingredientes frescos, técnicas modernas y una experiencia fine-casual para disfrutar con calma.',
      ctaMenu: 'Nuestro Menú',
      ctaReserve: 'Reservar Ahora',
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
      description: 'Fresh ingredients, modern techniques, and a fine-casual experience to enjoy at your own pace.',
      ctaMenu: 'Our Menu',
      ctaReserve: 'Reserve Now',
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
    },
    hero: {
      title: get('hero', 'title', fallback.hero.title),
      subtitle: get('hero', 'subtitle', fallback.hero.subtitle),
      location: get('hero', 'location', fallback.hero.location),
      description: get('hero', 'description', fallback.hero.description),
      ctaMenu: get('hero', 'ctaMenu', fallback.hero.ctaMenu),
      ctaReserve: get('hero', 'ctaReserve', fallback.hero.ctaReserve),
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
    },
    contactPage: {
      title: get('contactPage', 'title', fallback.contactPage.title),
      address: get('contactPage', 'address', fallback.contactPage.address),
      phone: get('contactPage', 'phone', fallback.contactPage.phone),
      email: get('contactPage', 'email', fallback.contactPage.email),
      getDirections: get('contactPage', 'getDirections', fallback.contactPage.getDirections),
      hoursTitle: get('contactPage', 'hoursTitle', fallback.contactPage.hoursTitle),
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
    const saved = localStorage.getItem('amana-language');
    return (saved as Language) || 'es';
  });

  const { data: dbTranslations, isLoading } = useTranslations();

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('amana-language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
