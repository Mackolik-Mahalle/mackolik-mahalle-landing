# mackolik-mahalle-landing

Mahalle'nin tanıtım sitesi ve halı saha başvuru formu. Next.js (App Router), tek sayfa.

```bash
cp .env.example .env.local   # anon anahtarı doldurun
pnpm install
pnpm dev
```

- **Başvurular** `public.submit_venue_application` RPC'sine gider (backend deposu,
  `20260924120000_venue_applications.sql`). Moderasyon admin panelinde, `/moderation/sahalar`.
- **Tasarım** Maçkolik Figma dosyası (`ZkjxgbSQvdrbwz2AHl3hfL`) ve Android uygulamasının
  `ui/theme/Color.kt` token'larıyla birebir: Roboto, `#3866b0` / `#1c90f0`, 10px kart, yuvarlak hap.
- **Görseller** `public/media/`: Figma'dan 3x alınmış ekranlar (`screen-*.jpg`) ve
  veritabanındaki `video_items` kayıtlarıyla aynı Sporyo maç kayıtlarından çekilmiş
  kareler (`frame-<maç id>-<saniye>.jpg`) ile 12 sn'lik `hero.mp4`.
- **Kadro** ve **Videolar** ekranları uygulamada henüz bitmediği için `app/screens.tsx` içinde
  HTML olarak çizildi; uygulama ekranları hazır olunca gerçek ekran görüntüleriyle değiştirin.
