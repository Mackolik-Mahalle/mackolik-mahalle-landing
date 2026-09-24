import { BackIcon, MackolikLogo, PlayIcon, ShareIcon } from './brand'

// HTML stand-ins for the two app surfaces that are not finished yet (squad
// picking and the video tab). They reuse the app's own chrome, the same match
// as the Figma match-detail frame, and stills from real Mahalle recordings.

function AppChrome({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <div className="scr">
      <div className="scr-hero" style={{ backgroundImage: 'url(/media/frame-1205-540.jpg)' }}>
        <div className="scr-bar">
          <BackIcon />
          <MackolikLogo className="scr-logo" />
          <ShareIcon />
        </div>
        <div className="scr-score">
          <span>SARIYER FC</span>
          <b>3 - 0</b>
          <span>VELTRON</span>
        </div>
      </div>
      <div className="scr-tabs">
        {['Detay', 'Kadro', 'Videolar', 'İstatistik'].map((t) => (
          <span key={t} className={t === tab ? 'on' : undefined}>{t}</span>
        ))}
      </div>
      <div className="scr-body">{children}</div>
    </div>
  )
}

// 7'li halı saha: 1 kaleci, 2 defans, 3 orta saha, 1 forvet. x/y are percent of the pitch.
const LINEUP = [
  { no: 1, name: 'O. Demir', x: 50, y: 90 },
  { no: 4, name: 'F. Öztürk', x: 28, y: 70 },
  { no: 5, name: 'B. Tekin', x: 72, y: 70 },
  { no: 8, name: 'Y. Bayrak', x: 20, y: 45 },
  { no: 6, name: 'E. Kaya', x: 50, y: 50 },
  { no: 10, name: 'A. Atay', x: 80, y: 45 },
]

// Nobody picked yet: the open forward slot is what the sheet is for.
const BENCH = [
  { no: 9, name: 'Tolga Şen', pos: 'Forvet' },
  { no: 11, name: 'Cem Kara', pos: 'Forvet' },
  { no: 14, name: 'Denis Aslan', pos: 'Orta saha' },
  { no: 7, name: 'Yasin Kılıç', pos: 'Kanat' },
]

export function SquadScreen() {
  return (
    <AppChrome tab="Kadro">
      <div className="pitch" aria-hidden>
        <div className="pitch-lines" />
        {LINEUP.map((p) => (
          <div key={p.no} className="pl" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <i>{p.no}</i><span>{p.name}</span>
          </div>
        ))}
        <div className="pl pl--open" style={{ left: '50%', top: '20%' }}>
          <i>+</i><span>Forvet</span>
        </div>
      </div>
      <div className="sheet">
        <div className="sheet-head"><b>Oyuncu seç</b><span>6 / 7</span></div>
        {BENCH.map((p) => (
          <div key={p.no} className="row">
            <i className="num">{p.no}</i>
            <div><b>{p.name}</b><small>{p.pos}</small></div>
            <span className="pick">Seç</span>
          </div>
        ))}
      </div>
    </AppChrome>
  )
}

// Names and events match the highlight rows in video_items.
const CLIPS = [
  { img: 'frame-1203-300', who: 'Mert Yılmaz', what: 'Gol', min: "24'", len: '0:33' },
  { img: 'frame-1206-120', who: 'Okan Şahin', what: 'Gol', min: "41'", len: '0:21' },
  { img: 'frame-1204-300', who: 'Serkan Uysal', what: 'Sarı kart', min: "55'", len: '0:12' },
  { img: 'frame-1205-300', who: 'Emre Aydın', what: 'Gol', min: "67'", len: '0:45' },
]

export function VideosScreen() {
  return (
    <AppChrome tab="Videolar">
      <div className="feature">
        <video src="/media/hero.mp4" poster="/media/frame-1203-540.jpg" controls muted playsInline preload="none" />
        <div className="feature-meta">
          <b>Emre Aydın · Gol</b>
          <small>12&apos; · Sarıyer FC - Veltron</small>
        </div>
      </div>
      <h4 className="scr-h">Maçın öne çıkanları</h4>
      {CLIPS.map((c) => (
        <div key={c.img} className="clip">
          <div className="clip-thumb" style={{ backgroundImage: `url(/media/${c.img}.jpg)` }}>
            <span className="clip-play"><PlayIcon size={10} /></span>
            <span className="clip-len">{c.len}</span>
          </div>
          <div>
            <b>{c.who}</b>
            <small>{c.what} · {c.min}</small>
          </div>
        </div>
      ))}
    </AppChrome>
  )
}
