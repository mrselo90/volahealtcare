export interface Service {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  benefits: string[];
  process: string[];
  images: string[];
  thumbnail: string;
  priceRange: [number, number];
  duration: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ServiceCategory {
  name: string;
  slug: string;
  description: string;
  services: Service[];
}

export const services: ServiceCategory[] = [
  {
    name: 'Dental Procedures',
    slug: 'dental',
    description: 'Transform your smile with our advanced dental procedures',
    services: [
      {
        name: 'Digital Smile Design',
        slug: 'digital-smile-design',
        description: 'Digital Smile Design (DSD) is an innovative process that uses advanced technology to create a customized smile tailored to your facial features and preferences.',
        longDescription: 'Digital Smile Design (DSD) is an innovative, high-tech approach to achieving the smile of your dreams. At Aesthetic Care Istanbul, we use cutting-edge digital tools and advanced techniques to create personalized, precise smile transformations. Whether you're looking to enhance the appearance of your teeth, correct alignment issues, or achieve a more youthful smile, DSD allows us to design and visualize your ideal smile before any treatment begins.',
        priceRange: [1500, 3000],
        duration: '2-3 hours',
        benefits: [
          'Visualize your new smile before treatment',
          'Customized treatment plan',
          'Precise and predictable results',
          'Minimally invasive procedures'
        ],
        process: [
          'Initial consultation and facial analysis',
          'Digital imaging and smile design',
          'Treatment plan presentation',
          'Implementation of approved design'
        ],
        images: ['/images/services/dental/digital-smile-design/1.svg'],
        thumbnail: '/images/services/dental/digital-smile-design/thumb.svg',
        faqs: [
          {
            question: 'How long does the Digital Smile Design process take?',
            answer: 'The initial design process typically takes 1-2 weeks. The actual treatment duration depends on the procedures needed to achieve your desired smile.'
          },
          {
            question: 'Is Digital Smile Design painful?',
            answer: 'The design process is completely non-invasive. Any subsequent treatments are performed with appropriate anesthesia to ensure your comfort.'
          }
        ]
      },
      {
        name: 'Dental Veneers',
        slug: 'dental-veneers',
        description: 'Dental veneers are thin, custom-made shells designed to enhance the appearance of teeth by covering imperfections like stains, chips, or gaps.',
        longDescription: 'Dental veneers at Aesthetic Care Istanbul offer a transformative solution for enhancing the appearance of your smile. This minimally invasive cosmetic dental procedure involves placing custom-made porcelain shells on the front surface of teeth, effectively improving their color, shape, size, and overall aesthetic. Whether addressing stained, chipped, or misaligned teeth, dental veneers can deliver a flawless, natural-looking smile that boosts confidence.',
        priceRange: [800, 2000],
        duration: '2-4 hours per session',
        benefits: [
          'Natural-looking results',
          'Long-lasting solution',
          'Stain-resistant',
          'Minimal tooth reduction'
        ],
        process: [
          'Initial consultation and planning',
          'Tooth preparation',
          'Veneer fabrication',
          'Final fitting and bonding'
        ],
        images: ['/images/services/dental/dental-veneers/1.svg'],
        thumbnail: '/images/services/dental/dental-veneers/thumb.svg',
        faqs: [
          {
            question: 'How long do dental veneers last?',
            answer: 'With proper care, dental veneers can last 10-15 years or even longer.'
          },
          {
            question: 'Are veneers reversible?',
            answer: 'Since a small amount of tooth enamel is removed, veneers are considered a permanent treatment.'
          }
        ]
      },
      {
        name: 'Hollywood Smile',
        slug: 'hollywood-smile',
        description: 'A Hollywood smile is a cosmetic treatment designed to enhance the appearance of your teeth, giving you a bright, flawless, and symmetrical smile.',
        longDescription: 'A Hollywood Smile is the ultimate transformation for anyone looking to achieve a perfect, radiant, and flawless smile. At Aesthetic Care Istanbul, we specialize in creating dazzling Hollywood Smiles, combining advanced dental techniques with a personalized approach to give you a smile that's not only beautiful but also perfectly suited to your facial features.',
        priceRange: [2000, 5000],
        duration: '2-3 weeks',
        benefits: [
          'Complete smile transformation',
          'Customized to your features',
          'Improved confidence',
          'Long-lasting results'
        ],
        process: [
          'Comprehensive smile analysis',
          'Treatment planning',
          'Procedures implementation',
          'Final adjustments and polishing'
        ],
        images: ['/images/services/dental/hollywood-smile/1.svg'],
        thumbnail: '/images/services/dental/hollywood-smile/thumb.svg',
        faqs: [
          {
            question: 'How long does it take to get a Hollywood Smile?',
            answer: 'The complete treatment typically takes 2-3 weeks, depending on the procedures needed.'
          },
          {
            question: 'Is the procedure painful?',
            answer: 'All procedures are performed under appropriate anesthesia to ensure your comfort.'
          }
        ]
      },
      {
        name: 'Gum Aesthetics',
        slug: 'gum-aesthetics',
        description: 'Gum aesthetics, also known as gum contouring, is a cosmetic procedure designed to enhance the appearance of your gums by reshaping or removing excess gum tissue.',
        longDescription: 'Gum aesthetics, also known as gum contouring or gum reshaping, is a cosmetic dental procedure designed to improve the appearance of the gums. At Aesthetic Care Istanbul, we specialize in creating a balanced and beautiful smile by enhancing the gum line. This procedure can address a variety of concerns, including excessive gum tissue, uneven gum lines, or a "gummy smile" where too much of the gums are visible when smiling.',
        priceRange: [1000, 3000],
        duration: '1-2 hours',
        benefits: [
          'Improved smile aesthetics',
          'Minimal recovery time',
          'Long-lasting results',
          'Enhanced oral health'
        ],
        process: [
          'Gum evaluation',
          'Treatment planning',
          'Laser contouring procedure',
          'Recovery and aftercare'
        ],
        images: ['/images/services/dental/gum-aesthetics/1.svg'],
        thumbnail: '/images/services/dental/gum-aesthetics/thumb.svg',
        faqs: [
          {
            question: 'Is gum contouring permanent?',
            answer: 'Yes, gum contouring results are permanent as the removed gum tissue does not grow back.'
          },
          {
            question: 'How long is the recovery period?',
            answer: 'Most patients recover within a few days to a week.'
          }
        ]
      },
      {
        name: 'Teeth Whitening',
        slug: 'teeth-whitening',
        description: 'Teeth whitening is a cosmetic treatment designed to brighten and lighten stained or discolored teeth.',
        longDescription: 'Teeth whitening is a popular and effective cosmetic treatment that brightens and rejuvenates your smile by removing stains and discoloration. At Aesthetic Care Istanbul, we specialize in professional teeth whitening services that restore your teeth to their natural, radiant whiteness, providing noticeable and long-lasting results.',
        priceRange: [1000, 3000],
        duration: '1-2 hours',
        benefits: [
          'Immediate results',
          'Safe and comfortable',
          'Customized treatment',
          'Long-lasting effects'
        ],
        process: [
          'Dental examination',
          'Cleaning and preparation',
          'Whitening procedure',
          'Aftercare instructions'
        ],
        images: ['/images/services/dental/teeth-whitening/1.svg'],
        thumbnail: '/images/services/dental/teeth-whitening/thumb.svg',
        faqs: [
          {
            question: 'How long do whitening results last?',
            answer: 'Results can last 6 months to 2 years, depending on your habits and maintenance.'
          },
          {
            question: 'Is teeth whitening safe?',
            answer: 'Yes, professional teeth whitening is safe when performed by qualified professionals.'
          }
        ]
      },
      {
        name: 'Dental Crowns',
        slug: 'dental-crowns',
        description: 'Dental crowns are custom-made caps that cover damaged or weakened teeth, restoring their shape, strength, and appearance.',
        longDescription: 'Dental crowns are a versatile and durable solution for restoring damaged, decayed, or weakened teeth, offering both functional and aesthetic benefits. At Aesthetic Care Istanbul, we specialize in custom-made dental crowns that blend seamlessly with your natural teeth, ensuring a restored, beautiful smile.',
        priceRange: [1500, 3000],
        duration: '2-3 hours',
        benefits: [
          'Restores damaged teeth',
          'Improves appearance',
          'Long-lasting solution',
          'Natural-looking results'
        ],
        process: [
          'Initial consultation',
          'Tooth preparation',
          'Crown fabrication',
          'Final placement'
        ],
        images: ['/images/services/dental/dental-crowns/1.svg'],
        thumbnail: '/images/services/dental/dental-crowns/thumb.svg',
        faqs: [
          {
            question: 'How long do dental crowns last?',
            answer: 'With proper care, dental crowns can last 10-15 years or longer.'
          },
          {
            question: 'Are dental crowns noticeable?',
            answer: 'Modern dental crowns are designed to match your natural teeth in color and shape.'
          }
        ]
      },
      {
        name: 'Root Canal Treatment',
        slug: 'root-canal',
        description: 'Root canal treatment is a procedure designed to save an infected or damaged tooth.',
        longDescription: 'Root canal treatment, also known as endodontic therapy, is a highly effective dental procedure designed to save teeth that are severely decayed or infected. At Aesthetic Care Istanbul, we specialize in providing advanced root canal treatments with precision and care, ensuring our patients receive top-quality dental care in a comfortable and stress-free environment.',
        priceRange: [1000, 2500],
        duration: '1-2 hours',
        benefits: [
          'Saves natural teeth',
          'Relieves pain',
          'Prevents further infection',
          'Restores function'
        ],
        process: [
          'Initial examination',
          'Numbing the area',
          'Cleaning and shaping',
          'Filling and sealing'
        ],
        images: ['/images/services/dental/root-canal/1.svg'],
        thumbnail: '/images/services/dental/root-canal/thumb.svg',
        faqs: [
          {
            question: 'Is root canal treatment painful?',
            answer: 'Modern root canal treatment is performed with anesthesia and is generally painless.'
          },
          {
            question: 'How long does recovery take?',
            answer: 'Most patients can return to normal activities the same day.'
          }
        ]
      },
      {
        name: 'Dental Implants',
        slug: 'dental-implants',
        description: 'Dental implants are a durable and natural-looking solution for replacing missing teeth.',
        longDescription: 'Dental implants are titanium posts surgically placed into the jawbone to act as artificial tooth roots. Once the implants have fused with the bone, custom-made crowns, bridges, or dentures are attached to the implants, providing a functional and aesthetically pleasing restoration. The result is a stable, durable, and natural-looking solution to missing teeth.',
        priceRange: [2000, 5000],
        duration: '3-6 months',
        benefits: [
          'Permanent solution',
          'Natural look and feel',
          'Preserves jawbone',
          'Restores full function'
        ],
        process: [
          'Initial consultation',
          'Implant placement',
          'Healing period',
          'Crown attachment'
        ],
        images: ['/images/services/dental/dental-implants/1.svg'],
        thumbnail: '/images/services/dental/dental-implants/thumb.svg',
        faqs: [
          {
            question: 'How long do dental implants last?',
            answer: 'With proper care, dental implants can last a lifetime.'
          },
          {
            question: 'Is the procedure painful?',
            answer: 'The procedure is performed under anesthesia, and most patients report minimal discomfort.'
          }
        ]
      },
      {
        name: 'Zirconium Crowns',
        slug: 'zirconium-crowns',
        description: 'Zirconium crowns are a premium dental solution designed to restore damaged or discolored teeth with a natural, durable, and metal-free option.',
        longDescription: 'Dental Zirconium Crowns at Aesthetic Care Istanbul: Durable, Aesthetic, and Comfortable Solutions for Your Smile. Dental zirconium crowns are a popular choice for patients seeking durable, natural-looking, and highly aesthetic restorations. At Aesthetic Care Istanbul, we offer state-of-the-art zirconium crown solutions, designed to restore your smile while ensuring long-term durability and comfort.',
        priceRange: [1500, 3500],
        duration: '2-3 hours',
        benefits: [
          'Metal-free solution',
          'Natural appearance',
          'High durability',
          'Biocompatible material'
        ],
        process: [
          'Initial consultation',
          'Tooth preparation',
          'Crown fabrication',
          'Final placement'
        ],
        images: ['/images/services/dental/zirconium-crowns/1.svg'],
        thumbnail: '/images/services/dental/zirconium-crowns/thumb.svg',
        faqs: [
          {
            question: 'How long do zirconium crowns last?',
            answer: 'Zirconium crowns can last 15-20 years with proper care.'
          },
          {
            question: 'Are zirconium crowns noticeable?',
            answer: 'Zirconium crowns are designed to match your natural teeth perfectly.'
          }
        ]
      }
    ]
  },
  {
    name: 'Facial Procedures',
    slug: 'facial',
    description: 'Enhance your natural beauty with our advanced facial procedures',
    services: [
      {
        name: 'Rhinoplasty',
        slug: 'rhinoplasty',
        description: 'Reshape your nose for improved harmony and function',
        longDescription: 'Rhinoplasty, also known as a nose job, is a surgical procedure that reshapes the nose to enhance facial harmony and improve breathing function. Our expert surgeons use advanced techniques to create natural-looking results that complement your facial features.',
        priceRange: [2000, 5000],
        duration: '1-2 weeks',
        benefits: [
          'Enhanced facial harmony',
          'Improved breathing function',
          'Correction of structural defects',
          'Boosted self-confidence'
        ],
        process: [
          'Initial consultation and analysis',
          'Custom treatment planning',
          'Surgery under general anesthesia',
          'Recovery and follow-up care'
        ],
        images: ['/images/services/facial/rhinoplasty/1.svg'],
        thumbnail: '/images/services/facial/rhinoplasty/thumb.svg',
        faqs: [
          {
            question: 'How long is the recovery period after rhinoplasty?',
            answer: 'Initial recovery takes about 1-2 weeks. Full results will be visible after swelling subsides, which can take several months.'
          },
          {
            question: 'Will I have visible scars after rhinoplasty?',
            answer: 'Most incisions are made inside the nose, leaving no visible external scars. If external incisions are needed, they are typically very small and well-concealed.'
          }
        ]
      },
      {
        name: 'Facelift',
        slug: 'facelift',
        description: 'Turn back the clock with our advanced facelift procedures',
        longDescription: 'A facelift, or rhytidectomy, is a surgical procedure that improves visible signs of aging in the face and neck. Our surgeons use the latest techniques to create natural-looking results that help you look refreshed and rejuvenated.',
        priceRange: [3000, 7000],
        duration: '1-2 weeks',
        benefits: [
          'Natural-looking rejuvenation',
          'Long-lasting results',
          'Improved facial contours',
          'Boosted confidence'
        ],
        process: [
          'Comprehensive facial analysis',
          'Customized treatment planning',
          'Surgery under anesthesia',
          'Recovery and aftercare'
        ],
        images: ['/images/services/facial/facelift/1.svg'],
        thumbnail: '/images/services/facial/facelift/thumb.svg',
        faqs: [
          {
            question: 'How long do facelift results last?',
            answer: "Results typically last 10-15 years, though the natural aging process continues.",
          },
          {
            question: 'What is the recovery time for a facelift?',
            answer: 'Most patients return to normal activities within 2-3 weeks, with final results visible after several months.',
          },
        ],
      },
      {
        name: 'Eyelid Surgery',
        slug: 'eyelid-surgery',
        description: 'Rejuvenate your eyes with blepharoplasty',
        longDescription: 'Eyelid surgery, or blepharoplasty, removes excess skin and fat from the upper and/or lower eyelids to create a more refreshed and youthful appearance. This procedure can also improve vision if excess skin is interfering with sight.',
        priceRange: [1000, 2000],
        duration: '1-3 hours',
        benefits: [
          'More youthful eye appearance',
          'Improved field of vision',
          'Natural-looking results',
          'Long-lasting effects',
        ],
        process: [
          'Eye examination and consultation',
          'Procedure planning',
          'Surgery under local anesthesia',
          'Recovery monitoring',
        ],
        images: ['/images/services/facial/eyelid-surgery/1.svg'],
        thumbnail: '/images/services/facial/eyelid-surgery/thumb.svg',
        faqs: [
          {
            question: 'How long does eyelid surgery take?',
            answer: 'The procedure typically takes 1-3 hours, depending on whether upper, lower, or both eyelids are being treated.',
          },
          {
            question: 'When can I return to work?',
            answer: 'Most patients return to work within 7-10 days after surgery.',
          },
        ],
      },
      {
        name: 'Forehead Lifting',
        slug: 'forehead-lifting',
        description: 'Achieve a more youthful appearance with a brow lift',
        longDescription: 'A forehead lift, also known as a brow lift, raises the eyebrows and reduces wrinkles on the forehead and between the eyes. This procedure can help you look more refreshed and alert while maintaining natural facial expressions.',
        priceRange: [1000, 2000],
        duration: '1-2 hours',
        benefits: [
          'Reduced forehead wrinkles',
          'Lifted eyebrows',
          'More alert appearance',
          'Natural-looking results',
        ],
        process: [
          'Facial analysis',
          'Treatment planning',
          'Surgery under anesthesia',
          'Recovery support',
        ],
        images: ['/images/services/facial/forehead-lifting/1.svg'],
        thumbnail: '/images/services/facial/forehead-lifting/thumb.svg',
        faqs: [
          {
            question: 'How long do results last?',
            answer: 'Results typically last 5-10 years, depending on factors like age and lifestyle.',
          },
          {
            question: 'Is the procedure painful?',
            answer: 'The surgery is performed under anesthesia, and any post-operative discomfort can be managed with medication.',
          },
        ],
      },
      {
        name: 'Neck Lift',
        slug: 'neck-lift',
        description: 'Restore a youthful neck contour with our advanced techniques',
        longDescription: 'A neck lift surgically removes excess skin and fat from the neck area while tightening underlying muscles. This procedure can dramatically improve the appearance of a sagging or aging neck, creating a more defined and youthful profile.',
        priceRange: [1500, 3000],
        duration: '1-2 weeks',
        benefits: [
          'Improved neck contour',
          'Reduced sagging skin',
          'More defined jawline',
          'Natural-looking results',
        ],
        process: [
          'Initial consultation',
          'Customized planning',
          'Surgery under anesthesia',
          'Recovery monitoring',
        ],
        images: ['/images/services/facial/neck-lift/1.svg'],
        thumbnail: '/images/services/facial/neck-lift/thumb.svg',
        faqs: [
          {
            question: 'How long is the recovery period?',
            answer: 'Most patients return to normal activities within 2-3 weeks.',
          },
          {
            question: 'Will there be visible scars?',
            answer: 'Incisions are carefully placed to be hidden behind the ears and under the chin.',
          },
        ],
      },
      {
        name: 'Botox',
        slug: 'botox',
        description: 'Reduce wrinkles and fine lines with Botox treatments',
        longDescription: 'Botox is a non-surgical treatment that temporarily reduces or eliminates facial wrinkles by relaxing the underlying muscles. Our expert practitioners precisely target specific areas to achieve natural-looking results while maintaining facial expressions.',
        priceRange: [1000, 2000],
        duration: '1-2 hours',
        benefits: [
          'Quick treatment',
          'No downtime',
          'Natural-looking results',
          'Preventive anti-aging',
        ],
        process: [
          'Consultation and assessment',
          'Treatment planning',
          'Injection procedure',
          'Follow-up care',
        ],
        images: ['/images/services/facial/botox/1.svg'],
        thumbnail: '/images/services/facial/botox/thumb.svg',
        faqs: [
          {
            question: 'How long do Botox results last?',
            answer: 'Results typically last 3-4 months, though this can vary by individual.',
          },
          {
            question: 'Is Botox safe?',
            answer: 'Yes, Botox is FDA-approved and safe when administered by qualified professionals.',
          },
        ],
      },
      {
        name: 'Otoplasty',
        slug: 'otoplasty',
        description: 'Otoplasty is a surgical procedure designed to reshape and reposition protruding or misshapen ears, creating a more natural and balanced appearance.',
        longDescription: 'Otoplasty (Ear Surgery) at Aesthetic Care Istanbul\n\nOtoplasty, also known as ear surgery, is a highly effective procedure designed to reshape, resize, or reposition the ears for a more balanced and natural appearance. This surgery is ideal for individuals who feel self-conscious about the size, shape, or prominence of their ears. At Aesthetic Care Istanbul, we specialize in providing safe and tailored otoplasty procedures to achieve harmonious facial proportions and enhance your self-confidence.\n\nWhat is Otoplasty?\nOtoplasty is a cosmetic surgery that corrects protruding, misshapen, or asymmetrical ears. Whether due to genetics or injury, this procedure can reshape the ear structure, reduce excess cartilage, and reposition the ears closer to the head. Otoplasty can be performed on both children and adults, making it an ideal solution for those seeking a more balanced and aesthetically pleasing ear appearance.\n\nThe Otoplasty Procedure at Aesthetic Care Istanbul\nYour otoplasty journey at Aesthetic Care Istanbul begins with a thorough consultation, where our expert surgeons assess your ear anatomy and discuss your goals. We take the time to understand your concerns and craft a personalized plan to ensure the best outcome.\n\nRecovery and Results\nAfter otoplasty, patients may experience some swelling, bruising, and mild discomfort, which should subside within a few days. Most individuals can return to normal activities within 5-7 days, though strenuous activities should be avoided for 3-4 weeks.\n\nThe results of otoplasty are immediately visible, but it can take several weeks for the final shape to fully settle as swelling reduces. Once healed, the ears will appear more naturally positioned, balanced, and proportionate to the face, helping you feel more confident about your appearance.\n\nWhy Choose Aesthetic Care Istanbul for Your Otoplasty?\nAt Aesthetic Care Istanbul, our surgeons have extensive experience performing otoplasty procedures, ensuring the highest level of precision and aesthetic results. We use advanced techniques and state-of-the-art equipment to achieve safe, natural-looking outcomes while minimizing scarring.',
        priceRange: [2000, 5000],
        duration: '2-3 hours',
        benefits: [
          'Reshapes and repositions ears',
          'Improves facial harmony',
          'Safe and effective',
          'Minimal scarring',
          'Quick recovery',
        ],
        process: [
          'Consultation and assessment',
          'Surgical planning',
          'Otoplasty procedure',
          'Recovery and aftercare',
        ],
        images: ['/images/services/facial/otoplasty/1.svg'],
        thumbnail: '/images/services/facial/otoplasty/thumb.svg',
        faqs: [
          {
            question: 'How long does otoplasty take?',
            answer: 'The surgery typically takes about 2-3 hours, depending on the complexity of the procedure.',
          },
          {
            question: 'When can I return to normal activities?',
            answer: 'Most individuals can return to normal activities within 5-7 days.',
          },
        ],
      },
      {
        name: 'Fat Transfer to Face',
        slug: 'fat-transfer-to-face',
        description: 'Fat transfer to the face is a natural, long-lasting solution to restore lost volume, smooth wrinkles, and rejuvenate facial contours.',
        longDescription: `Fat transfer to the face, also known as facial fat grafting, is a revolutionary cosmetic procedure that restores volume, smooths wrinkles, and rejuvenates the face using your body's natural fat. At Aesthetic Care Istanbul, we provide exceptional fat transfer services, combining expertise with state-of-the-art technology to achieve natural-looking, long-lasting results.

The Process at Aesthetic Care Istanbul
Fat Harvesting: The procedure begins with liposuction to remove excess fat from a donor area of the body.
Fat Purification: The harvested fat is carefully processed to isolate healthy fat cells for re-injection.
Fat Injection: The purified fat is strategically injected into specific facial areas, such as the cheeks, under the eyes, nasolabial folds, or lips, to enhance volume, contour, and symmetry.

Benefits:
- Natural enhancement
- Dual benefit (face and body)
- Safe and effective
- Customized care`,
        priceRange: [2000, 5000],
        duration: '1-2 hours',
        benefits: [
          'Natural enhancement',
          'Dual benefit (face and body)',
          'Safe and effective',
          'Customized care'
        ],
        process: [
          'Consultation and assessment',
          'Fat harvesting',
          'Fat purification',
          'Fat injection',
          'Recovery and aftercare'
        ],
        images: ['/images/services/facial/fat-transfer-to-face/1.svg'],
        thumbnail: '/images/services/facial/fat-transfer-to-face/thumb.svg',
        faqs: [
          {
            question: 'How long do results last?',
            answer: 'Results are long-lasting, with a portion of the transferred fat cells permanently integrating into the treated areas.'
          },
          {
            question: 'Is the procedure safe?',
            answer: 'Yes, it uses your own fat, making it biocompatible and safe.'
          }
        ]
      },
      {
        name: 'Brow Lift',
        slug: 'brow-lift',
        description: 'Lifts and smooths the forehead, reducing wrinkles and sagging eyebrows for a more youthful appearance.',
        longDescription: 'A brow lift, also known as a forehead lift, is a highly effective cosmetic procedure designed to rejuvenate the upper face by lifting sagging eyebrows and smoothing forehead wrinkles. As we age, the skin around the forehead and eyebrows naturally begins to lose elasticity, which can result in a tired or angry appearance.',
        priceRange: [1000, 2000],
        duration: '1-2 hours',
        benefits: [
          'Reduced forehead wrinkles',
          'Lifted eyebrow position',
          'More youthful appearance',
          'Improved facial harmony',
          'Long-lasting results'
        ],
        process: [
          'Initial consultation',
          'Pre-surgical planning',
          'Surgical procedure',
          'Recovery period',
          'Follow-up care'
        ],
        images: [
          '/images/services/brow-lift-1.svg',
          '/images/services/brow-lift-2.svg'
        ],
        thumbnail: '/images/services/brow-lift-thumb.svg',
        faqs: [
          {
            question: 'How long does the procedure take?',
            answer: 'The surgery typically takes 1-2 hours, depending on the technique used.'
          },
          {
            question: 'When will I see results?',
            answer: 'Initial results are visible after swelling subsides, with final results becoming apparent within a few months.'
          }
        ]
      },
      {
        name: 'Bichectomy',
        slug: 'bichectomy',
        description: 'Removes excess fat from the lower cheeks to create a more defined and contoured facial appearance.',
        longDescription: 'Bichectomy, also known as cheek reduction surgery, is a highly effective cosmetic procedure designed to enhance the contour and definition of the face by removing excess buccal fat pads from the lower cheeks. This surgery is ideal for individuals who desire a more sculpted and defined facial appearance.',
        priceRange: [1500, 3000],
        duration: '1-2 hours',
        benefits: [
          'Enhanced facial contour',
          'More defined cheekbones',
          'Slimmer face shape',
          'Natural-looking results',
          'Minimal scarring'
        ],
        process: [
          'Consultation and evaluation',
          'Surgical planning',
          'Minimally invasive procedure',
          'Quick recovery',
          'Follow-up care'
        ],
        images: [
          '/images/services/bichectomy-1.svg',
          '/images/services/bichectomy-2.svg'
        ],
        thumbnail: '/images/services/bichectomy-thumb.svg',
        faqs: [
          {
            question: 'Is the procedure permanent?',
            answer: 'Yes, the results of bichectomy are permanent as the removed fat pads do not grow back.'
          },
          {
            question: 'What is the recovery time?',
            answer: 'Most patients can return to normal activities within 5-7 days, with full results visible within a few weeks.'
          }
        ]
      }
    ],
  },
  {
    name: 'Body Procedures',
    slug: 'body',
    description: 'Transform your body with our advanced surgical procedures',
    services: [
      {
        name: 'Brazilian Butt Lift',
        slug: 'bbl',
        description: 'Enhance your curves with natural fat transfer',
        longDescription: 'The Brazilian Butt Lift (BBL) is an advanced body contouring procedure that uses your own fat to enhance the shape and size of your buttocks. This procedure not only improves your curves but also provides natural-looking and long-lasting results.',
        priceRange: [2000, 5000],
        duration: '1-2 hours',
        benefits: [
          'Natural enhancement using your own fat',
          'Improved body proportions',
          'Reduced fat in donor areas',
          'Long-lasting results'
        ],
        process: [
          'Consultation and body assessment',
          'Fat harvesting through liposuction',
          'Fat processing and purification',
          'Strategic fat injection'
        ],
        images: ['/images/services/body/bbl/1.svg'],
        thumbnail: '/images/services/body/bbl/thumb.svg',
        faqs: [
          {
            question: 'How long do BBL results last?',
            answer: 'With proper care and maintenance, BBL results can last many years. The transferred fat cells that survive become permanent.'
          },
          {
            question: 'What is the recovery time for a BBL?',
            answer: 'Initial recovery takes 2-3 weeks. You will need to avoid sitting directly on your buttocks for several weeks to ensure optimal results.'
          }
        ]
      },
      {
        name: 'Breast Augmentation',
        slug: 'breast-augmentation',
        description: 'Enhance your figure with natural-looking breast augmentation',
        longDescription: 'Breast augmentation surgery enhances the size and shape of your breasts using implants or fat transfer. Our surgeons use the latest techniques to create natural-looking results that complement your body proportions.',
        priceRange: [2000, 5000],
        duration: '1-2 hours',
        benefits: [
          'Enhanced breast size and shape',
          'Improved body proportions',
          'Boosted confidence',
          'Natural-looking results',
        ],
        process: [
          'Consultation and sizing',
          'Implant or technique selection',
          'Surgery under anesthesia',
          'Recovery monitoring',
        ],
        images: ['/images/services/body/breast-augmentation/1.svg'],
        thumbnail: '/images/services/body/breast-augmentation/thumb.svg',
        faqs: [
          {
            question: 'How long do breast implants last?',
            answer: "While implants do not expire, they may need to be replaced after 10-15 years.",
          },
          {
            question: 'When can I return to normal activities?',
            answer: 'Most patients return to work within 1-2 weeks and resume full activities within 6-8 weeks.',
          },
        ],
      },
      {
        name: 'Thigh Lift',
        slug: 'thigh-lift',
        description: 'Achieve smoother, more contoured thighs',
        longDescription: 'A thigh lift reshapes the thighs by reducing excess skin and fat, resulting in smoother skin and better-proportioned contours. This procedure is particularly effective for patients who have lost significant weight.',
        priceRange: [2000, 5000],
        duration: '1-2 weeks',
        benefits: [
          'Improved thigh contours',
          'Reduced excess skin',
          'Better-fitting clothes',
          'Enhanced comfort',
        ],
        process: [
          'Initial consultation',
          'Procedure planning',
          'Surgery under anesthesia',
          'Recovery support',
        ],
        images: ['/images/services/body/thigh-lift/1.svg'],
        thumbnail: '/images/services/body/thigh-lift/thumb.svg',
        faqs: [
          {
            question: 'How long is the recovery period?',
            answer: 'Most patients return to work within 2-3 weeks and resume full activities within 4-6 weeks.',
          },
          {
            question: 'Will there be visible scars?',
            answer: 'Incisions are strategically placed to be hidden by clothing and natural body contours.',
          },
        ],
      },
      {
        name: 'Tummy Tuck',
        slug: 'tummy-tuck',
        description: 'Achieve a flatter, more toned abdomen',
        longDescription: 'A tummy tuck, or abdominoplasty, removes excess skin and fat from the abdomen while tightening the underlying muscles. This procedure is particularly effective for patients who have lost significant weight or women post-pregnancy.',
        priceRange: [2000, 5000],
        duration: '1-2 weeks',
        benefits: [
          'Flatter abdomen',
          'Tightened muscles',
          'Removed excess skin',
          'Improved body contour',
        ],
        process: [
          'Consultation and evaluation',
          'Procedure planning',
          'Surgery under anesthesia',
          'Recovery monitoring',
        ],
        images: ['/images/services/body/tummy-tuck/1.svg'],
        thumbnail: '/images/services/body/tummy-tuck/thumb.svg',
        faqs: [
          {
            question: 'How long is the recovery period?',
            answer: 'Most patients return to work within 2-3 weeks and resume full activities within 6-8 weeks.',
          },
          {
            question: 'Will the results be permanent?',
            answer: "Results can be long-lasting with proper diet and exercise, though significant weight changes can affect results.",
          },
        ],
      },
      {
        name: 'Six Pack Surgery',
        slug: 'six-pack-surgery',
        description: 'Define your abs with advanced surgical techniques',
        longDescription: 'Six pack surgery, or abdominal etching, is an advanced liposuction technique that creates the appearance of a six-pack by removing fat in specific patterns. This procedure is ideal for patients who are close to their ideal weight but struggle to achieve defined abs.',
        priceRange: [2000, 5000],
        duration: '1-2 hours',
        benefits: [
          'Enhanced abdominal definition',
          'Natural-looking results',
          'Minimal recovery time',
          'Long-lasting effects',
        ],
        process: [
          'Fitness assessment',
          'Treatment planning',
          'Liposuction procedure',
          'Recovery guidance',
        ],
        images: ['/images/services/body/six-pack-surgery/1.svg'],
        thumbnail: '/images/services/body/six-pack-surgery/thumb.svg',
        faqs: [
          {
            question: 'How long do results last?',
            answer: 'Results can be permanent with proper diet and exercise maintenance.',
          },
          {
            question: 'Who is an ideal candidate?',
            answer: 'Ideal candidates are within 10-15 pounds of their ideal weight with good skin elasticity.',
          },
        ],
      },
      {
        name: 'Arm Lift',
        slug: 'arm-lift',
        description: 'Removes excess skin and fat from the upper arms to create a more toned and sculpted appearance.',
        longDescription: 'An arm lift, also known as brachioplasty, is a cosmetic surgery designed to remove excess skin and fat from the upper arms, creating a more toned, youthful, and sculpted appearance. At Aesthetic Care Istanbul, we specialize in delivering customized arm lift procedures that help patients achieve smoother, firmer, and more defined arms.',
        priceRange: [1500, 3000],
        duration: '1-2 hours',
        benefits: [
          'Firmer upper arms',
          'Improved arm contour',
          'Enhanced body proportion',
          'Increased confidence',
          'Long-lasting results'
        ],
        process: [
          'Initial consultation',
          'Surgical planning',
          'Arm lift procedure',
          'Recovery period',
          'Follow-up care'
        ],
        images: [
          '/images/services/arm-lift-1.svg',
          '/images/services/arm-lift-2.svg'
        ],
        thumbnail: '/images/services/arm-lift-thumb.svg',
        faqs: [
          {
            question: 'How long is the recovery period?',
            answer: 'Most patients can return to normal activities within 1-2 weeks, with full recovery taking a few weeks.'
          },
          {
            question: 'Will there be visible scarring?',
            answer: 'Scars are typically placed in discreet locations and fade over time with proper care.'
          }
        ]
      },
      {
        name: 'Breast Reduction',
        slug: 'breast-reduction',
        description: 'Reduces the size and weight of overly large breasts to improve both comfort and appearance.',
        longDescription: `Breast reduction surgery is a transformative procedure designed to reduce the size and volume of excessively large breasts, providing both physical relief and enhanced aesthetic appeal. At Aesthetic Care Istanbul, we specialize in breast reduction surgeries that help restore natural proportions, improve comfort, and boost confidence.`,
        priceRange: [2000, 5000],
        duration: '1-2 weeks',
        benefits: [
          'Reduced breast size',
          'Improved comfort',
          'Better body proportion',
          'Enhanced posture',
          'Increased confidence'
        ],
        process: [
          'Comprehensive consultation',
          'Surgical planning',
          'Breast reduction procedure',
          'Recovery period',
          'Follow-up care'
        ],
        images: [
          '/images/services/breast-reduction-1.svg',
          '/images/services/breast-reduction-2.svg'
        ],
        thumbnail: '/images/services/breast-reduction-thumb.svg',
        faqs: [
          {
            question: 'What is the recovery time?',
            answer: 'Most patients can return to normal activities within 1-2 weeks, with full recovery taking a few weeks.'
          },
          {
            question: 'Will I be able to breastfeed after surgery?',
            answer: "While many women can breastfeed after breast reduction, it's important to discuss this with your surgeon during consultation."
          }
        ]
      },
      {
        name: 'Breast Lift',
        slug: 'breast-lift',
        description: 'Lifts and reshapes sagging breasts, restoring a more youthful and firm appearance.',
        longDescription: 'Breast lift surgery, also known as mastopexy, is a transformative procedure designed to lift and reshape sagging breasts, providing a more youthful, firm, and aesthetically pleasing appearance. At Aesthetic Care Istanbul, we specialize in delivering customized breast lift surgeries tailored to meet the individual needs of our patients.',
        priceRange: [2000, 5000],
        duration: '1-2 weeks',
        benefits: [
          'Elevated breast position',
          'Improved breast shape',
          'Enhanced body contour',
          'Increased confidence',
          'Natural-looking results'
        ],
        process: [
          'Initial consultation',
          'Surgical planning',
          'Breast lift procedure',
          'Recovery period',
          'Follow-up care'
        ],
        images: [
          '/images/services/breast-lift-1.svg',
          '/images/services/breast-lift-2.svg'
        ],
        thumbnail: '/images/services/breast-lift-thumb.svg',
        faqs: [
          {
            question: 'How long do the results last?',
            answer: 'Results are long-lasting, though natural aging and gravity will continue to affect the breasts over time.'
          },
          {
            question: 'Can I combine this with other procedures?',
            answer: 'Yes, breast lift can be combined with other procedures like breast augmentation or reduction for optimal results.'
          }
        ]
      },
      {
        name: 'Gynecomastia',
        slug: 'gynecomastia',
        description: 'Treats enlarged breast tissue in men, creating a flatter, more masculine chest contour.',
        longDescription: 'Gynecomastia is a medical condition that causes the enlargement of breast tissue in men, often leading to physical discomfort and emotional distress. At Aesthetic Care Istanbul, we specialize in gynecomastia surgery, offering men a safe and effective solution to restore a more masculine chest contour and regain confidence in their appearance.',
        priceRange: [2000, 5000],
        duration: '1-2 weeks',
        benefits: [
          'Flatter chest contour',
          'Improved body proportion',
          'Enhanced self-confidence',
          'Reduced physical discomfort',
          'Natural-looking results'
        ],
        process: [
          'Comprehensive consultation',
          'Surgical planning',
          'Gynecomastia procedure',
          'Recovery period',
          'Follow-up care'
        ],
        images: [
          '/images/services/gynecomastia-1.svg',
          '/images/services/gynecomastia-2.svg'
        ],
        thumbnail: '/images/services/gynecomastia-thumb.svg',
        faqs: [
          {
            question: 'What is the recovery time?',
            answer: 'Most patients can return to normal activities within 1-2 weeks, with full recovery taking a few weeks.'
          },
          {
            question: 'Will the results be permanent?',
            answer: 'Yes, the results are permanent as long as the underlying cause of gynecomastia is addressed.'
          }
        ]
      },
      {
        name: 'Liposuction',
        slug: 'liposuction',
        description: 'Liposuction is a cosmetic surgery that removes excess fat from specific areas of the body to enhance contour and shape.',
        longDescription: 'Liposuction is one of the most popular cosmetic procedures for sculpting the body by removing excess fat deposits and enhancing natural contours. At Aesthetic Care Istanbul, we specialize in advanced liposuction techniques to help you achieve the toned, slim figure you\'ve always desired. Our clinic is renowned for its expertise, state-of-the-art technology, and personalized care, making us a trusted destination for liposuction in Istanbul.\n\nWhat is Liposuction?\nLiposuction, also known as lipoplasty or body contouring, is a surgical procedure designed to eliminate stubborn fat that is resistant to diet and exercise. It targets areas such as the abdomen, thighs, hips, arms, back, and neck, reshaping your body for a more proportional and attractive appearance.\n\nThe Liposuction Process at Aesthetic Care Istanbul\nAt Aesthetic Care Istanbul, we start with a detailed consultation to understand your goals and assess the areas you wish to target. Our experienced surgeons customize each liposuction procedure to ensure optimal results that enhance your natural shape.\n\nBenefits:\n- Experienced Surgeons\n- State-of-the-Art Facility\n- Comprehensive Care\n- Affordable Luxury',
        priceRange: [2000, 5000],
        duration: '1-2 hours',
        benefits: [
          'Removes stubborn fat',
          'Improves body contour',
          'Quick recovery',
          'Long-lasting results',
        ],
        process: [
          'Consultation and assessment',
          'Anesthesia',
          'Liposuction procedure',
          'Recovery and aftercare',
        ],
        images: ['/images/services/body/liposuction/1.svg'],
        thumbnail: '/images/services/body/liposuction/thumb.svg',
        faqs: [
          {
            question: 'How long is the recovery period?',
            answer: 'Most patients can return to daily activities within a week, with full results visible after a few weeks.',
          },
          {
            question: 'Is liposuction a weight-loss solution?',
            answer: 'No, it is ideal for individuals close to their ideal weight who want to address localized fat pockets.',
          },
        ],
      }
    ],
  }
]; 