const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Supported languages
const languages = ['en', 'tr', 'es', 'pt', 'de', 'fr', 'ru', 'ro', 'it', 'pl', 'ar'];

// Translation mappings for service names and descriptions
const translations = {
  // Category translations
  categories: {
    'Plastic Surgery': {
      en: 'Plastic Surgery',
      tr: 'Plastik Cerrahi',
      es: 'Cirugía Plástica',
      pt: 'Cirurgia Plástica',
      de: 'Plastische Chirurgie',
      fr: 'Chirurgie Plastique',
      ru: 'Пластическая Хирургия',
      ro: 'Chirurgie Plastică',
      it: 'Chirurgia Plastica',
      pl: 'Chirurgia Plastyczna',
      ar: 'الجراحة التجميلية'
    },
    'Dental Treatments': {
      en: 'Dental Treatments',
      tr: 'Diş Tedavileri',
      es: 'Tratamientos Dentales',
      pt: 'Tratamentos Dentários',
      de: 'Zahnbehandlungen',
      fr: 'Traitements Dentaires',
      ru: 'Стоматологические Процедуры',
      ro: 'Tratamente Dentare',
      it: 'Trattamenti Dentali',
      pl: 'Zabiegi Dentystyczne',
      ar: 'علاجات الأسنان'
    },
    'Hair Transplant': {
      en: 'Hair Transplant',
      tr: 'Saç Ekimi',
      es: 'Trasplante de Cabello',
      pt: 'Transplante Capilar',
      de: 'Haartransplantation',
      fr: 'Greffe de Cheveux',
      ru: 'Пересадка Волос',
      ro: 'Transplant de Păr',
      it: 'Trapianto di Capelli',
      pl: 'Przeszczep Włosów',
      ar: 'زراعة الشعر'
    }
  },

  // Service translations
  services: {
    'Liposuction': {
      en: 'Liposuction',
      tr: 'Liposuction',
      es: 'Liposucción',
      pt: 'Lipoaspiração',
      de: 'Fettabsaugung',
      fr: 'Liposuccion',
      ru: 'Липосакция',
      ro: 'Liposucție',
      it: 'Liposuzione',
      pl: 'Liposukcja',
      ar: 'شفط الدهون'
    },
    'Brazilian Butt Lift (BBL)': {
      en: 'Brazilian Butt Lift (BBL)',
      tr: 'Brezilyalı Kalça Kaldırma',
      es: 'Levantamiento de Glúteos Brasileño',
      pt: 'Levantamento de Glúteos Brasileiro',
      de: 'Brazilian Butt Lift',
      fr: 'Lifting Brésilien des Fesses',
      ru: 'Бразильская Подтяжка Ягодиц',
      ro: 'Lifting Brazilian de Fese',
      it: 'Lifting Brasiliano dei Glutei',
      pl: 'Brazylijskie Podniesienie Pośladków',
      ar: 'رفع الأرداف البرازيلي'
    },
    'Thigh Lift': {
      en: 'Thigh Lift',
      tr: 'Uyluk Germe',
      es: 'Levantamiento de Muslos',
      pt: 'Lifting de Coxas',
      de: 'Oberschenkelstraffung',
      fr: 'Lifting des Cuisses',
      ru: 'Подтяжка Бедер',
      ro: 'Lifting de Coapse',
      it: 'Lifting delle Cosce',
      pl: 'Lifting Ud',
      ar: 'شد الفخذين'
    },
    'Tummy Tuck': {
      en: 'Tummy Tuck',
      tr: 'Karın Germe',
      es: 'Abdominoplastia',
      pt: 'Abdominoplastia',
      de: 'Bauchdeckenstraffung',
      fr: 'Abdominoplastie',
      ru: 'Абдоминопластика',
      ro: 'Abdominoplastie',
      it: 'Addominoplastica',
      pl: 'Plastyka Brzucha',
      ar: 'شد البطن'
    },
    'Arm Lift': {
      en: 'Arm Lift',
      tr: 'Kol Germe',
      es: 'Levantamiento de Brazos',
      pt: 'Lifting de Braços',
      de: 'Armstraffung',
      fr: 'Lifting des Bras',
      ru: 'Подтяжка Рук',
      ro: 'Lifting de Brațe',
      it: 'Lifting delle Braccia',
      pl: 'Lifting Ramion',
      ar: 'شد الذراعين'
    },
    'Abdominal Muscle Aesthetics (Six Pack)': {
      en: 'Six Pack Surgery',
      tr: 'Karın Kası Estetiği',
      es: 'Cirugía de Abdominales',
      pt: 'Cirurgia do Abdômen',
      de: 'Bauchmuskel-Ästhetik',
      fr: 'Chirurgie des Abdominaux',
      ru: 'Эстетика Мышц Живота',
      ro: 'Estetica Mușchilor Abdominali',
      it: 'Estetica Muscoli Addominali',
      pl: 'Estetyka Mięśni Brzucha',
      ar: 'جراحة عضلات البطن'
    },
    'Breast Augmentation': {
      en: 'Breast Augmentation',
      tr: 'Meme Büyütme',
      es: 'Aumento de Senos',
      pt: 'Aumento de Seios',
      de: 'Brustvergrößerung',
      fr: 'Augmentation Mammaire',
      ru: 'Увеличение Груди',
      ro: 'Mărirea Sânilor',
      it: 'Aumento del Seno',
      pl: 'Powiększanie Piersi',
      ar: 'تكبير الثدي'
    },
    'Breast Lift': {
      en: 'Breast Lift',
      tr: 'Meme Dikleştirme',
      es: 'Levantamiento de Senos',
      pt: 'Lifting de Seios',
      de: 'Bruststraffung',
      fr: 'Lifting des Seins',
      ru: 'Подтяжка Груди',
      ro: 'Lifting de Sâni',
      it: 'Lifting del Seno',
      pl: 'Lifting Piersi',
      ar: 'شد الثدي'
    },
    'Breast Reduction': {
      en: 'Breast Reduction',
      tr: 'Meme Küçültme',
      es: 'Reducción de Senos',
      pt: 'Redução de Seios',
      de: 'Brustverkleinerung',
      fr: 'Réduction Mammaire',
      ru: 'Уменьшение Груди',
      ro: 'Micșorarea Sânilor',
      it: 'Riduzione del Seno',
      pl: 'Zmniejszanie Piersi',
      ar: 'تصغير الثدي'
    },
    'Gynecomastia': {
      en: 'Gynecomastia',
      tr: 'Jinekomasti',
      es: 'Ginecomastia',
      pt: 'Ginecomastia',
      de: 'Gynäkomastie',
      fr: 'Gynécomastie',
      ru: 'Гинекомастия',
      ro: 'Ginecomasție',
      it: 'Ginecomastia',
      pl: 'Ginekomastia',
      ar: 'التثدي'
    },
    'Brow Lift': {
      en: 'Brow Lift',
      tr: 'Kaş Kaldırma',
      es: 'Levantamiento de Cejas',
      pt: 'Lifting de Sobrancelhas',
      de: 'Stirnlifting',
      fr: 'Lifting des Sourcils',
      ru: 'Подтяжка Бровей',
      ro: 'Lifting de Sprâncene',
      it: 'Lifting delle Sopracciglia',
      pl: 'Lifting Brwi',
      ar: 'رفع الحاجب'
    },
    'Facelift': {
      en: 'Facelift',
      tr: 'Yüz Germe',
      es: 'Lifting Facial',
      pt: 'Lifting Facial',
      de: 'Facelift',
      fr: 'Lifting du Visage',
      ru: 'Подтяжка Лица',
      ro: 'Lifting Facial',
      it: 'Lifting del Viso',
      pl: 'Lifting Twarzy',
      ar: 'شد الوجه'
    },
    'Nose Aesthetics (Rhinoplasty)': {
      en: 'Rhinoplasty',
      tr: 'Burun Estetiği',
      es: 'Rinoplastia',
      pt: 'Rinoplastia',
      de: 'Nasenkorrektur',
      fr: 'Rhinoplastie',
      ru: 'Ринопластика',
      ro: 'Rinoplastie',
      it: 'Rinoplastica',
      pl: 'Operacja Nosa',
      ar: 'تجميل الأنف'
    },
    'Eyelid Surgery': {
      en: 'Eyelid Surgery',
      tr: 'Göz Kapağı Estetiği',
      es: 'Cirugía de Párpados',
      pt: 'Cirurgia de Pálpebras',
      de: 'Lidkorrektur',
      fr: 'Chirurgie des Paupières',
      ru: 'Блефаропластика',
      ro: 'Chirurgia Pleoapelor',
      it: 'Chirurgia delle Palpebre',
      pl: 'Chirurgia Powiek',
      ar: 'جراحة الجفون'
    },
    'Fat Transfer to Face': {
      en: 'Fat Transfer to Face',
      tr: 'Yüze Yağ Enjeksiyonu',
      es: 'Transferencia de Grasa Facial',
      pt: 'Transferência de Gordura Facial',
      de: 'Eigenfetttransfer Gesicht',
      fr: 'Transfert de Graisse Facial',
      ru: 'Пересадка Жира в Лицо',
      ro: 'Transfer de Grăsime Facială',
      it: 'Trasferimento di Grasso Facciale',
      pl: 'Przeszczep Tłuszczu do Twarzy',
      ar: 'نقل الدهون للوجه'
    },
    'Otoplasty': {
      en: 'Otoplasty',
      tr: 'Kulak Estetiği',
      es: 'Otoplastia',
      pt: 'Otoplastia',
      de: 'Ohrenkorrektur',
      fr: 'Otoplastie',
      ru: 'Отопластика',
      ro: 'Otoplastie',
      it: 'Otoplastica',
      pl: 'Otoplastyka',
      ar: 'تجميل الأذن'
    },
    'Bichectomy': {
      en: 'Bichectomy',
      tr: 'Bişektomi',
      es: 'Bichectomía',
      pt: 'Bichectomia',
      de: 'Bichektomie',
      fr: 'Bichectomie',
      ru: 'Бишектомия',
      ro: 'Bichectomie',
      it: 'Bichectomia',
      pl: 'Bichektomia',
      ar: 'استئصال الخد'
    },
    'Forehead Lifting': {
      en: 'Forehead Lifting',
      tr: 'Alın Germe',
      es: 'Levantamiento de Frente',
      pt: 'Lifting de Testa',
      de: 'Stirnlifting',
      fr: 'Lifting du Front',
      ru: 'Подтяжка Лба',
      ro: 'Lifting de Frunte',
      it: 'Lifting della Fronte',
      pl: 'Lifting Czoła',
      ar: 'شد الجبهة'
    },
    'Neck Lift': {
      en: 'Neck Lift',
      tr: 'Boyun Germe',
      es: 'Levantamiento de Cuello',
      pt: 'Lifting de Pescoço',
      de: 'Halslifting',
      fr: 'Lifting du Cou',
      ru: 'Подтяжка Шеи',
      ro: 'Lifting de Gât',
      it: 'Lifting del Collo',
      pl: 'Lifting Szyi',
      ar: 'شد الرقبة'
    },
    'Botox': {
      en: 'Botox',
      tr: 'Botoks',
      es: 'Bótox',
      pt: 'Botox',
      de: 'Botox',
      fr: 'Botox',
      ru: 'Ботокс',
      ro: 'Botox',
      it: 'Botox',
      pl: 'Botoks',
      ar: 'البوتوكس'
    },
    'Implants': {
      en: 'Dental Implants',
      tr: 'Diş İmplantı',
      es: 'Implantes Dentales',
      pt: 'Implantes Dentários',
      de: 'Zahnimplantate',
      fr: 'Implants Dentaires',
      ru: 'Зубные Имплантаты',
      ro: 'Implanturi Dentare',
      it: 'Impianti Dentali',
      pl: 'Implanty Zębowe',
      ar: 'زراعة الأسنان'
    },
    'Canal Root': {
      en: 'Root Canal Treatment',
      tr: 'Kanal Tedavisi',
      es: 'Tratamiento de Conducto',
      pt: 'Tratamento de Canal',
      de: 'Wurzelkanalbehandlung',
      fr: 'Traitement de Canal',
      ru: 'Лечение Корневых Каналов',
      ro: 'Tratament de Canal',
      it: 'Trattamento Canalare',
      pl: 'Leczenie Kanałowe',
      ar: 'علاج قناة الجذر'
    },
    'Hollywood Smile': {
      en: 'Hollywood Smile',
      tr: 'Hollywood Gülüş',
      es: 'Sonrisa de Hollywood',
      pt: 'Sorriso de Hollywood',
      de: 'Hollywood Lächeln',
      fr: 'Sourire Hollywood',
      ru: 'Голливудская Улыбка',
      ro: 'Zâmbet Hollywood',
      it: 'Sorriso Hollywood',
      pl: 'Uśmiech Hollywood',
      ar: 'ابتسامة هوليوود'
    },
    'Dental Veneers': {
      en: 'Dental Veneers',
      tr: 'Diş Kaplaması',
      es: 'Carillas Dentales',
      pt: 'Facetas Dentárias',
      de: 'Veneers',
      fr: 'Facettes Dentaires',
      ru: 'Виниры',
      ro: 'Fațete Dentare',
      it: 'Faccette Dentali',
      pl: 'Licówki Zębowe',
      ar: 'قشور الأسنان'
    },
    'Zirconium Crowns': {
      en: 'Zirconium Crowns',
      tr: 'Zirkonyum Kaplama',
      es: 'Coronas de Zirconio',
      pt: 'Coroas de Zircônia',
      de: 'Zirkonkronen',
      fr: 'Couronnes en Zircone',
      ru: 'Циркониевые Коронки',
      ro: 'Coroane de Zirconiu',
      it: 'Corone in Zirconia',
      pl: 'Korony Cyrkonowe',
      ar: 'تيجان الزركونيوم'
    },
    'Digital Smile Design': {
      en: 'Digital Smile Design',
      tr: 'Dijital Gülüş Tasarımı',
      es: 'Diseño Digital de Sonrisa',
      pt: 'Design Digital do Sorriso',
      de: 'Digitales Lächeln Design',
      fr: 'Conception Numérique du Sourire',
      ru: 'Цифровой Дизайн Улыбки',
      ro: 'Design Digital al Zâmbetului',
      it: 'Design Digitale del Sorriso',
      pl: 'Cyfrowy Projekt Uśmiechu',
      ar: 'تصميم الابتسامة الرقمي'
    },
    'Gum Aesthetics': {
      en: 'Gum Aesthetics',
      tr: 'Diş Eti Estetiği',
      es: 'Estética de Encías',
      pt: 'Estética Gengival',
      de: 'Zahnfleischästhetik',
      fr: 'Esthétique Gingivale',
      ru: 'Эстетика Десен',
      ro: 'Estetica Gingivală',
      it: 'Estetica Gengivale',
      pl: 'Estetyka Dziąseł',
      ar: 'تجميل اللثة'
    },
    'Teeth Whitening': {
      en: 'Teeth Whitening',
      tr: 'Diş Beyazlatma',
      es: 'Blanqueamiento Dental',
      pt: 'Clareamento Dental',
      de: 'Zahnaufhellung',
      fr: 'Blanchiment Dentaire',
      ru: 'Отбеливание Зубов',
      ro: 'Albirea Dinților',
      it: 'Sbiancamento Dentale',
      pl: 'Wybielanie Zębów',
      ar: 'تبييض الأسنان'
    },
    'FUE Hair Transplant': {
      en: 'FUE Hair Transplant',
      tr: 'FUE Saç Ekimi',
      es: 'Trasplante FUE',
      pt: 'Transplante FUE',
      de: 'FUE Haartransplantation',
      fr: 'Greffe FUE',
      ru: 'Пересадка FUE',
      ro: 'Transplant FUE',
      it: 'Trapianto FUE',
      pl: 'Przeszczep FUE',
      ar: 'زراعة الشعر بتقنية FUE'
    },
    'DHI Hair Transplant': {
      en: 'DHI Hair Transplant',
      tr: 'DHI Saç Ekimi',
      es: 'Trasplante DHI',
      pt: 'Transplante DHI',
      de: 'DHI Haartransplantation',
      fr: 'Greffe DHI',
      ru: 'Пересадка DHI',
      ro: 'Transplant DHI',
      it: 'Trapianto DHI',
      pl: 'Przeszczep DHI',
      ar: 'زراعة الشعر بتقنية DHI'
    },
    'Unshaven Hair Transplant': {
      en: 'Unshaven Hair Transplant',
      tr: 'Tıraşsız Saç Ekimi',
      es: 'Trasplante Sin Afeitar',
      pt: 'Transplante Sem Raspar',
      de: 'Unrasierte Haartransplantation',
      fr: 'Greffe Sans Rasage',
      ru: 'Пересадка Без Бритья',
      ro: 'Transplant Fără Ras',
      it: 'Trapianto Senza Rasatura',
      pl: 'Przeszczep Bez Golenia',
      ar: 'زراعة الشعر بدون حلاقة'
    },
    'Stem Cell Hair Transplant': {
      en: 'Stem Cell Hair Transplant',
      tr: 'Kök Hücre Saç Ekimi',
      es: 'Trasplante con Células Madre',
      pt: 'Transplante com Células-Tronco',
      de: 'Stammzellen Haartransplantation',
      fr: 'Greffe Cellules Souches',
      ru: 'Пересадка Стволовыми Клетками',
      ro: 'Transplant Celule Stem',
      it: 'Trapianto Cellule Staminali',
      pl: 'Przeszczep Komórkami Macierzystymi',
      ar: 'زراعة الشعر بالخلايا الجذعية'
    },
    'FUE Sapphire Hair Transplantation': {
      en: 'FUE Sapphire Hair Transplant',
      tr: 'FUE Safir Saç Ekimi',
      es: 'Trasplante FUE Zafiro',
      pt: 'Transplante FUE Safira',
      de: 'FUE Saphir Haartransplantation',
      fr: 'Greffe FUE Saphir',
      ru: 'Пересадка FUE Сапфир',
      ro: 'Transplant FUE Safir',
      it: 'Trapianto FUE Zaffiro',
      pl: 'Przeszczep FUE Szafir',
      ar: 'زراعة الشعر FUE بالياقوت'
    },
    'FUT Hair Transplant': {
      en: 'FUT Hair Transplant',
      tr: 'FUT Saç Ekimi',
      es: 'Trasplante FUT',
      pt: 'Transplante FUT',
      de: 'FUT Haartransplantation',
      fr: 'Greffe FUT',
      ru: 'Пересадка FUT',
      ro: 'Transplant FUT',
      it: 'Trapianto FUT',
      pl: 'Przeszczep FUT',
      ar: 'زراعة الشعر بتقنية FUT'
    }
  }
};

// Package details for different service types
const packageDetails = {
  'Plastic Surgery': {
    timeInTurkey: '7-10 days',
    operationTime: '2-4 hours',
    hospitalStay: '1-2 nights',
    recovery: '2-4 weeks',
    accommodation: '4-star hotel',
    transportation: 'VIP transfer included',
    anesthesia: 'General anesthesia'
  },
  'Dental Treatments': {
    timeInTurkey: '5-7 days',
    operationTime: '1-3 hours',
    hospitalStay: 'Outpatient',
    recovery: '1-2 weeks',
    accommodation: '4-star hotel',
    transportation: 'VIP transfer included',
    anesthesia: 'Local anesthesia'
  },
  'Hair Transplant': {
    timeInTurkey: '3-5 days',
    operationTime: '6-8 hours',
    hospitalStay: 'Outpatient',
    recovery: '10-14 days',
    accommodation: '4-star hotel',
    transportation: 'VIP transfer included',
    anesthesia: 'Local anesthesia'
  }
};

async function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
}

async function createCategoryIfNotExists(categoryName) {
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  let category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    const categoryTranslations = translations.categories[categoryName];
    if (!categoryTranslations) {
      console.log(`⚠️ No translations found for category: ${categoryName}`);
      return null;
    }

    category = await prisma.category.create({
      data: {
        slug: categorySlug,
        name: categoryTranslations.en,
        description: `Professional ${categoryTranslations.en} services in Istanbul`,
        orderIndex: Object.keys(translations.categories).indexOf(categoryName) + 1,
        imageUrl: `/images/categories/${categorySlug}.jpg`
      }
    });
    
    console.log(`✅ Created category: ${categoryName}`);
  }

  return category;
}

async function createService(serviceData, category) {
  const serviceTranslations = translations.services[serviceData.service_name];
  if (!serviceTranslations) {
    console.log(`⚠️ No translations found for service: ${serviceData.service_name}`);
    return;
  }

  const packageDetail = packageDetails[serviceData.category];

  // Create service translations
  const serviceTranslationData = languages.map(lang => ({
    language: lang,
    title: serviceTranslations[lang] || serviceTranslations.en,
    description: `Professional ${serviceTranslations[lang] || serviceTranslations.en} treatment in Istanbul with experienced surgeons and modern facilities.`
  }));

  try {
    const service = await prisma.service.create({
      data: {
        title: serviceTranslations.en, // Base title in English
        slug: serviceData.slug,
        description: `Professional ${serviceTranslations.en} treatment in Istanbul`,
        categoryId: category.id,
        timeInTurkey: packageDetail.timeInTurkey,
        operationTime: packageDetail.operationTime,
        hospitalStay: packageDetail.hospitalStay,
        recovery: packageDetail.recovery,
        accommodation: packageDetail.accommodation,
        transportation: packageDetail.transportation,
        anesthesia: packageDetail.anesthesia,
        translations: {
          create: serviceTranslationData
        }
      }
    });

    console.log(`✅ Created service: ${serviceData.service_name} (${serviceData.slug})`);
    return service;
  } catch (error) {
    console.error(`❌ Error creating service ${serviceData.service_name}:`, error.message);
  }
}

async function importServices() {
  try {
    console.log('🚀 Starting service import...');
    
    // Parse CSV
    const csvPath = path.join(__dirname, '..', 'services-data.csv');
    const servicesData = await parseCSV(csvPath);
    
    console.log(`📋 Found ${servicesData.length} services to import`);

    // Group services by category
    const servicesByCategory = {};
    servicesData.forEach(service => {
      if (!servicesByCategory[service.category]) {
        servicesByCategory[service.category] = [];
      }
      servicesByCategory[service.category].push(service);
    });

    // Process each category
    for (const [categoryName, services] of Object.entries(servicesByCategory)) {
      console.log(`\n📁 Processing category: ${categoryName}`);
      
      const category = await createCategoryIfNotExists(categoryName);
      if (!category) continue;

      // Create services in this category
      for (const serviceData of services) {
        await createService(serviceData, category);
      }
    }

    console.log('\n🎉 Import completed successfully!');
    
    // Show summary
    const totalServices = await prisma.service.count();
    const totalCategories = await prisma.category.count();
    
    console.log(`\n📊 Final Summary:`);
    console.log(`   Categories: ${totalCategories}`);
    console.log(`   Services: ${totalServices}`);
    console.log(`   Languages: ${languages.length}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importServices(); 