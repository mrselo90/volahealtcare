import ResultsPageTemplate from '@/components/ResultsPageTemplate';

export default function HairResultsPage() {
  return (
    <ResultsPageTemplate
      categoryId="cmc2g9jq500027kw73m9vh455"
      title="Hair Transplant Results"
      subtitle="Our Natural-Looking Hair Transplant Results"
      description="View our exceptional hair transplant transformations. From FUE to DHI techniques, see the natural-looking results achieved by our expert surgeons."
      gradientFrom="from-blue-500"
              gradientTo="to-purple-500"
      treatments={[
        'FUE Hair Transplant',
        'DHI Hair Transplant',
        'Beard Transplant',
        'Eyebrow Transplant',
        'PRP Treatment',
        'Mesotherapy',
        'Hair Analysis',
        'Women Hair Transplant'
      ]}
      stats={[
        { number: '1500+', label: 'Successful Hair Transplants' },
        { number: '99%', label: 'Patient Satisfaction' },
        { number: '15+', label: 'Years of Experience' },
        { number: '10+', label: 'Expert Surgeons' }
      ]}
    />
  );
} 