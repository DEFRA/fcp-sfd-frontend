export const googleAnalyticsConfig = {
  googleAnalytics: {
    googleTagManagerKey: {
      doc: 'Google Tag Manager (GTM) key, also called the container ID for connecting the fcp-sfd-frontend service to Google Analytics',
      format: String,
      default: undefined,
      env: 'GOOGLE_TAG_MANAGER_KEY'
    },
    enabled: {
      doc: 'Check if the GTM key is present and if so enable Google Analytics',
      format: Boolean,
      default: !!process.env.GOOGLE_TAG_MANAGER_KEY
    }
  }
}
