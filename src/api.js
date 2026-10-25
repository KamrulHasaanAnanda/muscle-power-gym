const API = import.meta.env.VITE_API_URL || '/api'

export async function saveUser(fields) {
  const body = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value != null && String(value).trim()) body.append(key, String(value).trim())
  })

  const res = await fetch(`${API}/users`, { method: 'POST', body })
  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok) throw new Error(data.detail || 'Could not save')
  return data
}
