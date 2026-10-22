import { useEffect, useState } from 'react'
import './App.css'

const PHONE = '01732-126333'
const PHONE_TEL = '+8801732126333'
const WHATSAPP = 'https://wa.me/8801732126333'
const FACEBOOK =
  'https://www.facebook.com/p/Muscle-Power-Gym-Chittagong-100048470155690/'
const MAPS =
  'https://www.google.com/maps/search/?api=1&query=22.3331929,91.7887957'
const MAP_EMBED =
  'https://maps.google.com/maps?q=22.3331929,91.7887957&z=16&output=embed'

const OPEN_HOUR = 7
const CLOSE_HOUR = 23

const hours = [
  ['Saturday', '7:00 AM – 11:00 PM'],
  ['Sunday', '7:00 AM – 11:00 PM'],
  ['Monday', '7:00 AM – 11:00 PM'],
  ['Tuesday', '7:00 AM – 11:00 PM'],
  ['Wednesday', '7:00 AM – 11:00 PM'],
  ['Thursday', '7:00 AM – 11:00 PM'],
  ['Friday', 'Closed'],
]

const features = [
  {
    title: 'Strength training',
    text: 'Benches, squat racks, plates, cable stations, and plate-loaded machines for every muscle group.',
    icon: <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />,
  },
  {
    title: 'Cardio zone',
    text: 'A full line of treadmills for warm-ups, fat loss, and conditioning work.',
    icon: <path d="M3 12h4l2.5-6 5 12 2.5-6H21" />,
  },
  {
    title: 'Ladies’ hours',
    text: 'Women train on a separate timetable. Call or message us for the current slots.',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
  },
]

const steps = [
  {
    title: 'Call or WhatsApp',
    text: `Reach us on ${PHONE} and ask about fees, timings, or a trial day.`,
  },
  {
    title: 'Visit the floor',
    text: 'Come to the top floor above Rangs eMart and see the equipment for yourself.',
  },
  {
    title: 'Start training',
    text: 'Sign up at the front desk and train any day from Saturday to Thursday.',
  },
]

function dhakaNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    weekday: 'long',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value
  return { day: get('weekday'), hour: Number(get('hour')) }
}

function useGymStatus() {
  const [now, setNow] = useState(dhakaNow)
  useEffect(() => {
    const id = setInterval(() => setNow(dhakaNow()), 60_000)
    return () => clearInterval(id)
  }, [])
  const open =
    now.day !== 'Friday' && now.hour >= OPEN_HOUR && now.hour < CLOSE_HOUR
  return { today: now.day, open }
}

function Icon({ children, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const PhoneIcon = () => (
  <Icon size={18}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </Icon>
)

const PinIcon = () => (
  <Icon size={18}>
    <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
)

const ChatIcon = () => (
  <Icon size={18}>
    <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" />
  </Icon>
)

const ArrowIcon = () => (
  <Icon size={18}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

const FacebookIcon = () => (
  <Icon size={18}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Icon>
)

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sent, setSent] = useState(false)
  const { today, open } = useGymStatus()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function sendWhatsApp(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const note = String(data.get('note') || '').trim()
    const text = [
      `Hi Muscle Power Gym, this is ${name || 'a visitor'}.`,
      phone ? `My number is ${phone}.` : '',
      note || 'I want to know about membership.',
    ]
      .filter(Boolean)
      .join(' ')
    window.open(
      `${WHATSAPP}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
    setSent(true)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const status = (
    <span className={`status ${open ? 'is-open' : 'is-closed'}`}>
      <span className="status-dot" />
      {open ? 'Open now · until 11 PM' : 'Closed now · opens 7 AM'}
    </span>
  )

  return (
    <div className="site">
      <header className={`nav dark${scrolled || menuOpen ? ' is-solid' : ''}`}>
        <div className="container nav-inner">
          <a className="brand" href="#top" onClick={closeMenu}>
            <img src="/images/logo.png" alt="" width="40" height="40" />
            <span>
              Muscle Power <em>Gym</em>
            </span>
          </a>
          <nav id="site-nav" className={menuOpen ? 'open' : ''} aria-label="Main">
            <a href="#facilities" onClick={closeMenu}>
              Facilities
            </a>
            <a href="#join" onClick={closeMenu}>
              How to join
            </a>
            <a href="#hours" onClick={closeMenu}>
              Hours
            </a>
            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>
            <a className="btn btn-sm nav-cta" href={`tel:${PHONE_TEL}`}>
              <PhoneIcon />
              {PHONE}
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

      <main id="top">
        {/* Hero */}
        <section className="hero dark">
          <img
            className="hero-bg"
            src="/images/gym-3.jpg"
            alt="Night view of the Halishahar building with the red Muscle Power Gym sign on the top floor"
          />
          <div className="hero-shade" />
          <div className="container hero-content">
            <div className="hero-meta">
              {status}
              <span className="bn">মাসেল পাওয়ার জিম</span>
            </div>
            <h1>
              Change your <span>lifestyle.</span>
            </h1>
            <p className="hero-lead">
              Muscle Power Gym is Halishahar’s top-floor training gym on Port
              Connecting Road — free weights, machines, cardio, and dedicated
              ladies’ hours.
            </p>
            <div className="hero-actions">
              <a className="btn btn-lg" href={`tel:${PHONE_TEL}`}>
                <PhoneIcon />
                Call to join
              </a>
              <a
                className="btn btn-lg btn-glass"
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
              >
                <ChatIcon />
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="container">
            <dl className="stats">
              <div>
                <dt>Open daily</dt>
                <dd>16 hrs</dd>
              </div>
              <div>
                <dt>Days a week</dt>
                <dd>6</dd>
              </div>
              <div>
                <dt>Opens at</dt>
                <dd>7 AM</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Top floor</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Facilities */}
        <section className="section light" id="facilities">
          <div className="container facilities">
            <div className="gallery">
              <figure className="gallery-main">
                <img
                  src="/images/gym-google-1.jpg"
                  alt="Training floor with wood flooring, mirrors, plate-loaded machines, and blue ceiling lights"
                  loading="lazy"
                />
              </figure>
              <figure className="gallery-inset">
                <img
                  src="/images/gym-4.jpg"
                  alt="Benches, machines, and a row of treadmills on red and blue floor mats"
                  loading="lazy"
                />
              </figure>
              <div className="gallery-badge">
                <strong>7 AM – 11 PM</strong>
                <span>Saturday to Thursday</span>
              </div>
            </div>

            <div className="facilities-copy">
              <p className="eyebrow">Facilities</p>
              <h2>Everything you need to train hard.</h2>
              <p className="section-lead">
                A working gym, not a showroom. Built for serious lifters,
                complete beginners, and everyone in between.
              </p>

              <ul className="feature-list">
                {features.map((f) => (
                  <li key={f.title}>
                    <span className="feature-icon">
                      <Icon>{f.icon}</Icon>
                    </span>
                    <div>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="facilities-actions">
                <a className="btn btn-lg" href={`tel:${PHONE_TEL}`}>
                  <PhoneIcon />
                  Book a visit
                </a>
                <a className="text-link" href="#hours">
                  See opening hours
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How to join */}
        <section className="section dark" id="join">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">How to join</p>
                <h2>Three steps to your first session.</h2>
              </div>
              <p className="section-lead">
                No complicated sign-up. Talk to us, see the gym, and start
                training the same day.
              </p>
            </div>
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={s.title} className="step">
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Hours + location */}
        <section className="section light alt" id="hours">
          <div className="container">
            <div className="visit">
              <div className="visit-panel dark">
                <div className="visit-top">
                  <p className="eyebrow">Hours & location</p>
                  {status}
                </div>
                <h2>Open six days a week.</h2>

                <div className="visit-time">
                  <div>
                    <span>Opens</span>
                    <strong>7:00 AM</strong>
                  </div>
                  <div>
                    <span>Closes</span>
                    <strong>11:00 PM</strong>
                  </div>
                </div>
                <p className="visit-note">Saturday to Thursday · Closed on Friday</p>

                <ul className="days" aria-label="Weekly schedule">
                  {hours.map(([day, time]) => {
                    const classes = [
                      'day',
                      day === today ? 'is-today' : '',
                      time === 'Closed' ? 'is-shut' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <li key={day} className={classes}>
                        <abbr title={day}>{day.slice(0, 3)}</abbr>
                        <span>{time === 'Closed' ? 'Off' : 'Open'}</span>
                      </li>
                    )
                  })}
                </ul>

                <div className="visit-address" id="location">
                  <span className="map-icon">
                    <PinIcon />
                  </span>
                  <div>
                    <h3>Port Connecting Road, Halishahar</h3>
                    <p>Top floor, above Rangs eMart · Chattogram</p>
                  </div>
                </div>

                <div className="visit-actions">
                  <a className="btn btn-lg" href={MAPS} target="_blank" rel="noreferrer">
                    Get directions
                    <ArrowIcon />
                  </a>
                  <a className="btn btn-lg btn-glass" href={`tel:${PHONE_TEL}`}>
                    <PhoneIcon />
                    Call
                  </a>
                </div>
              </div>

              <div className="visit-map">
                <iframe
                  title="Muscle Power Gym on Google Maps"
                  src={MAP_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section dark contact" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">Membership</p>
              <h2>Ready to start? Talk to us today.</h2>
              <p className="section-lead">
                Ask about monthly fees, a trial day, or the ladies’ timetable.
                Send a message and we’ll reply on WhatsApp.
              </p>
              <ul className="contact-list">
                <li>
                  <span className="contact-icon">
                    <PhoneIcon />
                  </span>
                  <div>
                    <span>Phone & WhatsApp</span>
                    <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">
                    <PinIcon />
                  </span>
                  <div>
                    <span>Address</span>
                    <a href={MAPS} target="_blank" rel="noreferrer">
                      Port Connecting Road, Halishahar
                    </a>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">
                    <FacebookIcon />
                  </span>
                  <div>
                    <span>Facebook</span>
                    <a href={FACEBOOK} target="_blank" rel="noreferrer">
                      Muscle Power Gym Chittagong
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <form className="form" onSubmit={sendWhatsApp}>
              <h3>Send us a message</h3>
              <p className="form-sub">We usually reply within the day.</p>
              <div className="form-row">
                <label>
                  <span>Name</span>
                  <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="01XXX-XXXXXX" required />
                </label>
              </div>
              <label>
                <span>Message</span>
                <textarea name="note" rows="4" placeholder="Fees, trial day, ladies’ hours…" />
              </label>
              <button className="btn btn-lg btn-block" type="submit">
                <ChatIcon />
                Send on WhatsApp
              </button>
              {sent ? (
                <p className="form-note is-ok" role="status">
                  WhatsApp should be open with your message. If not, call{' '}
                  <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>.
                </p>
              ) : (
                <p className="form-note">Opens WhatsApp with your message filled in.</p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="foot dark">
        <div className="container foot-grid">
          <div className="foot-brand">
            <img src="/images/logo.png" alt="" width="48" height="48" />
            <div>
              <strong>Muscle Power Gym</strong>
              <span>Change your lifestyle.</span>
            </div>
          </div>
          <div>
            <h4>Visit</h4>
            <p>
              Port Connecting Road
              <br />
              Halishahar, Chattogram
            </p>
          </div>
          <div>
            <h4>Hours</h4>
            <p>
              Sat – Thu · 7 AM – 11 PM
              <br />
              Friday closed
            </p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
              <br />
              <a href={FACEBOOK} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </p>
          </div>
        </div>
        <div className="container foot-bottom">
          <span>© {new Date().getFullYear()} Muscle Power Gym, Chattogram</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}
