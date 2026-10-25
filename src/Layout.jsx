import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  FACEBOOK,
  GYM_MAIL,
  GYM_MAILTO,
  copyGymMail,
  MAPS,
  PHONE,
  PHONE_2,
  PHONE_2_TEL,
  PHONE_TEL,
  PhoneIcon,
} from './site.jsx'

const titles = {
  '/': 'Muscle Power Gym · Halishahar, Chattogram',
  '/dress-code': 'Dress code · Muscle Power Gym',
  '/rules': 'Rules & regulations · Muscle Power Gym',
  '/weight-loss': 'Weight loss plan · Muscle Power Gym',
  '/weight-gain': 'Weight gain plan · Muscle Power Gym',
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.title = titles[location.pathname] || titles['/']
    setMenuOpen(false)
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  // Home page: underline the nav link for the section in the middle of the screen
  useEffect(() => {
    setActiveSection(null)
    if (location.pathname !== '/') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('main > section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [location.pathname])

  const sectionLink = (id) => (activeSection === id ? 'active' : undefined)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="site">

      <header className={`nav${scrolled || menuOpen ? ' is-solid' : ''}`}>
        <div className="container nav-inner">
          <Link className="brand" to="/" onClick={closeMenu}>
            <span className="brand-tile">
              <img src="/images/logo-badge-web.png" alt="" width="40" height="51" />
            </span>
            <span className="brand-name">
              Muscle Power <em>Gym</em>
            </span>
          </Link>
          <nav id="site-nav" className={menuOpen ? 'open' : ''} aria-label="Main">
            <Link className={sectionLink('facilities')} to="/#facilities" onClick={closeMenu}>
              Facilities
            </Link>
            <Link className={sectionLink('hours')} to="/#hours" onClick={closeMenu}>
              Hours
            </Link>
            <Link className={sectionLink('join')} to="/#join" onClick={closeMenu}>
              Join
            </Link>
            <NavLink to="/dress-code" onClick={closeMenu}>
              Dress code
            </NavLink>
            <NavLink to="/rules" onClick={closeMenu}>
              Rules
            </NavLink>
            <Link className={sectionLink('contact')} to="/#contact" onClick={closeMenu}>
              Contact
            </Link>
            <a className="btn btn-sm nav-cta" href={`tel:${PHONE_TEL}`} aria-label={`Call ${PHONE}`}>
              <PhoneIcon />
              <span className="nav-cta-short">Call</span>
              <span className="nav-cta-full">{PHONE}</span>
            </a>
          </nav>
          <button
            className="menu-btn"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <Outlet />

      <footer className="foot">
        <div className="container">
          <div className="foot-brand">
            <span className="foot-logo">
              <img src="/images/logo-badge-web.png" alt="Muscle Power Gym" width="69" height="88" />
            </span>
            <p className="foot-name">Muscle Power Gym</p>
            <p className="foot-tag">Change your lifestyle.</p>
          </div>
          <div className="foot-grid">
            <div>
              <h4>Visit</h4>
              <p>
                <a href={MAPS} target="_blank" rel="noreferrer">
                  Port Connecting Road
                  <br />
                  Top floor, above Rangs eMart
                  <br />
                  Halishahar, Chattogram
                </a>
              </p>
            </div>
            <div>
              <h4>Hours</h4>
              <p>
                Saturday – Thursday
                <br />
                7:00 AM – 11:00 PM
                <br />
                Friday closed
              </p>
            </div>
            <div>
              <h4>Contact</h4>
              <p>
                <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
                <br />
                <a href={`tel:${PHONE_2_TEL}`}>{PHONE_2}</a>
                <br />
                <a href={GYM_MAILTO} onClick={copyGymMail}>
                  {GYM_MAIL}
                </a>
                <br />
                <a href={FACEBOOK} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </p>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} Muscle Power Gym, Chattogram</span>
            <nav className="foot-links" aria-label="More">
              <Link to="/dress-code">Dress code</Link>
              <Link to="/rules">Rules</Link>
              <Link to="/weight-loss">Weight loss</Link>
              <Link to="/weight-gain">Weight gain</Link>
              <a href="#top">Back to top ↑</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
