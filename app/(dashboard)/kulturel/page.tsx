import { Globe } from "lucide-react";

export default function KulturelPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Kültürel Rehber
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Hedef ülkelerdeki yaşam, kültür ve öğrenci hayatı hakkında bilgiler
      </p>
      <div
        className="rounded-xl p-12 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <Globe className="w-12 h-12 mb-4" style={{ color: "var(--muted)", opacity: 0.3 }} />
        <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
          Bu sayfa yakında aktif olacak.
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
          Ülke bazlı kültürel rehberler ve yaşam ipuçları eklenecektir.
        </p>
      </div>
    </div>
  );
}
