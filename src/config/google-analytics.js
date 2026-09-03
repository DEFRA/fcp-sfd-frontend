export const googleAnalyticsConfig = {
  googleAnalytics: {
    googleTagManagerKey: {
      doc: 'Google Tag Manager (GTM) key, also called the container ID for connecting the fcp-sfd-frontend service to Google Analytics',
      format: String,
      default: '',
      env: 'GOOGLE_TAG_MANAGER_KEY'
    }
  }
}
