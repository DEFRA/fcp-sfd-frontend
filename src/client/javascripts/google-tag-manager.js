const consentDefaults = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
}

let loaded = false

// Loads Google Tag Manager mid-session so analytics starts without a page refresh
export const loadGoogleTagManager = (containerId) => {
  if (loaded || !containerId) {
    return
  }

  loaded = true

  window.dataLayer = window.dataLayer || []

  function gtag () {
    window.dataLayer.push(arguments)
  }

  gtag('consent', 'default', consentDefaults)
  gtag('consent', 'update', { analytics_storage: 'granted' })

  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')

  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`

  document.head.appendChild(script)
}
