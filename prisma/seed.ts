import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// Helper function to create JSON string for translations
function createTranslationString(en: string, tr: string) {
  return JSON.stringify({ en, tr });
}

const prisma = new PrismaClient();

// Admin user details
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin User';

// Services data from CSV with proper categorization
const servicesData = [
  {
    categoryName: 'Dental',
    categorySlug: 'dental',
    services: [
      {
        title: 'Digital Smile Design',
        slug: 'digital-smile-design',
        description: 'Digital Smile Design (DSD) is an innovative process that uses advanced technology to create a customized smile tailored to your facial features and preferences.',
        fullDescription: `Digital Smile Design (DSD) is an innovative, high-tech approach to achieving the smile of your dreams. At Aesthetic Care Istanbul, we use cutting-edge digital tools and advanced techniques to create personalized, precise smile transformations. Whether you're looking to enhance the appearance of your teeth, correct alignment issues, or achieve a more youthful smile, DSD allows us to design and visualize your ideal smile before any treatment begins.

What is Digital Smile Design (DSD)?
Digital Smile Design is a modern cosmetic dentistry technique that combines digital technology with artistic skill to design the perfect smile for each patient. Using digital imaging, we can capture detailed measurements of your facial features, tooth structure, and smile dynamics. This data is then used to create a customized treatment plan, showing you a virtual preview of how your smile will look post-treatment.

The Digital Smile Design Process at Aesthetic Care Istanbul
At Aesthetic Care Istanbul, we understand that every patient's smile is unique. Our DSD process begins with an in-depth consultation where we evaluate your facial aesthetics, smile goals, and oral health. Using the latest digital tools, we capture precise measurements of your teeth, gums, and facial features, ensuring a comprehensive design that perfectly complements your natural beauty.`,
        price: 2000,
        duration: '2-3 hours'
      },
      {
        title: 'Dental Veneers',
        slug: 'dental-veneers',
        description: 'Dental veneers are thin, custom-made shells designed to enhance the appearance of teeth by covering imperfections like stains, chips, or gaps.',
        fullDescription: `Dental veneers at Aesthetic Care Istanbul offer a transformative solution for enhancing the appearance of your smile. This minimally invasive cosmetic dental procedure involves placing custom-made porcelain shells on the front surface of teeth, effectively improving their color, shape, size, and overall aesthetic. Whether addressing stained, chipped, or misaligned teeth, dental veneers can deliver a flawless, natural-looking smile that boosts confidence.

What Are Dental Veneers?
Dental veneers are ultra-thin, custom-designed shells made from porcelain or composite resin. They bond to the front of your teeth, correcting imperfections such as discoloration, cracks, gaps, or slight misalignments. Veneers provide a fast, effective, and long-lasting solution for a dramatic smile makeover.`,
        price: 1500,
        duration: '2-4 hours'
      },
      {
        title: 'Hollywood Smile',
        slug: 'hollywood-smile',
        description: 'A Hollywood smile is a cosmetic treatment designed to enhance the appearance of your teeth, giving you a bright, flawless, and symmetrical smile.',
        fullDescription: `A Hollywood Smile is the ultimate transformation for anyone looking to achieve a perfect, radiant, and flawless smile. At Aesthetic Care Istanbul, we specialize in creating dazzling Hollywood Smiles, combining advanced dental techniques with a personalized approach to give you a smile that's not only beautiful but also perfectly suited to your facial features.

What is a Hollywood Smile?
A Hollywood Smile refers to a smile that is bright, even, and perfectly aligned, often seen on celebrities. This transformation involves a combination of aesthetic dental treatments to enhance the overall appearance of your teeth. The goal is to create a natural, yet stunning smile that enhances your facial aesthetics, boosts your confidence, and makes you feel your best.`,
        price: 3500,
        duration: '2-3 weeks'
      },
      {
        title: 'Gum Aesthetics (Gingivectomy)',
        slug: 'gum-aesthetics',
        description: 'Gum aesthetics, also known as gum contouring, is a cosmetic procedure designed to enhance the appearance of your gums by reshaping or removing excess gum tissue.',
        fullDescription: `Gum aesthetics, also known as gum contouring or gum reshaping, is a cosmetic dental procedure designed to improve the appearance of the gums. At Aesthetic Care Istanbul, we specialize in creating a balanced and beautiful smile by enhancing the gum line. This procedure can address a variety of concerns, including excessive gum tissue, uneven gum lines, or a "gummy smile" where too much of the gums are visible when smiling.

What is Gum Aesthetics?
Gum aesthetics is a non-invasive procedure aimed at improving the proportion and symmetry of your gums to enhance the overall appearance of your smile. Whether it involves reducing excess gum tissue, lifting the gum line, or creating a more symmetrical gum profile, gum aesthetics can drastically transform the way your smile looks.`,
        price: 2000,
        duration: '1-2 hours'
      },
      {
        title: 'Teeth Whitening',
        slug: 'teeth-whitening',
        description: 'Teeth whitening is a cosmetic treatment designed to brighten and lighten stained or discolored teeth.',
        fullDescription: `Teeth whitening is a popular and effective cosmetic treatment that brightens and rejuvenates your smile by removing stains and discoloration. At Aesthetic Care Istanbul, we specialize in professional teeth whitening services that restore your teeth to their natural, radiant whiteness, providing noticeable and long-lasting results.

The process begins with a detailed consultation at Aesthetic Care Istanbul, where our experienced dental team assesses your teeth and determines the best whitening method for your needs. We offer both in-office whitening treatments and take-home kits, using advanced whitening technology to achieve optimal results with minimal discomfort.`,
        price: 800,
        duration: '1-2 hours'
      },
      {
        title: 'Zirconium Crown',
        slug: 'zirconium-crown',
        description: 'Zirconium crowns are a premium dental solution designed to restore damaged or discolored teeth with a natural, durable, and metal-free option.',
        fullDescription: `Dental Zirconium Crowns at Aesthetic Care Istanbul: Durable, Aesthetic, and Comfortable Solutions for Your Smile

Dental zirconium crowns are a popular choice for patients seeking durable, natural-looking, and highly aesthetic restorations. At Aesthetic Care Istanbul, we offer state-of-the-art zirconium crown solutions, designed to restore your smile while ensuring long-term durability and comfort.`,
        price: 1200,
        duration: '2-3 visits'
      },
      {
        title: 'Dental Crowns',
        slug: 'dental-crowns',
        description: 'Dental crowns are custom-made caps that cover damaged or weakened teeth, restoring their shape, strength, and appearance.',
        fullDescription: `Dental crowns are a versatile and durable solution for restoring damaged, decayed, or weakened teeth, offering both functional and aesthetic benefits. At Aesthetic Care Istanbul, we specialize in custom-made dental crowns that blend seamlessly with your natural teeth, ensuring a restored, beautiful smile.

The process begins with an in-depth consultation at Aesthetic Care Istanbul, where our experienced dentists evaluate the condition of your teeth and discuss your treatment goals. The affected tooth is then carefully prepared by removing any decayed or damaged tissue to create an ideal surface for the crown.`,
        price: 1000,
        duration: '2-3 visits'
      },
      {
        title: 'Dental Implants',
        slug: 'dental-implants',
        description: 'Dental implants are a durable and natural-looking solution for replacing missing teeth.',
        fullDescription: `Dental Implants at Aesthetic Care Istanbul: Restoring Your Smile with Precision and Expertise

At Aesthetic Care Istanbul, we offer cutting-edge dental implant solutions to restore your smile, confidence, and oral health. Dental implants are the most advanced and reliable solution for replacing missing teeth, providing a permanent, natural-looking result that mimics the function and appearance of your real teeth.`,
        price: 2500,
        duration: '3-6 months'
      },
      {
        title: 'Root Canal Treatment',
        slug: 'root-canal-treatment',
        description: 'Root canal treatment is a procedure designed to save an infected or damaged tooth.',
        fullDescription: `Root canal treatment, also known as endodontic therapy, is a highly effective dental procedure designed to save teeth that are severely decayed or infected. At Aesthetic Care Istanbul, we specialize in providing advanced root canal treatments with precision and care, ensuring our patients receive top-quality dental care in a comfortable and stress-free environment.

What is Root Canal Treatment?
Root canal therapy focuses on removing infected or damaged pulp tissue from the interior of a tooth, preventing further infection and saving the tooth from extraction.`,
        price: 800,
        duration: '1-2 hours'
      }
    ]
  },
  {
    categoryName: 'Face',
    categorySlug: 'face',
    services: [
      {
        title: 'Facelift Surgery',
        slug: 'facelift-surgery',
        description: 'Facelift surgery, also known as rhytidectomy, is a procedure designed to reduce the visible signs of aging by lifting and tightening the skin on the face and neck.',
        fullDescription: `Facelift surgery, also known as rhytidectomy, is one of the most effective procedures to address the signs of aging, such as sagging skin, deep wrinkles, and loss of facial volume. By lifting and tightening the skin, a facelift can restore a more youthful, refreshed appearance, enhancing both the face and neck. At Aesthetic Care Istanbul, we specialize in delivering high-quality facelift surgery, offering our patients natural-looking results that rejuvenate their facial aesthetics with minimal downtime.`,
        price: 6000,
        duration: '4-6 hours'
      },
      {
        title: 'Neck Lift',
        slug: 'neck-lift',
        description: 'A neck lift is a cosmetic procedure designed to remove excess skin and fat from the neck area, while tightening the underlying muscles to create a smoother, more youthful appearance.',
        fullDescription: `A neck lift, or lower rhytidectomy, is a transformative cosmetic procedure designed to rejuvenate the neck by eliminating excess skin and fat, tightening underlying muscles, and creating a smoother, firmer, and more youthful appearance. Over time, aging, weight fluctuations, and environmental factors can cause the neck to lose its definition, resulting in sagging skin, wrinkles, or a "turkey wattle" appearance.`,
        price: 4500,
        duration: '2-3 hours'
      },
      {
        title: 'Botox',
        slug: 'botox',
        description: 'Botox is a non-surgical cosmetic treatment used to reduce fine lines and wrinkles by temporarily relaxing facial muscles.',
        fullDescription: `Botox, one of the most popular non-surgical cosmetic treatments worldwide, is a safe and effective way to reduce wrinkles and fine lines, restoring a youthful, refreshed appearance. At Aesthetic Care Istanbul, we specialize in advanced Botox applications that deliver natural, long-lasting results. Whether you're looking to smooth forehead lines, soften crow's feet, or prevent the signs of aging, our expert team provides personalized care in a state-of-the-art facility.`,
        price: 500,
        duration: '10-20 minutes'
      },
      {
        title: 'Forehead Lifting',
        slug: 'forehead-lifting',
        description: 'Forehead lifting, also known as a brow lift, is a cosmetic procedure designed to elevate sagging brows and smooth forehead wrinkles for a rejuvenated, youthful appearance.',
        fullDescription: `Forehead lifting, commonly known as a brow lift, is a highly effective cosmetic procedure designed to rejuvenate the upper face by lifting sagging brows and smoothing forehead wrinkles. Aging, gravity, and stress can cause the brows to droop and deepen lines across the forehead, resulting in a tired or stern appearance.`,
        price: 3500,
        duration: '1-2 hours'
      },
      {
        title: 'Brow Lift',
        slug: 'brow-lift',
        description: 'A brow lift, also known as a forehead lift, is a cosmetic surgery that aims to lift and smooth the forehead, reducing the appearance of wrinkles and sagging eyebrows.',
        fullDescription: `A brow lift, also known as a forehead lift, is a highly effective cosmetic procedure designed to rejuvenate the upper face by lifting sagging eyebrows and smoothing forehead wrinkles. As we age, the skin around the forehead and eyebrows naturally begins to lose elasticity, which can result in a tired or angry appearance.`,
        price: 3500,
        duration: '1-2 hours'
      },
      {
        title: 'Eyelid Surgery',
        slug: 'eyelid-surgery',
        description: 'Eyelid surgery, also known as blepharoplasty, is a cosmetic procedure aimed at correcting drooping eyelids, removing excess skin, and improving the appearance of puffiness or bags under the eyes.',
        fullDescription: `Eyelid surgery, or blepharoplasty, is a popular cosmetic procedure designed to rejuvenate the eyes by correcting drooping eyelids, eliminating excess skin, and reducing puffiness or under-eye bags. Over time, the skin around the eyes can lose its elasticity, causing the upper and lower eyelids to sag, which may lead to a tired or aged appearance.`,
        price: 3000,
        duration: '1-2 hours'
      },
      {
        title: 'Nose Aesthetics (Rhinoplasty)',
        slug: 'nose-aesthetics-rhinoplasty',
        description: 'Nose aesthetics, or rhinoplasty, is a surgical procedure designed to reshape and enhance the appearance of the nose, as well as improve functionality, such as breathing.',
        fullDescription: `Nose aesthetics, or rhinoplasty, is a transformative surgical procedure that enhances the appearance of the nose and, in some cases, improves nasal function. Whether you're looking to correct a crooked nose, reduce a nasal hump, refine the tip, or address breathing issues, rhinoplasty offers a personalized solution to achieve a harmonious facial balance.`,
        price: 4000,
        duration: '2-3 hours'
      },
      {
        title: 'Otoplasty',
        slug: 'otoplasty',
        description: 'Otoplasty is a surgical procedure designed to reshape and reposition protruding or misshapen ears, creating a more natural and balanced appearance.',
        fullDescription: `Otoplasty, also known as ear surgery, is a highly effective procedure designed to reshape, resize, or reposition the ears for a more balanced and natural appearance. This surgery is ideal for individuals who feel self-conscious about the size, shape, or prominence of their ears.`,
        price: 2500,
        duration: '2-3 hours'
      },
      {
        title: 'Bichectomy',
        slug: 'bichectomy',
        description: 'Bichectomy, also known as cheek reduction surgery, is a cosmetic procedure aimed at removing excess fat from the lower cheeks to create a more defined and contoured facial appearance.',
        fullDescription: `Bichectomy, also known as cheek reduction surgery, is a highly effective cosmetic procedure designed to enhance the contour and definition of the face by removing excess buccal fat pads from the lower cheeks. This surgery is ideal for individuals who desire a more sculpted and defined facial appearance, especially those with fuller or rounder cheeks.`,
        price: 2000,
        duration: '1 hour'
      },
      {
        title: 'Fat Transfer to Face',
        slug: 'fat-transfer-to-face',
        description: 'Fat transfer to the face is a natural, long-lasting solution to restore lost volume, smooth wrinkles, and rejuvenate facial contours.',
        fullDescription: `Fat transfer to the face, also known as facial fat grafting, is a revolutionary cosmetic procedure that restores volume, smooths wrinkles, and rejuvenates the face using your body's natural fat. At Aesthetic Care Istanbul, we provide exceptional fat transfer services, combining expertise with state-of-the-art technology to achieve natural-looking, long-lasting results.`,
        price: 3500,
        duration: '2-3 hours'
      }
    ]
  },
  {
    categoryName: 'Body',
    categorySlug: 'body',
    services: [
      {
        title: 'Brazilian Butt Lift (BBL)',
        slug: 'bbl-brazilian-butt-lift',
        description: 'A Brazilian Butt Lift (BBL) is a cosmetic procedure that enhances the shape and volume of the buttocks by transferring fat from other areas of the body.',
        fullDescription: `Transform Your Silhouette with a Brazilian Butt Lift at Aesthetic Care Istanbul

The Brazilian Butt Lift (BBL) is a highly sought-after cosmetic procedure designed to enhance the size, shape, and contour of the buttocks using your body's natural fat. At Aesthetic Care Istanbul, we specialize in delivering exceptional BBL results, combining advanced techniques with world-class care to provide a more sculpted, curvier silhouette.`,
        price: 4500,
        duration: '4-6 hours'
      },
      {
        title: 'Liposuction',
        slug: 'liposuction',
        description: 'Liposuction is a cosmetic surgery that removes excess fat from specific areas of the body to enhance contour and shape.',
        fullDescription: `Transform Your Body with Expert Liposuction at Aesthetic Care Istanbul

Liposuction is one of the most popular cosmetic procedures for sculpting the body by removing excess fat deposits and enhancing natural contours. At Aesthetic Care Istanbul, we specialize in advanced liposuction techniques to help you achieve the toned, slim figure you've always desired.`,
        price: 3500,
        duration: '2-4 hours'
      },
      {
        title: 'Tummy Tuck',
        slug: 'tummy-tuck',
        description: 'A tummy tuck, or abdominoplasty, is a surgical procedure designed to remove excess skin and fat from the abdominal area, while tightening the underlying muscles.',
        fullDescription: `Transform Your Body with a Tummy Tuck at Aesthetic Care Istanbul

A tummy tuck, or abdominoplasty, is a transformative surgical procedure designed to remove excess skin and fat from the abdomen while tightening weakened or separated abdominal muscles. This results in a firmer, flatter, and more toned midsection.`,
        price: 5000,
        duration: '3-5 hours'
      },
      {
        title: 'Abdominal Muscle Aesthetics (Six Pack)',
        slug: 'six-pack-abdominal-aesthetics',
        description: 'Abdominal muscle aesthetics, or six-pack surgery, is a cosmetic procedure designed to create well-defined abdominal muscles by sculpting and enhancing the natural contours of the abdomen.',
        fullDescription: `Abdominal Muscle Aesthetics, commonly known as six-pack surgery, is a popular cosmetic procedure designed to sculpt and enhance the appearance of the abdominal muscles, giving the body a well-defined, toned six-pack look. At Aesthetic Care Istanbul, we specialize in providing advanced abdominal muscle aesthetics that help you achieve the chiseled abdomen you've always desired.`,
        price: 4000,
        duration: '2-3 hours'
      },
      {
        title: 'Thigh Lift',
        slug: 'thigh-lift',
        description: 'A thigh lift is a cosmetic procedure designed to remove excess skin and fat from the inner or outer thighs, resulting in a firmer, more toned appearance.',
        fullDescription: `A thigh lift, or thighplasty, is a transformative cosmetic procedure designed to remove excess skin and fat from the thighs, resulting in a more toned, sculpted, and youthful appearance. At Aesthetic Care Istanbul, we specialize in providing customized thigh lift procedures to help patients achieve firmer, smoother thighs.`,
        price: 4500,
        duration: '2-4 hours'
      },
      {
        title: 'Arm Lift',
        slug: 'arm-lift',
        description: 'An arm lift, or brachioplasty, is a cosmetic surgery that removes excess skin and fat from the upper arms to create a more toned and sculpted appearance.',
        fullDescription: `An arm lift, also known as brachioplasty, is a cosmetic surgery designed to remove excess skin and fat from the upper arms, creating a more toned, youthful, and sculpted appearance. At Aesthetic Care Istanbul, we specialize in delivering customized arm lift procedures that help patients achieve smoother, firmer, and more defined arms.`,
        price: 3500,
        duration: '2-3 hours'
      },
      {
        title: 'Gynecomastia',
        slug: 'gynecomastia',
        description: 'Gynecomastia is a condition where males experience enlarged breast tissue, which can cause discomfort or self-consciousness.',
        fullDescription: `Gynecomastia is a medical condition that causes the enlargement of breast tissue in men, often leading to physical discomfort and emotional distress. This condition can occur due to hormonal imbalances, obesity, or genetic factors, and it affects a significant number of men across various age groups.`,
        price: 3000,
        duration: '2-3 hours'
      }
    ]
  },
  {
    categoryName: 'Breast',
    categorySlug: 'breast',
    services: [
      {
        title: 'Breast Augmentation',
        slug: 'breast-augmentation',
        description: 'Breast augmentation is a cosmetic surgery designed to enhance the size and shape of the breasts using implants or fat transfer.',
        fullDescription: `Enhance Your Confidence with Breast Augmentation at Aesthetic Care Istanbul
Breast augmentation is one of the most popular cosmetic procedures worldwide, designed to enhance breast size, shape, and symmetry, creating a fuller and more balanced figure. At Aesthetic Care Istanbul, we specialize in delivering exceptional breast augmentation results, tailored to each patient's unique goals and body type.`,
        price: 4500,
        duration: '1-2 hours'
      },
      {
        title: 'Breast Reduction',
        slug: 'breast-reduction',
        description: 'Breast reduction is a cosmetic surgery aimed at reducing the size and weight of overly large breasts to improve both comfort and appearance.',
        fullDescription: `Achieve Comfort and Balance with Breast Reduction Surgery at Aesthetic Care Istanbul
Breast reduction surgery is a transformative procedure designed to reduce the size and volume of excessively large breasts, providing both physical relief and enhanced aesthetic appeal. At Aesthetic Care Istanbul, we specialize in breast reduction surgeries that help restore natural proportions, improve comfort, and boost confidence.`,
        price: 4000,
        duration: '2-4 hours'
      },
      {
        title: 'Breast Lift',
        slug: 'breast-lift',
        description: 'Breast lift, also known as mastopexy, is a cosmetic surgery designed to lift and reshape sagging breasts, restoring a more youthful and firm appearance.',
        fullDescription: `Breast lift surgery, also known as mastopexy, is a transformative procedure designed to lift and reshape sagging breasts, providing a more youthful, firm, and aesthetically pleasing appearance. At Aesthetic Care Istanbul, we specialize in delivering customized breast lift surgeries tailored to meet the individual needs of our patients.`,
        price: 3500,
        duration: '2-3 hours'
      }
    ]
  },
  {
    categoryName: 'Other',
    categorySlug: 'other',
    services: [
      {
        title: 'Jaw Surgery',
        slug: 'jaw-surgery',
        description: 'Jaw surgery, also known as orthognathic surgery, is a procedure that corrects misalignment of the jaw and teeth, improving both function and appearance.',
        fullDescription: `Jaw surgery, also known as orthognathic surgery, is a highly specialized procedure designed to correct misalignments in the jaw and teeth, enhancing both functional and aesthetic outcomes. Whether due to congenital issues, injury, or conditions such as overbite, underbite, or facial asymmetry, jaw surgery can significantly improve your quality of life.`,
        price: 6000,
        duration: '3-5 hours'
      }
    ]
  }
];

async function main() {
  console.log('Start seeding...');

  // Delete existing data in correct order
  try {
    await prisma.serviceTranslation.deleteMany();
    await prisma.image.deleteMany();
    await prisma.beforeAfterImage.deleteMany();
    await prisma.beforeAfterCase.deleteMany();
    await prisma.fAQ.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.service.deleteMany();
    await prisma.category.deleteMany();
  } catch (error) {
    console.log('Some tables may not exist yet, continuing with seeding...');
  }

  // Create categories and services
  for (const categoryData of servicesData) {
    console.log(`Creating category: ${categoryData.categoryName}`);
    
    // Create category
    const category = await prisma.category.create({
      data: {
        name: createTranslationString(categoryData.categoryName, categoryData.categoryName),
        slug: categoryData.categorySlug,
        orderIndex: servicesData.indexOf(categoryData),
        description: createTranslationString(
          `Professional ${categoryData.categoryName.toLowerCase()} treatments and procedures`,
          `Profesyonel ${categoryData.categoryName.toLowerCase()} tedavileri ve prosedürleri`
        )
      },
    });

    // Create services for this category
    for (const serviceData of categoryData.services) {
      console.log(`Creating service: ${serviceData.title}`);
      
      const service = await prisma.service.create({
        data: {
          title: serviceData.title,
          slug: serviceData.slug,
          description: serviceData.description,
          price: serviceData.price,
          duration: serviceData.duration,
          currency: 'USD',
          categoryId: category.id,
          featured: false,
          availability: 'always',
          minAge: 18,
          maxAge: 99,
          benefits: serviceData.fullDescription,
        }
      });

      // Create English translation
      await prisma.serviceTranslation.create({
        data: {
          language: 'en',
          title: serviceData.title,
          description: serviceData.fullDescription || serviceData.description,
          serviceId: service.id
        }
      });

      // Create Turkish translation (basic for now)
      await prisma.serviceTranslation.create({
        data: {
          language: 'tr',
          title: serviceData.title, // You can add proper Turkish translations later
          description: serviceData.description,
          serviceId: service.id
        }
      });
    }
  }

  // Create admin user
  await createAdminUser();
  
  // Create before/after cases
  await createBeforeAfterCases();

  console.log('Seeding finished.');
}

async function createAdminUser() {
  console.log('Creating admin user...');
  
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL }
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Hash the password
  const hashedPassword = await hash(ADMIN_PASSWORD, 12);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  });

  console.log('Admin user created:', adminUser.email);
}

async function createBeforeAfterCases() {
  console.log('Creating before/after cases...');
  
  // Get some services to associate with before/after cases
  const services = await prisma.service.findMany({
    take: 5
  });

  if (services.length === 0) {
    console.log('No services found, skipping before/after cases');
    return;
  }

  const beforeAfterData = [
    {
      title: 'Amazing Smile Transformation',
      description: 'Complete smile makeover with veneers and whitening',
      beforeImage: '/images/real/before-1.jpg',
      afterImage: '/images/real/after-1.jpg',
      beforeImageAlt: 'Before dental treatment',
      afterImageAlt: 'After dental treatment',
      patientAge: 32,
      patientGender: 'Female',
      timeframe: '2 weeks',
      isFeatured: true,
      serviceId: services[0].id
    },
    {
      title: 'Rhinoplasty Success Story',
      description: 'Natural nose reshaping for improved facial harmony',
      beforeImage: '/images/real/before-2.jpg',
      afterImage: '/images/real/after-2.jpg',
      beforeImageAlt: 'Before rhinoplasty',
      afterImageAlt: 'After rhinoplasty',
      patientAge: 28,
      patientGender: 'Female',
      timeframe: '3 months',
      isFeatured: true,
      serviceId: services[1]?.id || services[0].id
    },
    {
      title: 'Body Contouring Results',
      description: 'Liposuction and tummy tuck combination',
      beforeImage: '/images/real/before-3.jpg',
      afterImage: '/images/real/after-3.jpg',
      beforeImageAlt: 'Before body contouring',
      afterImageAlt: 'After body contouring',
      patientAge: 35,
      patientGender: 'Female',
      timeframe: '6 weeks',
      isFeatured: true,
      serviceId: services[2]?.id || services[0].id
    },
    {
      title: 'Breast Augmentation Journey',
      description: 'Natural breast enhancement with implants',
      beforeImage: '/images/real/before-4.jpg',
      afterImage: '/images/real/after-4.jpg',
      beforeImageAlt: 'Before breast augmentation',
      afterImageAlt: 'After breast augmentation',
      patientAge: 29,
      patientGender: 'Female',
      timeframe: '4 weeks',
      isFeatured: true,
      serviceId: services[3]?.id || services[0].id
    },
    {
      title: 'Facelift Rejuvenation',
      description: 'Anti-aging facelift for youthful appearance',
      beforeImage: '/images/real/before-5.jpg',
      afterImage: '/images/real/after-5.jpg',
      beforeImageAlt: 'Before facelift',
      afterImageAlt: 'After facelift',
      patientAge: 45,
      patientGender: 'Female',
      timeframe: '8 weeks',
      isFeatured: true,
      serviceId: services[4]?.id || services[0].id
    }
  ];

  for (const caseData of beforeAfterData) {
    await prisma.beforeAfterCase.create({
      data: caseData
    });
  }

  console.log('Before/after cases created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });