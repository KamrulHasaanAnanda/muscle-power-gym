import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Icon } from './site.jsx'

const INSTALL_DISMISS = 'mp-install-dismissed'
const IOS_DISMISS = 'mp-ios-install-dismissed'

function standalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function iosDevice() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export default function Pwa() {
  const [installEvent, setInstallEvent] = useState(null)
  const [offline, setOffline] = useState(() => !navigator.onLine)
  const [showIos, setShowIos] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      const hour = 60 * 60 * 1000
      setInterval(() => registration.update(), hour)
    },
  })

  useEffect(() => {
    document.body.classList.toggle('is-standalone', standalone())

    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const onPrompt = (event) => {
      event.preventDefault()
      if (sessionStorage.getItem(INSTALL_DISMISS) || standalone()) return
      setInstallEvent(event)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    const onInstalled = () => {
      setInstallEvent(null)
      setShowIos(false)
      document.body.classList.add('is-standalone')
    }
    window.addEventListener('appinstalled', onInstalled)

    if (!standalone() && iosDevice() && !sessionStorage.getItem(IOS_DISMISS)) {
      setShowIos(true)
    }

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function install() {
    if (!installEvent) return
    installEvent.prompt()
    const choice = await installEvent.userChoice
    setInstallEvent(null)
    if (choice.outcome !== 'accepted') sessionStorage.setItem(INSTALL_DISMISS, '1')
  }

  function dismissInstall() {
    sessionStorage.setItem(INSTALL_DISMISS, '1')
    setInstallEvent(null)
  }

  function dismissIos() {
    sessionStorage.setItem(IOS_DISMISS, '1')
    setShowIos(false)
  }

  const card = needRefresh
    ? {
        title: 'Update ready',
        text: 'A newer version of the gym app is available.',
        action: 'Refresh',
        onAction: () => updateServiceWorker(true),
        onClose: () => setNeedRefresh(false),
      }
    : installEvent
      ? {
          title: 'Install Muscle Power',
          text: 'Add the gym to your home screen for hours, plans, and rules.',
          action: 'Install',
          onAction: install,
          onClose: dismissInstall,
        }
      : showIos
        ? {
            title: 'Add to Home Screen',
            text: (
              <>
                Tap <ShareIcon /> Share, then <strong>Add to Home Screen</strong>.
              </>
            ),
            onClose: dismissIos,
          }
        : null

  if (!card && !offline) return null

  return (
    <div className="pwa-stack">
      {offline && (
        <p className="pwa-offline" role="status">
          You’re offline. Hours, rules, and plans are still here.
        </p>
      )}
      {card && (
        <aside className="pwa-card" aria-label={card.title}>
          <div className="pwa-card-copy">
            <strong>{card.title}</strong>
            <span>{card.text}</span>
          </div>
          <div className="pwa-card-actions">
            {card.action && (
              <button className="btn btn-sm" type="button" onClick={card.onAction}>
                {card.action}
              </button>
            )}
            <button
              className="pwa-close"
              type="button"
              aria-label="Dismiss"
              onClick={card.onClose}
            >
              <Icon size={18}>
                <path d="M6 6l12 12M18 6 6 18" />
              </Icon>
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}

function ShareIcon() {
  return (
    <svg
      className="pwa-share"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4M8 7l4-4 4 4" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  )
}
