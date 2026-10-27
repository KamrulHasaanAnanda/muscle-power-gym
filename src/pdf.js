import { ADDRESS, PHONE, PHONE_2 } from './site.jsx'

// A4 in millimetres, laid out to match the gym's printed sheets
const W = 210
const H = 297
const GREEN = [29, 122, 58]
const RED = [190, 22, 30]
const NAVY = [31, 42, 94]
const INK = [25, 22, 20]
const GREY = [110, 104, 96]

function header(doc, images) {
  // Logo in a ring, top left
  doc.setDrawColor(...RED)
  doc.setLineWidth(0.8)
  doc.circle(28, 27, 16, 'S')
  doc.setDrawColor(230, 180, 40)
  doc.setLineWidth(0.4)
  doc.circle(28, 27, 17.2, 'S')
  doc.addImage(images.badge, 'PNG', 18.5, 15, 19, 24.1, 'badge', 'FAST')

  // MUSCLE POWER GYM, right aligned
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  const words = [
    ['MUSCLE ', GREEN],
    ['POWER ', RED],
    ['GYM', NAVY],
  ]
  const total = words.reduce((w, [t]) => w + doc.getTextWidth(t), 0)
  let x = W - 12 - total
  words.forEach(([text, color]) => {
    doc.setTextColor(...color)
    doc.text(text, x, 24)
    x += doc.getTextWidth(text)
  })

  doc.setFontSize(11)
  doc.setTextColor(...NAVY)
  doc.text('A COMPLETE MULTI INSTRUMENTAL GYM', W - 12, 30.5, { align: 'right' })

  // "Gents & Ladies" pill
  const pillX = 92
  doc.setFillColor(...GREEN)
  doc.roundedRect(pillX, 33, 42, 7.5, 3.75, 3.75, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.text('Gents & Ladies', pillX + 21, 38.3, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(...INK)
  doc.text(ADDRESS, W - 12, 45.5, { align: 'right' })

  doc.setDrawColor(...INK)
  doc.setLineWidth(0.35)
  doc.line(12, 48.5, W - 12, 48.5)
}

function memberLine(doc, fields) {
  let x = 14
  fields.forEach(([label, value, width]) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...GREY)
    doc.text(`${label} :`, x, 56)
    const lx = x + doc.getTextWidth(`${label} : `)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(...INK)
    doc.text(fitText(doc, value || '', width - (lx - x) - 2), lx, 56)
    x += width
  })
}

function watermark(doc, images) {
  doc.saveGraphicsState()
  doc.setGState(new doc.GState({ opacity: 0.07 }))
  doc.addImage(images.mark, 'PNG', 45, 85, 120, 120, 'mark', 'FAST')
  doc.restoreGraphicsState()
}

function footer(doc) {
  doc.setFillColor(150, 18, 24)
  doc.rect(0, H - 11, W / 2, 11, 'F')
  doc.setFillColor(...NAVY)
  doc.rect(W / 2, H - 11, W / 2, 11, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(255, 255, 255)
  doc.text(`Call: ${PHONE}, ${PHONE_2}`, W / 4, H - 4.2, { align: 'center' })
  doc.text('Facebook: Muscle Power Gym Chittagong', (W * 3) / 4, H - 4.2, { align: 'center' })
}

// Shrink a line until it fits, then truncate as a last resort
function fitText(doc, text, maxWidth, minSize = 8) {
  let size = doc.getFontSize()
  while (doc.getTextWidth(text) > maxWidth && size > minSize) {
    size -= 0.5
    doc.setFontSize(size)
  }
  if (doc.getTextWidth(text) <= maxWidth) return text
  let cut = text
  while (cut.length > 1 && doc.getTextWidth(`${cut}…`) > maxWidth) cut = cut.slice(0, -1)
  return `${cut}…`
}

function box(doc, x, y, w, h, value) {
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.3)
  doc.rect(x, y, w, h, 'S')
  if (value) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(...RED)
    doc.text(fitText(doc, String(value), w - 1.5), x + w / 2, y + h / 2 + 1.4, { align: 'center' })
  }
}

// Rows: { name, boxes: [value, ...] } or { gap: true }
function column(doc, x, width, title, labels, rows, top, rowH) {
  const boxW = labels.length === 1 ? 24 : 12
  const boxesW = labels.length * boxW + (labels.length - 1) * 2.5
  const nameW = width - boxesW - 3

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12.5)
  doc.setTextColor(...INK)
  doc.text(title, x, top)
  labels.forEach((label, i) => {
    const bx = x + nameW + 3 + i * (boxW + 2.5)
    doc.text(label, bx + boxW / 2, top, { align: 'center' })
  })

  let y = top + 3
  rows.forEach((row) => {
    if (row.gap) {
      y += rowH * 0.45
      return
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10.5)
    doc.setTextColor(...INK)
    doc.text(fitText(doc, `* ${row.name}`, nameW), x + 1, y + rowH * 0.62)
    row.boxes.forEach((value, i) => {
      const bx = x + nameW + 3 + i * (boxW + 2.5)
      box(doc, bx, y + 0.8, boxW, rowH - 1.6, value)
    })
    y += rowH
  })
  return y
}

function noteBlock(doc, x, y, width, lines) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...INK)
  doc.text('Note :', x, y)
  let ny = y + 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  lines.forEach((line) => {
    doc.splitTextToSize(line, width).forEach((part) => {
      if (ny < H - 16) doc.text(part, x + 1, ny)
      ny += 4.8
    })
  })
}

function workoutRows(block, b, values, extras) {
  const rows = []
  if (block.groups) {
    block.groups.forEach((group, g) => {
      if (g > 0) rows.push({ gap: true })
      group.forEach((move, m) => {
        rows.push({ name: move, boxes: [values[`${b}-${g}-${m}`]?.rep || ''] })
      })
    })
    ;(extras[b] || [])
      .filter((row) => row.name.trim())
      .forEach((row) => {
        rows.push({ gap: true })
        rows.push({
          name: row.name.trim(),
          boxes: [[row.rep && `${row.rep}r`, row.set && `${row.set}s`].filter(Boolean).join(' × ')],
        })
      })
  } else {
    block.items.forEach((move, i) => {
      const v = values[`${b}-${i}`] || {}
      rows.push({ name: move, boxes: [v.rep || '', v.set || ''] })
    })
    ;(extras[b] || [])
      .filter((row) => row.name.trim())
      .forEach((row) => rows.push({ name: row.name.trim(), boxes: [row.rep, row.set] }))
  }
  return rows
}

export function makePlanPdf(JsPDF, images, { plan, member, values, extras, workoutNote, dietNote, withDiet, date }) {
  const doc = new JsPDF({ unit: 'mm', format: 'a4' })
  doc.setProperties({ title: `${plan.title} plan · ${member.name}` })

  // Page 1: workout sheet
  watermark(doc, images)
  header(doc, images)
  memberLine(doc, [
    ['Member Name', member.name, 104],
    ['Member No', member.no, 46],
    ['Date', date, 38],
  ])

  const columns = plan.workouts.map((block, b) => ({
    title: block.groups ? 'Exercise Name' : 'Exercise Name',
    labels: block.groups ? ['Reps / Time'] : ['Rep', 'Set'],
    rows: workoutRows(block, b, values, extras),
  }))
  const units = Math.max(
    ...columns.map((c) => c.rows.reduce((n, r) => n + (r.gap ? 0.45 : 1), 0)),
  )
  const top = 67
  const rowH = Math.min(9, (H - 34 - top) / units)

  const ends = columns.map((c, i) =>
    column(doc, i === 0 ? 14 : 110, 86, c.title, c.labels, c.rows, top, rowH),
  )

  const noteLines = [...plan.notes]
  if (workoutNote.trim()) noteLines.push(workoutNote.trim())
  const shorter = ends[0] <= (ends[1] ?? Infinity) ? 0 : 1
  noteBlock(doc, shorter === 0 ? 14 : 110, Math.max(ends[shorter] + 8, top + 20), 84, noteLines)
  footer(doc)

  // Page 2: diet sheet
  if (withDiet) {
    doc.addPage()
    watermark(doc, images)
    header(doc, images)
    memberLine(doc, [
      ['Member Name', member.name, 78],
      ['Member No', member.no, 40],
      ['Weight', member.weight && `${member.weight} kg`, 36],
      ['Date', date, 34],
    ])

    let y = 70
    plan.diet.forEach(([time, foods], i) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13.5)
      doc.setTextColor(...NAVY)
      doc.text(`Meal-${i + 1} : ${time}`, 16, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(14)
      doc.setTextColor(...INK)
      const lines = doc.splitTextToSize(foods.join(' + '), W - 34)
      doc.text(lines, 16, y + 8)
      y += 8 + lines.length * 6.5 + 8
    })
    noteBlock(doc, 16, y + 2, W - 34, dietNote.trim() ? [dietNote.trim()] : [])
    footer(doc)
  }

  return doc
}

export function formatDate(value) {
  if (!value) return ''
  return new Date(`${value}T00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function toDataURL(src) {
  return fetch(src)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        }),
    )
}

// jsPDF plus the two logos, fetched once and reused
let kit = null
export function loadPdfKit() {
  kit ||= Promise.all([
    import('jspdf'),
    toDataURL('/images/logo-badge.png'),
    toDataURL('/images/logo-mark.png'),
  ]).then(([mod, badge, mark]) => ({ JsPDF: mod.jsPDF, images: { badge, mark } }))
  return kit
}

export function planFileName(name, id) {
  const slug = name.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
  return `Muscle-Power-${slug || 'member'}-${id}.pdf`
}
