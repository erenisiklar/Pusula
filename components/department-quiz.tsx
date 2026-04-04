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
      { text: "Bir uygulama veya web sitesi yapmaya çalışırım", scores: { tech: 4, engineering: 1 } },
      { text: "Bir şeyi söküp nasıl çalıştığını anlamaya çalışırım", scores: { engineering: 4, tech: 1 } },
      { text: "Arkadaşlarımla bir etkinlik organize ederim veya bir proje yönetirim", scores: { business: 4, social: 1 } },
      { text: "Sosyal bir konuda araştırma yapar, makale veya belgesel izlerim", scores: { social: 4, business: 1 } },
      { text: "Çizim yapar, tasarım programlarıyla oynar veya fotoğraf çekerim", scores: { creative: 4, science: 1 } },
      { text: "Doğayı gözlemler, deney yapar veya bilimsel içerik tüketirim", scores: { science: 4, engineering: 1 } },
    ],
  },
  {
    question: "Bir grup projesinde genellikle hangi rolü üstlenirsin?",
    subtitle: "Doğal olarak yöneldiğin rol",
    options: [
      { text: "Teknik kısmı ben yaparım — araştırma, hesaplama, kodlama", scores: { tech: 3, engineering: 2 } },
      { text: "Projeyi planlar, iş bölümünü yapar, sunumu hazırlarım", scores: { business: 4, social: 1 } },
      { text: "Yaratıcı kısmını üstlenirim — görsel, tasarım, sunum estetiği", scores: { creative: 4 } },
      { text: "Herkesin fikrini dinler, grubu bir arada tutarım", scores: { social: 3, business: 2 } },
    ],
  },
  {
    question: "Hangisi seni daha çok heyecanlandırır?",
    options: [
      { text: "Yapay zekanın gelecekte neler yapabileceğini düşünmek", scores: { tech: 4, science: 1 } },
      { text: "Bir köprünün veya binanın mühendislik harikası olması", scores: { engineering: 4, creative: 1 } },
      { text: "Bir startup'ın sıfırdan milyar dolarlık şirket olması", scores: { business: 4 } },
      { text: "Bir ülkenin politikasının milyonlarca insanı etkilemesi", scores: { social: 4 } },
      { text: "Güzel tasarlanmış bir ürünün insanların hayatını kolaylaştırması", scores: { creative: 3, tech: 1, business: 1 } },
      { text: "Bir hastalığa çare bulunması veya bilimsel keşif yapılması", scores: { science: 4, engineering: 1 } },
    ],
  },
  {
    question: "Bir problemi çözerken önce ne yaparsın?",
    subtitle: "Düşünce tarzın hangisine daha yakın?",
    options: [
      { text: "Mantıksal adımlarla parçalara ayırırım, sistematik ilerlerim", scores: { tech: 3, engineering: 2, science: 1 } },
      { text: "Büyük resme bakarım, strateji oluştururum", scores: { business: 3, social: 2 } },
      { text: "Farklı açılardan bakarım, yaratıcı çözüm ararım", scores: { creative: 3, social: 1, tech: 1 } },
      { text: "İnsanlarla konuşurum, farklı bakış açıları toplarım", scores: { social: 4, business: 1 } },
    ],
  },
  {
    question: "Okulda hangi ders türlerinden daha çok keyif alırsın?",
    options: [
      { text: "Matematik ve mantık — formüller, ispatlar, problem çözme", scores: { tech: 2, engineering: 3, science: 1 } },
      { text: "Fizik ve fen — deneyler, doğa kanunları, uygulamalı bilim", scores: { engineering: 3, science: 2 } },
      { text: "Tarih, edebiyat ve sosyal bilimler — toplum, kültür, insan", scores: { social: 4, creative: 1 } },
      { text: "Ekonomi ve işletme — piyasalar, ticaret, finansal okuryazarlık", scores: { business: 4, social: 1 } },
      { text: "Sanat, müzik veya görsel dersler — yaratıcılık, estetik", scores: { creative: 4 } },
      { text: "Biyoloji ve kimya — canlılar, moleküller, sağlık", scores: { science: 4 } },
    ],
  },
  {
    question: "10 yıl sonra kendini nerede görüyorsun?",
    subtitle: "Hangi hayat seni daha çok mutlu eder?",
    options: [
      { text: "Teknoloji şirketinde ürün geliştiriyorum veya kendi startup'ımı kurdum", scores: { tech: 3, business: 2 } },
      { text: "Büyük bir mühendislik projesinde — köprü, uçak, fabrika tasarlıyorum", scores: { engineering: 4, creative: 1 } },
      { text: "Bir şirketin üst yönetiminde stratejik kararlar alıyorum", scores: { business: 4 } },
      { text: "Uluslararası bir kuruluşta dünyayı daha iyi bir yer yapıyorum", scores: { social: 4, business: 1 } },
      { text: "Kendi tasarım stüdyomda veya mimarlık bürosunda çalışıyorum", scores: { creative: 4 } },
      { text: "Bir laboratuvarda veya hastanede araştırma/tedavi yapıyorum", scores: { science: 4 } },
    ],
  },
  {
    question: "Hangi tür içerik seni daha çok çeker?",
    subtitle: "YouTube, podcast veya kitap olarak",
    options: [
      { text: "Teknoloji incelemeleri, kodlama tutorialları, yapay zeka haberleri", scores: { tech: 4 } },
      { text: "Nasıl yapılır videoları, mühendislik harikaları, mega yapılar", scores: { engineering: 4 } },
      { text: "İş dünyası hikayeleri, yatırım, ekonomi analizleri", scores: { business: 4 } },
      { text: "Belgeseller, siyaset, psikoloji, toplumsal konular", scores: { social: 4 } },
      { text: "Tasarım, mimari, sanat, estetik içerikler", scores: { creative: 4 } },
      { text: "Bilim videoları, uzay, tıp, keşifler", scores: { science: 4 } },
    ],
  },
  {
    question: "Bir hackathon'a katılsan hangi projede çalışmak istersin?",
    subtitle: "24 saatin var, ne yaparsın?",
    options: [
      { text: "Bir mobil uygulama veya web platformu geliştirmek", scores: { tech: 4, creative: 1 } },
      { text: "Bir robot veya IoT cihazı prototipi yapmak", scores: { engineering: 4, tech: 1 } },
      { text: "Sosyal etki yaratan bir iş modeli tasarlamak", scores: { business: 3, social: 2 } },
      { text: "Toplumsal bir soruna farkındalık kampanyası oluşturmak", scores: { social: 4, creative: 1 } },
      { text: "Kullanıcı deneyimi ve arayüz tasarımı yapmak", scores: { creative: 4, tech: 1 } },
      { text: "Sağlık verisi analiz eden bir araç geliştirmek", scores: { science: 3, tech: 2 } },
    ],
  },
  {
    question: "Hangisi seni daha çok rahatsız eder?",
    subtitle: "İçgüdüsel tepkin önemli",
    options: [
      { text: "Yavaş ve verimsiz çalışan bir sistem veya yazılım", scores: { tech: 4, engineering: 1 } },
      { text: "Kötü tasarlanmış, çirkin veya kullanışsız bir ürün", scores: { creative: 3, engineering: 2 } },
      { text: "Adaletsiz bir ekonomik sistem veya iş uygulaması", scores: { business: 2, social: 3 } },
      { text: "İnsanların bilimsel gerçekleri görmezden gelmesi", scores: { science: 3, social: 2 } },
    ],
  },
  {
    question: "Sana süper bir güç verilse hangisini seçerdin?",
    subtitle: "Son soru — eğlenceli ama söyleyici",
    options: [
      { text: "Her sistemi ve kodu anında anlama ve yazma gücü", scores: { tech: 4 } },
      { text: "Her şeyin nasıl çalıştığını bir bakışta görme gücü", scores: { engineering: 3, science: 2 } },
      { text: "İnsanları ikna etme ve liderlik etme gücü", scores: { business: 3, social: 2 } },
      { text: "İnsanların ne hissettiğini ve düşündüğünü anlama gücü", scores: { social: 4 } },
      { text: "Hayal ettiğin her şeyi görselleştirme ve yaratma gücü", scores: { creative: 4 } },
      { text: "Her hastalığı teşhis edip çare bulma gücü", scores: { science: 4 } },
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
    description: "Analitik düşünce yapın güçlü, problem çözmeyi ve sistemler kurmayı seviyorsun. Yazılım, yapay zeka ve dijital dünya senin alanın. Teknoloji sektörü hızla büyüyor ve senin gibi sistematik düşünürlere ihtiyaç duyuyor.",
  },
  engineering: {
    title: "Mühendislik & Yapı",
    emoji: "⚙️",
    description: "Şeylerin nasıl çalıştığını anlamak ve daha iyisini tasarlamak seni heyecanlandırıyor. Fiziksel dünyayı şekillendirmek, somut projeler üretmek senin için anlam taşıyor. Mühendislik disiplinleri senin merakını karşılayacak.",
  },
  business: {
    title: "İş Dünyası & Ekonomi",
    emoji: "📊",
    description: "Stratejik düşünme, organizasyon ve liderlik yeteneklerin öne çıkıyor. Büyük resmi görebiliyorsun ve insanları yönetmekten, projeler planlamaktan keyif alıyorsun. İş dünyası ve ekonomi senin sahnein.",
  },
  social: {
    title: "Toplum & İnsan",
    emoji: "🌍",
    description: "İnsanları anlamak, toplumsal konularda düşünmek ve dünyayı daha adil bir yer yapmak seni motive ediyor. Empatin ve analitik bakış açın sosyal bilimler alanında seni başarılı kılacak.",
  },
  creative: {
    title: "Yaratıcılık & Tasarım",
    emoji: "🎨",
    description: "Estetik duyarlılığın ve yaratıcı problem çözme yeteneğin güçlü. Güzel ve işlevsel şeyler yaratmak, görsel düşünmek senin doğal yeteneğin. Tasarım ve mimarlık alanları senin yaratıcılığını besleyecek.",
  },
  science: {
    title: "Bilim & Araştırma",
    emoji: "🔬",
    description: "Merak duygun güçlü, doğayı ve canlıları anlamak seni heyecanlandırıyor. Bilimsel yöntemle düşünme ve keşfetme tutkun seni araştırma dünyasında başarılı kılacak.",
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
