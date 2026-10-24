import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './site.jsx'

// Full-screen photo viewer: arrows / swipe to move, Esc or backdrop tap to close
export default function Lightbox({ photos, index, onClose, onStep }) {
  const photo = photos[index]
  const closeRef = useRef(null)
  const touchX = useRef(null)

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onStep(1)
      if (event.key === 'ArrowLeft') onStep(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [onClose, onStep])

  function onTouchEnd(event) {
    if (touchX.current === null) return
    const dx = event.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1)
  }

  function step(event, dir) {
    event.stopPropagation()
    onStep(dir)
  }

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      <button ref={closeRef} className="lightbox-close" type="button" aria-label="Close" onClick={onClose}>
        <Icon size={22}>
          <path d="M6 6l12 12M18 6L6 18" />
        </Icon>
      </button>

      <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
        <img key={photo.src} src={photo.src} alt={photo.alt} />
        <figcaption>
          <span>{photo.cap}</span>
          <span className="lightbox-count">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>

      <div className="lightbox-nav">
        <button type="button" aria-label="Previous photo" onClick={(event) => step(event, -1)}>
          <Icon size={22}>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </button>
        <button type="button" aria-label="Next photo" onClick={(event) => step(event, 1)}>
          <Icon size={22}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </Icon>
        </button>
      </div>
    </div>,
    document.body,
  )
}
