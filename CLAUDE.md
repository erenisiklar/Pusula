# Pusula — Proje Talimatları

## Proje

Türkiye'den Avrupa üniversitelerine başvurmak isteyen öğrenciler için AI destekli rehber platform. Öğrenci GPA ve dil sertifikası girince hangi üniversitelere girebileceğini görür.

## Renk Paleti — ASLA DEĞİŞTİRME

```
--bg: #0a0f1e | --surface: #111827 | --surface2: #1a2236 | --border: rgba(255,255,255,0.08)
--text: #f0f4ff | --muted: #8892a8 | --white: #ffffff
--blue: #3b82f6 | --blue-light: #60a5fa | --blue-bg: rgba(59,130,246,0.10) | --blue-border: rgba(59,130,246,0.25)
--gold: #f59e0b | --gold-light: #fbbf24 | --gold-bg: rgba(245,158,11,0.10) | --gold-border: rgba(245,158,11,0.25)
--success: #22c55e | --success-bg: rgba(34,197,94,0.10)
--danger: #ef4444 | --danger-bg: rgba(239,68,68,0.10)
```

Primary buton → blue. Vurgu/premium → gold. Başarı → success. Hata → danger. **Mor/turuncu/pembe YASAK.**

## Stack

Next.js 14 App Router, Supabase, Claude API (claude-haiku-4-5), Tailwind CSS, shadcn/ui, Resend, Vercel

## Sayfalar

/dashboard, /schools (core), /motivasyon, /cv, /takvim, /baglanti, /dersler, /kulturel, /rankings, /acceptance, /map

## Eligibility Skoru

| Kriter | Puan |
|--------|------|
| GPA karşılandı | +25 |
| GPA eksik her puan | -3 |
| Dil karşılandı | +25 |
| Dil karşılanmadı | -30 |
| Dil yok | -40 |
| Bütçe yeterli | +10 |
| Bütçe yetersiz | -20 |

| Skor Aralığı | Durum |
|---------------|-------|
| 80+ | eligible (success) |
| 55-79 | possible (blue) |
| 30-54 | reach (gold) |
| 0-29 | unlikely (danger) |

## Claude API

Model: `claude-haiku-4-5`. Kullanım: motivasyon mektubu üretimi, CV optimize, eligibility açıklaması (Türkçe). **Eligibility HESAPLAMASI için kullanma — deterministik yap.**

## Kurallar

- Veri doğruluğu önce — yanlış eligibility kullanıcıyı zarara uğratır
- Tüm sonuçlara disclaimer: "Bu tahmindir, üniversitenin resmi sitesini kontrol edin"
- Arayüz Türkçe, üretilen içerik İngilizce
- MVP: Almanya, İtalya, Hollanda — derinlik önce, genişlik sonra
- Renk kuralına kesinlikle uy

## Öncelik Sırası

1. Eligibility checker (schools sayfası) — CORE
2. Auth + profil
3. Motivasyon mektubu AI
4. Takvim
5. Diğer sayfalar
