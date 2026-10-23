import { Link } from 'react-router-dom'
import {
  ArrowIcon,
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
            How we keep
            <br />
            the <span>floor fair.</span>
          </h1>
          <p className="lead">
            These rules apply to every member. They cover the timetable,
            equipment, lockers, fees, and how we treat each other.
          </p>
        </div>
      </section>

      <section className="section paper">
        <div className="container rules">
          <nav className="rules-index" aria-label="Rule sections">
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
                <h2>
                  <span>{roman[i]}</span>
                  {group.title}
                </h2>
                <ol>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </article>
            ))}
            <p className="rules-sign">
              Thank you for your cooperation.
              <span>
                <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
                {' · '}
                <a href={`tel:${PHONE_2_TEL}`}>{PHONE_2}</a>
              </span>
              <strong>Muscle Power Gym Management</strong>
            </p>
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
