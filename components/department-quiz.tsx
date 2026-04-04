"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, RotateCcw } from "lucide-react";

// ─── Scoring categories ───
// Each answer distributes points across these categories
type Category = "tech" | "engineering" | "business" | "social" | "creative" | "science";

const CATEGORY_DEPARTMENTS: Record<Category, string[]> = {
  tech: ["Bilgisayar Mühendisliği", "Elektrik-Elektronik Mühendisliği"],
  engineering: ["Mühendislik", "Makine Mühendisliği", "Havacılık Mühendisliği"],
  business: ["İşletme", "Ekonomi"],
  social: ["Siyaset Bilimi", "Uluslararası İlişkiler", "Psikoloji"],
  creative: ["Tasarım", "Mimarlık"],
  science: ["Tıp Bilimleri"],
};

interface QuizOption {
  text: string;
  scores: Partial<Record<Category, number>>;
}

interface QuizQuestion {
  question: string;
  subtitle?: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: "Cumartesi günü tamamen serbest — ne yaparsın?",
    subtitle: "İçgüdüsel olarak aklına ilk gelen",
    options: [
      { text: "Bilgisayarın başına geçip bir şeyler kurcalarım — yazılım, oyun motoru, elektronik devre", scores: { tech: 4, engineering: 1 } },
      { text: "Bir şeyi söküp nasıl çalıştığını anlamaya çalışırım — saat, motor, eski cihaz", scores: { engineering: 4, tech: 1 } },
      { text: "Arkadaşlarımla bir etkinlik organize ederim ya da alışveriş/bütçe planı yaparım", scores: { business: 4, social: 1 } },
      { text: "Belgesel izler, haber okur ya da toplumsal bir konuda arkadaşlarımla tartışırım", scores: { social: 4, business: 1 } },
      { text: "Çizim yapar, fotoğraf çeker, bir mekan veya oda düzenlerim", scores: { creative: 4, science: 1 } },
      { text: "Doğada vakit geçirir, bitkileri gözlemler ya da evde deney yaparım", scores: { science: 4, engineering: 1 } },
    ],
  },
  {
    question: "Bir grup projesinde genellikle hangi rolü üstlenirsin?",
    subtitle: "Doğal olarak yöneldiğin rol",
    options: [
      { text: "Teknik kısmı ben yaparım — araştırma, hesaplama, veri toplama", scores: { tech: 3, engineering: 2 } },
      { text: "Projeyi planlar, iş bölümünü yapar, sunumu organize ederim", scores: { business: 4, social: 1 } },
      { text: "Yaratıcı kısmını üstlenirim — poster, görsel, sunum estetiği", scores: { creative: 4 } },
      { text: "Herkesin fikrini dinler, anlaşmazlıkları çözer, grubu motive ederim", scores: { social: 3, business: 2 } },
    ],
  },
  {
    question: "Hangisi seni daha çok heyecanlandırır?",
    options: [
      { text: "Telefonların ve bilgisayarların yıldan yıla nasıl bu kadar güçlendiğini düşünmek", scores: { tech: 4, science: 1 } },
      { text: "Dev bir köprünün, gökdelenin veya uçağın nasıl ayakta durduğunu anlamak", scores: { engineering: 4, creative: 1 } },
      { text: "Küçük bir dükkanın nasıl büyük bir markaya dönüştüğünü öğrenmek", scores: { business: 4 } },
      { text: "Bir kanunun veya kararın toplumu nasıl değiştirdiğini görmek", scores: { social: 4 } },
      { text: "Güzel tasarlanmış bir binanın, afişin veya ürünün insanlarda bıraktığı etki", scores: { creative: 3, engineering: 1, business: 1 } },
      { text: "Yeni bir ilaç veya tedavi yönteminin hayat kurtarması", scores: { science: 4, engineering: 1 } },
    ],
  },
  {
    question: "Bir problemi çözerken önce ne yaparsın?",
    subtitle: "Düşünce tarzın hangisine daha yakın?",
    options: [
      { text: "Mantıksal adımlarla parçalara ayırırım, sistematik ilerlerim", scores: { tech: 3, engineering: 2, science: 1 } },
      { text: "Büyük resme bakarım — asıl sorun ne, neyi çözersek en çok işe yarar?", scores: { business: 3, social: 2 } },
      { text: "Farklı açılardan bakarım, alışılmadık bir çözüm bulmaya çalışırım", scores: { creative: 3, social: 1, tech: 1 } },
      { text: "Etrafımdaki insanlara danışırım, farklı görüşleri bir araya getiririm", scores: { social: 4, business: 1 } },
    ],
  },
  {
    question: "Okulda hangi ders türlerinden daha çok keyif alırsın?",
    options: [
      { text: "Matematik ve mantık — formüller, ispatlar, problem çözme", scores: { tech: 2, engineering: 3, science: 1 } },
      { text: "Fizik ve fen — deneyler, doğa kanunları, uygulamalı bilim", scores: { engineering: 3, science: 2 } },
      { text: "Tarih, edebiyat ve sosyal bilimler — toplum, kültür, insan", scores: { social: 4, creative: 1 } },
      { text: "Ekonomi, girişimcilik veya güncel olaylar — piyasalar, ticaret, para", scores: { business: 4, social: 1 } },
      { text: "Sanat, müzik veya görsel dersler — yaratıcılık, el becerisi", scores: { creative: 4 } },
      { text: "Biyoloji ve kimya — canlılar, moleküller, sağlık", scores: { science: 4 } },
    ],
  },
  {
    question: "10 yıl sonra kendini nerede görüyorsun?",
    subtitle: "Hangi hayat seni daha çok mutlu eder?",
    options: [
      { text: "Bir teknoloji firmasında yazılım veya ürün geliştiriyorum", scores: { tech: 3, business: 2 } },
      { text: "Bir mühendislik projesinde çalışıyorum — fabrika, altyapı, enerji santrali", scores: { engineering: 4, creative: 1 } },
      { text: "Kendi işimi kurmuşum ya da bir şirkette yönetici olmuşum", scores: { business: 4 } },
      { text: "İnsanlara yardım eden bir kurumda çalışıyorum — eğitim, hukuk, diplomasi", scores: { social: 4, business: 1 } },
      { text: "Tasarım stüdyomda, mimarlık bürosunda veya sanat atölyesinde çalışıyorum", scores: { creative: 4 } },
      { text: "Bir hastanede, laboratuvarda veya üniversitede araştırma yapıyorum", scores: { science: 4 } },
    ],
  },
  {
    question: "Hangi tür içerik seni daha çok çeker?",
    subtitle: "YouTube, sosyal medya veya kitap olarak",
    options: [
      { text: "Teknoloji incelemeleri, bilgisayar/telefon karşılaştırmaları, yazılım dünyası", scores: { tech: 4 } },
      { text: "\"Nasıl yapılır\" videoları, dev makineler, mega projeler, uzay araçları", scores: { engineering: 4 } },
      { text: "Girişimcilik hikayeleri, kişisel gelişim, para ve ekonomi", scores: { business: 4 } },
      { text: "Haberler, tartışma programları, psikoloji, insan hikayeleri", scores: { social: 4 } },
      { text: "Mimari, iç tasarım, moda, sanat ve estetik içerikler", scores: { creative: 4 } },
      { text: "Doğa belgeselleri, tıp hikayeleri, bilimsel keşifler", scores: { science: 4 } },
    ],
  },
  {
    question: "Bir yarışmaya katılacaksın — hangisini seçersin?",
    subtitle: "Hangisinde kendini daha rahat hissedersin?",
    options: [
      { text: "Bilişim veya robot yarışması — bir şey programla ya da devreyle çöz", scores: { tech: 3, engineering: 2 } },
      { text: "Proje veya model yarışması — bir köprü, araç ya da mekanizma tasarla", scores: { engineering: 4, creative: 1 } },
      { text: "Girişimcilik veya vaka analizi yarışması — bir iş fikri sun", scores: { business: 3, social: 2 } },
      { text: "Münazara veya makale yarışması — bir görüşü savun", scores: { social: 4, creative: 1 } },
      { text: "Tasarım veya sanat yarışması — afiş, kısa film ya da portfolyo hazırla", scores: { creative: 4, tech: 1 } },
      { text: "Bilim olimpiyatı veya deney yarışması — bir hipotezi test et", scores: { science: 3, tech: 2 } },
    ],
  },
  {
    question: "Hangisi seni daha çok rahatsız eder?",
    subtitle: "İçgüdüsel tepkin önemli",
    options: [
      { text: "İşlerin yavaş ve verimsiz ilerlemesi, gereksiz bürokrasi", scores: { tech: 3, engineering: 2 } },
      { text: "Çirkin, düzensiz veya kötü tasarlanmış bir mekan ya da ürün", scores: { creative: 3, engineering: 2 } },
      { text: "Haksızlık, adaletsizlik veya insanların sesini duyuramaması", scores: { social: 4, business: 1 } },
      { text: "İnsanların bilimsel gerçeklere inanmaması veya doğaya zarar vermesi", scores: { science: 3, social: 2 } },
    ],
  },
  {
    question: "Sana süper bir güç verilse hangisini seçerdin?",
    subtitle: "Son soru — eğlenceli ama söyleyici",
    options: [
      { text: "Her makineyi ve sistemi bir bakışta anlama ve kontrol etme gücü", scores: { tech: 3, engineering: 2 } },
      { text: "Kafandaki her şeyi gerçeğe dönüştürme gücü — bina, araç, mekanizma", scores: { engineering: 3, creative: 2 } },
      { text: "İnsanları bir amaç etrafında birleştirme ve yönlendirme gücü", scores: { business: 3, social: 2 } },
      { text: "İnsanların ne hissettiğini ve neye ihtiyacı olduğunu anlama gücü", scores: { social: 4 } },
      { text: "Hayal ettiğin her görseli, mekanı veya tasarımı anında yaratma gücü", scores: { creative: 4 } },
      { text: "Her hastalığı teşhis edip doğanın sırlarını çözme gücü", scores: { science: 4 } },
    ],
  },
];

// ─── Result calculation ───
interface QuizResult {
  topCategory: Category;
  scores: Record<Category, number>;
  topDepartments: string[];
  description: string;
}

const CATEGORY_DESCRIPTIONS: Record<Category, { title: string; description: string; emoji: string }> = {
  tech: {
    title: "Teknoloji & Yazılım",
    emoji: "💻",
    description: "Analitik düşünce yapın güçlü, sistemlerin nasıl çalıştığını anlamak ve daha iyisini kurmak seni motive ediyor. Bilgisayarlar, yazılım ve dijital dünya senin doğal ortamın.",
  },
  engineering: {
    title: "Mühendislik & Yapı",
    emoji: "⚙️",
    description: "Şeylerin nasıl çalıştığını anlamak ve elle tutulur projeler üretmek seni heyecanlandırıyor. Somut problemlere somut çözümler bulmak, fiziksel dünyayı şekillendirmek senin için anlam taşıyor.",
  },
  business: {
    title: "İş Dünyası & Ekonomi",
    emoji: "📊",
    description: "Organizasyon yeteneğin ve stratejik düşünme kapasiten öne çıkıyor. Planlama, yönetim ve insanları bir hedefe yönlendirme konusunda doğal bir yeteneğin var.",
  },
  social: {
    title: "Toplum & İnsan",
    emoji: "🌍",
    description: "İnsanları anlamak, toplumsal konularda düşünmek ve adaletli bir dünya için çalışmak seni motive ediyor. Empatin ve eleştirel bakış açın sosyal bilimler alanında seni başarılı kılacak.",
  },
  creative: {
    title: "Yaratıcılık & Tasarım",
    emoji: "🎨",
    description: "Estetik duyarlılığın ve görsel düşünme yeteneğin güçlü. Güzel ve işlevsel şeyler yaratmak, mekanlara ve ürünlere şekil vermek senin doğal yeteneğin.",
  },
  science: {
    title: "Bilim & Araştırma",
    emoji: "🔬",
    description: "Merak duygun güçlü, doğayı ve canlıları anlamak seni heyecanlandırıyor. Gözlem yapma, soru sorma ve cevap arama alışkanlığın seni araştırma dünyasında başarılı kılacak.",
  },
};

function calculateResults(answers: number[]): QuizResult {
  const scores: Record<Category, number> = { tech: 0, engineering: 0, business: 0, social: 0, creative: 0, science: 0 };

  answers.forEach((answerIdx, questionIdx) => {
    const option = QUESTIONS[questionIdx].options[answerIdx];
    if (!option) return;
    for (const [cat, pts] of Object.entries(option.scores)) {
      scores[cat as Category] += pts;
    }
  });

  const sorted = (Object.entries(scores) as [Category, number][]).sort((a, b) => b[1] - a[1]);
  const topCategory = sorted[0][0];

  // Get top 2 categories' departments, prioritize primary
  const topDepts = [
    ...CATEGORY_DEPARTMENTS[sorted[0][0]],
    ...CATEGORY_DEPARTMENTS[sorted[1][0]],
  ];
  // Remove duplicates, keep order
  const uniqueDepts = [...new Set(topDepts)];

  return {
    topCategory,
    scores,
    topDepartments: uniqueDepts.slice(0, 3),
    description: CATEGORY_DESCRIPTIONS[topCategory].description,
  };
}

// ─── Component ───
interface DepartmentQuizProps {
  onComplete: (department: string) => void;
  onSkip: () => void;
}

export default function DepartmentQuiz({ onComplete, onSkip }: DepartmentQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  const question = QUESTIONS[currentQ];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQ) / totalQuestions) * 100;

  function handleSelect(optionIdx: number) {
    setSelectedOption(optionIdx);
  }

  function handleNext() {
    if (selectedOption === null) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ + 1 >= totalQuestions) {
      setResult(calculateResults(newAnswers));
    } else {
      setCurrentQ(currentQ + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setSelectedOption(null);
      setCurrentQ(currentQ - 1);
    }
  }

  function handleRetry() {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
  }

  // ─── Result screen ───
  if (result) {
    const info = CATEGORY_DESCRIPTIONS[result.topCategory];
    const sorted = (Object.entries(result.scores) as [Category, number][]).sort((a, b) => b[1] - a[1]);
    const maxScore = sorted[0][1];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-3">{info.emoji}</div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
            {info.title}
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "var(--muted)" }}>
            {info.description}
          </p>
        </div>

        {/* Score bars */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
            İlgi Alanı Dağılımın
          </p>
          {sorted.map(([cat, score]) => {
            const catInfo = CATEGORY_DESCRIPTIONS[cat];
            const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span style={{ color: "var(--text)" }}>
                    {catInfo.emoji} {catInfo.title}
                  </span>
                  <span style={{ color: "var(--muted)" }}>{score} puan</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface2)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat === result.topCategory ? "var(--blue)" : "var(--border)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended departments */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
            Sana Önerilen Bölümler
          </p>
          <div className="space-y-2">
            {result.topDepartments.map((dept, i) => (
              <button
                key={dept}
                onClick={() => onComplete(dept)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: i === 0 ? "var(--blue-bg)" : "var(--surface)",
                  border: `1px solid ${i === 0 ? "var(--blue-border)" : "var(--border)"}`,
                  color: i === 0 ? "var(--blue)" : "var(--text)",
                }}
              >
                <span>{dept}</span>
                {i === 0 && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--blue)", color: "#fff" }}
                  >
                    En Uygun
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
          >
            <RotateCcw className="w-4 h-4" />
            Tekrar Çöz
          </button>
          <button
            onClick={onSkip}
            className="text-xs font-medium hover:opacity-80"
            style={{ color: "var(--muted)" }}
          >
            Bölüm seçmeden devam et
          </button>
        </div>
      </div>
    );
  }

  // ─── Question screen ───
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-2" style={{ color: "var(--muted)" }}>
          <span>Soru {currentQ + 1} / {totalQuestions}</span>
          <span>%{Math.round(progress)}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface2)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: "var(--blue)" }}
          />
        </div>
      </div>

      {/* Question */}
      <div>
        <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>{question.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
            style={{
              backgroundColor: selectedOption === i ? "var(--blue-bg)" : "var(--surface)",
              border: `1.5px solid ${selectedOption === i ? "var(--blue)" : "var(--border)"}`,
              color: selectedOption === i ? "var(--blue)" : "var(--text)",
              fontWeight: selectedOption === i ? 500 : 400,
            }}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          {currentQ > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
          )}
          <button
            onClick={onSkip}
            className="text-xs font-medium hover:opacity-80"
            style={{ color: "var(--muted)" }}
          >
            Testi atla
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-30"
          style={{ backgroundColor: "var(--blue)", color: "#fff" }}
        >
          {currentQ + 1 >= totalQuestions ? (
            <>
              <Sparkles className="w-4 h-4" />
              Sonuçları Gör
            </>
          ) : (
            <>
              Sonraki
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
