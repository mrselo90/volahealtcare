import { Metadata } from 'next';
import ResultsPageTemplate from '@/components/ResultsPageTemplate';

export const metadata: Metadata = {
  title: 'Estetik Cerrahi Sonuçları 2 | Before & After',
  description: 'Estetik cerrahi operasyonlarımızın başarılı sonuçlarını keşfedin. Plastik cerrahi ve estetik tedavilerimizin öncesi ve sonrası fotoğrafları.',
  keywords: 'estetik cerrahi, plastik cerrahi, rinoplasti, liposuction, meme estetiği, before after',
};

export default function AestheticResults2Page() {
  return (
    <ResultsPageTemplate
      categoryId="cmbxi8jzv001j6qsyv769abfx"
      title="Estetik Cerrahi Sonuçları 2"
      subtitle="Güvenli ve Doğal Estetik Cerrahi Sonuçlarımız"
      description="Estetik cerrahi operasyonlarımızda hasta güvenliği ve doğal sonuçlar önceliğimizdir. Deneyimli cerrah kadromuz ile her hastaya özel yaklaşım sergileyerek mükemmel sonuçlar elde edilmektedir."
      gradientFrom="from-purple-500"
      gradientTo="to-pink-500"
      treatments={[
        'Rinoplasti (Burun Estetiği)',
        'Liposuction (Yağ Aldırma)',
        'Meme Estetiği',
        'Karın Germe',
        'Yüz Germe',
        'Göz Kapağı Estetiği',
        'Brazilian Butt Lift (BBL)',
        'Botox & Dolgu'
      ]}
      stats={[
        { number: '3000+', label: 'Başarılı Operasyon' },
        { number: '97%', label: 'Hasta Memnuniyeti' },
        { number: '18+', label: 'Yıllık Deneyim' },
        { number: '15+', label: 'Uzman Cerrah' }
      ]}
    />
  );
} 