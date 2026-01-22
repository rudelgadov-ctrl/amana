import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Menu items organized by category
const menuItems = {
  main: {
    es: {
      starters: [
        { name: 'Soursop Ceviche [v]', description: 'Naranjilla y rocoto · mantequilla de marañón · cebolla morada · chips de plátano · aguacate', price: '₡5,500' },
        { name: 'Steamed Buns', description: 'Lengua de res estofada · salsa macha · miel picante', price: '₡6,000' },
        { name: 'Calamari & Potato', description: 'Croqueta de papa · mayonesa de soya y limón · yema de huevo · katsuobushi', price: '₡6,800' },
        { name: 'Aji & Goldenberry Tiradito', description: 'Pescado fresco · ají peruano y uchuva · cebolla frita · aceite de gochugaru · mango y cilantro · chips de plátano', price: '₡7,500' },
        { name: 'Arancinis [v]', description: 'Bolitas de risotto frito · queso de cabra · alioli de pimentón ahumado', price: '₡8,000' },
      ],
      mains: [
        { name: 'Broccoli and Hummus [v]', description: 'Hummus de cilantro · queso feta · vinagre balsámico de manzana · chips de ajo', price: '₡7,500' },
        { name: 'Grilled Chicken Breast and Wing', description: 'Salsa de curry · espuma de coco · cebollas crocantes con cebollín · daikon y apio', price: '₡8,900' },
        { name: 'Crispy Porkbelly', description: 'Panceta de cerdo · frijoles refritos · mole rojo', price: '₡9,500' },
        { name: 'Mahi-Mahi al Pastor', description: 'Salsa adobo · puré de piña · piña verde picada y cebolla morada · cilantro y zanahoria', price: '₡11,500' },
        { name: 'Octopus & Crab Broth', description: 'Frijoles blancos · caldo de cangrejo · plátano maduro · pesto de cilantro', price: '₡14,500' },
        { name: 'Outside Skirt Risotto', description: 'Aceite de tomate · ajo confitado · pimientos dulces picados y semillas de mostaza · arúgula · jugo de carne', price: '₡15,500' },
      ],
      desserts: [
        { name: 'Cas and Dulce de Leche', description: 'Helado de cas · granita de cas · espuma de dulce de leche · crumble', price: '₡5,000' },
        { name: 'Seasonal Dessert', description: 'Postre de temporada del chef', price: 'Precio variable' },
      ]
    },
    en: {
      starters: [
        { name: 'Soursop Ceviche [v]', description: 'Naranjilla and rocoto · cashew butter · red onions · plantain chips · avocado', price: '₡5,500' },
        { name: 'Steamed Buns', description: 'Stewed beef tongue · macha sauce · spicy honey', price: '₡6,000' },
        { name: 'Calamari & Potato', description: 'Potato croquette · soy and lemon mayo · egg yolk · katsuobushi', price: '₡6,800' },
        { name: 'Aji & Goldenberry Tiradito', description: 'Fresh fish · peruvian chili pepper and golden berry · fried onion · gochugaru oil · mango and cilantro · plantain chips', price: '₡7,500' },
        { name: 'Arancinis [v]', description: 'Fried risotto balls · goat cream cheese · smoked paprika alioli', price: '₡8,000' },
      ],
      mains: [
        { name: 'Broccoli and Hummus [v]', description: 'Cilantro hummus · feta cheese · apple balsamic vinegar · garlic chips', price: '₡7,500' },
        { name: 'Grilled Chicken Breast and Wing', description: 'Curry sauce · coconut foam · crunchy onions with chives · daikon and celery', price: '₡8,900' },
        { name: 'Crispy Porkbelly', description: 'Porkbelly · refried large beans · red mole', price: '₡9,500' },
        { name: 'Mahi-Mahi al Pastor', description: 'Adobo sauce · pineapple pureé · chopped green pineapple and red onion · cilantro and carrot', price: '₡11,500' },
        { name: 'Octopus & Crab Broth', description: 'White beans · crab broth · sweet plantain · cilantro pesto', price: '₡14,500' },
        { name: 'Outside Skirt Risotto', description: 'Tomato oil · garlic confit · chopped sweet peppers & mustard seeds · arugula · meat jus', price: '₡15,500' },
      ],
      desserts: [
        { name: 'Cas and Dulce de Leche', description: 'Cas ice cream · cas granita · dulce de leche foam · crumble', price: '₡5,000' },
        { name: 'Seasonal Dessert', description: "Chef's seasonal dessert", price: 'Variable price' },
      ]
    }
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
              <div className="space-y-12">
                {/* Starters */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Entradas' : 'Starters'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.main[language].starters.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
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
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mains */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Platos Fuertes' : 'Mains'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.main[language].mains.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
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
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desserts */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Postres' : 'Desserts'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.main[language].desserts.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
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
                      </div>
                    ))}
                  </div>
                </div>
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