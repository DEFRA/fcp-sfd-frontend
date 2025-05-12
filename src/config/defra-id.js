export const defraIdConfig = {
  defraId: {
    wellKnownUrl: {
      doc: 'The Defra Identity well known URL.',
      format: String,
      nullable: true,
      default: null,
      env: 'DEFRA_ID_WELL_KNOWN_URL'
    },
    clientId: {
      doc: 'The Defra Identity client ID.',
      format: String,
      nullable: true,
      default: null,
      env: 'DEFRA_ID_CLIENT_ID'
    },
    clientSecret: {
      doc: 'The Defra Identity client secret.',
      format: String,
      nullable: true,
      default: null,
      env: 'DEFRA_ID_CLIENT_SECRET'
    },
    serviceId: {
      doc: 'The Defra Identity service ID.',
      format: String,
      nullable: true,
      default: null,
      env: 'DEFRA_ID_SERVICE_ID'
    },
    policy: {
      doc: 'The Defra Identity policy.',
      format: String,
      nullable: true,
      default: null,
      env: 'DEFRA_ID_POLICY'
    },
    redirectUrl: {
      doc: 'The Defra Identity redirect URl.',
      format: String,
      nullable: true,
      default: null,
      env: 'DEFRA_ID_REDIRECT_URL'
    },
    signOutRedirectUrl: {
      doc: 'The Defra Identity sign out redirect URl.',
      format: String,
      nullable: true,
      default: null,
      env: 'DEFRA_ID_SIGN_OUT_REDIRECT_URL'
    },
    refreshTokens: {
      doc: 'True if Defra Identity refresh tokens are enabled.',
      format: Boolean,
      default: true,
      env: 'DEFRA_ID_REFRESH_TOKENS'
    }
  }
}
