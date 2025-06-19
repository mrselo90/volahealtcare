'use client';

import ServicePage from '@/components/ServicePage';

export default function DentalVeneersPage() {
  return (
    <ServicePage
      title="Dental Veneers"
      description="Transform your smile with custom-made, ultra-thin porcelain shells that cover the front surface of your teeth, providing a natural and beautiful appearance."
      longDescription={`
        <p>Dental veneers are ultra-thin, custom-made shells of tooth-colored materials designed to cover the front surface of teeth to improve their appearance. These shells are bonded to the front of the teeth, changing their color, shape, size, or length.</p>
        <p>Our expert dentists use the highest quality porcelain materials and advanced techniques to ensure your veneers look completely natural while providing the durability you need for a long-lasting smile transformation.</p>
      `}
      benefits={[
        "Natural-looking results that blend seamlessly with your existing teeth",
        "Resistant to stains and discoloration",
        "Minimal tooth reduction required compared to crowns",
        "Long-lasting solution (10-15 years with proper care)",
        "Can fix multiple aesthetic issues simultaneously",
        "Custom-designed to match your facial features",
      ]}
      process={[
        {
          title: "Initial Consultation",
          description: "Meet with our cosmetic dentist to discuss your goals and evaluate your teeth's suitability for veneers.",
        },
        {
          title: "Treatment Planning",
          description: "Using digital imaging and mock-ups, we'll design your new smile and show you what to expect.",
        },
        {
          title: "Tooth Preparation",
          description: "A small amount of enamel is removed to make room for the veneers, and impressions are taken.",
        },
        {
          title: "Temporary Veneers",
          description: "While your custom veneers are being crafted, you'll wear comfortable temporary veneers.",
        },
        {
          title: "Final Placement",
          description: "Your permanent veneers are carefully bonded to your teeth and adjusted for perfect fit and comfort.",
        },
      ]}
      faq={[
        {
          question: "How long do dental veneers last?",
          answer: "With proper care and maintenance, porcelain veneers typically last 10-15 years or longer.",
        },
        {
          question: "Are veneers permanent?",
          answer: "Veneers are considered a permanent treatment as a small amount of enamel must be removed. They will need to be replaced eventually.",
        },
        {
          question: "Do veneers look natural?",
          answer: "Yes, our porcelain veneers are custom-designed to match your natural teeth in color, translucency, and shape.",
        },
        {
          question: "Is the procedure painful?",
          answer: "The procedure is typically painless with local anesthesia. Any discomfort afterward is minimal and temporary.",
        },
        {
          question: "Can I eat normally with veneers?",
          answer: "Yes, you can eat most foods normally. However, you should avoid biting into very hard objects to protect your veneers.",
        },
      ]}
      beforeAfterImages={[
        {
          before: "https://placehold.co/400x300?text=Before+Veneers",
          after: "https://placehold.co/400x300?text=After+Veneers",
          description: "Patient received 8 upper veneers to correct spacing and discoloration",
        },
        {
          before: "https://placehold.co/400x300?text=Before+Veneers+2",
          after: "https://placehold.co/400x300?text=After+Veneers+2",
          description: "Complete smile makeover with 10 upper and lower veneers",
        },
      ]}
      category="dental"
    />
  );
} 