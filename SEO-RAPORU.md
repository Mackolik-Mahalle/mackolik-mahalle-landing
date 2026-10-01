# Mahalle landing · SEO raporu

Kapsam: canlıdaki `https://www.mackolik.com/static-mahalle.html` (Next static export, 29.09.2026)
ve onun yerine hazırlanan `public/static-mahalle.html`. Tarih: 30.09.2026.

## 1. Yeni HTML'de düzeltilenler

| Eksik (canlı) | Canlıda | Yeni HTML'de |
|---|---|---|
| Canonical | Yok | `<link rel="canonical">` var |
| Open Graph | `og:url`, `og:site_name`, görsel ölçüleri ve `alt` yok | Hepsi var |
| Yapılandırılmış veri | JSON-LD yok | `Organization` + `WebPage` + `FAQPage` (`@graph`) |
| Sayfa ağırlığı | 199 KB HTML, bunun 118 KB'ı inline Next/React payload'ı (içerik JSON olarak iki kez) | 47 KB, JS sadece form için (~4 KB) |
| Görsel ölçüleri | 18 görselin hiçbirinde `width`/`height` yok → CLS riski | Hepsinde var |
| `alt` metinleri | 9 görselde boş | Hepsinde görseli anlatan metin var |
| LCP | Hero'da poster önceden yüklenmiyor | Video (3,1 MB) kalıyor ama `preload="metadata"` ile. Poster `preload` + `fetchpriority="high"` ile önce gelir. "Hareketi azalt" açıksa video gizlenir |
| Lazy loading | Yok | İlk ekran dışındaki tüm görseller `loading="lazy"` |
| Başlık hiyerarşisi | Yolculuk adımları JS sekmelerinin içinde | Tek `h1`, her bölümde `h2`, adımlar `h3`; bölümler `aria-labelledby` ile adlandırılmış |
| `robots` meta | Yok | `index, follow, max-image-preview:large` |

Not: Google 2023'ten beri FAQ zengin sonucunu yalnızca resmi sağlık ve devlet sitelerinde gösteriyor.
`FAQPage` şeması arama sonucunda soru-cevap kutusu çıkarmaz, sadece sayfanın anlaşılmasına yardım eder.

## 2. Platform veya ekip tarafında yapılması gerekenler

1. **URL.** `static-mahalle.html` adresi anahtar kelime içermiyor, `.html` uzantılı ve "static" ön ekli.
   Öneri: `https://www.mackolik.com/mahalle` (ya da `/hali-saha`). Eski adres 301 ile yeniye yönlenmeli.
   Adres değişince HTML'deki `canonical`, `og:url` ve JSON-LD `url` alanları da güncellenmeli.
2. **Sitemap yok.** `/sitemap.xml`, `/sitemap_index.xml` 404 veriyor, `robots.txt`'te `Sitemap:` satırı yok.
   Sayfayı bir sitemap'e ekleyip Search Console'a gönderin.
3. **Sayfaya link veren yer yok.** mackolik.com ana sayfasında bu adrese link yok. Google'ın sayfayı bulması ve
   önemsemesi için menüden, footer'dan ya da ilgili haberlerden link verilmeli.
4. **Search Console.** Yayından sonra URL denetimi ile dizine eklenmesini isteyin.
   Zengin sonuç testinde JSON-LD'yi doğrulayın.
5. **Sunucuya yüklenecek görseller.** Sayfadaki tüm görseller `static-files/mahalle/media/` altından geliyor.
   Bento kartlarındaki iki yeni ekran henüz sunucuda yok; yüklenene kadar sayfada boş görünür:
   `screen-profile-matches.jpg`, `screen-team-squad.jpg` (repoda `public/media/`).
   Kart arka planları CSS ile çiziliyor (degrade + saha çizgileri), görsel dosyası gerektirmiyor.
6. **AI tarayıcıları.** `robots.txt` GPTBot, Google-Extended, CCBot ve anthropic-ai'yi engelliyor.
   Sayfa bu yüzden yapay zekâ asistanlarının cevaplarında çıkmaz. Bu bilinçli bir kararsa sorun yok.
7. **Favicon.** `mahalle-logo.png` kare değil (341×240). Tarayıcı sekmesinde sıkışık görünür.
   32×32 / 180×180 kare bir sürüm eklenmeli.

## 3. İçerik önerileri (isteğe bağlı)

- `title` (40 karakter) ve `description` (148 karakter) uygun uzunlukta. Aranan ifadeler
  ("halı saha maç videosu", "halı saha lig", "halı saha istatistik") şu an sadece gövde metninde geçiyor.
  Bölüm başlıklarında da geçerse sayfanın bu aramalarla eşleşmesi güçlenir.
- Tesis sahiplerine yönelik ayrı bir sayfa (`/mahalle/sahalar`) açılırsa oyuncu ve işletme aramaları
  aynı sayfada birbiriyle yarışmaz.
