import { Metadata } from 'next';
import ResultsPageTemplate from '@/components/ResultsPageTemplate';

export const metadata: Metadata = {
  title: 'Saç Ekimi Sonuçları 2 | Before & After',
  description: 'Saç ekimi ve tedavilerimizin başarılı sonuçlarını keşfedin. FUE, DHI ve diğer saç ekimi tekniklerinin öncesi ve sonrası fotoğrafları.',
  keywords: 'saç ekimi, FUE, DHI, saç tedavisi, kellik tedavisi, before after',
};

export default function HairResults2Page() {
  return (
    <ResultsPageTemplate
      categoryId="cmbxiawkb0000uxvzc1in2i7v"
      title="Saç Ekimi Sonuçları 2"
      subtitle="Doğal Görünümlü Saç Ekimi Sonuçlarımız"
      description="Saç ekimi ve tedavilerimizde doğal görünüm ön plandadır. FUE tekniği ile yapılan işlemlerimizde hastalarımız 6-12 ay içerisinde kalıcı ve doğal sonuçlar elde etmektedir."
      gradientFrom="from-green-500"
      gradientTo="to-emerald-500"
      treatments={[
        'FUE Saç Ekimi',
        'DHI Saç Ekimi',
        'Sakal Ekimi',
        'Kaş Ekimi',
        'PRP Tedavisi',
        'Mezoterapi',
        'Saç Analizi',
        'Kadın Saç Ekimi'
      ]}
      stats={[
        { number: '5000+', label: 'Başarılı Saç Ekimi' },
        { number: '99%', label: 'Hasta Memnuniyeti' },
        { number: '20+', label: 'Yıllık Deneyim' },
        { number: '10+', label: 'Uzman Cerrah' }
      ]}
    />
  );
} 