import { Link } from 'react-router-dom'
import { FemaleIcon, MaleIcon, workoutCharts } from '../site.jsx'

const icons = {
  male: MaleIcon,
  female: FemaleIcon,
}

export default function WorkoutChart() {
  return (
    <main id="top">
      <section className="page-hero">
        <div className="container">
          <p className="crumbs">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            Workout chart
          </p>
          <h1 className="display">
            Male &amp; female
            <br />
            <span>workout chart.</span>
          </h1>
          <p className="bn bn-lg">পুরুষ ও মহিলা ওয়ার্কআউট চার্ট</p>
          <p className="lead">
            Two boards, Saturday to Thursday. Friday the gym is closed. Your
            trainer sets the weight, sets, and reps.
          </p>
        </div>
      </section>

      <section className="section paper">
        <div className="container charts">
          {workoutCharts.map((chart) => {
            const Glyph = icons[chart.id]
            return (
              <article key={chart.id} id={chart.id} className="chart-board">
                <header className="chart-head">
                  <span className="feature-icon" aria-hidden="true">
                    <Glyph />
                  </span>
                  <div>
                    <h2>{chart.title}</h2>
                    <p className="bn">{chart.bn}</p>
                  </div>
                </header>
                <ol className="chart-list">
                  {chart.days.map(([day, focus, moves]) => (
                    <li key={day}>
                      <span>{day}</span>
                      <div>
                        <strong>{focus}</strong>
                        <p>{moves}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
