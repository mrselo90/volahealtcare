'use client';

import ResultsPageTemplate from '@/components/ResultsPageTemplate';
import { useTranslation } from '@/lib/i18n/hooks';

export default function DentalResultsPage() {
  const { t } = useTranslation();

  return (
    <ResultsPageTemplate
      categoryId="cmc2g9jq400017kw78mx3v07k"
      title={t('results.dental.title') || 'Dental Treatment Results'}
      subtitle={t('results.dental.subtitle') || 'Results of Our Treatments That Transform Your Smile'}
      description={t('results.treatments.dental')}
      gradientFrom="from-blue-600"
              gradientTo="to-blue-700"
      treatments={[
        t('results.dental.treatments.smileDesign') || 'Smile Design',
        t('results.dental.treatments.dentalImplant') || 'Dental Implant',
        t('results.dental.treatments.veneers') || 'Dental Veneers (Laminate)',
        t('results.dental.treatments.whitening') || 'Teeth Whitening',
        t('results.dental.treatments.orthodontics') || 'Orthodontics (Braces)',
        t('results.dental.treatments.gumAesthetics') || 'Gum Aesthetics',
        t('results.dental.treatments.allOn4') || 'All-on-4 Implant',
        t('results.dental.treatments.zirconia') || 'Zirconia Crown'
      ]}
      stats={[
        { number: '2000+', label: t('results.dental.stats.treatments') || 'Successful Dental Treatments' },
        { number: '98%', label: t('results.dental.stats.satisfaction') || 'Patient Satisfaction' },
        { number: '15+', label: t('results.dental.stats.experience') || 'Years of Experience' },
        { number: '50+', label: t('results.dental.stats.dentists') || 'Expert Dentists' }
      ]}
    />
  );
} 