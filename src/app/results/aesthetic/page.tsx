'use client';

import ResultsPageTemplate from '@/components/ResultsPageTemplate';
import { useTranslation } from '@/lib/i18n/hooks';

export default function AestheticResultsPage() {
  const { t } = useTranslation();

  return (
    <ResultsPageTemplate
      categoryId="cmc2g9jq200007kw7t4b2pi3d"
      title={t('results.aesthetic.title') || 'Aesthetic Surgery Results'}
      subtitle={t('results.aesthetic.subtitle') || 'Our Safe and Natural Aesthetic Surgery Results'}
      description={t('results.treatments.aesthetic')}
      gradientFrom="from-purple-600"
              gradientTo="to-purple-700"
      treatments={[
        t('results.aesthetic.treatments.rhinoplasty') || 'Rhinoplasty (Nose Job)',
        t('results.aesthetic.treatments.liposuction') || 'Liposuction (Fat Removal)',
        t('results.aesthetic.treatments.breastAesthetics') || 'Breast Aesthetics',
        t('results.aesthetic.treatments.tummyTuck') || 'Tummy Tuck',
        t('results.aesthetic.treatments.facelift') || 'Face Lift',
        t('results.aesthetic.treatments.eyelidSurgery') || 'Eyelid Surgery',
        t('results.aesthetic.treatments.bbl') || 'Brazilian Butt Lift (BBL)',
        t('results.aesthetic.treatments.botoxFiller') || 'Botox & Filler'
      ]}
      stats={[
        { number: '1000+', label: t('results.aesthetic.stats.operations') || 'Successful Operations' },
        { number: '98%', label: t('results.aesthetic.stats.satisfaction') || 'Patient Satisfaction' },
        { number: '15+', label: t('results.aesthetic.stats.experience') || 'Years of Experience' },
        { number: '15+', label: t('results.aesthetic.stats.surgeons') || 'Expert Surgeons' }
      ]}
    />
  );
} 