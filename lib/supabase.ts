// PostgREST over plain fetch: the page reads three lookup tables and calls one
// RPC, which does not need supabase-js.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function env() {
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY eksik (.env.example)')
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } }
}

export async function select<T>(path: string): Promise<T[]> {
  const { url, headers } = env()
  const res = await fetch(`${url}/rest/v1/${path}`, { headers })
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

export type RpcError = { code?: string; message?: string }

export async function rpc(name: string, args: Record<string, unknown>): Promise<RpcError | null> {
  const { url, headers } = env()
  const res = await fetch(`${url}/rest/v1/rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(args) })
  return res.ok ? null : res.json().catch(() => ({}))
}
