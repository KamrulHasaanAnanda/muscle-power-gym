import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { saveUser } from '../api.js'
import Lightbox from '../Lightbox.jsx'
import {
  ArrowIcon,
  ChatIcon,
  copyWhatsAppNumber,
  FACEBOOK,
  FacebookIcon,
  GYM_MAIL,
  GYM_MAILTO,
  copyGymMail,
  Icon,
  MailIcon,
  MAPS,
  MAP_EMBED,
  PHONE,
  PHONE_2,
  PHONE_2_TEL,
  PHONE_TEL,
  PhoneIcon,
  PinIcon,
  Status,
  WHATSAPP,
  features,
  formatPhone,
  hours,
  steps,
  trainers,
  useGymStatus,
} from '../site.jsx'

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI']

// Banner slideshow: each photo shows for 6s, crossfading on a 30s loop (see .hero-bg in App.css)
const heroSlides = [
  '/images/gym-3.jpg',
  '/images/equip-chest.jpg',
  '/images/hero-group.jpg',
  '/images/floor-treadmill.jpg',
  '/images/equip-rack.jpg',
]

const gallery = [
  {
    src: '/images/equip-chest.jpg',
    alt: 'Members training on red plate-loaded chest press machines',
    cap: 'Plate-loaded machines',
    size: 'gallery-big',
  },
  {
    src: '/images/equip-squat.jpg',
    alt: 'Red plate-loaded squat machine by the yellow wall',
    cap: 'Squat machine',
  },
  {
    src: '/images/equip-preacher.jpg',
    alt: 'Red and black preacher curl bench with an EZ bar',
    cap: 'Preacher curl',
  },
  {
    src: '/images/equip-machines.jpg',
    alt: 'Member using a pulldown machine beside a row of strength machines',
    cap: 'Strength floor',
  },
  {
    src: '/images/floor-treadmill.jpg',
    alt: 'Members walking on a row of treadmills under pendant lights',
    cap: 'Treadmills',
  },
  {
    src: '/images/equip-rack.jpg',
    alt: 'Power racks loaded with barbells and weight plates',
    cap: 'Power racks',
  },
  {
    src: '/images/cardio-bikes.jpg',
    alt: 'Members riding yellow and black spin bikes',
    cap: 'Spin bikes',
  },
  {
    src: '/images/members-male.jpg',
    alt: 'Male members in matching red and black gym shirts posing together on the floor',
    cap: 'Male members',
  },
  {
    src: '/images/members-female.jpg',
    alt: 'Female members in matching red and black gym shirts posing together on the floor',
    cap: 'Female members',
  },
]

const community = [
  {
    src: '/images/athlete-tarek.jpg',
    alt: 'Poster congratulating Tarek Mohiuddin on gold medals at IFBB Pro League Thailand 2026 and 6th runner-up at Mr. Universe Thailand 2026',
    cap: 'Tarek Mohiuddin · IFBB Pro League Thailand 2026',
    size: 'community-star',
    poster: true,
  },
  {
    src: '/images/community-group.jpg',
    alt: 'Large group of male members posing together on the gym floor',
    cap: 'Our members',
    size: 'community-wide',
  },
  {
    src: '/images/ladies-event.jpg',
    alt: 'Female members in saris and salwar kameez gathered for an event at the gym',
    cap: 'Ladies’ get-together',
  },
  {
    src: '/images/community-celebration.jpg',
    alt: 'Members crowding around an athlete holding a prize cheque on the gym floor',
    cap: 'Celebrating a win',
    size: 'community-cheer',
  },
]

// Every photo the viewer can step through, gallery first
const photos = [...gallery, ...community]

// [thumbnail width, full width] for each photo; thumbnails live in /images/sm/
const photoWidths = {
  'equip-chest': [480, 825],
  'equip-squat': [480, 825],
  'equip-preacher': [480, 825],
  'equip-machines': [480, 825],
  'floor-treadmill': [480, 825],
  'equip-rack': [480, 825],
  'cardio-bikes': [480, 825],
  'members-male': [640, 1024],
  'members-female': [640, 1024],
  'athlete-tarek': [480, 825],
  'community-group': [640, 1100],
  'ladies-event': [640, 1100],
  'community-celebration': [510, 877],
}

// Lets phones download the small version while big screens get the full photo
function srcSet(src) {
  const [small, full] = photoWidths[src.split('/').pop().replace('.jpg', '')]
  return `${src.replace('/images/', '/images/sm/')} ${small}w, ${src} ${full}w`
}

const tileSizes = {
  'gallery-big': '(min-width: 760px) 50vw, 100vw',
  'gallery-wide': '(min-width: 760px) 50vw, 100vw',
  'community-star': '(min-width: 760px) 40vw, 100vw',
  'community-wide': '(min-width: 760px) 60vw, 100vw',
}
const defaultTileSize = '(min-width: 760px) 30vw, 50vw'

export default function Home() {
  const [sent, setSent] = useState(false)
  const { today, open, ladies } = useGymStatus()
  const heroRef = useRef(null)
  const contactRef = useRef(null)
  const [heroVisible, setHeroVisible] = useState(true)
  const [contactVisible, setContactVisible] = useState(false)
  const barHidden = heroVisible || contactVisible
  const [viewing, setViewing] = useState(null)
  const [showMap, setShowMap] = useState(false)
  // Only the first banner photo loads up front; the rest wait until the page has finished loading
  const [slidesReady, setSlidesReady] = useState(false)

  useEffect(() => {
    if (document.readyState === 'complete') {
      setSlidesReady(true)
      return
    }
    const ready = () => setSlidesReady(true)
    window.addEventListener('load', ready, { once: true })
    return () => window.removeEventListener('load', ready)
  }, [])
  const closeViewer = useCallback(() => setViewing(null), [])
  const stepViewer = useCallback(
    (dir) => setViewing((i) => (i + dir + photos.length) % photos.length),
    [],
  )

  // Phone/tablet action bar: show once the hero's buttons scroll away, hide again from the contact section down
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === heroRef.current) setHeroVisible(entry.isIntersecting)
        if (entry.target === contactRef.current) {
          setContactVisible(entry.isIntersecting || entry.boundingClientRect.top < 0)
        }
      }
    }, { rootMargin: '-80px 0px 0px 0px' })
    observer.observe(heroRef.current)
    observer.observe(contactRef.current)
    return () => observer.disconnect()
  }, [])

  async function sendWhatsApp(event) {
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
    try {
      await saveUser({ name, phone, message: note, source: 'contact' })
    } catch {
      // WhatsApp still opens if the API is down
    }
    copyWhatsAppNumber(PHONE)
    window.open(
      `${WHATSAPP}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
    setSent(true)
  }

  return (
    <main id="top">
      <section className={`hero${heroVisible ? '' : ' is-away'}`} ref={heroRef}>
        <div className="hero-slides" aria-hidden="true">
          {heroSlides.map((src, i) => (
            <img
              key={src}
              className="hero-bg"
              src={i === 0 || slidesReady ? src : undefined}
              alt=""
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding="async"
              style={{ animationDelay: `${i * 6}s` }}
            />
          ))}
        </div>
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="hero-meta">
            <Status open={open} ladies={ladies} />
            <span className="bn">মাসেল পাওয়ার জিম</span>
          </div>
          <h1 className="display">
            Change your
            <br />
            <span>lifestyle.</span>
          </h1>
          <p className="hero-lead">
            Halishahar’s top-floor training gym on Port Connecting Road. Free
            weights, machines, cardio, and dedicated ladies’ hours.
          </p>
          <div className="hero-actions">
            <a className="btn btn-lg" href={`tel:${PHONE_TEL}`}>
              <PhoneIcon />
              Call to join
            </a>
            <a
              className="btn btn-lg btn-ghost"
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              onClick={() => copyWhatsAppNumber(PHONE)}
            >
              <ChatIcon />
              WhatsApp us
            </a>
          </div>
        </div>
        <div className="hero-bar">
          <div className="container hero-bar-inner">
            <div>
              <span>Sat – Thu</span>
              <strong>7 AM – 11 PM</strong>
            </div>
            <div>
              <span>Ladies’ hours</span>
              <strong>2:30 – 5 PM</strong>
            </div>
            <div>
              <span>Friday</span>
              <strong>Closed</strong>
            </div>
            <div>
              <span>Find us</span>
              <strong>Top floor, Rangs eMart</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section ink" id="facilities">
        <div className="container">
          <header className="head">
            <p className="kicker">No. I · Facilities</p>
            <h2 className="display">
              Everything you need{' '}
              <br className="wide-only" />
              to train hard.
            </h2>
          </header>

          <p className="facilities-lead">
            A working gym, not a showroom. Built for serious lifters, complete
            beginners, and everyone in between.
          </p>
          <ul className="features">
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

          <div className="trainers-block">
            <p className="kicker">Trainers</p>
            <ul className="trainers">
              {trainers.map((t) => (
                <li key={t.title}>
                  <strong>{t.count}</strong>
                  <h3>{t.title}</h3>
                </li>
              ))}
            </ul>
          </div>

          <div className="gallery">
            {gallery.map((g, i) => (
              <figure key={g.src} className={`photo ${g.size || ''}`}>
                <img
                  src={g.src}
                  srcSet={srcSet(g.src)}
                  sizes={tileSizes[g.size] || defaultTileSize}
                  alt={g.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="photo-cap">{g.cap}</figcaption>
                <button
                  className="photo-open"
                  type="button"
                  aria-label={`View photo: ${g.cap}`}
                  onClick={() => setViewing(i)}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section paper" id="community">
        <div className="container">
          <header className="head">
            <div>
              <p className="kicker">No. II · Community</p>
              <h2 className="display">
                More than a gym.
                <br />
                <span>A family.</span>
              </h2>
            </div>
            <p className="lead">
              Members who train together, celebrate together, and push each
              other further.
            </p>
          </header>
          <div className="community">
            {community.map((c, i) => (
              <figure key={c.src} className={`photo ${c.size || ''}`}>
                <img
                  src={c.src}
                  srcSet={srcSet(c.src)}
                  sizes={tileSizes[c.size] || defaultTileSize}
                  alt={c.alt}
                  loading="lazy"
                  decoding="async"
                />
                {!c.poster && <figcaption className="photo-cap">{c.cap}</figcaption>}
                <button
                  className="photo-open"
                  type="button"
                  aria-label={`View photo: ${c.cap}`}
                  onClick={() => setViewing(gallery.length + i)}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section ink" id="hours">
        <div className="container">
          <header className="head">
            <div>
              <p className="kicker">No. III · Hours & location</p>
              <h2 className="display">Open six days a week.</h2>
            </div>
            <Status open={open} ladies={ladies} />
          </header>

          <div className="visit">
            <div className="visit-info">
              <ul className="days" aria-label="Weekly schedule">
                {hours.map(([day, time]) => {
                  const classes = [
                    day === today ? 'is-today' : '',
                    time === 'Closed' ? 'is-shut' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')
                  return (
                    <li key={day} className={classes || undefined}>
                      <span className="day-name">
                        {day}
                        {day === today && <em>Today</em>}
                      </span>
                      <span className="day-time">{time}</span>
                    </li>
                  )
                })}
              </ul>
              <p className="visit-note">
                <strong>Ladies’ hours</strong> 2:30 PM – 5:00 PM daily, floor
                reserved for female members.
              </p>

              <div className="visit-address" id="location">
                <PinIcon />
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
                <a className="btn btn-lg btn-ghost" href={`tel:${PHONE_TEL}`}>
                  <PhoneIcon />
                  Call
                </a>
              </div>
            </div>

            <div className="visit-map">
              {/* The Google embed is heavy, so it only loads when asked for */}
              {showMap ? (
                <iframe
                  title="Muscle Power Gym on Google Maps"
                  src={MAP_EMBED}
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <button className="map-cover" type="button" onClick={() => setShowMap(true)}>
                  <PinIcon />
                  <strong>Port Connecting Road, Halishahar</strong>
                  <span>Top floor, above Rangs eMart</span>
                  <em>Tap to load the map</em>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section paper" id="join">
        <div className="container">
          <header className="head">
            <div>
              <p className="kicker">No. IV · How to join</p>
              <h2 className="display">
                Three steps to{' '}
                <br className="wide-only" />
                your first session.
              </h2>
            </div>
            <p className="lead">
              No complicated sign-up. Talk to us, see the gym, and start
              training the same day.
            </p>
          </header>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="step-num">{roman[i]}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="join-cta">
            <a className="btn btn-lg" href={`tel:${PHONE_TEL}`}>
              <PhoneIcon />
              Call {PHONE}
            </a>
            <a
              className="btn btn-lg btn-ghost"
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              onClick={() => copyWhatsAppNumber(PHONE)}
            >
              <ChatIcon />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="section ink" id="guides">
        <div className="container">
          <header className="head">
            <p className="kicker">No. V · Before you train</p>
            <h2 className="display">Read this before you come in.</h2>
          </header>
          <div className="guides">
            <Link className="guide" to="/dress-code">
              <span className="guide-num">A</span>
              <div>
                <h3>Dress code</h3>
                <p>
                  Two T-shirts, trousers or shorts, a towel, clean soft-soled
                  sneakers, a water bottle, and body spray.
                </p>
                <p className="bn">ড্রেস কোড ও প্রয়োজনীয় সামগ্রী</p>
              </div>
              <span className="guide-arrow">
                <ArrowIcon />
              </span>
            </Link>
            <Link className="guide" to="/rules">
              <span className="guide-num">B</span>
              <div>
                <h3>Rules & regulations</h3>
                <p>
                  Hours, equipment, lockers, monthly fees, conduct, and who may
                  come in with you.
                </p>
              </div>
              <span className="guide-arrow">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section paper" id="contact" ref={contactRef}>
        <div className="container">
          <header className="head">
            <p className="kicker">No. VI · Membership</p>
            <h2 className="display">
              Ready to start?
              <br />
              <span>Talk to us today.</span>
            </h2>
            <p className="lead">
              Ask about monthly fees or the ladies’ timetable. Send a message
              and we’ll reply on WhatsApp.
            </p>
          </header>

          <div className="contact">
            <div className="contact-card">
              <h3>Call us</h3>
              <p className="contact-sub">Saturday – Thursday · 7:00 AM – 11:00 PM</p>
              <div className="contact-phones">
                <a href={`tel:${PHONE_TEL}`}>
                  <PhoneIcon />
                  <span>{PHONE}</span>
                  <ArrowIcon />
                </a>
                <a href={`tel:${PHONE_2_TEL}`}>
                  <PhoneIcon />
                  <span>{PHONE_2}</span>
                  <ArrowIcon />
                </a>
              </div>
              <ul className="contact-links">
                <li>
                  <a href={MAPS} target="_blank" rel="noreferrer">
                    <PinIcon />
                    Port Connecting Road, Halishahar
                  </a>
                </li>
                <li>
                  <a href={GYM_MAILTO} onClick={copyGymMail}>
                    <MailIcon />
                    {GYM_MAIL}
                  </a>
                </li>
                <li>
                  <a href={FACEBOOK} target="_blank" rel="noreferrer">
                    <FacebookIcon />
                    Muscle Power Gym Chittagong
                  </a>
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
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXX-XXXXXX"
                    pattern="01[3-9][0-9]{2}-[0-9]{6}"
                    title="A Bangladeshi mobile number, like 01712-345678"
                    onChange={(event) => (event.target.value = formatPhone(event.target.value))}
                    required
                  />
                </label>
              </div>
              <label>
                <span>Message</span>
                <textarea name="note" rows="3" placeholder="Fees, ladies’ hours…" />
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
                <p className="form-note">
                  Opens WhatsApp with your message filled in, or{' '}
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => copyWhatsAppNumber(PHONE)}
                  >
                    chat directly
                  </a>
                  .
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <div className={`quick-bar${barHidden ? '' : ' is-shown'}`} aria-hidden={barHidden}>
        <a className="btn" href={`tel:${PHONE_TEL}`} tabIndex={barHidden ? -1 : 0}>
          <PhoneIcon />
          Call
        </a>
        <a
          className="btn btn-ghost"
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          tabIndex={barHidden ? -1 : 0}
          onClick={() => copyWhatsAppNumber(PHONE)}
        >
          <ChatIcon />
          WhatsApp
        </a>
      </div>

      {viewing !== null && (
        <Lightbox photos={photos} index={viewing} onClose={closeViewer} onStep={stepViewer} />
      )}
    </main>
  )
}
