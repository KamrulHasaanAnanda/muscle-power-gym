import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowIcon,
  ChatIcon,
  FACEBOOK,
  FacebookIcon,
  FemaleIcon,
  Icon,
  MaleIcon,
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
  hours,
  steps,
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
    src: '/images/gym-4.jpg',
    alt: 'Benches, machines, and a row of treadmills on red and blue floor mats',
    cap: 'Free weights & cardio',
    size: 'gallery-wide',
  },
]

export default function Home() {
  const [sent, setSent] = useState(false)
  const { today, open, ladies } = useGymStatus()
  const heroRef = useRef(null)
  const contactRef = useRef(null)
  const [heroVisible, setHeroVisible] = useState(true)
  const [contactVisible, setContactVisible] = useState(false)
  const barHidden = heroVisible || contactVisible

  // Phone action bar: show once the hero's buttons scroll away, hide again from the contact section down
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

  return (
    <main id="top">
      <section className="hero" ref={heroRef}>
        <div className="hero-slides" aria-hidden="true">
          {heroSlides.map((src, i) => (
            <img
              key={src}
              className="hero-bg"
              src={src}
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
              Everything you need
              <br />
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

          <div className="gallery">
            {gallery.map((g) => (
              <figure key={g.src} className={`photo ${g.size || ''}`}>
                <img src={g.src} alt={g.alt} loading="lazy" />
                <figcaption className="photo-cap">{g.cap}</figcaption>
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
            <figure className="photo community-star">
              <img
                src="/images/athlete-tarek.jpg"
                alt="Poster congratulating Tarek Mohiuddin on gold medals at IFBB Pro League Thailand 2026 and 6th runner-up at Mr. Universe Thailand 2026"
                loading="lazy"
              />
            </figure>
            <figure className="photo community-wide">
              <img
                src="/images/community-group.jpg"
                alt="Large group of male members posing together on the gym floor"
                loading="lazy"
              />
              <figcaption className="photo-cap">Our members</figcaption>
            </figure>
            <figure className="photo">
              <img
                src="/images/ladies-event.jpg"
                alt="Female members in saris and salwar kameez gathered for an event at the gym"
                loading="lazy"
              />
              <figcaption className="photo-cap">Ladies’ get-together</figcaption>
            </figure>
            <figure className="photo community-cheer">
              <img
                src="/images/community-celebration.jpg"
                alt="Members crowding around an athlete holding a prize cheque on the gym floor"
                loading="lazy"
              />
              <figcaption className="photo-cap">Celebrating a win</figcaption>
            </figure>
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

      <section className="section paper" id="join">
        <div className="container">
          <header className="head">
            <div>
              <p className="kicker">No. IV · How to join</p>
              <h2 className="display">
                Three steps to
                <br />
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
                  Hours, equipment, lockers, fees, conduct, and who may come in
                  with you.
                </p>
              </div>
              <span className="guide-arrow">
                <ArrowIcon />
              </span>
            </Link>
            <Link className="guide" to="/workout-chart">
              <span className="guide-icons" aria-hidden="true">
                <span className="feature-icon">
                  <MaleIcon />
                </span>
                <span className="feature-icon">
                  <FemaleIcon />
                </span>
              </span>
              <div>
                <h3>Workout chart</h3>
                <p>Separate Saturday-to-Thursday boards for male and female members.</p>
                <p className="bn">পুরুষ ও মহিলা ওয়ার্কআউট চার্ট</p>
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
              Ask about monthly fees, a trial day, or the ladies’ timetable.
              Send a message and we’ll reply on WhatsApp.
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
              <a
                className="btn btn-lg btn-block btn-ghost"
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
              >
                <ChatIcon />
                Chat on WhatsApp
              </a>
              <ul className="contact-links">
                <li>
                  <a href={MAPS} target="_blank" rel="noreferrer">
                    <PinIcon />
                    Port Connecting Road, Halishahar
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
                  <input name="phone" type="tel" autoComplete="tel" placeholder="01XXX-XXXXXX" required />
                </label>
              </div>
              <label>
                <span>Message</span>
                <textarea name="note" rows="3" placeholder="Fees, trial day, ladies’ hours…" />
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
        >
          <ChatIcon />
          WhatsApp
        </a>
      </div>
    </main>
  )
}
