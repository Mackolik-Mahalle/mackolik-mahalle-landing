import { select } from '@/lib/supabase'
import { ApplicationForm, type District, type Province } from './ApplicationForm'
import { MackolikLogo } from './brand'
import { Showcase } from './Showcase'

// Lookup lists barely change; rebuild them once a day.
export const revalidate = 86400

const NAV = [
  ['#uygulama', 'Uygulama'],
  ['#ozellikler', 'Neler var'],
  ['#sahalar', 'Sahalar için'],
  ['#basvuru', 'Başvuru'],
  ['#sss', 'SSS'],
]

const FEATURES = [
  {
    img: 'frame-1202-540', title: 'Oyuncu profilini oluştur',
    text: 'Oyuncu profilini oluştur; maçlarını, gollerini, asistlerini ve kartlarını tek bir yerde takip et.',
  },
  {
    img: 'frame-1205-300', title: 'Takımını kur',
    text: 'Arkadaşlarını davet et, takımını kur ve Mahalle’de birlikte sahaya çıkın.',
  },
  {
    img: 'frame-1206-120', title: 'Lig Oluştur',
    text: 'Takımların katılacağı bir lig kur, fikstürü oluştur ve sezon boyunca puan durumunu yönet.',
  },
]

const VENUE_POINTS = [
  ['Mackolik’te görünür ol', 'Tesisin, Mahalle’de maç kuran ve rakip arayan oyuncuların seçebileceği sahalar arasına girsin.'],
  ['Maçlar kayda geçer', 'Sahanda oynanan maçlar skorları, kadroları ve istatistikleriyle Mahalle’de yerini alsın.'],
  ['Videolar oyuncuya ulaşır', 'Kamera sistemi olan sahalarda gol videoları maç sayfasına ve oyuncuların profillerine otomatik olarak ulaşsın.'],
  ['Lig ve turnuva düzenle', 'Lig ve turnuvalarını Mahalle üzerinden yönet; fikstürü oluştur, puan durumunu herkes takip etsin.'],
]

const FAQ = [
  ['Başvurudan sonra ne oluyor?', 'Başvurunuz Mahalle ekibine ulaşır. Bilgileriniz kontrol edildikten sonra tesisiniz ve sahalarınız Mahalle’de yayına alınır. Ek bilgiye ihtiyaç duyarsak sizi telefonla ararız.'],
  ['Birden fazla sahamız var, ayrı ayrı mı başvurmalıyız?', 'Hayır. Tek başvuruda tesisinizdeki saha sayısını (20’ye kadar) belirtmeniz yeterli. Sahaların zemin, ölçü, kapalı alan ve ışıklandırma bilgilerini ekibimiz sizinle görüşürken alır.'],
  ['İletişim bilgilerim sitede görünür mü?', 'Hayır. Yetkili adı ve telefon numarası yalnızca başvurunun değerlendirilmesi amacıyla kullanılır; tesis sayfasında yayımlanmaz.'],
  ['Aynı telefonla tekrar başvurabilir miyim?', 'Bekleyen bir başvurunuz varken aynı telefon numarasıyla en fazla üç başvuru oluşturabilirsiniz. Mevcut başvurunuzdaki bilgileri güncellemek istiyorsanız yeni başvuru oluşturmak yerine ekibimizin sizinle iletişime geçmesini bekleyebilirsiniz.'],
]

type Lookups = { provinces: Province[]; districts: District[] }

async function lookups(): Promise<Lookups> {
  const [provinces, districts] = await Promise.all([
    select<Province>('turkish_provinces?select=id,name&order=code'),
    // ~970 rows, filtered in the browser: cheaper than a round trip per province pick.
    select<District>('turkish_districts?select=id,name,province_id&order=name&limit=2000'),
  ])
  return { provinces, districts }
}

export default async function Home() {
  const data = await lookups()

  return (
    <>
      <header className="hero">
        <video className="hero-video" src="/media/hero.mp4" poster="/media/hero-poster.jpg"
          autoPlay muted loop playsInline aria-hidden />
        <div className="hero-shade" />
        <div className="wrap hero-top">
          <a href="#" className="brand" aria-label="Mahalle ana sayfa">
            <MackolikLogo className="brand-mk" />
            <span className="brand-sep" />
            <img src="/media/mahalle-logo.png" alt="Mahalle" className="brand-mh" />
          </a>
          <a href="#basvuru" className="pill pill--ghost hide-sm">Sahanı ekle</a>
        </div>
        <div className="wrap hero-main">
          <div className="hero-copy">
            <span className="kicker">Mackolik’te yeni</span>
            <h1>Halı saha maçın, <em>Mackolik’te.</em></h1>
            <p>
              Skoru, kadrosu, istatistikleri ve gol videolarıyla artık senin maçın da Mackolik’te.
              Profilini oluştur, takımını kur, sahaya çık.
            </p>
            <div className="hero-cta">
              <a href="#basvuru" className="pill">Halı sahanı Mahalle’ye ekle</a>
              <a href="#uygulama" className="pill pill--ghost">Uygulamayı gör</a>
            </div>
          </div>
          <div className="phone phone--hero" aria-hidden>
            <div className="phone-screen"><img src="/media/screen-match.jpg" alt="" /></div>
          </div>
        </div>
        <p className="wrap hero-credit">Görüntüler: Mahalle’ye bağlı bir halı sahanın maç kaydı.</p>
      </header>

      <nav className="navbar" aria-label="Bölümler">
        <div className="wrap navbar-in">
          {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </div>
      </nav>

      <main>
        <section id="uygulama" className="section wrap">
          <div className="section-head">
            <h2>Profesyonel maç sayfası, senin maçın için</h2>
            <p>Mahalle, Mackolik uygulamasının içinde çalışır. Aynı ekranlar, aynı alışkanlıklar; sadece sahada sen varsın.</p>
          </div>
          <Showcase />
        </section>

        <section id="ozellikler" className="section section--tint">
          <div className="wrap">
            <div className="section-head">
              <h2>Halı saha maçını bir üst seviyeye taşı</h2>
              <p>Oyuncu profilini oluştur, takımını kur, sahaya çık. Her maçta yeni bir hikâye, her maçta yeni bir rekabet.</p>
            </div>
            <div className="adv">
              {FEATURES.map((f, i) => (
                <article key={f.title} className={`adv-card adv-card--${i + 1}`}
                  style={{ backgroundImage: `url(/media/${f.img}.jpg)` }}>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="sahalar" className="venues">
          <div className="wrap">
            <span className="kicker">Halı saha işletmeleri için</span>
            <h2>Sahan Mahalle’de, maçların Mackolik’te</h2>
            <dl className="venue-points">
              {VENUE_POINTS.map(([t, d], i) => (
                <div key={t}>
                  <dt><span className="num">{String(i + 1).padStart(2, '0')}</span>{t}</dt>
                  <dd>{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="basvuru" className="section wrap apply">
          <aside className="apply-side">
            <h2>Halı sahanı Mahalle’ye ekle</h2>
            <p>Tesisinizi Mahalle’ye eklemek için formu doldurun. Ekibimiz başvurunuzu inceleyip gerekli kontrollerin ardından tesisinizi yayına alsın.</p>
            <ol className="steps">
              <li><b>Formu gönderin.</b><span>Tesis, saha ve yetkili bilgilerinizi paylaşın.</span></li>
              <li><b>Ekibimiz incelesin.</b><span>Gerekirse sizi telefonla arayalım.</span></li>
              <li><b>Sahanız Mahalle’de.</b><span>Oyuncular maç kurarken tesisinizi seçebilsin.</span></li>
            </ol>
          </aside>
          <ApplicationForm {...data} />
        </section>

        <section id="sss" className="section wrap faq">
          <h2>Sık sorulan sorular</h2>
          <div className="faq-list">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-in">
          <MackolikLogo className="footer-mk" />
          <p>Mahalle bir Mackolik ürünüdür. © {new Date().getFullYear()} Mackolik</p>
        </div>
      </footer>
    </>
  )
}
