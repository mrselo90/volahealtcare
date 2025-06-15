'use client';

import ResultsPageTemplate from '@/components/ResultsPageTemplate';
import { useTranslation } from '@/lib/i18n/hooks';

export default function AestheticResultsPage() {
  const { t } = useTranslation();

  return (
    <ResultsPageTemplate
      categoryId="cmbxi8jzv001j6qsyv769abfx"
      title={t('results.aesthetic.title') || 'Aesthetic Surgery Results'}
      subtitle={t('results.aesthetic.subtitle') || 'Our Safe and Natural Aesthetic Surgery Results'}
      description={t('results.treatments.aesthetic')}
      gradientFrom="from-purple-500"
      gradientTo="to-pink-500"
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
        { number: '3000+', label: t('results.aesthetic.stats.operations') || 'Successful Operations' },
        { number: '97%', label: t('results.aesthetic.stats.satisfaction') || 'Patient Satisfaction' },
        { number: '18+', label: t('results.aesthetic.stats.experience') || 'Years of Experience' },
        { number: '15+', label: t('results.aesthetic.stats.surgeons') || 'Expert Surgeons' }
      ]}
    />
  );
} 