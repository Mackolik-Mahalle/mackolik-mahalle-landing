'use client'

import { useRef, useState } from 'react'

const TABS = [
  {
    id: 'detay', label: 'Maç Detayı',
    title: 'Maçın her anı, dakika dakika',
    text: 'Goller, asistler, kartlar ve oyuncu değişiklikleri dakika dakika karşında. Mackolik’te Süper Lig maçlarını nasıl takip ediyorsan, artık kendi maçını da öyle takip et.',
    screen: <img src="/media/screen-match.jpg" alt="Mahalle maç detay ekranı: Sarıyer FC 3-0 Veltron" />,
  },
  {
    id: 'kadro', label: 'Kadro',
    title: 'Kadronu kur, sahaya diz',
    text: 'Takımındaki oyuncuları seç, pozisyonlarına yerleştir. Maça kimin geleceği maçtan önce belli olsun, eksik kalan mevki boş görünsün.',
    screen: <img src="/media/screen-squad.jpg" alt="Maç kadrosu ekranı: saha fotoğrafında numaralı oyuncular ve kadro listesi" />,
  },
  {
    id: 'videolar', label: 'Videolar',
    title: 'Golün videosu cebinde',
    text: 'Kamera sistemi olan sahalarda maç baştan sona kaydedilir. Goller ve öne çıkan anlar kısa videolara ayrılır, atan oyuncunun profiline düşer.',
    screen: <img src="/media/screen-videos.jpg" alt="Maç videoları ekranı: maçın tamamı ve oyuncu klipleri" />,
  },
  {
    id: 'profil', label: 'Oyuncu Profili',
    title: 'Sahadaki kimliğin',
    text: 'Forma numaran, mevkin, kullandığın ayak ve maç istatistiklerin tek bir profilde. Takım arkadaşların ve rakiplerin seni oradan tanır.',
    screen: <img src="/media/screen-profile.jpg" alt="Mahalle oyuncu profili ekranı" />,
  },
]

export function Showcase() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const tab = TABS[active]

  function onKey(e: React.KeyboardEvent) {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const next = (active + step + TABS.length) % TABS.length
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="showcase">
      <div className="tabbar" role="tablist" aria-label="Uygulama ekranları" onKeyDown={onKey}>
        {TABS.map((t, i) => (
          <button
            key={t.id} ref={(el) => { refs.current[i] = el }}
            role="tab" id={`tab-${t.id}`} aria-controls="showcase-panel"
            aria-selected={i === active} tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="showcase-body" role="tabpanel" id="showcase-panel" aria-labelledby={`tab-${tab.id}`}>
        <div className="showcase-copy">
          <h3>{tab.title}</h3>
          <p>{tab.text}</p>
        </div>
        <div className="phone" key={tab.id}>
          <div className="phone-screen">{tab.screen}</div>
        </div>
      </div>
    </div>
  )
}
