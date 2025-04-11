export interface XpressAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
}

export interface ApplicationConfig {
  apiURL: string;
}

declare global {
  interface Window {
    _XPRESS_ADMIN_PRO_APP_CONF_: XpressAdminProAppConfigRaw;
  }
}
