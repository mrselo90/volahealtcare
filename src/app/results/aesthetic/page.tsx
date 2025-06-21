import ResultsPageTemplate from '@/components/ResultsPageTemplate';

export default function AestheticResultsPage() {
  return (
    <ResultsPageTemplate
      categoryId="cmc2g9jq200007kw7t4b2pi3d"
      title="Aesthetic Surgery Results"
      subtitle="Our Safe and Natural Aesthetic Surgery Results"
      description="Explore our comprehensive collection of aesthetic surgery transformations. See real before and after results from our experienced surgeons."
      gradientFrom="from-purple-600"
              gradientTo="to-purple-700"
      treatments={[
        'Rhinoplasty (Nose Job)',
        'Liposuction (Fat Removal)',
        'Breast Aesthetics',
        'Tummy Tuck',
        'Face Lift',
        'Eyelid Surgery',
        'Brazilian Butt Lift (BBL)',
        'Botox & Filler'
      ]}
      stats={[
        { number: '1000+', label: 'Successful Operations' },
        { number: '98%', label: 'Patient Satisfaction' },
        { number: '15+', label: 'Years of Experience' },
        { number: '15+', label: 'Expert Surgeons' }
      ]}
    />
  );
} 