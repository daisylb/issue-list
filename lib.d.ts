declare module "netlify-auth-providers" {
  const NETLIFY_API = "https://api.netlify.com"

  class NetlifyError {
    toString(): string
  }

  const PROVIDERS: {
    github: {
      width: number
      height: number
    }
    gitlab: {
      width: number
      height: number
    }
    bitbucket: {
      width: number
      height: number
    }
    email: {
      width: number
      height: number
    }
  }

  type Options = {
    provider: keyof typeof PROVIDERS
    scope?: string
    login?: boolean
    beta_invite?: string
    invite_code?: string
  }
  type Callback = (
    err: NetlifyError,
    data: { token: string; provider: keyof typeof PROVIDERS }
  ) => void

  class Authenticator {
    constructor(config: { site_id?: string; base_url?: string | null })

    handshakeCallback(options: Options, cb: Callback): (e: any) => void

    authorizeCallback(options: Options, cb: Callback): (e: any) => void

    getSiteID(): string | null

    authenticate(
      options: Options,
      cb: (err: NetlifyError, data: any) => void
    ): void
  }

  export default Authenticator
}
