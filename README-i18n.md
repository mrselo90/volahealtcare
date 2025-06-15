# Çeviri Sistemi Kullanım Kılavuzu

Bu proje artık kapsamlı bir çeviri sistemi ile donatılmıştır. Tüm hardcoded metinler çevrilebilir hale getirilmiş ve çoklu dil desteği eklenmiştir.

## Sistem Özellikleri

### Desteklenen Diller
- 🇬🇧 İngilizce (English) - Varsayılan dil
- 🇹🇷 Türkçe (Türkçe) - Tam çeviri
- 🇪🇸 İspanyolca (Español) - Hazır template
- 🇵🇹 Portekizce (Português) - Hazır template
- 🇩🇪 Almanca (Deutsch) - Hazır template
- 🇫🇷 Fransızca (Français) - Hazır template
- 🇷🇺 Rusça (Русский) - Hazır template
- 🇷🇴 Romence (Română) - Hazır template
- 🇮🇹 İtalyanca (Italiano) - Hazır template
- 🇵🇱 Lehçe (Polski) - Hazır template
- 🇸🇦 Arapça (العربية) - Hazır template (RTL desteği)

### Çeviri Kapsamı

#### ✅ Tamamlanan Bölümler
- **Navigation** - Tüm menü öğeleri
- **Common** - Genel butonlar ve mesajlar
- **Homepage** - Hero, hizmetler, testimonials
- **Services** - Paket detayları, prosedür bilgileri
- **Results/Gallery** - Önce/sonra sonuçları
- **Footer** - Alt bilgi alanı
- **Admin Panel** - Paket detayları bölümü
- **Mock Data** - Örnek hasta verileri

#### 🔄 Devam Eden Bölümler
- Contact sayfası
- About sayfası
- Testimonials sayfası
- Booking modal
- Diğer admin panel bölümleri

## Dosya Yapısı

```
src/lib/i18n/
├── config.ts          # Dil konfigürasyonu
├── translations.ts    # Tüm çeviriler
├── hooks.ts          # React hooks
└── utils.ts          # Yardımcı fonksiyonlar
```

## Kullanım

### 1. Bileşenlerde Çeviri Kullanımı

```tsx
'use client';

import { useTranslation } from '@/lib/i18n/hooks';

export function MyComponent() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      <button onClick={() => setLanguage('tr')}>
        Türkçe
      </button>
    </div>
  );
}
```

### 2. Parametreli Çeviriler

```tsx
// Çeviri dosyasında:
// operationTime: 'İşlem genellikle {time} sürmektedir.'

const { t } = useTranslation();
const text = t('services.procedure.operationTime.description', { time: '2 saat' });
```

### 3. Yeni Çeviri Anahtarı Ekleme

1. `src/lib/i18n/translations.ts` dosyasını açın
2. `Translations` interface'ine yeni anahtar ekleyin:

```typescript
interface Translations {
  // ... mevcut anahtarlar
  newSection: {
    title: string;
    description: string;
  };
}
```

3. İngilizce ve Türkçe çevirileri ekleyin:

```typescript
export const translations: Record<Language, Translations> = {
  en: {
    // ... mevcut çeviriler
    newSection: {
      title: 'New Section',
      description: 'This is a new section',
    },
  },
  tr: {
    // ... mevcut çeviriler
    newSection: {
      title: 'Yeni Bölüm',
      description: 'Bu yeni bir bölümdür',
    },
  },
  // ...
};
```

### 4. Dil Değiştirici Kullanımı

Dil değiştirici otomatik olarak header'da bulunur. Seçilen dil localStorage'da saklanır.

## Çeviri Anahtarları Rehberi

### Navigasyon
- `nav.home` - Ana Sayfa
- `nav.services` - Hizmetler
- `nav.about` - Hakkımızda
- `nav.contact` - İletişim

### Genel
- `common.loading` - Yükleniyor...
- `common.save` - Kaydet
- `common.cancel` - İptal
- `common.viewAll` - Tümünü Gör

### Ana Sayfa
- `home.hero.title` - Ana başlık
- `home.hero.subtitle` - Alt başlık
- `home.services.title` - Hizmetler başlığı

### Hizmetler
- `services.packageDetails.title` - Paket Detayları
- `services.packageDetails.timeInTurkey` - Türkiye'de Kalış Süresi
- `services.packageDetails.operationTime` - Operasyon Süresi

## Yeni Dil Ekleme

1. `src/lib/i18n/config.ts` dosyasına yeni dil ekleyin:

```typescript
export type Language = 'en' | 'tr' | 'es' | 'pt' | 'de' | 'fr' | 'ru' | 'ro' | 'it' | 'pl' | 'ar' | 'yeni_dil';

export const languages = [
  // ... mevcut diller
  {
    code: 'yeni_dil',
    name: 'Yeni Dil',
    flag: '🏳️',
    dir: 'ltr' as const,
  },
];
```

2. `src/lib/i18n/translations.ts` dosyasında çevirileri ekleyin:

```typescript
export const translations: Record<Language, Translations> = {
  // ... mevcut diller
  yeni_dil: {
    nav: {
      home: 'Ev',
      services: 'Hizmetler',
      // ... tüm çeviriler
    },
    // ... diğer bölümler
  } as Translations,
};
```

## RTL (Sağdan Sola) Dil Desteği

Arapça gibi RTL diller için otomatik destek mevcuttur:

```typescript
// config.ts'de
{
  code: 'ar',
  name: 'العربية',
  flag: '🇸🇦',
  dir: 'rtl' as const,
}
```

## Fallback Sistemi

Eğer bir çeviri bulunamazsa, sistem otomatik olarak İngilizce çeviriye geri döner.

## Performans

- Çeviriler build time'da yüklenir
- localStorage kullanılarak dil tercihi saklanır
- Lazy loading desteklenir

## Geliştirici Notları

### Yeni Bileşen Oluştururken
1. `'use client'` direktifini ekleyin
2. `useTranslation` hook'unu import edin
3. Hardcoded metinler yerine `t()` fonksiyonunu kullanın

### Çeviri Anahtarı Adlandırma
- Nokta notasyonu kullanın: `section.subsection.key`
- Küçük harf kullanın
- Anlamlı isimler verin

### Test Etme
```bash
npm run dev
```
Tarayıcıda dil değiştiriciyi kullanarak çevirileri test edin.

## Sorun Giderme

### Çeviri Görünmüyor
1. Anahtar doğru yazıldığından emin olun
2. Çeviri dosyasında anahtar mevcut mu kontrol edin
3. Bileşen `LanguageProvider` içinde mi kontrol edin

### Dil Değişmiyor
1. localStorage'ı temizleyin
2. Sayfayı yenileyin
3. Browser console'da hata var mı kontrol edin

## Katkıda Bulunma

Yeni çeviriler eklemek veya mevcut çevirileri iyileştirmek için:

1. `src/lib/i18n/translations.ts` dosyasını düzenleyin
2. Hem İngilizce hem Türkçe çevirileri ekleyin
3. Test edin
4. Pull request oluşturun

---

Bu sistem ile site artık tamamen çok dilli ve uluslararası kullanıma hazırdır! 🌍 