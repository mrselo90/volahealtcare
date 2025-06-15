import { Language } from './config';

export interface Translations {
  nav: {
    home: string;
    services: string;
    about: string;
    whyChooseUs: string;
    results: string;
    testimonials: string;
    contact: string;
    consultation: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    update: string;
    submit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    viewAll: string;
    learnMore: string;
    getStarted: string;
    bookNow: string;
    callNow: string;
    messageNow: string;
    readMore: string;
    showLess: string;
    noResults: string;
    comingSoon: string;
    quickLinks: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
      trustBadge: string;
    };
  };
  services: {
    categories: {
      dental: string;
      hair: string;
      aesthetic: string;
    };
    packageDetails: {
      title: string;
      timeInTurkey: string;
      operationTime: string;
      hospitalStay: string;
      recovery: string;
      accommodation: string;
      transportation: string;
    };
  };
  results: {
    beforeAfter: {
      age: string;
      results: string;
    };
    treatments: {
      dental: string;
      hair: string;
      aesthetic: string;
    };
    dental: {
      title: string;
      subtitle: string;
      treatments: {
        smileDesign: string;
        dentalImplant: string;
        veneers: string;
        whitening: string;
        orthodontics: string;
        gumAesthetics: string;
        allOn4: string;
        zirconia: string;
      };
      stats: {
        treatments: string;
        satisfaction: string;
        experience: string;
        dentists: string;
      };
    };
    hair: {
      title: string;
      subtitle: string;
      treatments: {
        fue: string;
        dhi: string;
        beard: string;
        eyebrow: string;
        prp: string;
        mesotherapy: string;
        analysis: string;
        women: string;
      };
      stats: {
        transplants: string;
        satisfaction: string;
        experience: string;
        surgeons: string;
      };
    };
    aesthetic: {
      title: string;
      subtitle: string;
      treatments: {
        rhinoplasty: string;
        liposuction: string;
        breastAesthetics: string;
        tummyTuck: string;
        facelift: string;
        eyelidSurgery: string;
        bbl: string;
        botoxFiller: string;
      };
      stats: {
        operations: string;
        satisfaction: string;
        experience: string;
        surgeons: string;
      };
    };
    backToGallery: string;
    treatmentAreas: string;
    treatmentAreasDesc: string;
    beforeAfterResults: string;
    discoverResults: string;
    resultTime: string;
    description: string;
    treatmentDetails: string;
    results: string;
    cta: {
      viewAllResults: string;
      title: string;
      subtitle: string;
      consultation: string;
      contact: string;
    };
  };
  gallery: {
    hero: {
      title: string;
      subtitle: string;
      consultation_btn: string;
      contact_btn: string;
    };
    dental: {
      title: string;
      description: string;
    };
    hair: {
      title: string;
      description: string;
    };
    aesthetic: {
      title: string;
      description: string;
    };
    testimonials: {
      title: string;
      subtitle: string;
      testimonial1: string;
      testimonial2: string;
      testimonial3: string;
      hair_patient: string;
      dental_patient: string;
      plastic_patient: string;
    };
    cta: {
      title: string;
      subtitle: string;
      consultation_btn: string;
      contact_btn: string;
    };
    stats: {
      transformations: string;
      satisfaction: string;
      experience: string;
      countries: string;
    };
  };
  about: {
    content: string;
  };
  contact: {
    info: {
      phone: string;
      email: string;
    };
  };
  mockData: {
    patient: string;
    transformation: string;
    results: string;
    procedure: string;
    male: string;
    female: string;
    months: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      whyChooseUs: 'Why Choose Us?',
      results: 'Results',
      testimonials: 'Testimonials',
      contact: 'Contact',
      consultation: 'Free Consultation',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      submit: 'Submit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      viewAll: 'View All',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      bookNow: 'Book Now',
      callNow: 'Call Now',
      messageNow: 'Message Now',
      readMore: 'Read More',
      showLess: 'Show Less',
      noResults: 'No results found',
      comingSoon: 'Coming Soon',
      quickLinks: 'Quick Links',
    },
    home: {
      hero: {
        title: 'Transform Your Life with Premium Medical Tourism',
        subtitle: 'Experience world-class healthcare in Istanbul with our expert medical team and luxury accommodations.',
        cta: 'Start Your Journey',
        trustBadge: 'Trusted by 10,000+ patients worldwide',
      },
    },
    services: {
      categories: {
        dental: 'Dental Treatments',
        hair: 'Hair Transplant',
        aesthetic: 'Aesthetic Surgery',
      },
      packageDetails: {
        title: 'Treatment Package Details',
        timeInTurkey: 'Time In Turkey',
        operationTime: 'Operation Time',
        hospitalStay: 'Hospital Stay',
        recovery: 'Recovery Time',
        accommodation: 'Accommodation',
        transportation: 'Transportation',
      },
    },
    results: {
      beforeAfter: {
        age: 'years old',
        results: 'Results',
      },
      treatments: {
        dental: 'With our dental treatments, our patients achieve excellent results not only aesthetically but also functionally.',
        hair: 'Natural appearance is at the forefront in our hair transplant and treatments.',
        aesthetic: 'Patient safety and natural results are our priority in our aesthetic surgery operations.',
      },
      dental: {
        title: 'Dental Treatment Results',
        subtitle: 'Results of Our Treatments That Transform Your Smile',
        treatments: {
          smileDesign: 'Smile Design',
          dentalImplant: 'Dental Implant',
          veneers: 'Dental Veneers (Laminate)',
          whitening: 'Teeth Whitening',
          orthodontics: 'Orthodontics (Braces)',
          gumAesthetics: 'Gum Aesthetics',
          allOn4: 'All-on-4 Implant',
          zirconia: 'Zirconia Crown',
        },
        stats: {
          treatments: 'Successful Dental Treatments',
          satisfaction: 'Patient Satisfaction',
          experience: 'Years of Experience',
          dentists: 'Expert Dentists',
        },
      },
      hair: {
        title: 'Hair Transplant Results',
        subtitle: 'Our Natural-Looking Hair Transplant Results',
        treatments: {
          fue: 'FUE Hair Transplant',
          dhi: 'DHI Hair Transplant',
          beard: 'Beard Transplant',
          eyebrow: 'Eyebrow Transplant',
          prp: 'PRP Treatment',
          mesotherapy: 'Mesotherapy',
          analysis: 'Hair Analysis',
          women: 'Women Hair Transplant',
        },
        stats: {
          transplants: 'Successful Hair Transplants',
          satisfaction: 'Patient Satisfaction',
          experience: 'Years of Experience',
          surgeons: 'Expert Surgeons',
        },
      },
      aesthetic: {
        title: 'Aesthetic Surgery Results',
        subtitle: 'Our Safe and Natural Aesthetic Surgery Results',
        treatments: {
          rhinoplasty: 'Rhinoplasty (Nose Job)',
          liposuction: 'Liposuction (Fat Removal)',
          breastAesthetics: 'Breast Aesthetics',
          tummyTuck: 'Tummy Tuck',
          facelift: 'Face Lift',
          eyelidSurgery: 'Eyelid Surgery',
          bbl: 'Brazilian Butt Lift (BBL)',
          botoxFiller: 'Botox & Filler',
        },
        stats: {
          operations: 'Successful Operations',
          satisfaction: 'Patient Satisfaction',
          experience: 'Years of Experience',
          surgeons: 'Expert Surgeons',
        },
      },
      backToGallery: 'Back to Gallery',
      treatmentAreas: 'Treatment Areas',
      treatmentAreasDesc: 'Treatment options provided by our expert team',
      beforeAfterResults: 'Before & After Results',
      discoverResults: 'Discover our real patient results',
      resultTime: 'Result Time',
      description: 'Description',
      treatmentDetails: 'Treatment Details',
      results: 'Results',
      cta: {
        viewAllResults: 'View All Results',
        title: 'Would You Like to Achieve These Results Too?',
        subtitle: 'Get a free consultation with our expert team and create your personalized treatment plan.',
        consultation: 'Free Consultation',
        contact: 'Contact Us',
      },
    },
    gallery: {
      hero: {
        title: 'Before & After Gallery',
        subtitle: 'Witness real transformations from our satisfied patients. Each story represents a journey of confidence and renewed self-esteem.',
        consultation_btn: 'Free Consultation',
        contact_btn: 'Contact Us',
      },
      dental: {
        title: 'Dental Treatment Results',
        description: 'Discover the impressive results of our dental treatments that transform your smile. From aesthetic dentistry to implant applications, achieving perfect results.',
      },
      hair: {
        title: 'Hair Transplant Results',
        description: 'See the natural results achieved with our hair transplant and treatments. Permanent and natural-looking hair with FUE technique.',
      },
      aesthetic: {
        title: 'Plastic Surgery Results',
        description: 'Impressive results of our plastic surgery operations. Perfect transformations with our priority on natural appearance and patient safety.',
      },
      testimonials: {
        title: 'Patient Testimonials',
        subtitle: 'Listen to our patients\' experiences and satisfaction',
        testimonial1: '"My hair transplant operation was perfect. Natural-looking results and professional service. I definitely recommend it."',
        testimonial2: '"My dental treatment went great. My smile completely changed and my self-confidence increased. Thank you Vola Health!"',
        testimonial3: '"My plastic surgery operation exceeded my expectations. Natural results and excellent care. I recommend it to everyone."',
        hair_patient: 'Hair Transplant Patient',
        dental_patient: 'Dental Treatment Patient',
        plastic_patient: 'Plastic Surgery Patient',
      },
      cta: {
        title: 'Ready to Start Your Transformation?',
        subtitle: 'Join thousands of satisfied patients who have achieved their aesthetic goals. Achieve the look of your dreams with our expert care and proven results.',
        consultation_btn: 'Get Free Consultation',
        contact_btn: 'Contact Us',
      },
      stats: {
        transformations: 'Successful Transformations',
        satisfaction: 'Patient Satisfaction Rate',
        experience: 'Years of Excellence',
        countries: 'Countries Served',
      },
    },
    about: {
      content: 'Choosing Vola Health means choosing a team that values your journey as much as you do.',
    },
    contact: {
      info: {
        phone: 'Phone',
        email: 'Email',
      },
    },
    mockData: {
      patient: 'Patient',
      transformation: 'Amazing transformation',
      results: 'Incredible results',
      procedure: 'Life-changing procedure',
      male: 'Male',
      female: 'Female',
      months: 'months',
    },
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      services: 'Hizmetler',
      about: 'Hakkımızda',
      whyChooseUs: 'Neden Bizi Seçmelisiniz?',
      results: 'Sonuçlar',
      testimonials: 'Hasta Yorumları',
      contact: 'İletişim',
      consultation: 'Ücretsiz Konsültasyon',
    },
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      edit: 'Düzenle',
      create: 'Oluştur',
      update: 'Güncelle',
      submit: 'Gönder',
      close: 'Kapat',
      back: 'Geri',
      next: 'İleri',
      previous: 'Önceki',
      viewAll: 'Tümünü Gör',
      learnMore: 'Daha Fazla Bilgi',
      getStarted: 'Başlayın',
      bookNow: 'Hemen Rezerve Et',
      callNow: 'Hemen Ara',
      messageNow: 'Mesaj Gönder',
      readMore: 'Devamını Oku',
      showLess: 'Daha Az Göster',
      noResults: 'Sonuç bulunamadı',
      comingSoon: 'Yakında Gelecek',
      quickLinks: 'Hızlı Bağlantılar',
    },
    home: {
      hero: {
        title: 'Premium Medikal Turizm ile Hayatınızı Dönüştürün',
        subtitle: 'İstanbul\'da uzman tıbbi ekibimiz ve lüks konaklamalarımızla dünya standartlarında sağlık hizmeti deneyimleyin.',
        cta: 'Yolculuğunuza Başlayın',
        trustBadge: 'Dünya çapında 10.000+ hasta tarafından güveniliyor',
      },
    },
    services: {
      categories: {
        dental: 'Diş Tedavileri',
        hair: 'Saç Ekimi',
        aesthetic: 'Estetik Cerrahi',
      },
      packageDetails: {
        title: 'Tedavi Paketi Detayları',
        timeInTurkey: 'Türkiye\'de Kalış Süresi',
        operationTime: 'Operasyon Süresi',
        hospitalStay: 'Hastane Kalışı',
        recovery: 'İyileşme Süresi',
        accommodation: 'Konaklama',
        transportation: 'Ulaşım',
      },
    },
    results: {
      beforeAfter: {
        age: 'yaş',
        results: 'Sonuçlar',
      },
      treatments: {
        dental: 'Diş tedavilerimiz ile hastalarımız sadece estetik açıdan değil, aynı zamanda fonksiyonel olarak da mükemmel sonuçlar elde ediyor.',
        hair: 'Saç ekimi ve tedavilerimizde doğal görünüm ön plandadır.',
        aesthetic: 'Estetik cerrahi operasyonlarımızda hasta güvenliği ve doğal sonuçlar önceliğimizdir.',
      },
              dental: {
          title: 'Diş Tedavisi Sonuçları',
          subtitle: 'Gülüşünüzü Dönüştüren Tedavilerimizin Sonuçları',
        treatments: {
          smileDesign: 'Gülüş Tasarımı',
          dentalImplant: 'Diş İmplant',
          veneers: 'Diş Laminat',
          whitening: 'Diş Beyazlığı',
          orthodontics: 'Ortodontik',
          gumAesthetics: 'Gül Aestetiği',
          allOn4: 'All-on-4 İmplant',
          zirconia: 'Zirkonya Kron',
        },
        stats: {
          treatments: 'Başarılı Diş Tedavileri',
          satisfaction: 'Hasta Memnuniyeti',
          experience: 'Deneyim',
          dentists: 'Uzman Diş Hekimleri',
        },
      },
      hair: {
        title: 'Saç Ekimi Sonuçları',
        subtitle: 'Doğal Görünümlü Saç Ekimi Sonuçları',
        treatments: {
          fue: 'FUE Saç Ekimi',
          dhi: 'DHI Saç Ekimi',
          beard: 'Barba Ekimi',
          eyebrow: 'Bıyık Ekimi',
          prp: 'PRP İşlemi',
          mesotherapy: 'Mesoterapi',
          analysis: 'Saç Analizi',
          women: 'Kadın Saç Ekimi',
        },
        stats: {
          transplants: 'Başarılı Saç Ekimi',
          satisfaction: 'Hasta Memnuniyeti',
          experience: 'Deneyim',
          surgeons: 'Uzman Cerrahçılar',
        },
      },
      aesthetic: {
        title: 'Plastik Cerrahi Sonuçları',
        subtitle: 'Güvenli ve Doğal Plastik Cerrahi Sonuçları',
        treatments: {
          rhinoplasty: 'Rhinoplasti',
          liposuction: 'Liposuksiyon',
          breastAesthetics: 'Göğüs Aestetiği',
          tummyTuck: 'Tummy Tuck',
          facelift: 'Yüz Lifliği',
          eyelidSurgery: 'Bıyık Cerrahi',
          bbl: 'Brazilian Butt Lift',
          botoxFiller: 'Botok ve Filler',
        },
        stats: {
          operations: 'Başarılı Operasyonlar',
          satisfaction: 'Hasta Memnuniyeti',
          experience: 'Deneyim',
          surgeons: 'Uzman Cerrahçılar',
        },
      },
      backToGallery: 'Galereye Dön',
      treatmentAreas: 'Tedavi Alanları',
      treatmentAreasDesc: 'Uzman ekibimiz tarafından sağlanan tedavi seçenekleri',
      beforeAfterResults: 'Önce & Sonra Sonuçlar',
      discoverResults: 'Gerçek hastalarımızın sonuçlarını keşfedin',
      resultTime: 'Sonuç Zamanı',
      description: 'Açıklama',
      treatmentDetails: 'Tedavi Detayları',
      results: 'Sonuçlar',
      cta: {
        viewAllResults: 'Tüm Sonuçları Gör',
        title: 'Bu Sonuçları Da Elde Etmek İstermisiniz?',
        subtitle: 'Uzman ekibimizle birlikte ücretsiz konsültasyon alın ve kişiselleştirilmiş tedavi planınızı oluşturun.',
        consultation: 'Ücretsiz Konsültasyon',
        contact: 'İletişime Geçin',
      },
    },
    gallery: {
      hero: {
        title: 'Önce & Sonra Galerisi',
        subtitle: 'Memnun hastalarımızın gerçek dönüşümlerine tanık olun. Her hikaye güven ve yenilenen öz saygı yolculuğunu temsil ediyor.',
        consultation_btn: 'Ücretsiz Konsültasyon',
        contact_btn: 'İletişim',
      },
      dental: {
        title: 'Diş Tedavisi Sonuçları',
        description: 'Gülüşünüzü dönüştüren diş tedavilerimizin etkileyici sonuçlarını keşfedin. Estetik diş hekimliğinden implant uygulamalarına kadar mükemmel sonuçlar elde ediyoruz.',
      },
      hair: {
        title: 'Saç Ekimi Sonuçları',
        description: 'Saç ekimi ve tedavilerimizle elde edilen doğal sonuçları görün. FUE tekniği ile kalıcı ve doğal görünümlü saçlar.',
      },
      aesthetic: {
        title: 'Plastik Cerrahi Sonuçları',
        description: 'Plastik cerrahi operasyonlarımızın etkileyici sonuçları. Doğal görünüm ve hasta güvenliği önceliğimizle mükemmel dönüşümler.',
      },
      testimonials: {
        title: 'Hasta Yorumları',
        subtitle: 'Hastalarımızın deneyimlerini ve memnuniyetlerini dinleyin',
        testimonial1: '"Saç ekimi operasyonum mükemmeldi. Doğal görünümlü sonuçlar ve profesyonel hizmet. Kesinlikle tavsiye ederim."',
        testimonial2: '"Diş tedavim harika geçti. Gülüşüm tamamen değişti ve özgüvenim arttı. Teşekkürler Vola Health!"',
        testimonial3: '"Plastik cerrahi operasyonum beklentilerimi aştı. Doğal sonuçlar ve mükemmel bakım. Herkese tavsiye ederim."',
        hair_patient: 'Saç Ekimi Hastası',
        dental_patient: 'Diş Tedavisi Hastası',
        plastic_patient: 'Plastik Cerrahi Hastası',
      },
      cta: {
        title: 'Dönüşümünüze Başlamaya Hazır mısınız?',
        subtitle: 'Estetik hedeflerine ulaşan binlerce memnun hastaya katılın. Uzman bakımımız ve kanıtlanmış sonuçlarımızla hayalinizdeki görünüme kavuşun.',
        consultation_btn: 'Ücretsiz Konsültasyon Alın',
        contact_btn: 'İletişime Geçin',
      },
      stats: {
        transformations: 'Başarılı Dönüşüm',
        satisfaction: 'Hasta Memnuniyet Oranı',
        experience: 'Yıllık Mükemmellik',
        countries: 'Hizmet Verilen Ülke',
      },
    },
    about: {
      content: 'Vola Health\'i seçmek, yolculuğunuza sizin kadar değer veren bir ekibi seçmek demektir.',
    },
    contact: {
      info: {
        phone: 'Telefon',
        email: 'E-posta',
      },
    },
    mockData: {
      patient: 'Hasta',
      transformation: 'Muhteşem dönüşüm',
      results: 'İnanılmaz sonuçlar',
      procedure: 'Hayat değiştiren prosedür',
      male: 'Erkek',
      female: 'Kadın',
      months: 'ay',
    },
  },
  es: {} as Translations,
  pt: {} as Translations,
  de: {} as Translations,
  fr: {} as Translations,
  ru: {} as Translations,
  ro: {} as Translations,
  it: {} as Translations,
  pl: {} as Translations,
  ar: {} as Translations,
};

export function getTranslation(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key;
        }
      }
      break;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  if (params) {
    return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
      return result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    }, value);
  }

  return value;
} 