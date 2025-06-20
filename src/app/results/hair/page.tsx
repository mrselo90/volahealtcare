'use client';

import ResultsPageTemplate from '@/components/ResultsPageTemplate';
import { useTranslation } from '@/lib/i18n/hooks';

export default function HairResultsPage() {
  const { t } = useTranslation();

  return (
    <ResultsPageTemplate
      categoryId="cmc2g9jq500027kw73m9vh455"
      title={t('results.hair.title') || 'Hair Transplant Results'}
      subtitle={t('results.hair.subtitle') || 'Our Natural-Looking Hair Transplant Results'}
      description={t('results.treatments.hair')}
      gradientFrom="from-blue-500"
              gradientTo="to-purple-500"
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
        { number: '1500+', label: t('results.hair.stats.transplants') || 'Successful Hair Transplants' },
        { number: '99%', label: t('results.hair.stats.satisfaction') || 'Patient Satisfaction' },
        { number: '15+', label: t('results.hair.stats.experience') || 'Years of Experience' },
        { number: '10+', label: t('results.hair.stats.surgeons') || 'Expert Surgeons' }
      ]}
    />
  );
} 