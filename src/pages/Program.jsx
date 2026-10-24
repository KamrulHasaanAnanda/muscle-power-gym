import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, loadPdfKit, makePlanPdf, planFileName } from '../pdf.js'
import { ArrowIcon, ChatIcon, Icon, programs } from '../site.jsx'

const today = () => new Date().toISOString().slice(0, 10)

// Turn a local number like 01712-345678 into wa.me form (8801712345678)
function toWhatsApp(raw) {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = `88${digits}`
  else if (digits.length === 10 && digits.startsWith('1')) digits = `880${digits}`
  return digits
}

const isBangladeshMobile = (raw) => /^8801\d{9}$/.test(toWhatsApp(raw))

// Whole numbers only, up to three digits
const digits = (value) => value.replace(/\D/g, '').slice(0, 3)

// Value keys of a block, in display order
const blockKeys = (block, b) =>
  block.items
    ? block.items.map((_, i) => `${b}-${i}`)
    : block.groups.flatMap((group, g) => group.map((_, m) => `${b}-${g}-${m}`))

function Box({ value, onChange, label, placeholder = ' ' }) {
  return (
    <input
      className="box"
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      min="0"
      value={value || ''}
      onChange={(event) => onChange(digits(event.target.value))}
      placeholder={placeholder}
      aria-label={label}
    />
  )
}

const PdfIcon = () => (
  <Icon size={18}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Icon>
)

export default function Program({ id }) {
  const plan = programs[id]
  const next = programs[plan.next]

  const [member, setMember] = useState({ name: '', phone: '', no: '', weight: '', date: today() })
  const [error, setError] = useState('')
  const [values, setValues] = useState({})
  const [fill, setFill] = useState({})
  const [extras, setExtras] = useState({})
  const [note, setNote] = useState('')
  const [withDiet, setWithDiet] = useState(true)
  const [status, setStatus] = useState('')
  const pdfKit = useRef(null)
  const nameInput = useRef(null)
  const phoneInput = useRef(null)

  // Load jsPDF and the logos up front so tapping "Send PDF" can share
  // straight away; phones only allow sharing directly from a tap.
  useEffect(() => {
    loadPdfKit()
      .then((k) => {
        pdfKit.current = k
      })
      .catch(() => {})
  }, [])

  const firstName = member.name.trim().split(/\s+/)[0]
  const memberReady = member.name.trim() && isBangladeshMobile(member.phone)
  const filled = Object.values(values).filter((v) => v.rep || v.set).length

  const updateMember = (field) => (event) => {
    setMember((m) => ({ ...m, [field]: event.target.value }))
    setError('')
  }

  const setValue = (key, field) => (value) =>
    setValues((v) => ({ ...v, [key]: { ...v[key], [field]: value } }))

  const setFillValue = (b, field) => (value) =>
    setFill((f) => ({ ...f, [b]: { ...f[b], [field]: value } }))

  // Copy the quick-fill numbers into every empty box of the block
  function fillBlock(block, b) {
    const { rep = '', set = '' } = fill[b] || {}
    if (!rep && !set) return
    setValues((v) => {
      const out = { ...v }
      blockKeys(block, b).forEach((key) => {
        const cur = out[key] || {}
        out[key] = { rep: cur.rep || rep, set: block.items ? cur.set || set : '' }
      })
      return out
    })
  }

  function addExtra(b) {
    setExtras((e) => ({ ...e, [b]: [...(e[b] || []), { name: '', rep: '', set: '' }] }))
  }

  const setExtra = (b, index, field) => (value) =>
    setExtras((e) => ({
      ...e,
      [b]: e[b].map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))

  function removeExtra(b, index) {
    setExtras((e) => ({ ...e, [b]: e[b].filter((_, i) => i !== index) }))
  }

  function check() {
    const bad = !member.name.trim() ? 'name' : !isBangladeshMobile(member.phone) ? 'phone' : ''
    if (!bad) return true
    setError(bad)
    const input = bad === 'name' ? nameInput.current : phoneInput.current
    input?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    input?.focus({ preventScroll: true })
    setStatus(bad === 'name' ? 'Write the member’s name first.' : 'Write a valid WhatsApp number first.')
    return false
  }

  const greeting = () =>
    `Hi ${firstName}, here is your ${plan.title.toLowerCase()} plan from Muscle Power Gym.`

  // Opening the chat first puts the member at the top of WhatsApp's
  // share list, even if they aren't saved as a contact.
  function openChat() {
    if (!check()) return
    window.open(
      `https://wa.me/${toWhatsApp(member.phone)}?text=${encodeURIComponent(greeting())}`,
      '_blank',
      'noopener,noreferrer',
    )
    setStatus('Chat opened. Now tap Send PDF.')
  }

  function sharePdf() {
    if (!check()) return
    if (!pdfKit.current) {
      setStatus('PDF is still loading. Try again in a second.')
      return
    }
    const { JsPDF, images } = pdfKit.current
    const doc = makePlanPdf(JsPDF, images, {
      plan,
      member,
      values,
      extras,
      note,
      withDiet,
      date: formatDate(member.date),
    })
    const filename = planFileName(member.name, id)
    const file = new File([doc.output('blob')], filename, { type: 'application/pdf' })

    if (navigator.canShare?.({ files: [file] })) {
      navigator
        .share({ files: [file], title: `${plan.title} plan` })
        .then(() => setStatus('Sent.'))
        .catch(() => {})
      return
    }

    // No share sheet (desktop): save the file and open the chat to attach it
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
    openChat()
    setStatus('PDF downloaded. Attach it in the WhatsApp chat.')
  }

  const steps = [
    ['Member', 'Name and WhatsApp number', memberReady],
    ['Reps & sets', 'Write them in the boxes', filled > 0],
    ['Send', 'Tap Send PDF at the bottom', false],
  ]

  return (
    <main id="top" className="program">
      <section className="program-hero">
        <div className="container">
          <p className="crumbs">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            {plan.title}
          </p>
          <h1 className="display">
            {plan.title.split(' ')[0]} <span>{plan.accent}</span>
          </h1>
          <p className="bn">{plan.bn}</p>
        </div>
      </section>

      <section className="program-body">
        <div className="container">
          <ol className="how">
            {steps.map(([title, text, done], i) => (
              <li key={title} className={done ? 'is-done' : ''}>
                <span>{done ? '✓' : i + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              </li>
            ))}
          </ol>

          <article className="paper">
            <header className="paper-head">
              <img src="/images/logo-badge.png" alt="" width="54" height="68" />
              <div>
                <p className="paper-brand">
                  <b>Muscle</b> <b>Power</b> <b>Gym</b>
                </p>
                <p className="paper-sub">{plan.title} · workout sheet</p>
              </div>
            </header>

            <div className="paper-member">
              <label className={`line line-wide${error === 'name' ? ' is-bad' : ''}`}>
                <span>Member name *</span>
                <input
                  ref={nameInput}
                  type="text"
                  value={member.name}
                  onChange={updateMember('name')}
                  maxLength={40}
                  placeholder="Write name"
                  autoComplete="off"
                />
              </label>
              <label className={`line line-wide${error === 'phone' ? ' is-bad' : ''}`}>
                <span>WhatsApp *</span>
                <input
                  ref={phoneInput}
                  type="tel"
                  inputMode="numeric"
                  value={member.phone}
                  onChange={updateMember('phone')}
                  maxLength={14}
                  placeholder="01XXX-XXXXXX"
                  autoComplete="off"
                />
              </label>
              <label className="line">
                <span>Member no.</span>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={member.no}
                  onChange={(event) =>
                    setMember((m) => ({ ...m, no: event.target.value.replace(/\D/g, '').slice(0, 8) }))
                  }
                />
              </label>
              <label className="line">
                <span>Weight (kg)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={member.weight}
                  onChange={(event) =>
                    setMember((m) => ({ ...m, weight: event.target.value.slice(0, 5) }))
                  }
                />
              </label>
              <label className="line">
                <span>Date</span>
                <input type="date" value={member.date} onChange={updateMember('date')} />
              </label>
            </div>

            <div className="paper-cols">
              {plan.workouts.map((block, b) => {
                const single = Boolean(block.groups)
                return (
                  <section key={block.title} className="chart">
                    <h3 className="chart-title">{block.title}</h3>

                    <div className="quick">
                      <span>Same for all empty boxes</span>
                      <Box
                        value={fill[b]?.rep}
                        onChange={setFillValue(b, 'rep')}
                        label={`${block.title}: reps for all`}
                        placeholder={single ? 'Reps' : 'Rep'}
                      />
                      {!single && (
                        <Box
                          value={fill[b]?.set}
                          onChange={setFillValue(b, 'set')}
                          label={`${block.title}: sets for all`}
                          placeholder="Set"
                        />
                      )}
                      <button type="button" onClick={() => fillBlock(block, b)}>
                        Fill
                      </button>
                    </div>

                    <table className={single ? 'is-single' : ''}>
                      <thead>
                        <tr>
                          <th>Exercise name</th>
                          <th>{single ? 'Reps / time' : 'Rep'}</th>
                          {!single && <th>Set</th>}
                        </tr>
                      </thead>
                      {single ? (
                        block.groups.map((group, g) => (
                          <tbody key={group.join()} className="round">
                            {group.map((move, m) => (
                              <tr key={move}>
                                <td>
                                  {m > 0 && <em>+ </em>}
                                  {move}
                                </td>
                                <td>
                                  <Box
                                    value={values[`${b}-${g}-${m}`]?.rep}
                                    onChange={setValue(`${b}-${g}-${m}`, 'rep')}
                                    label={`${move} reps or time`}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ))
                      ) : (
                        <tbody>
                          {block.items.map((move, i) => (
                            <tr key={move}>
                              <td>{move}</td>
                              <td>
                                <Box
                                  value={values[`${b}-${i}`]?.rep}
                                  onChange={setValue(`${b}-${i}`, 'rep')}
                                  label={`${move} reps`}
                                />
                              </td>
                              <td>
                                <Box
                                  value={values[`${b}-${i}`]?.set}
                                  onChange={setValue(`${b}-${i}`, 'set')}
                                  label={`${move} sets`}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                      {(extras[b] || []).length > 0 && (
                        <tbody className="added">
                          {extras[b].map((row, i) => (
                            <tr key={i}>
                              <td>
                                <div className="added-name">
                                  <input
                                    value={row.name}
                                    onChange={(event) => setExtra(b, i, 'name')(event.target.value)}
                                    maxLength={30}
                                    placeholder="Exercise name"
                                    aria-label="Exercise name"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeExtra(b, i)}
                                    aria-label="Remove exercise"
                                  >
                                    ×
                                  </button>
                                </div>
                              </td>
                              <td>
                                <Box value={row.rep} onChange={setExtra(b, i, 'rep')} label="Reps" />
                              </td>
                              {!single && (
                                <td>
                                  <Box value={row.set} onChange={setExtra(b, i, 'set')} label="Sets" />
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                    <button type="button" className="add-row" onClick={() => addExtra(b)}>
                      + Add exercise
                    </button>
                  </section>
                )
              })}
            </div>

            {plan.notes.length > 0 && (
              <ul className="paper-notes">
                {plan.notes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}

            <label className="paper-note">
              <span>Note</span>
              <textarea
                rows="3"
                maxLength={300}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Anything extra for this member (optional)"
              />
            </label>
          </article>

          <article className={`paper diet${withDiet ? '' : ' is-off'}`}>
            <header className="diet-head">
              <h3 className="chart-title">Diet chart</h3>
              <label className="diet-toggle">
                <input
                  type="checkbox"
                  checked={withDiet}
                  onChange={(event) => setWithDiet(event.target.checked)}
                />
                Add to PDF
              </label>
            </header>
            <ol className="meals">
              {plan.diet.map(([time, foods], i) => (
                <li key={time}>
                  <p>
                    <b>Meal-{i + 1}</b> : <time>{time}</time>
                  </p>
                  <p>{foods.join(', ')}</p>
                </li>
              ))}
            </ol>
          </article>

          <Link className="next-link" to={`/${plan.next}`}>
            <span>Next</span>
            {next.title} plan
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <div className="send-bar">
        <div className="send-card">
          <span className={`send-avatar${memberReady ? ' is-ready' : ''}`} aria-hidden="true">
            {memberReady ? firstName.charAt(0).toUpperCase() : '?'}
          </span>
          <div className="send-info">
            <strong>{memberReady ? member.name.trim() : 'No member yet'}</strong>
            <p role="status" className={status ? 'is-status' : ''}>
              {status ||
                (memberReady
                  ? `+88 ${member.phone.trim()} · ${filled} filled`
                  : 'Fill in the sheet first')}
            </p>
          </div>
          <button
            type="button"
            className="chat-btn"
            onClick={openChat}
            aria-label="Open member’s WhatsApp chat"
            title="Open member’s WhatsApp chat"
          >
            <ChatIcon />
            <span>Chat</span>
          </button>
          <button type="button" className="btn send-btn" onClick={sharePdf}>
            <PdfIcon />
            Send<span className="send-btn-pdf"> PDF</span>
          </button>
        </div>
      </div>
    </main>
  )
}
