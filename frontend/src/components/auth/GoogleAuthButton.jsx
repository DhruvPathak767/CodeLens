import { useEffect, useId, useRef, useState } from 'react'

const GOOGLE_SCRIPT_ID = 'google-identity-services'
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '383284326845-5el14ver96c6je4itjd66kjq8f8v0r53.apps.googleusercontent.com'

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export function GoogleAuthButton({ onCredential, disabled = false }) {
  const buttonId = useId().replace(/:/g, '')
  const buttonRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function renderGoogleButton() {
      if (!GOOGLE_CLIENT_ID) {
        setError('Google sign-in is not configured for this deployment.')
        return
      }

      try {
        await loadGoogleScript()
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return
        }

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              onCredential(response.credential)
            }
          },
          auto_select: false,
          ux_mode: 'popup',
        })

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: 280,
          text: 'continue_with',
          shape: 'rectangular',
        })
      } catch {
        if (!cancelled) {
          setError('Google sign-in could not be loaded.')
        }
      }
    }

    renderGoogleButton()

    return () => {
      cancelled = true
    }
  }, [onCredential, buttonId])

  if (error) {
    return (
      <div className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground">
        {error}
      </div>
    )
  }

  return (
    <div
      ref={buttonRef}
      id={`google-auth-${buttonId}`}
      aria-disabled={disabled}
      className={disabled ? 'pointer-events-none opacity-60' : ''}
    />
  )
}
