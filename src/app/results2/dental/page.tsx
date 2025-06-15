import { Metadata } from 'next';
import ResultsPageTemplate from '@/components/ResultsPageTemplate';

export const metadata: Metadata = {
  title: 'Diş Tedavisi Sonuçları 2 | Before & After',
  description: 'Diş tedavilerimizin başarılı sonuçlarını keşfedin. Gülümseme tasarımı, implant ve estetik diş tedavilerinin öncesi ve sonrası fotoğrafları.',
  keywords: 'diş tedavisi, gülümseme tasarımı, dental implant, diş estetiği, before after',
};

export default function DentalResults2Page() {
  return (
    <ResultsPageTemplate
      categoryId="cmbxi8jym00006qsy4b8dagzk"
      title="Diş Tedavisi Sonuçları 2"
      subtitle="Gülüşünüzü Dönüştüren Tedavilerimizin Sonuçları"
      description="Diş tedavilerimiz ile hastalarımız sadece estetik açıdan değil, aynı zamanda fonksiyonel olarak da mükemmel sonuçlar elde ediyor. Gülümseme tasarımından implant uygulamalarına kadar her aşamada en son teknoloji kullanılmaktadır."
      gradientFrom="from-blue-500"
      gradientTo="to-cyan-500"
      treatments={[
        'Gülümseme Tasarımı (Smile Design)',
        'Dental İmplant',
        'Diş Veneerleri (Laminate)',
        'Diş Beyazlatma',
        'Ortodonti (Diş Teli)',
        'Diş Eti Estetiği',
        'All-on-4 İmplant',
        'Zirkonyum Kaplama'
      ]}
      stats={[
        { number: '2000+', label: 'Başarılı Diş Tedavisi' },
        { number: '98%', label: 'Hasta Memnuniyeti' },
        { number: '15+', label: 'Yıllık Deneyim' },
        { number: '50+', label: 'Uzman Diş Hekimi' }
      ]}
    />
  );
} 