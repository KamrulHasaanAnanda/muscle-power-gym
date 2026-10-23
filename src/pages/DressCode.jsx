import { Link } from 'react-router-dom'
import { ArrowIcon, dressCode } from '../site.jsx'

export default function DressCode() {
  return (
    <main id="top">
      <section className="page-hero">
        <div className="container">
          <p className="crumbs">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            Dress code
          </p>
          <h1 className="display">
            What to wear
            <br />
            <span>and bring.</span>
          </h1>
          <p className="bn bn-lg">ড্রেস কোড ও প্রয়োজনীয় সামগ্রী</p>
          <p className="lead">
            Come ready to train. Members are admitted only in the prescribed
            kit, with every required item.
          </p>
        </div>
      </section>

      <section className="section paper">
        <div className="container">
          <ol className="kit">
            {dressCode.map((item, i) => (
              <li key={item.title}>
                <span className="kit-num">No. {i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p className="bn">{item.bn}</p>
              </li>
            ))}
          </ol>
          <div className="notice">
            <strong>Do not arrive without the dress code and required items.</strong>
            <p>
              Shirts, sleeveless vests, jeans, gabardine pants, and dirty or
              used sneakers will not be accepted.
            </p>
            <p className="bn">
              নির্ধারিত ড্রেস কোড ও প্রয়োজনীয় সামগ্রী ছাড়া উপস্থিত না হওয়ার জন্য
              বিশেষভাবে অনুরোধ করা হলো।
            </p>
          </div>
          <Link className="next-link" to="/rules">
            <span>Next</span>
            Read the gym rules
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </main>
  )
}
