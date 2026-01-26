import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMenuItems, groupMenuItems, MenuItem } from '@/hooks/useMenuItems';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import { Skeleton } from '@/components/ui/skeleton';
import ChefsTableIllustrationCarousel from '@/components/menu/ChefsTableIllustrationCarousel';

// Category labels mapping
const categoryLabels: Record<string, {
  es: string;
  en: string;
}> = {
  starters: {
    es: 'Entradas',
    en: 'Starters'
  },
  mains: {
    es: 'Platos Fuertes',
    en: 'Mains'
  },
  desserts: {
    es: 'Postres',
    en: 'Desserts'
  },
  drinks: {
    es: 'Bebidas',
    en: 'Drinks'
  },
  chefs_table: {
    es: "Chef's Table",
    en: "Chef's Table"
  }
};

// Subcategory labels for drinks
const subcategoryLabels: Record<string, {
  es: string;
  en: string;
}> = {
  cocktails: {
    es: 'Cocteles',
    en: 'Cocktails'
  },
  low_alcohol: {
    es: 'Cocteles Bajos/Sin Alcohol',
    en: 'Low/No Alcohol'
  },
  red_wine: {
    es: 'Vino Tinto',
    en: 'Red Wine'
  },
  white_wine: {
    es: 'Vino Blanco',
    en: 'White Wine'
  },
  rose_wine: {
    es: 'Vino Rosado',
    en: 'Rosé Wine'
  },
  sparkling_wine: {
    es: 'Vino Espumante',
    en: 'Sparkling Wine'
  }
};

// Format price based on language (Glass/Bottle vs Copa/Botella)
const formatPrice = (price: string | null, language: 'es' | 'en'): string | null => {
  if (!price) return null;
  if (language === 'es') {
    return price.replace(/Glass/g, 'Copa').replace(/Bottle/g, 'Botella');
  }
  return price;
};

// Menu item component
const MenuItemCard = ({
  item,
  language
}: {
  item: MenuItem;
  language: 'es' | 'en';
}) => {
  const name = language === 'es' ? item.name_es : item.name_en;
  const description = language === 'es' ? item.description_es : item.description_en;
  const displayPrice = formatPrice(item.price, language);
  return <div className="flex justify-between items-start pb-4 sm:pb-6 border-b border-asparagus/20 last:border-0">
      <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
        <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-blueberry">{name}</h3>
        {description && <p className="font-body text-xs sm:text-sm md:text-base text-blueberry/60">{description}</p>}
      </div>
      {displayPrice && <span className="font-body font-medium text-sm sm:text-base text-blueberry whitespace-nowrap ml-3 sm:ml-4">
          {displayPrice}
        </span>}
    </div>;
};

// Loading skeleton
const MenuSkeleton = () => <div className="space-y-8 sm:space-y-12">
    {[1, 2, 3].map(section => <div key={section}>
        <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mx-auto mb-4 sm:mb-6" />
        <div className="space-y-4 sm:space-y-6">
          {[1, 2, 3].map(item => <div key={item} className="flex justify-between pb-4 sm:pb-6 border-b border-asparagus/20">
              <div className="space-y-1 sm:space-y-2 flex-1">
                <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
                <Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
              </div>
              <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 ml-3 sm:ml-4" />
            </div>)}
        </div>
      </div>)}
  </div>;
const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('main');
  const {
    t,
    language
  } = useLanguage();
  const {
    data: menuItems,
    isLoading
  } = useMenuItems();
  const {
    data: restaurantInfo
  } = useRestaurantInfo();

  // Read tab from URL query params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['main', 'drinks', 'chefs-table'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Group items by category and subcategory
  const groupedItems = menuItems ? groupMenuItems(menuItems) : {};

  // Get items for main menu (starters, mains, desserts)
  const mainMenuCategories = ['starters', 'mains', 'desserts'];

  // Subcategory order for drinks
  const drinksSubcategoryOrder = ['cocktails', 'low_alcohol', 'red_wine', 'white_wine', 'rose_wine', 'sparkling_wine'];

  // Get chef's table items
  const chefsTableItems = groupedItems['chefs_table']?.['default'] || [];
  return <Layout>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 bg-blueberry">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-eggshell">
            {t.menuPage.title}
          </h1>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-[#dad8c8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="w-full justify-center mb-6 sm:mb-8 md:mb-12 flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="main" className="font-body text-xs sm:text-sm data-[state=active]:bg-blueberry data-[state=active]:text-eggshell px-2 sm:px-4">
                {t.menuPage.mainMenu}
              </TabsTrigger>
              <TabsTrigger value="drinks" className="font-body text-xs sm:text-sm data-[state=active]:bg-blueberry data-[state=active]:text-eggshell px-2 sm:px-4">
                {t.menuPage.drinks}
              </TabsTrigger>
              <TabsTrigger value="chefs-table" className="font-body text-xs sm:text-sm data-[state=active]:bg-blueberry data-[state=active]:text-eggshell px-2 sm:px-4">
                {t.menuPage.chefsTable}
              </TabsTrigger>
            </TabsList>

            {/* Main Menu */}
            <TabsContent value="main" id="main">
              {isLoading ? <MenuSkeleton /> : <div className="space-y-8 sm:space-y-12">
                  {mainMenuCategories.map(category => {
                const items = groupedItems[category]?.['default'] || [];
                if (items.length === 0) return null;
                return <div key={category}>
                        <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-blueberry mb-4 sm:mb-6 text-center">
                          {categoryLabels[category]?.[language] || category}
                        </h2>
                        <div className="space-y-4 sm:space-y-6">
                          {items.map(item => <MenuItemCard key={item.id} item={item} language={language} />)}
                        </div>
                      </div>;
              })}
                </div>}
            </TabsContent>

            {/* Drinks */}
            <TabsContent value="drinks" id="drinks">
              {isLoading ? <MenuSkeleton /> : <div className="space-y-8 sm:space-y-12">
                  {groupedItems['drinks'] && drinksSubcategoryOrder.map(subcategory => {
                const items = groupedItems['drinks'][subcategory];
                if (!items || items.length === 0) return null;
                return <div key={subcategory}>
                          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-blueberry mb-4 sm:mb-6 text-center">
                            {subcategoryLabels[subcategory]?.[language] || subcategory}
                          </h2>
                          <div className="space-y-4 sm:space-y-6">
                            {items.map(item => <MenuItemCard key={item.id} item={item} language={language} />)}
                          </div>
                        </div>;
              })}
                </div>}
            </TabsContent>

            {/* Chef's Table - Submarca con paleta distintiva: crema, negro, grises */}
            <TabsContent value="chefs-table" id="chefs-table">
              <div className="bg-[#dad8c8] rounded-lg overflow-hidden border border-black/10">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Panel Visual */}
                  <div className="relative p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-black/5 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10">
                      <ChefsTableIllustrationCarousel />
                    </div>
                  </div>
                  
                  {/* Panel Contenido */}
                  <div className="p-4 sm:p-6 md:p-8 lg:p-12 text-center lg:text-left space-y-4 sm:space-y-6 md:space-y-8 flex flex-col justify-center">
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                        {t.menuPage.chefsTable}
                      </h3>
                      <p className="font-body text-xs sm:text-sm md:text-base text-neutral-600">{t.menuPage.chefsTableNote}</p>
                    </div>

                    {isLoading ? (
                      <div className="space-y-2 sm:space-y-3">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                          <Skeleton key={i} className="h-5 sm:h-6 w-full bg-black/10" />
                        ))}
                      </div>
                    ) : chefsTableItems.length > 0 ? (() => {
                      const item = chefsTableItems[0];
                      const description = language === 'es' ? item.description_es : item.description_en;
                      const courses = description ? description.split(', ') : [];
                      
                      return (
                        <div className="space-y-3 sm:space-y-4 md:space-y-6">
                          <h4 className="font-display text-base sm:text-lg md:text-xl text-neutral-700">
                            {language === 'es' ? item.name_es : item.name_en}
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {courses.map((course, index) => (
                              <li key={index} className="font-body text-xs sm:text-sm md:text-base text-black/80 flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
                                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black text-[#dad8c8] flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                                  {index + 1}
                                </span>
                                {course.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })() : null}

                    <div className="text-center lg:text-left">
                      <Button asChild className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-[#dad8c8] font-body font-medium px-6 sm:px-8 text-sm sm:text-base transition-all duration-300">
                        <a href={restaurantInfo?.opentable_link || 'https://www.opentable.com'} target="_blank" rel="noopener noreferrer">
                          {t.nav.reserve}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>;
};
export default MenuPage;