export interface CountryModifier {
  gpaWeight: number;
  languageWeight: number;
  systemBonus: number;
  description: string;
}

export const countryModifiers: Record<string, CountryModifier> = {
  Almanya: {
    gpaWeight: 1.3,
    languageWeight: 1.0,
    systemBonus: -5,
    description:
      "Numerus Clausus (NC) sistemi: GPA çok belirleyici, eğitim genelde ücretsiz",
  },
  İngiltere: {
    gpaWeight: 1.0,
    languageWeight: 1.1,
    systemBonus: -3,
    description:
      "UCAS sistemi: kişisel başvuru ve referans mektupları da değerlendiriliyor",
  },
  Hollanda: {
    gpaWeight: 1.0,
    languageWeight: 1.0,
    systemBonus: 0,
    description:
      "Genel olarak erişilebilir sistem, bazı programlarda numerus fixus kısıtlaması",
  },
  Fransa: {
    gpaWeight: 1.1,
    languageWeight: 1.0,
    systemBonus: -4,
    description:
      "Grandes Écoles için yüksek rekabet, devlet üniversiteleri daha erişilebilir",
  },
  İtalya: {
    gpaWeight: 0.9,
    languageWeight: 0.9,
    systemBonus: 3,
    description:
      "Motivasyon mektubu ağırlıklı değerlendirme, genel olarak erişilebilir",
  },
  İspanya: {
    gpaWeight: 1.0,
    languageWeight: 1.0,
    systemBonus: 2,
    description: "Genel olarak erişilebilir kabul sistemi",
  },
  İsviçre: {
    gpaWeight: 1.2,
    languageWeight: 1.1,
    systemBonus: -5,
    description: "Çok yüksek akademik standartlar, sıkı seçim süreci",
  },
  İsveç: {
    gpaWeight: 1.0,
    languageWeight: 1.1,
    systemBonus: 2,
    description:
      "Erişilebilir sistem, güçlü dil gereksinimleri, bazı programlar ücretsiz",
  },
  Danimarka: {
    gpaWeight: 1.0,
    languageWeight: 1.0,
    systemBonus: 0,
    description: "Standart kabul sistemi, quota bazlı değerlendirme",
  },
  Norveç: {
    gpaWeight: 1.0,
    languageWeight: 1.1,
    systemBonus: 3,
    description: "Erişilebilir sistem, devlet üniversitelerinde eğitim ücretsiz",
  },
  Finlandiya: {
    gpaWeight: 1.0,
    languageWeight: 1.0,
    systemBonus: 0,
    description: "Giriş sınavı bazlı sistem, akademik yeterlilik önemli",
  },
  Belçika: {
    gpaWeight: 1.0,
    languageWeight: 1.0,
    systemBonus: 2,
    description: "Genel olarak erişilebilir kabul sistemi",
  },
  Avusturya: {
    gpaWeight: 1.1,
    languageWeight: 1.0,
    systemBonus: -2,
    description:
      "Bazı programlarda giriş sınavı, düşük eğitim ücreti",
  },
  Portekiz: {
    gpaWeight: 1.0,
    languageWeight: 0.9,
    systemBonus: 3,
    description: "Erişilebilir kabul sistemi, uygun fiyatlı eğitim",
  },
  İrlanda: {
    gpaWeight: 1.0,
    languageWeight: 1.1,
    systemBonus: 0,
    description: "İngiliz sistemine benzer kabul süreci",
  },
  Polonya: {
    gpaWeight: 0.9,
    languageWeight: 0.9,
    systemBonus: 5,
    description: "Erişilebilir kabul sistemi, düşük eğitim ücreti",
  },
  Çekya: {
    gpaWeight: 0.9,
    languageWeight: 0.9,
    systemBonus: 5,
    description: "Erişilebilir kabul sistemi, uygun yaşam maliyeti",
  },
  Macaristan: {
    gpaWeight: 0.9,
    languageWeight: 0.9,
    systemBonus: 5,
    description: "Erişilebilir kabul sistemi, Stipendium Hungaricum burs imkânı",
  },
  Estonya: {
    gpaWeight: 1.0,
    languageWeight: 1.0,
    systemBonus: 3,
    description: "Erişilebilir kabul sistemi, düşük yaşam maliyeti",
  },
};
