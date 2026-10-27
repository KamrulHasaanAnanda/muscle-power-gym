import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { saveUser } from '../api.js'
import { formatDate, loadPdfKit, makePlanPdf, planFileName } from '../pdf.js'
import { ChatIcon, copyWhatsAppNumber, formatPhone, GYM_MAIL, Icon, programs } from '../site.jsx'

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

const isEmail = (raw) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim())

// Weight like 82 or 82.5
function formatWeight(raw) {
  const [whole = '', ...rest] = raw.replace(/[^\d.]/g, '').split('.')
  const tail = rest.join('').slice(0, 1)
  return raw.includes('.') && whole ? `${whole.slice(0, 3)}.${tail}` : whole.slice(0, 3)
}

// Shared props for number-pad fields: plain text keeps typing and
// pasting predictable, inputMode still brings up the number keypad
const numberPad = {
  type: 'text',
  inputMode: 'numeric',
  pattern: '[0-9]*',
  autoComplete: 'off',
  enterKeyHint: 'next',
}

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
      {...numberPad}
      value={value || ''}
      onFocus={(event) => event.target.select()}
      onChange={(event) => onChange(digits(event.target.value))}
      placeholder={placeholder}
      aria-label={label}
    />
  )
}

// Where a meal sits in the day, from its "8:00 AM" style time
function mealPeriod(time) {
  const [, h = '0', m = '0', ampm = 'AM'] = time.match(/(\d+):(\d+)\s*(AM|PM)/i) || []
  const hour = (Number(h) % 12) + (ampm.toUpperCase() === 'PM' ? 12 : 0) + Number(m) / 60
  if (hour < 10) return 'Breakfast'
  if (hour < 12) return 'Mid-morning'
  if (hour < 15) return 'Lunch'
  if (hour < 18) return 'Afternoon'
  if (hour < 21) return 'Evening'
  if (hour < 23) return 'Dinner'
  return 'Before bed'
}

const MailIcon = () => (
  <Icon size={18}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Icon>
)

export default function Program({ id }) {
  const plan = programs[id]

  const [member, setMember] = useState({
    name: '',
    phone: '',
    email: '',
    no: '',
    weight: '',
    date: today(),
  })
  const [error, setError] = useState('')
  const [values, setValues] = useState({})
  const [fill, setFill] = useState({})
  const [extras, setExtras] = useState(() =>
    plan.blank
      ? {
          0: Array.from({ length: 8 }, () => ({ name: '', rep: '', set: '' })),
          1: Array.from({ length: 8 }, () => ({ name: '', rep: '', set: '' })),
        }
      : {},
  )
  const [customDiet, setCustomDiet] = useState(() =>
    plan.blank ? plan.diet.map(([time]) => [time, '']) : null,
  )
  const [workoutNote, setWorkoutNote] = useState('')
  const [dietNote, setDietNote] = useState('')
  const [withDiet, setWithDiet] = useState(true)
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const pdfKit = useRef(null)
  const nameInput = useRef(null)
  const phoneInput = useRef(null)
  const emailInput = useRef(null)

  // Load jsPDF and the logos up front so tapping "Send PDF" can share
  // straight away; phones only allow sharing directly from a tap.
  useEffect(() => {
    loadPdfKit()
      .then((k) => {
        pdfKit.current = k
      })
      .catch(() => {})
  }, [])

  // Hide the floating bars while the phone keyboard is up so they
  // don't cover the box being typed in
  useEffect(() => {
    const isField = (el) => el?.matches?.('input:not([type=checkbox]), textarea')
    const update = () =>
      setTimeout(() => document.body.classList.toggle('is-typing', isField(document.activeElement)))
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', update)
    return () => {
      document.removeEventListener('focusin', update)
      document.removeEventListener('focusout', update)
      document.body.classList.remove('is-typing')
    }
  }, [])

  // Enter / "Next" on the keyboard moves to the next box on the sheet
  function nextField(event) {
    if (event.key !== 'Enter' || event.target.tagName !== 'INPUT') return
    event.preventDefault()
    const fields = [...event.currentTarget.querySelectorAll('input:not([type=checkbox]), textarea')]
    const next = fields[fields.indexOf(event.target) + 1]
    if (next) next.focus()
    else event.target.blur()
  }

  const firstName = member.name.trim().split(/\s+/)[0]
  const hasPhone = isBangladeshMobile(member.phone)
  const hasEmail = isEmail(member.email)
  const memberReady = member.name.trim() && (hasPhone || hasEmail)
  const diet = plan.blank ? customDiet : plan.diet
  const filled = plan.blank
    ? Object.values(extras)
        .flat()
        .filter((row) => row.name.trim() || row.rep || row.set).length
    : Object.values(values).filter((v) => v.rep || v.set).length

  const dietForPdf = (diet || [])
    .map(([time, foods]) => [
      String(time || '').trim(),
      Array.isArray(foods)
        ? foods
        : String(foods)
            .split(/[·,+]/)
            .map((item) => item.trim())
            .filter(Boolean),
    ])
    .filter(([time, foods]) => time && foods.length)

  const setMeal = (index, field) => (event) =>
    setCustomDiet((rows) =>
      rows.map((row, i) =>
        i === index ? (field === 'time' ? [event.target.value, row[1]] : [row[0], event.target.value]) : row,
      ),
    )

  function addMeal() {
    setCustomDiet((rows) => [...rows, ['', '']])
  }

  function removeMeal(index) {
    setCustomDiet((rows) => rows.filter((_, i) => i !== index))
  }

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
    if (plan.blank) {
      setExtras((e) => ({
        ...e,
        [b]: (e[b] || []).map((row) => ({
          ...row,
          rep: row.rep || rep,
          set: row.set || set,
        })),
      }))
    }
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

  // Name plus the contact the chosen channel needs: a WhatsApp number or an email
  function check(channel) {
    const contactOk = channel === 'email' ? hasEmail : hasPhone
    const bad = !member.name.trim() ? 'name' : contactOk ? '' : channel === 'email' ? 'email' : 'phone'
    if (!bad) return true
    setError(bad)
    const input = { name: nameInput, phone: phoneInput, email: emailInput }[bad].current
    input?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    input?.focus({ preventScroll: true })
    setStatus(
      {
        name: 'Write the member’s name first.',
        phone: 'Write a valid WhatsApp number first.',
        email: 'Write a valid email address first.',
      }[bad],
    )
    return false
  }

  const greeting = () =>
    `Hi ${firstName}, here is your ${plan.title.toLowerCase()} plan from Muscle Power Gym.`

  // Open the member's chat so the downloaded PDF can be attached there
  function openChat() {
    if (!check('whatsapp')) return
    window.open(
      `https://wa.me/${toWhatsApp(member.phone)}?text=${encodeURIComponent(greeting())}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  function downloadPdf(file, filename) {
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 15000)
  }

  // Build the sheet as a PDF file, or explain why it can't be built yet
  function buildPdf() {
    if (!pdfKit.current) {
      setStatus('PDF is still loading. Try again in a second.')
      return null
    }
    const { JsPDF, images } = pdfKit.current
    const doc = makePlanPdf(JsPDF, images, {
      plan: { ...plan, diet: dietForPdf },
      member,
      values,
      extras,
      workoutNote,
      dietNote,
      withDiet: withDiet && dietForPdf.length > 0,
      date: formatDate(member.date),
    })
    const filename = planFileName(member.name, id)
    return new File([doc.output('blob')], filename, { type: 'application/pdf' })
  }

  const canShareFile = (file) =>
    window.matchMedia('(pointer: coarse)').matches && navigator.canShare?.({ files: [file] })

  function sharePdf() {
    if (!check('whatsapp')) return
    copyWhatsAppNumber(member.phone)
    const file = buildPdf()
    if (!file) return

    // Phones have a share sheet that can pass the file into the WhatsApp app.
    // A computer does not: wa.me can only open a chat with text, never a PDF.
    if (canShareFile(file)) {
      navigator
        .share({ files: [file], title: `${plan.title} plan` })
        .then(() => setStatus('Sent.'))
        .catch((err) => {
          if (err?.name === 'AbortError') return
          downloadPdf(file, file.name)
          openChat()
          setStatus('Number copied. PDF downloaded. Attach it in the WhatsApp chat.')
        })
      return
    }

    downloadPdf(file, file.name)
    openChat()
    setStatus('Number copied. PDF saved to Downloads — attach that file in the WhatsApp chat.')
  }

  function composeHref() {
    const from = GYM_MAIL
    const to = member.email.trim()
    const subject = `Your ${plan.title.toLowerCase()} plan · Muscle Power Gym`
    const body = `${greeting()}\n\nYour plan is attached as a PDF.\n\nMuscle Power Gym`
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      tf: '1',
      to,
      su: subject,
      body,
      authuser: from,
    })
    const compose = `https://mail.google.com/mail/?${params}`
    return `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(from)}&continue=${encodeURIComponent(compose)}`
  }

  async function emailPdf() {
    if (!check('email') || sending) return
    const file = buildPdf()
    if (!file) return

    setSending(true)
    try {
      await saveUser({
        name: member.name,
        phone: member.phone,
        email: member.email,
        message: [
          workoutNote.trim() && `Exercise note: ${workoutNote.trim()}`,
          dietNote.trim() && `Diet note: ${dietNote.trim()}`,
        ]
          .filter(Boolean)
          .join('\n'),
        source: id,
      })
    } catch {
      // Still open mail if the API is down
    }

    const body = `${greeting()}\n\nYour plan is attached as a PDF.\n\nMuscle Power Gym`

    try {
      if (canShareFile(file)) {
        await navigator.share({ files: [file], title: `${plan.title} plan`, text: body })
        setStatus('Sent.')
        return
      }
      window.open(composeHref(), '_blank', 'noopener')
      downloadPdf(file, file.name)
      setStatus(`Gmail is opening from ${GYM_MAIL} to ${member.email.trim()}. Attach the downloaded PDF, then send.`)
    } catch (err) {
      if (err?.name === 'AbortError') {
        setStatus('')
        return
      }
      setStatus('Could not open Gmail. Try again.')
    } finally {
      setSending(false)
    }
  }

  const steps = [
    ['Member', 'Name and WhatsApp or email', memberReady],
    ['Reps & sets', 'Write them in the boxes', filled > 0],
    ['Send', 'WhatsApp or email it from the bar below', false],
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
          <nav className="sheet-switch" aria-label="Choose a sheet">
            {Object.entries(programs).map(([key, p]) => (
              <NavLink key={key} to={`/${key}`}>
                <span className="sheet-full">{p.title}</span>
                <span className="sheet-short">{p.short || p.title}</span>
              </NavLink>
            ))}
          </nav>

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

          <article className="paper" onKeyDown={nextField}>
            <header className="paper-head">
              <img src="/images/logo-badge-web.png" alt="" width="54" height="68" />
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
                  autoCapitalize="words"
                  enterKeyHint="next"
                />
              </label>
              <label className={`line line-wide${error === 'phone' ? ' is-bad' : ''}`}>
                <span>WhatsApp *</span>
                <input
                  ref={phoneInput}
                  type="tel"
                  inputMode="tel"
                  value={member.phone}
                  onChange={(event) => {
                    setMember((m) => ({ ...m, phone: formatPhone(event.target.value) }))
                    setError('')
                  }}
                  placeholder="01XXX-XXXXXX"
                  autoComplete="off"
                  enterKeyHint="next"
                />
                {isBangladeshMobile(member.phone) && (
                  <i className="line-ok" aria-label="Valid number">
                    ✓
                  </i>
                )}
              </label>
              <label className={`line line-full${error === 'email' ? ' is-bad' : ''}`}>
                <span>Email</span>
                <input
                  ref={emailInput}
                  type="email"
                  inputMode="email"
                  value={member.email}
                  onChange={updateMember('email')}
                  maxLength={80}
                  placeholder="Optional, to email the PDF"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  enterKeyHint="next"
                />
                {hasEmail && (
                  <i className="line-ok" aria-label="Valid email">
                    ✓
                  </i>
                )}
              </label>
              <label className="line">
                <span>Member no.</span>
                <input
                  {...numberPad}
                  value={member.no}
                  onChange={(event) =>
                    setMember((m) => ({ ...m, no: event.target.value.replace(/\D/g, '').slice(0, 8) }))
                  }
                />
              </label>
              <label className="line">
                <span>Weight (kg)</span>
                <input
                  {...numberPad}
                  inputMode="decimal"
                  pattern={undefined}
                  value={member.weight}
                  onChange={(event) =>
                    setMember((m) => ({ ...m, weight: formatWeight(event.target.value) }))
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
                                    enterKeyHint="next"
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
                value={workoutNote}
                onChange={(event) => setWorkoutNote(event.target.value)}
                placeholder="Exercise note for this member (optional)"
              />
            </label>
          </article>

          <article className={`paper diet${withDiet ? '' : ' is-off'}`}>
            <header className="diet-head">
              <div>
                <h3 className="chart-title">Diet chart</h3>
                <p className="diet-sub">{diet.length} meals through the day</p>
              </div>
              <label className="diet-switch">
                <input
                  type="checkbox"
                  checked={withDiet}
                  onChange={(event) => setWithDiet(event.target.checked)}
                />
                <span aria-hidden="true" />
                {withDiet ? 'In PDF' : 'Not in PDF'}
              </label>
            </header>
            <ol className="meals">
              {diet.map(([time, foods], i) => {
                if (plan.blank) {
                  return (
                    <li key={i} className="meal meal-edit">
                      <label className="meal-time-edit">
                        <input
                          value={time}
                          onChange={setMeal(i, 'time')}
                          placeholder="8:00 AM"
                          maxLength={16}
                          enterKeyHint="next"
                          aria-label={`Meal ${i + 1} time`}
                        />
                      </label>
                      <p className="meal-label">
                        <small>Meal {i + 1}</small>
                        {time ? mealPeriod(time) : 'Set a time'}
                      </p>
                      <input
                        className="meal-foods-edit"
                        value={foods}
                        onChange={setMeal(i, 'foods')}
                        placeholder="Foods, separated by commas"
                        maxLength={120}
                        enterKeyHint="next"
                        aria-label={`Meal ${i + 1} foods`}
                      />
                      <button
                        type="button"
                        className="meal-remove"
                        onClick={() => removeMeal(i)}
                        aria-label={`Remove meal ${i + 1}`}
                      >
                        ×
                      </button>
                    </li>
                  )
                }
                const [clock, ampm] = time.split(' ')
                return (
                  <li key={time} className="meal">
                    <time className="meal-time">
                      {clock}
                      <small>{ampm}</small>
                    </time>
                    <p className="meal-label">
                      <small>Meal {i + 1}</small>
                      {mealPeriod(time)}
                    </p>
                    <p className="meal-foods">{foods.join(' · ')}</p>
                  </li>
                )
              })}
            </ol>
            {plan.blank && (
              <button type="button" className="add-row" onClick={addMeal}>
                + Add meal
              </button>
            )}
            <label className="paper-note">
              <span>Note</span>
              <textarea
                rows="3"
                maxLength={300}
                value={dietNote}
                onChange={(event) => setDietNote(event.target.value)}
                placeholder="Diet note for this member (optional)"
              />
            </label>
          </article>
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
                  ? `${hasPhone ? `+88 ${member.phone.trim()}` : member.email.trim()} · ${filled} filled`
                  : 'Fill in the sheet first')}
            </p>
          </div>
          <button
            className="btn btn-ghost send-btn send-btn-mail"
            type="button"
            onClick={emailPdf}
            disabled={sending}
            aria-label="Email the PDF"
          >
            <MailIcon />
            <span className="send-btn-label">Email</span>
          </button>
          <button type="button" className="btn send-btn" onClick={sharePdf} aria-label="Send the PDF on WhatsApp">
            <ChatIcon />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </main>
  )
}
