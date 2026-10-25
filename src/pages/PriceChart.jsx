import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon, formatTaka, priceCharts } from '../site.jsx'

export default function PriceChart() {
  const [gender, setGender] = useState('male')
  const chart = priceCharts[gender]

  return (
    <main id="top">
      <section className="page-hero">
        <div className="container">
          <p className="crumbs">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            Price chart
          </p>
          <h1 className="display">
            Membership
            <br />
            <span>price chart.</span>
          </h1>
          <p className="lead">
            Membership and monthly fees for male and female members, including
            multi-month packages.
          </p>
        </div>
      </section>

      <section className="section paper">
        <div className="container price-page">
          <div
            className="price-toggle"
            role="tablist"
            aria-label="Choose a price chart"
          >
            {Object.values(priceCharts).map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={gender === option.id}
                className={gender === option.id ? 'is-on' : undefined}
                onClick={() => setGender(option.id)}
              >
                {option.title}
              </button>
            ))}
          </div>

          <article className="price-board" aria-live="polite">
            <header className="price-board-head">
              <p className="kicker">{chart.label}</p>
              <h2>{chart.title} members</h2>
            </header>
            <ol className="price-list">
              {chart.rows.map((row) => (
                <li key={row.name}>
                  <div>
                    <strong>{row.name}</strong>
                    {row.save ? (
                      <span className="price-save">Save {formatTaka(row.save)}</span>
                    ) : null}
                  </div>
                  <b>{formatTaka(row.price)}</b>
                </li>
              ))}
            </ol>
          </article>

          <Link className="next-link" to="/#contact">
            <span>Next</span>
            Ask about membership
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </main>
  )
}
