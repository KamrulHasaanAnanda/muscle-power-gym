function header(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim()
}

function utf8B64(text) {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

function encodedHeader(text) {
  const safe = header(text)
  if (/^[\x20-\x7E]*$/.test(safe)) return safe
  return `=?utf-8?B?${utf8B64(safe)}?=`
}

function wrap76(value) {
  return value.replace(/.{1,76}/g, '$&\r\n').trim()
}

export async function downloadMailDraft({ to, subject, body, file }) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const boundary = `mp_${crypto.randomUUID().replace(/-/g, '')}`
  const filename = header(file.name || 'plan.pdf')
  const eml = [
    `To: ${header(to)}`,
    `Subject: ${encodedHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="utf-8"',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(utf8B64(body)),
    `--${boundary}`,
    `Content-Type: application/pdf; name="${filename}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${filename}"`,
    '',
    wrap76(utf8B64(bytes)),
    `--${boundary}--`,
    '',
  ].join('\r\n')

  const blob = new Blob([eml], { type: 'message/rfc822' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.replace(/\.pdf$/i, '.eml')
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 15000)
}
