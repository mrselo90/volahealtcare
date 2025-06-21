import ResultsPageTemplate from '@/components/ResultsPageTemplate';

export default function DentalResultsPage() {
  return (
    <ResultsPageTemplate
      categoryId="cmc2g9jq400017kw78mx3v07k"
      title="Dental Treatment Results"
      subtitle="Results of Our Treatments That Transform Your Smile"
      description="Discover the amazing transformations achieved through our advanced dental treatments. From smile design to dental implants, see real results from our patients."
      gradientFrom="from-blue-600"
              gradientTo="to-blue-700"
      treatments={[
        'Smile Design',
        'Dental Implant',
        'Dental Veneers (Laminate)',
        'Teeth Whitening',
        'Orthodontics (Braces)',
        'Gum Aesthetics',
        'All-on-4 Implant',
        'Zirconia Crown'
      ]}
      stats={[
        { number: '2000+', label: 'Successful Dental Treatments' },
        { number: '98%', label: 'Patient Satisfaction' },
        { number: '15+', label: 'Years of Experience' },
        { number: '50+', label: 'Expert Dentists' }
      ]}
    />
  );
} 