'use client';

import ResultsPageTemplate from '@/components/ResultsPageTemplate';
import { useTranslation } from '@/lib/i18n/hooks';

export default function HairResultsPage() {
  const { t } = useTranslation();

  return (
    <ResultsPageTemplate
      categoryId="cmbxiawkb0000uxvzc1in2i7v"
      title={t('results.hair.title') || 'Hair Transplant Results'}
      subtitle={t('results.hair.subtitle') || 'Our Natural-Looking Hair Transplant Results'}
      description={t('results.treatments.hair')}
      gradientFrom="from-green-500"
      gradientTo="to-emerald-500"
      treatments={[
        t('results.hair.treatments.fue') || 'FUE Hair Transplant',
        t('results.hair.treatments.dhi') || 'DHI Hair Transplant',
        t('results.hair.treatments.beard') || 'Beard Transplant',
        t('results.hair.treatments.eyebrow') || 'Eyebrow Transplant',
        t('results.hair.treatments.prp') || 'PRP Treatment',
        t('results.hair.treatments.mesotherapy') || 'Mesotherapy',
        t('results.hair.treatments.analysis') || 'Hair Analysis',
        t('results.hair.treatments.women') || 'Women Hair Transplant'
      ]}
      stats={[
        { number: '5000+', label: t('results.hair.stats.transplants') || 'Successful Hair Transplants' },
        { number: '99%', label: t('results.hair.stats.satisfaction') || 'Patient Satisfaction' },
        { number: '20+', label: t('results.hair.stats.experience') || 'Years of Experience' },
        { number: '10+', label: t('results.hair.stats.surgeons') || 'Expert Surgeons' }
      ]}
    />
  );
} 