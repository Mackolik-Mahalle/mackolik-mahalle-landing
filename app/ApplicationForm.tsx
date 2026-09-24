'use client'

import { useMemo, useState } from 'react'
import { rpc, type RpcError } from '@/lib/supabase'

// Same contract as backend/admin-panel/app/saha-basvuru: the only write is
// public.submit_venue_application, which re-validates every field.

export type Province = { id: string; name: string }
export type District = { id: string; name: string; province_id: string }
type Field = {
  name: string; length_m: string; width_m: string
  surface_type: string; is_covered: boolean; has_floodlights: boolean
}

const AMENITY_LABEL: Record<string, string> = {
  SHOE_RENTAL: 'Ayakkabı kiralama', GLOVE_RENTAL: 'Eldiven kiralama', CREDIT_CARD: 'Kredi kartı',
  HAIR_DRYER: 'Saç kurutma', OPEN_AIR: 'Açık alan', COVERED: 'Kapalı alan', SHOWER: 'Duş',
  CAFETERIA: 'Kafeterya', PARKING: 'Otopark', GRANDSTAND: 'Tribün', WC: 'WC', WIFI: 'Wi-Fi',
}

// public.venue_surface_type
const SURFACES: [string, string][] = [
  ['ARTIFICIAL_GRASS', 'Suni çim'], ['GRASS', 'Doğal çim'], ['HYBRID', 'Hibrit çim'],
  ['CARPET', 'Halı'], ['CONCRETE', 'Beton'],
]

const newField = (n: number): Field => ({
  name: `Saha ${n}`, length_m: '', width_m: '', surface_type: 'ARTIFICIAL_GRASS',
  is_covered: false, has_floodlights: true,
})

const num = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')))

export function ApplicationForm({
  provinces, districts, amenities,
}: { provinces: Province[]; districts: District[]; amenities: string[] }) {
  const [provinceId, setProvinceId] = useState('')
  const [fields, setFields] = useState<Field[]>([newField(1)])
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const provinceDistricts = useMemo(
    () => districts.filter((d) => d.province_id === provinceId),
    [districts, provinceId],
  )

  const setField = (i: number, patch: Partial<Field>) =>
    setFields((fs) => fs.map((f, j) => (j === i ? { ...f, ...patch } : f)))

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const s = (k: string) => String(form.get(k) ?? '')
    setBusy(true)
    setError(null)
    const err = await rpc('submit_venue_application', {
      p_venue_name: s('venue_name'),
      p_province_id: provinceId,
      p_district_id: s('district_id'),
      p_neighborhood: s('neighborhood'),
      p_street_area: s('street_area'),
      p_location_url: s('location_url'),
      p_amenities: [...picked],
      p_fields: fields.map((f) => ({ ...f, length_m: num(f.length_m), width_m: num(f.width_m) })),
      p_contact_name: s('contact_name'),
      p_contact_phone: s('contact_phone'),
      p_contact_email: s('contact_email'),
      p_notes: s('notes'),
    }).catch((): RpcError => ({ code: 'network' }))
    setBusy(false)
    if (err) {
      // The RPC raises applicant-facing Turkish messages with errcode 22023.
      setError(err.code === '22023' && err.message ? err.message : 'Başvuru gönderilemedi. Lütfen tekrar deneyin.')
      return
    }
    setDone(true)
    document.getElementById('basvuru')?.scrollIntoView({ block: 'start' })
  }

  if (done) {
    return (
      <div className="card form-done" role="status">
        <h3>Başvurunuz alındı</h3>
        <p>Ekibimiz tesis bilgilerinizi inceledikten sonra verdiğiniz telefon numarasından size ulaşacak.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="form">
      <fieldset className="card">
        <legend>Tesis</legend>
        <Label text="Tesis adı" req>
          <input name="venue_name" required minLength={2} maxLength={120} placeholder="Örn. Sarıyer Merkez Halı Saha" />
        </Label>
        <div className="grid2">
          <Label text="İl" req>
            <select required value={provinceId} onChange={(e) => setProvinceId(e.target.value)}>
              <option value="">Seçin</option>
              {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Label>
          <Label text="İlçe" req>
            <select name="district_id" required disabled={!provinceId} key={provinceId} defaultValue="">
              <option value="">{provinceId ? 'Seçin' : 'Önce il seçin'}</option>
              {provinceDistricts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Label>
          <Label text="Mahalle">
            <input name="neighborhood" maxLength={120} />
          </Label>
          <Label text="Cadde / sokak">
            <input name="street_area" maxLength={200} />
          </Label>
        </div>
        <Label text="Harita bağlantısı">
          <input name="location_url" type="url" placeholder="https://maps.google.com/…" pattern="https?://.+" />
        </Label>
      </fieldset>

      <fieldset className="card">
        <legend>Sahalar</legend>
        {fields.map((f, i) => (
          <div key={i} className="pitch-row">
            <div className="pitch-row-head">
              <input aria-label={`${i + 1}. saha adı`} required maxLength={60} value={f.name}
                onChange={(e) => setField(i, { name: e.target.value })} />
              {fields.length > 1 && (
                <button type="button" className="btn-text"
                  onClick={() => setFields((fs) => fs.filter((_, j) => j !== i))}>Kaldır</button>
              )}
            </div>
            <div className="grid3">
              <Label text="Zemin">
                <select value={f.surface_type} onChange={(e) => setField(i, { surface_type: e.target.value })}>
                  {SURFACES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Label>
              <Label text="Uzunluk (m)">
                <input type="number" inputMode="decimal" min={1} max={200} step="0.1" value={f.length_m}
                  onChange={(e) => setField(i, { length_m: e.target.value })} />
              </Label>
              <Label text="Genişlik (m)">
                <input type="number" inputMode="decimal" min={1} max={200} step="0.1" value={f.width_m}
                  onChange={(e) => setField(i, { width_m: e.target.value })} />
              </Label>
            </div>
            <div className="checks">
              <Check label="Kapalı saha" checked={f.is_covered} onChange={(v) => setField(i, { is_covered: v })} />
              <Check label="Işıklandırma" checked={f.has_floodlights} onChange={(v) => setField(i, { has_floodlights: v })} />
            </div>
          </div>
        ))}
        {fields.length < 20 && (
          <button type="button" className="btn-text"
            onClick={() => setFields((fs) => [...fs, newField(fs.length + 1)])}>+ Saha ekle</button>
        )}
      </fieldset>

      {amenities.length > 0 && (
        <fieldset className="card">
          <legend>Olanaklar</legend>
          <div className="chips">
            {amenities.map((a) => (
              <label key={a} className="chip">
                <input type="checkbox" checked={picked.has(a)}
                  onChange={(e) => setPicked((s) => {
                    const n = new Set(s)
                    if (e.target.checked) n.add(a); else n.delete(a)
                    return n
                  })} />
                <span>{AMENITY_LABEL[a] ?? a}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="card">
        <legend>Yetkili</legend>
        <div className="grid2">
          <Label text="Ad soyad" req>
            <input name="contact_name" required minLength={2} maxLength={120} autoComplete="name" />
          </Label>
          <Label text="Telefon" req>
            <input name="contact_phone" type="tel" required placeholder="05xx xxx xx xx" autoComplete="tel"
              pattern="[0-9+\s\(\)\-]{10,20}" />
          </Label>
        </div>
        <Label text="E-posta">
          <input name="contact_email" type="email" autoComplete="email" />
        </Label>
        <Label text="Not">
          <textarea name="notes" rows={3} maxLength={1000} placeholder="Çalışma saatleri, kamera sistemi, fiyat bilgisi vb." />
        </Label>
        <label className="consent">
          <input type="checkbox" required />
          <span>Paylaştığım iletişim bilgilerinin başvurumun değerlendirilmesi amacıyla işlenmesini kabul ediyorum.</span>
        </label>
      </fieldset>

      {error && <p role="alert" className="form-error">{error}</p>}
      <button type="submit" className="btn-submit" disabled={busy}>
        {busy ? 'Gönderiliyor…' : 'Başvuruyu gönder'}
      </button>
    </form>
  )
}

function Label({ text, req, children }: { text: string; req?: boolean; children: React.ReactNode }) {
  return (
    <label className="lbl">
      <span>{text}{req && <em aria-hidden> *</em>}</span>
      {children}
    </label>
  )
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}
