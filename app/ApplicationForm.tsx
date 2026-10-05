'use client'

import { useMemo, useState } from 'react'
import { rpc, type RpcError } from '@/lib/supabase'

// Pre-registration over the admin panel's contract (backend/admin-panel/app/
// saha-basvuru): the only write is public.submit_venue_application, which
// re-validates every field. The pitch count becomes that many placeholder
// pitches (details are filled in when the team calls back).

export type Province = { id: string; name: string }
export type District = { id: string; name: string; province_id: string }

export function ApplicationForm({ provinces, districts }: { provinces: Province[]; districts: District[] }) {
  const [provinceId, setProvinceId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const provinceDistricts = useMemo(
    () => districts.filter((d) => d.province_id === provinceId),
    [districts, provinceId],
  )

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
      p_neighborhood: '',
      p_street_area: '',
      p_location_url: '',
      p_amenities: [],
      p_fields: Array.from({ length: Number(s('pitch_count')) }, (_, i) => ({ name: `Saha ${i + 1}` })),
      p_contact_name: s('contact_name'),
      p_contact_phone: s('contact_phone'),
      p_contact_email: '',
      p_notes: '',
      p_has_sports_school: s('sports_school') === 'true',
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
        <p>Ekibimiz verdiğiniz telefon numarasından size ulaşacak.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="form">
      <fieldset className="card">
        <legend>Ön kayıt</legend>
        <div className="grid2">
          <Label text="İl">
            <select required value={provinceId} onChange={(e) => setProvinceId(e.target.value)}>
              <option value="">Seçin</option>
              {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Label>
          <Label text="İlçe">
            <select name="district_id" required disabled={!provinceId} key={provinceId} defaultValue="">
              <option value="">{provinceId ? 'Seçin' : 'Önce il seçin'}</option>
              {provinceDistricts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Label>
          <Label text="Tesis adı">
            <input name="venue_name" required minLength={2} maxLength={120} placeholder="Örn. Sarıyer Merkez Halı Saha" />
          </Label>
          <Label text="Saha sayısı">
            <input name="pitch_count" type="number" inputMode="numeric" required min={1} max={20} step={1} placeholder="1–20" />
          </Label>
          <Label text="Yetkili ad soyad">
            <input name="contact_name" required minLength={2} maxLength={120} autoComplete="name" />
          </Label>
          <Label text="İletişim numarası">
            <input name="contact_phone" type="tel" required placeholder="05xx xxx xx xx" autoComplete="tel"
              pattern="[0-9+\s\(\)\-]{10,20}" />
          </Label>
        </div>
        <fieldset className="choice">
          <legend>Tesiste spor okulu mevcut mu?<em aria-hidden> *</em></legend>
          <label className="check"><input type="radio" name="sports_school" value="true" required /> Evet</label>
          <label className="check"><input type="radio" name="sports_school" value="false" /> Hayır</label>
        </fieldset>
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

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="lbl">
      <span>{text}<em aria-hidden> *</em></span>
      {children}
    </label>
  )
}
