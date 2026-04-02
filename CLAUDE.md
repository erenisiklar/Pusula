# Pusula — Proje Talimatları

## Proje

Türkiye'den Avrupa üniversitelerine başvurmak isteyen öğrenciler için AI destekli rehber platform. **Ana odak: Liseden sonra direkt başvurulabilecek lisans (bachelor) programları.** Yüksek lisans da desteklenir. Öğrenci GPA ve dil sertifikası girince hangi üniversitelere girebileceğini görür.

## Renk Paleti — ASLA DEĞİŞTİRME

```
--bg: #f8fafc | --surface: #ffffff | --surface2: #f1f5f9 | --border: rgba(30,64,175,0.08)
--text: #1e293b | --muted: #64748b | --white: #ffffff
--blue: #1e40af | --blue-light: #3b82f6 | --blue-bg: rgba(30,64,175,0.06) | --blue-border: rgba(30,64,175,0.15)
--gold: #d97706 | --gold-light: #b45309 | --gold-bg: rgba(217,119,6,0.06) | --gold-border: rgba(217,119,6,0.15)
--success: #16a34a | --success-bg: rgba(22,163,74,0.06)
--danger: #dc2626 | --danger-bg: rgba(220,38,38,0.06)
```

Primary buton → blue (navy). Vurgu/premium → gold. Başarı → success. Hata → danger. **Mor/turuncu/pembe YASAK.**

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
