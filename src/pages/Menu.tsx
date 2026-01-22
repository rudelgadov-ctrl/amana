import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Placeholder menu items - will be replaced with actual menu
const menuItems = {
  main: {
    es: [{
      name: 'Aguacate Confitado',
      description: 'Con crema de cilantro y chips de tortilla',
      price: '₡8,500'
    }, {
      name: 'Ceviche de Corvina',
      description: 'Leche de tigre clásica, cebolla morada, cilantro',
      price: '₡9,200'
    }, {
      name: 'Pulpo a la Parrilla',
      description: 'Puré de papa ahumada, chimichurri de hierbas',
      price: '₡14,500'
    }, {
      name: 'Lomo de Res',
      description: 'Reducción de vino tinto, vegetales de temporada',
      price: '₡18,900'
    }, {
      name: 'Corvina en Costra',
      description: 'De coco, arroz al curry, vegetales asiáticos',
      price: '₡15,800'
    }, {
      name: 'Risotto de Hongos',
      description: 'Hongos silvestres, parmesano, aceite de trufa',
      price: '₡13,500'
    }],
    en: [{
      name: 'Confit Avocado',
      description: 'With cilantro cream and tortilla chips',
      price: '₡8,500'
    }, {
      name: 'Corvina Ceviche',
      description: 'Classic leche de tigre, red onion, cilantro',
      price: '₡9,200'
    }, {
      name: 'Grilled Octopus',
      description: 'Smoked potato purée, herb chimichurri',
      price: '₡14,500'
    }, {
      name: 'Beef Tenderloin',
      description: 'Red wine reduction, seasonal vegetables',
      price: '₡18,900'
    }, {
      name: 'Coconut Crusted Corvina',
      description: 'Curry rice, Asian vegetables',
      price: '₡15,800'
    }, {
      name: 'Wild Mushroom Risotto',
      description: 'Wild mushrooms, parmesan, truffle oil',
      price: '₡13,500'
    }]
  },
  drinks: {
    es: [{
      name: 'Escalante Spritz',
      description: 'Aperol, espumante, naranja, hierbas locales',
      price: '₡6,500'
    }, {
      name: 'Mango Passion',
      description: 'Ron blanco, maracuyá, mango, lima',
      price: '₡6,000'
    }, {
      name: 'Costa Rica Old Fashioned',
      description: 'Bourbon, café costarricense, cacao',
      price: '₡7,200'
    }, {
      name: 'Vino Tinto (Copa)',
      description: 'Selección de la casa',
      price: '₡5,500'
    }, {
      name: 'Vino Blanco (Copa)',
      description: 'Selección de la casa',
      price: '₡5,000'
    }],
    en: [{
      name: 'Escalante Spritz',
      description: 'Aperol, sparkling wine, orange, local herbs',
      price: '₡6,500'
    }, {
      name: 'Mango Passion',
      description: 'White rum, passion fruit, mango, lime',
      price: '₡6,000'
    }, {
      name: 'Costa Rica Old Fashioned',
      description: 'Bourbon, Costa Rican coffee, cacao',
      price: '₡7,200'
    }, {
      name: 'Red Wine (Glass)',
      description: 'House selection',
      price: '₡5,500'
    }, {
      name: 'White Wine (Glass)',
      description: 'House selection',
      price: '₡5,000'
    }]
  },
  chefsTable: {
    es: {
      price: '₡65,000',
      courses: ['Amuse-bouche del día', 'Ceviche de temporada', 'Sopa o crema de la casa', 'Intermezzo de cítricos', 'Plato principal del chef', 'Pre-postre', 'Postre de la casa']
    },
    en: {
      price: '₡65,000',
      courses: ['Amuse-bouche of the day', 'Seasonal ceviche', 'House soup or cream', 'Citrus intermezzo', "Chef's main course", 'Pre-dessert', 'House dessert']
    }
  }
};
const MenuPage = () => {
  const {
    t,
    language
  } = useLanguage();
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
      <section className="py-16 bg-eggshell">
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
              <div className="space-y-6">
                {menuItems.main[language].map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-blueberry">
                        {item.name}
                      </h3>
                      <p className="font-body text-blueberry/60">
                        {item.description}
                      </p>
                    </div>
                    <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">
                      {item.price}
                    </span>
                  </div>)}
              </div>
            </TabsContent>

            {/* Drinks */}
            <TabsContent value="drinks" id="drinks">
              <div className="space-y-6">
                {menuItems.drinks[language].map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-blueberry">
                        {item.name}
                      </h3>
                      <p className="font-body text-blueberry/60">
                        {item.description}
                      </p>
                    </div>
                    <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">
                      {item.price}
                    </span>
                  </div>)}
              </div>
            </TabsContent>

            {/* Chef's Table */}
            <TabsContent value="chefs-table" id="chefs-table">
              <div className="bg-blueberry rounded-lg p-8 md:p-12 text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-eggshell">
                    {t.menuPage.chefsTable}
                  </h3>
                  <p className="font-body text-asparagus">
                    {t.menuPage.chefsTableNote}
                  </p>
                  
                </div>

                <div className="max-w-md mx-auto">
                  <ul className="space-y-3">
                    {menuItems.chefsTable[language].courses.map((course, index) => <li key={index} className="font-body text-wafer flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-asparagus/30 flex items-center justify-center text-sm text-eggshell">
                          {index + 1}
                        </span>
                        {course}
                      </li>)}
                  </ul>
                </div>

                <Button asChild className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-8 transition-all duration-300">
                  <a href="https://www.opentable.com" target="_blank" rel="noopener noreferrer">
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