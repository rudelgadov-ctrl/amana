import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMenuItems, groupMenuItems, MenuItem } from '@/hooks/useMenuItems';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import { Skeleton } from '@/components/ui/skeleton';

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
    es: 'Cócteles',
    en: 'Cocktails'
  },
  low_alcohol: {
    es: 'Cócteles Bajos/Sin Alcohol',
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
  return <div className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
      <div className="space-y-1">
        <h3 className="font-display text-xl font-bold text-blueberry">{name}</h3>
        {description && <p className="font-body text-blueberry/60">{description}</p>}
      </div>
      {item.price && <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">
          {item.price}
        </span>}
    </div>;
};

// Loading skeleton
const MenuSkeleton = () => <div className="space-y-12">
    {[1, 2, 3].map(section => <div key={section}>
        <Skeleton className="h-8 w-32 mx-auto mb-6" />
        <div className="space-y-6">
          {[1, 2, 3].map(item => <div key={item} className="flex justify-between pb-6 border-b border-asparagus/20">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-20 ml-4" />
            </div>)}
        </div>
      </div>)}
  </div>;
const MenuPage = () => {
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
      <section className="pt-32 pb-16 bg-blueberry">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-eggshell">
            {t.menuPage.title}
          </h1>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 bg-[#dad8c8]">
        <div className="container mx-auto px-4 lg:px-8">
          <Tabs defaultValue="main" className="max-w-4xl mx-auto">
            <TabsList className="w-full justify-center bg-wafer/50 mb-12">
              <TabsTrigger value="main" className="font-body data-[state=active]:bg-blueberry data-[state=active]:text-eggshell">
                {t.menuPage.mainMenu}
              </TabsTrigger>
              <TabsTrigger value="drinks" className="font-body data-[state=active]:bg-blueberry data-[state=active]:text-eggshell">
                {t.menuPage.drinks}
              </TabsTrigger>
              <TabsTrigger value="chefs-table" className="font-body data-[state=active]:bg-blueberry data-[state=active]:text-eggshell">
                {t.menuPage.chefsTable}
              </TabsTrigger>
            </TabsList>

            {/* Main Menu */}
            <TabsContent value="main" id="main">
              {isLoading ? <MenuSkeleton /> : <div className="space-y-12">
                  {mainMenuCategories.map(category => {
                const items = groupedItems[category]?.['default'] || [];
                if (items.length === 0) return null;
                return <div key={category}>
                        <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                          {categoryLabels[category]?.[language] || category}
                        </h2>
                        <div className="space-y-6">
                          {items.map(item => <MenuItemCard key={item.id} item={item} language={language} />)}
                        </div>
                      </div>;
              })}
                </div>}
            </TabsContent>

            {/* Drinks */}
            <TabsContent value="drinks" id="drinks">
              {isLoading ? <MenuSkeleton /> : <div className="space-y-12">
                  {groupedItems['drinks'] && drinksSubcategoryOrder.map(subcategory => {
                const items = groupedItems['drinks'][subcategory];
                if (!items || items.length === 0) return null;
                return <div key={subcategory}>
                          <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                            {subcategoryLabels[subcategory]?.[language] || subcategory}
                          </h2>
                          <div className="space-y-6">
                            {items.map(item => <MenuItemCard key={item.id} item={item} language={language} />)}
                          </div>
                        </div>;
              })}
                </div>}
            </TabsContent>

            {/* Chef's Table */}
            <TabsContent value="chefs-table" id="chefs-table">
              <div className="bg-blueberry rounded-lg p-8 md:p-12 text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-eggshell">
                    {t.menuPage.chefsTable}
                  </h3>
                  <p className="font-body text-asparagus">{t.menuPage.chefsTableNote}</p>
                </div>

                {isLoading ? (
                  <div className="max-w-md mx-auto space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <Skeleton key={i} className="h-6 w-full bg-asparagus/20" />
                    ))}
                  </div>
                ) : chefsTableItems.length > 0 ? (() => {
                  const item = chefsTableItems[0];
                  const description = language === 'es' ? item.description_es : item.description_en;
                  const courses = description ? description.split(', ') : [];
                  
                  return (
                    <div className="max-w-md mx-auto space-y-6">
                      <h4 className="font-display text-xl text-asparagus">
                        {language === 'es' ? item.name_es : item.name_en}
                      </h4>
                      <ul className="space-y-3">
                        {courses.map((course, index) => (
                          <li key={index} className="font-body text-wafer flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-asparagus/30 flex items-center justify-center text-sm text-eggshell">
                              {index + 1}
                            </span>
                            {course.trim()}
                          </li>
                        ))}
                      </ul>
                      {item.price && (
                        <p className="font-display text-2xl text-asparagus mt-6">
                          {item.price}
                        </p>
                      )}
                    </div>
                  );
                })() : null}

                <Button asChild className="border-2 border-eggshell bg-transparent text-eggshell hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-8 transition-all duration-300">
                  <a href={restaurantInfo?.opentable_link || 'https://www.opentable.com'} target="_blank" rel="noopener noreferrer">
                    {t.nav.reserve}
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>;
};
export default MenuPage;