import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Menu items organized by category
const menuItems = {
  main: {
    es: {
      starters: [{
        name: 'Soursop Ceviche [v]',
        description: 'Naranjilla y rocoto · mantequilla de marañón · cebolla morada · chips de plátano · aguacate',
        price: '₡5,500'
      }, {
        name: 'Steamed Buns',
        description: 'Lengua de res estofada · salsa macha · miel picante',
        price: '₡6,000'
      }, {
        name: 'Calamari & Potato',
        description: 'Croqueta de papa · mayonesa de soya y limón · yema de huevo · katsuobushi',
        price: '₡6,800'
      }, {
        name: 'Aji & Goldenberry Tiradito',
        description: 'Pescado fresco · ají peruano y uchuva · cebolla frita · aceite de gochugaru · mango y cilantro · chips de plátano',
        price: '₡7,500'
      }, {
        name: 'Arancinis [v]',
        description: 'Bolitas de risotto frito · queso de cabra · alioli de pimentón ahumado',
        price: '₡8,000'
      }],
      mains: [{
        name: 'Broccoli and Hummus [v]',
        description: 'Hummus de cilantro · queso feta · vinagre balsámico de manzana · chips de ajo',
        price: '₡7,500'
      }, {
        name: 'Grilled Chicken Breast and Wing',
        description: 'Salsa de curry · espuma de coco · cebollas crocantes con cebollín · daikon y apio',
        price: '₡8,900'
      }, {
        name: 'Crispy Porkbelly',
        description: 'Panceta de cerdo · frijoles refritos · mole rojo',
        price: '₡9,500'
      }, {
        name: 'Mahi-Mahi al Pastor',
        description: 'Salsa adobo · puré de piña · piña verde picada y cebolla morada · cilantro y zanahoria',
        price: '₡11,500'
      }, {
        name: 'Octopus & Crab Broth',
        description: 'Frijoles blancos · caldo de cangrejo · plátano maduro · pesto de cilantro',
        price: '₡14,500'
      }, {
        name: 'Outside Skirt Risotto',
        description: 'Aceite de tomate · ajo confitado · pimientos dulces picados y semillas de mostaza · arúgula · jugo de carne',
        price: '₡15,500'
      }],
      desserts: [{
        name: 'Cas and Dulce de Leche',
        description: 'Helado de cas · granita de cas · espuma de dulce de leche · crumble',
        price: '₡5,000'
      }, {
        name: 'Seasonal Dessert',
        description: 'Postre de temporada del chef',
        price: 'Precio variable'
      }]
    },
    en: {
      starters: [{
        name: 'Soursop Ceviche [v]',
        description: 'Naranjilla and rocoto · cashew butter · red onions · plantain chips · avocado',
        price: '₡5,500'
      }, {
        name: 'Steamed Buns',
        description: 'Stewed beef tongue · macha sauce · spicy honey',
        price: '₡6,000'
      }, {
        name: 'Calamari & Potato',
        description: 'Potato croquette · soy and lemon mayo · egg yolk · katsuobushi',
        price: '₡6,800'
      }, {
        name: 'Aji & Goldenberry Tiradito',
        description: 'Fresh fish · peruvian chili pepper and golden berry · fried onion · gochugaru oil · mango and cilantro · plantain chips',
        price: '₡7,500'
      }, {
        name: 'Arancinis [v]',
        description: 'Fried risotto balls · goat cream cheese · smoked paprika alioli',
        price: '₡8,000'
      }],
      mains: [{
        name: 'Broccoli and Hummus [v]',
        description: 'Cilantro hummus · feta cheese · apple balsamic vinegar · garlic chips',
        price: '₡7,500'
      }, {
        name: 'Grilled Chicken Breast and Wing',
        description: 'Curry sauce · coconut foam · crunchy onions with chives · daikon and celery',
        price: '₡8,900'
      }, {
        name: 'Crispy Porkbelly',
        description: 'Porkbelly · refried large beans · red mole',
        price: '₡9,500'
      }, {
        name: 'Mahi-Mahi al Pastor',
        description: 'Adobo sauce · pineapple pureé · chopped green pineapple and red onion · cilantro and carrot',
        price: '₡11,500'
      }, {
        name: 'Octopus & Crab Broth',
        description: 'White beans · crab broth · sweet plantain · cilantro pesto',
        price: '₡14,500'
      }, {
        name: 'Outside Skirt Risotto',
        description: 'Tomato oil · garlic confit · chopped sweet peppers & mustard seeds · arugula · meat jus',
        price: '₡15,500'
      }],
      desserts: [{
        name: 'Cas and Dulce de Leche',
        description: 'Cas ice cream · cas granita · dulce de leche foam · crumble',
        price: '₡5,000'
      }, {
        name: 'Seasonal Dessert',
        description: "Chef's seasonal dessert",
        price: 'Variable price'
      }]
    }
  },
  drinks: {
    es: {
      cocktails: [{
        name: 'Celaya Papaya',
        description: 'Amarás espadin reposado mezcal · papaya & lemon cordial · papaya homemade soda · black lemon bitters · papaya paper',
        price: '₡6,000'
      }, {
        name: 'Amana Paloma',
        description: 'Amaras verde mezcal · lacto-fermented grapefruit cordial · bubbles · chile dulce salt',
        price: '₡5,800'
      }, {
        name: 'Garden Highball',
        description: 'Stolichnaya vodka · fortified wine · lychees · green tea & jasmine · lavender · bubbles',
        price: '₡5,600'
      }, {
        name: 'Fresco Pisco Sour',
        description: 'Barsol pure pisco italia · soursop · lemon balm · lemon zest',
        price: '₡5,800'
      }, {
        name: 'TTT (Tamarind Tequila Tonic)',
        description: 'Milagro white tequila · clarified tamarind · sumac · fever tree tonic',
        price: '₡5,800'
      }, {
        name: 'Cas Gimlet',
        description: "Greenall's gin · cas & fennel cordial · lustau amontillado · cas paper",
        price: '₡5,800'
      }, {
        name: 'Cañas & Coco',
        description: 'Centenario 4 años rum macerated in spearmint & juanilama · lustau amontillado sherry · coconut · spearmint foam',
        price: '₡5,800'
      }, {
        name: 'Terruño Negroni',
        description: 'Amarás cupreata mezcal · chamomile infused cocchi americano · cocchi extra dry vermouth di torino · strega bitter gallio 900',
        price: '₡6,500'
      }, {
        name: 'Amana Dirty Martini',
        description: 'Zubrowka vodka · cocchi extra dry vermouth di torino · pickled green apples · herbal oil',
        price: '₡5,600'
      }, {
        name: 'Classic Cocktails',
        description: 'Pregunta a nuestro personal sobre nuestra selección de cócteles clásicos',
        price: ''
      }],
      lowAlcohol: [{
        name: 'Menthe Tonic (5% abv)',
        description: 'Giffard menthe pastille · fever tree tonic · lemon',
        price: '₡4,500'
      }, {
        name: 'Aperol Spritz (7.6% abv)',
        description: 'Aperol · sparkling wine · club soda',
        price: '₡5,800'
      }, {
        name: 'Highball Americano (4.6% abv)',
        description: 'Campari · lustau vermouth rosso · club soda',
        price: '₡4,500'
      }, {
        name: 'Paloma Spritz (no abv)',
        description: 'Giffard non-alcoholic grapefruit liqueur · homemade grapefruit soda · lactofermented grapefruit cordial · bell pepper salt',
        price: '₡4,500'
      }, {
        name: 'Ginger-Coffee Tonic (no abv)',
        description: 'Giffard non-alcoholic ginger liqueur · bocanegra cold brew · fever tree tonic water',
        price: '₡4,500'
      }, {
        name: 'Amana Pimms Teacup (no abv)',
        description: 'Iced tea · giffard non-alcoholic ginger and grapefruit liqueurs · citric fruit · cucumber · fever tree ginger beer',
        price: '₡4,000'
      }],
      redWine: [{
        name: 'Vino de la Casa',
        description: 'Cabernet sauvignon, syrah',
        price: 'Copa ₡4,000 · Botella ₡16,000'
      }, {
        name: 'Vigneti del Sole',
        description: 'Montepulciano - Abruzzo DOC, Italy',
        price: 'Copa ₡5,000 · Botella ₡21,000'
      }, {
        name: 'Capitan Quesada',
        description: 'Malbec - Mendoza, Argentina',
        price: 'Copa ₡5,200 · Botella ₡22,000'
      }, {
        name: 'Xaneta Tinta de Toro',
        description: 'Tempranillo - DO Toro, Spain',
        price: 'Copa ₡5,200 · Botella ₡22,500'
      }, {
        name: 'Yaya',
        description: 'Pinot Noir - Pfalz, Germany',
        price: 'Copa ₡5,400 · Botella ₡23,000'
      }, {
        name: 'Corte Camari',
        description: "Nero d'Avola - Sicilia DOC, Italy",
        price: 'Botella ₡25,000'
      }, {
        name: 'Morandé Pionero Gran Reserva',
        description: 'Carmenere - Valle del Maipo, Chile',
        price: 'Botella ₡27,000'
      }, {
        name: 'Cerro Añón Gran Reserva',
        description: 'Tempranillo, Graciano - DOCa Rioja, Spain',
        price: 'Botella ₡30,000'
      }, {
        name: 'Altos de Inurrieta',
        description: 'Graciano, Cabernet Sauvignon - DO Navarra, Spain',
        price: 'Botella ₡32,000'
      }, {
        name: 'Wayra Estate',
        description: 'Malbec - Mendoza, Argentina',
        price: 'Botella ₡33,000'
      }, {
        name: 'Esporao Reserva',
        description: 'Cabernet Sauvignon, Alicante Bouschet - Alentejo DOC, Portugal',
        price: 'Botella ₡35,000'
      }, {
        name: 'El Enemigo',
        description: 'Cabernet Franc - Mendoza, Argentina',
        price: 'Botella ₡40,000'
      }],
      whiteWine: [{
        name: 'Vino de la Casa',
        description: 'Sauvignon Blanc',
        price: 'Copa ₡4,000 · Botella ₡16,000'
      }, {
        name: 'Inurrieta Orchidea',
        description: 'Sauvignon Blanc - DO Navarra, Spain',
        price: 'Copa ₡4,800 · Botella ₡20,000'
      }, {
        name: 'Petit Cayeta',
        description: 'Pinot Grigio - DOC Friuli, Italy',
        price: 'Copa ₡5,000 · Botella ₡22,000'
      }, {
        name: 'Bico Amarelo',
        description: 'Alvarinho, Loureiro - Vinho Verde DOC, Portugal',
        price: 'Copa ₡5,200 · Botella ₡23,000'
      }, {
        name: 'Zuccardi Serie A',
        description: 'Torrontes - Maipu, Argentina',
        price: 'Botella ₡25,000'
      }, {
        name: 'A Vaca Cuca',
        description: 'Albariño - DO Rias Baixas, Spain',
        price: 'Botella ₡26,000'
      }, {
        name: 'Godeval',
        description: 'Godello - DO Valdeorras, Spain',
        price: 'Botella ₡28,000'
      }],
      roseWine: [{
        name: 'Xaneta Rosado',
        description: 'Bobal - Utiel-Requena, Spain',
        price: 'Copa ₡5,000 · Botella ₡22,000'
      }, {
        name: 'Belle Glos',
        description: 'Pinot Noir - California, EEUU',
        price: 'Botella ₡25,000'
      }],
      sparklingWine: [{
        name: 'Pinord +&+',
        description: 'Blend, Xarel·lo - Cava, Spain',
        price: 'Copa ₡5,000 · Botella ₡16,000'
      }, {
        name: 'Le Arguille',
        description: 'Prosecco - Prosecco, Italy',
        price: 'Botella ₡30,500'
      }]
    },
    en: {
      cocktails: [{
        name: 'Celaya Papaya',
        description: 'Amarás espadin reposado mezcal · papaya & lemon cordial · papaya homemade soda · black lemon bitters · papaya paper',
        price: '₡6,000'
      }, {
        name: 'Amana Paloma',
        description: 'Amaras verde mezcal · lacto-fermented grapefruit cordial · bubbles · chile dulce salt',
        price: '₡5,800'
      }, {
        name: 'Garden Highball',
        description: 'Stolichnaya vodka · fortified wine · lychees · green tea & jasmine · lavender · bubbles',
        price: '₡5,600'
      }, {
        name: 'Fresco Pisco Sour',
        description: 'Barsol pure pisco italia · soursop · lemon balm · lemon zest',
        price: '₡5,800'
      }, {
        name: 'TTT (Tamarind Tequila Tonic)',
        description: 'Milagro white tequila · clarified tamarind · sumac · fever tree tonic',
        price: '₡5,800'
      }, {
        name: 'Cas Gimlet',
        description: "Greenall's gin · cas & fennel cordial · lustau amontillado · cas paper",
        price: '₡5,800'
      }, {
        name: 'Cañas & Coco',
        description: 'Centenario 4 años rum macerated in spearmint & juanilama · lustau amontillado sherry · coconut · spearmint foam',
        price: '₡5,800'
      }, {
        name: 'Terruño Negroni',
        description: 'Amarás cupreata mezcal · chamomile infused cocchi americano · cocchi extra dry vermouth di torino · strega bitter gallio 900',
        price: '₡6,500'
      }, {
        name: 'Amana Dirty Martini',
        description: 'Zubrowka vodka · cocchi extra dry vermouth di torino · pickled green apples · herbal oil',
        price: '₡5,600'
      }, {
        name: 'Classic Cocktails',
        description: 'Ask our staff about our selection of classic cocktails',
        price: ''
      }],
      lowAlcohol: [{
        name: 'Menthe Tonic (5% abv)',
        description: 'Giffard menthe pastille · fever tree tonic · lemon',
        price: '₡4,500'
      }, {
        name: 'Aperol Spritz (7.6% abv)',
        description: 'Aperol · sparkling wine · club soda',
        price: '₡5,800'
      }, {
        name: 'Highball Americano (4.6% abv)',
        description: 'Campari · lustau vermouth rosso · club soda',
        price: '₡4,500'
      }, {
        name: 'Paloma Spritz (no abv)',
        description: 'Giffard non-alcoholic grapefruit liqueur · homemade grapefruit soda · lactofermented grapefruit cordial · bell pepper salt',
        price: '₡4,500'
      }, {
        name: 'Ginger-Coffee Tonic (no abv)',
        description: 'Giffard non-alcoholic ginger liqueur · bocanegra cold brew · fever tree tonic water',
        price: '₡4,500'
      }, {
        name: 'Amana Pimms Teacup (no abv)',
        description: 'Iced tea · giffard non-alcoholic ginger and grapefruit liqueurs · citric fruit · cucumber · fever tree ginger beer',
        price: '₡4,000'
      }],
      redWine: [{
        name: 'House Wine',
        description: 'Cabernet sauvignon, syrah',
        price: 'Glass ₡4,000 · Bottle ₡16,000'
      }, {
        name: 'Vigneti del Sole',
        description: 'Montepulciano - Abruzzo DOC, Italy',
        price: 'Glass ₡5,000 · Bottle ₡21,000'
      }, {
        name: 'Capitan Quesada',
        description: 'Malbec - Mendoza, Argentina',
        price: 'Glass ₡5,200 · Bottle ₡22,000'
      }, {
        name: 'Xaneta Tinta de Toro',
        description: 'Tempranillo - DO Toro, Spain',
        price: 'Glass ₡5,200 · Bottle ₡22,500'
      }, {
        name: 'Yaya',
        description: 'Pinot Noir - Pfalz, Germany',
        price: 'Glass ₡5,400 · Bottle ₡23,000'
      }, {
        name: 'Corte Camari',
        description: "Nero d'Avola - Sicilia DOC, Italy",
        price: 'Bottle ₡25,000'
      }, {
        name: 'Morandé Pionero Gran Reserva',
        description: 'Carmenere - Valle del Maipo, Chile',
        price: 'Bottle ₡27,000'
      }, {
        name: 'Cerro Añón Gran Reserva',
        description: 'Tempranillo, Graciano - DOCa Rioja, Spain',
        price: 'Bottle ₡30,000'
      }, {
        name: 'Altos de Inurrieta',
        description: 'Graciano, Cabernet Sauvignon - DO Navarra, Spain',
        price: 'Bottle ₡32,000'
      }, {
        name: 'Wayra Estate',
        description: 'Malbec - Mendoza, Argentina',
        price: 'Bottle ₡33,000'
      }, {
        name: 'Esporao Reserva',
        description: 'Cabernet Sauvignon, Alicante Bouschet - Alentejo DOC, Portugal',
        price: 'Bottle ₡35,000'
      }, {
        name: 'El Enemigo',
        description: 'Cabernet Franc - Mendoza, Argentina',
        price: 'Bottle ₡40,000'
      }],
      whiteWine: [{
        name: 'House Wine',
        description: 'Sauvignon Blanc',
        price: 'Glass ₡4,000 · Bottle ₡16,000'
      }, {
        name: 'Inurrieta Orchidea',
        description: 'Sauvignon Blanc - DO Navarra, Spain',
        price: 'Glass ₡4,800 · Bottle ₡20,000'
      }, {
        name: 'Petit Cayeta',
        description: 'Pinot Grigio - DOC Friuli, Italy',
        price: 'Glass ₡5,000 · Bottle ₡22,000'
      }, {
        name: 'Bico Amarelo',
        description: 'Alvarinho, Loureiro - Vinho Verde DOC, Portugal',
        price: 'Glass ₡5,200 · Bottle ₡23,000'
      }, {
        name: 'Zuccardi Serie A',
        description: 'Torrontes - Maipu, Argentina',
        price: 'Bottle ₡25,000'
      }, {
        name: 'A Vaca Cuca',
        description: 'Albariño - DO Rias Baixas, Spain',
        price: 'Bottle ₡26,000'
      }, {
        name: 'Godeval',
        description: 'Godello - DO Valdeorras, Spain',
        price: 'Bottle ₡28,000'
      }],
      roseWine: [{
        name: 'Xaneta Rosado',
        description: 'Bobal - Utiel-Requena, Spain',
        price: 'Glass ₡5,000 · Bottle ₡22,000'
      }, {
        name: 'Belle Glos',
        description: 'Pinot Noir - California, USA',
        price: 'Bottle ₡25,000'
      }],
      sparklingWine: [{
        name: 'Pinord +&+',
        description: 'Blend, Xarel·lo - Cava, Spain',
        price: 'Glass ₡5,000 · Bottle ₡16,000'
      }, {
        name: 'Le Arguille',
        description: 'Prosecco - Prosecco, Italy',
        price: 'Bottle ₡30,500'
      }]
    }
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
              <div className="space-y-12">
                {/* Starters */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Entradas' : 'Starters'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.main[language].starters.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
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
                </div>

                {/* Mains */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Platos Fuertes' : 'Mains'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.main[language].mains.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
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
                </div>

                {/* Desserts */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Postres' : 'Desserts'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.main[language].desserts.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
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
                </div>
              </div>
            </TabsContent>

            {/* Drinks */}
            <TabsContent value="drinks" id="drinks">
              <div className="space-y-12">
                {/* Cocktails */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Cócteles' : 'Cocktails'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.drinks[language].cocktails.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-bold text-blueberry">{item.name}</h3>
                          <p className="font-body text-blueberry/60">{item.description}</p>
                        </div>
                        {item.price && <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">{item.price}</span>}
                      </div>)}
                  </div>
                </div>

                {/* Low/No Alcohol */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Cócteles Bajos/Sin Alcohol' : 'Low/No Alcohol Cocktails'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.drinks[language].lowAlcohol.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-bold text-blueberry">{item.name}</h3>
                          <p className="font-body text-blueberry/60">{item.description}</p>
                        </div>
                        <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">{item.price}</span>
                      </div>)}
                  </div>
                </div>

                {/* Red Wine */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Vino Tinto' : 'Red Wine'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.drinks[language].redWine.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-bold text-blueberry">{item.name}</h3>
                          <p className="font-body text-blueberry/60">{item.description}</p>
                        </div>
                        <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">{item.price}</span>
                      </div>)}
                  </div>
                </div>

                {/* White Wine */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Vino Blanco' : 'White Wine'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.drinks[language].whiteWine.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-bold text-blueberry">{item.name}</h3>
                          <p className="font-body text-blueberry/60">{item.description}</p>
                        </div>
                        <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">{item.price}</span>
                      </div>)}
                  </div>
                </div>

                {/* Rosé Wine */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Vino Rosado' : 'Rosé Wine'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.drinks[language].roseWine.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-bold text-blueberry">{item.name}</h3>
                          <p className="font-body text-blueberry/60">{item.description}</p>
                        </div>
                        <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">{item.price}</span>
                      </div>)}
                  </div>
                </div>

                {/* Sparkling Wine */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-blueberry mb-6 text-center">
                    {language === 'es' ? 'Vino Espumante' : 'Sparkling Wine'}
                  </h2>
                  <div className="space-y-6">
                    {menuItems.drinks[language].sparklingWine.map((item, index) => <div key={index} className="flex justify-between items-start pb-6 border-b border-asparagus/20 last:border-0">
                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-bold text-blueberry">{item.name}</h3>
                          <p className="font-body text-blueberry/60">{item.description}</p>
                        </div>
                        <span className="font-body font-medium text-blueberry whitespace-nowrap ml-4">{item.price}</span>
                      </div>)}
                  </div>
                </div>
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