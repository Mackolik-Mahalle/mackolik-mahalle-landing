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
    img: 'frame-1202-540', title: 'Oyuncu Profili Oluştur',
    text: 'Maçlara katılmak için oyuncu profilini oluştur, gollerini, asistlerini ve kartlarını maç maç takip et.',
  },
  {
    img: 'frame-1205-300', title: 'Takım Oluştur',
    text: 'Arkadaşlarını davet et, kendi takımını kur ve halı saha maçlarında birlikte mücadele et.',
  },
  {
    img: 'frame-1206-120', title: 'Lig Oluştur',
    text: 'Takımların katılacağı bir lig kur, fikstürü oluştur ve sezon boyunca puan durumunu yönet.',
  },
]

const VENUE_POINTS = [
  ['Maçkolik’te görünür ol', 'Tesisin, Mahalle kullanıcılarının maç kurarken ve rakip ararken seçtiği sahalar arasına girer.'],
  ['Maçlar kayda geçer', 'Sahanda oynanan maçlar skoru, kadrosu ve istatistikleriyle Mahalle’de yayınlanır.'],
  ['Videolar oyuncuya ulaşır', 'Kamera sistemi olan sahalarda gol videoları oyuncuların profiline ve maç sayfasına düşer.'],
  ['Lig ve turnuva düzenle', 'Sahanda organize ettiğin lig ve turnuvaların fikstürü ile puan durumu Mahalle üzerinden yürür.'],
]

const FAQ = [
  ['Başvurudan sonra ne oluyor?', 'Başvurunuz Mahalle ekibinin inceleme kuyruğuna düşer. Bilgiler doğrulandıktan sonra tesisiniz ve sahalarınız Mahalle’de yayına alınır; gerekirse sizi verdiğiniz telefondan ararız.'],
  ['Birden fazla sahamız var, ayrı ayrı mı başvurmalıyız?', 'Hayır. Tek başvuruda tesisinizdeki sahaları (en fazla 20) zemin, ölçü, kapalı alan ve ışıklandırma bilgileriyle birlikte ekleyebilirsiniz.'],
  ['İletişim bilgilerim sitede görünür mü?', 'Hayır. Yetkili adı, telefon ve e-posta yalnızca başvurunun değerlendirilmesi için saklanır; tesis sayfasında yer almaz.'],
  ['Aynı telefonla tekrar başvurabilir miyim?', 'Bekleyen başvurunuz varken aynı numarayla en fazla üç başvuru açılabilir. Bilgilerinizi güncellemek isterseniz yeni başvuru yerine notlar kısmını kullanın ya da ekibimizin aramasını bekleyin.'],
]

type Lookups = { provinces: Province[]; districts: District[]; amenities: string[] }

async function lookups(): Promise<Lookups> {
  const [provinces, districts, amenities] = await Promise.all([
    select<Province>('turkish_provinces?select=id,name&order=code'),
    // ~970 rows, filtered in the browser: cheaper than a round trip per province pick.
    select<District>('turkish_districts?select=id,name,province_id&order=name&limit=2000'),
    select<{ code: string }>('venue_amenities?select=code'),
  ])
  return { provinces, districts, amenities: amenities.map((a) => a.code) }
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
            <span className="kicker">Maçkolik’te yeni</span>
            <h1>Halı saha maçın, <em>Maçkolik’te.</em></h1>
            <p>
              Mahalle, halı sahada oynadığın maçları skoru, kadrosu ve gol videolarıyla Maçkolik’e taşır.
              Profilini oluştur, takımını kur, ligini yönet.
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
            <p>Mahalle, Maçkolik uygulamasının içinde çalışır. Aynı ekranlar, aynı alışkanlıklar; sadece sahada sen varsın.</p>
          </div>
          <Showcase />
        </section>

        <section id="ozellikler" className="section section--tint">
          <div className="wrap">
            <div className="section-head">
              <h2>Halı saha deneyimini bir üst seviyeye taşı</h2>
              <p>Oyuncu profilini oluştur, takımını kur ve kendi ligini yöneterek rekabetinde yıldız ol.</p>
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
            <h2>Sahan Mahalle’de, maçların Maçkolik’te</h2>
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
            <h2>Halı saha başvurusu</h2>
            <p>Tesisinizi Mahalle’ye eklemek için formu doldurun. Başvurunuz ekibimiz tarafından incelendikten sonra yayına alınır.</p>
            <ol className="steps">
              <li><b>Formu gönderin</b><span>Tesis, saha ve yetkili bilgileri.</span></li>
              <li><b>Ekibimiz inceler</b><span>Gerekirse telefonla size ulaşırız.</span></li>
              <li><b>Sahanız yayında</b><span>Oyuncular maç kurarken tesisinizi seçebilir.</span></li>
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
          <p>Mahalle bir Maçkolik ürünüdür. © {new Date().getFullYear()} Maçkolik</p>
        </div>
      </footer>
    </>
  )
}
