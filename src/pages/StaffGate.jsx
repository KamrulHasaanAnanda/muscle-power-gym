import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

// Light lock for the staff-only pages (price chart and plan sheets).
// It lives in the browser, so it keeps casual visitors out, not a determined one.
const STAFF_ID = 'muscle_power'
const STAFF_PASSWORD = 'muscle_power'
const KEY = 'mp-staff'

function remembered() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export default function StaffGate() {
  const [ok, setOk] = useState(remembered)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (ok) return <Outlet />

  function submit(event) {
    event.preventDefault()
    if (id.trim() !== STAFF_ID || password !== STAFF_PASSWORD) {
      setError('Wrong ID or password.')
      return
    }
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      // Still let them in for this visit
    }
    setOk(true)
  }

  return (
    <main id="top">
      <section className="page-hero">
        <div className="container">
          <p className="crumbs">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            Staff
          </p>
          <h1 className="display">
            Staff <span>login.</span>
          </h1>
        </div>
      </section>

      <section className="section paper">
        <div className="container">
          <form className="staff-login" onSubmit={submit}>
            <label>
              <span>ID</span>
              <input
                value={id}
                onChange={(event) => {
                  setId(event.target.value)
                  setError('')
                }}
                autoComplete="username"
                autoCapitalize="off"
                spellCheck="false"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                autoComplete="current-password"
                required
              />
            </label>
            {error && (
              <p className="staff-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn">
              Log in
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
