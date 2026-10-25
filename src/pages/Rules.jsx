import { Link } from 'react-router-dom'
import {
  ArrowIcon,
  GYM_MAIL,
  GYM_MAILTO,
  copyGymMail,
  PHONE,
  PHONE_2,
  PHONE_2_TEL,
  PHONE_TEL,
  ruleGroups,
} from '../site.jsx'

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI']

const slug = (title) => title.toLowerCase().replace(/[^a-z]+/g, '-')

export default function Rules() {
  return (
    <main id="top">
      <section className="page-hero">
        <div className="container">
          <p className="crumbs">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            Rules
          </p>
          <h1 className="display">
            The house <span>rules.</span>
          </h1>
          <p className="lead">
            These rules apply to every member. They cover the timetable,
            equipment, lockers, fees, and how we treat each other.
          </p>
        </div>
      </section>

      <section className="section ink rules-section">
        <div className="container rules">
          <nav className="rules-index" aria-label="Rule sections">
            <p className="rules-index-title">Contents</p>
            {ruleGroups.map((group, i) => (
              <a key={group.title} href={`#${slug(group.title)}`}>
                <span>{roman[i]}</span>
                {group.title}
              </a>
            ))}
          </nav>
          <div className="rules-body">
            {ruleGroups.map((group, i) => (
              <article key={group.title} id={slug(group.title)} className="rule-group">
                <header className="rule-head">
                  <span className="rule-num" aria-hidden="true">
                    {roman[i]}
                  </span>
                  <div>
                    <p className="rule-article">Article {roman[i]}</p>
                    <h2>{group.title}</h2>
                  </div>
                </header>
                <ol>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </article>
            ))}
            <div className="rules-sign">
              <p className="rules-thanks">Thank you for your cooperation.</p>
              <p className="rules-signature">Muscle Power Gym</p>
              <strong>Management</strong>
              <p className="rules-phones">
                <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
                <i aria-hidden="true">✦</i>
                <a href={`tel:${PHONE_2_TEL}`}>{PHONE_2}</a>
                <i aria-hidden="true">✦</i>
                <a href={GYM_MAILTO} onClick={copyGymMail}>
                  {GYM_MAIL}
                </a>
              </p>
            </div>
            <Link className="next-link" to="/dress-code">
              <span>Next</span>
              See the dress code
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
