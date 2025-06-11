// JavaScript version of services data for seeding

const services = [
  {
    name: 'Dental Procedures',
    slug: 'dental',
    description: 'Transform your smile with our advanced dental procedures',
    services: [
      {
        name: 'Digital Smile Design',
        slug: 'digital-smile-design',
        description: 'Digital Smile Design (DSD) is an innovative process that uses advanced technology to create a customized smile tailored to your facial features and preferences.',
        longDescription: 'Digital Smile Design (DSD) is an innovative, high-tech approach to achieving the smile of your dreams. At Aesthetic Care Istanbul, we use cutting-edge digital tools and advanced techniques to create personalized, precise smile transformations. Whether you\'re looking to enhance the appearance of your teeth, correct alignment issues, or achieve a more youthful smile, DSD allows us to design and visualize your ideal smile before any treatment begins.',
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
            question: 'Are dental veneers reversible?',
            answer: 'No, dental veneers are not reversible as a small amount of tooth enamel is removed during preparation.'
          }
        ]
      }
    ],
  }
];

module.exports = { services };
