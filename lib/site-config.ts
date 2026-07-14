const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://agroplan.tefasalcedo.com'

export const siteUrl = configuredSiteUrl.replace(/\/+$/, '')
export const siteOrigin = new URL(siteUrl)
export const socialImagePath = '/ai%20images/portada%20Agroplan.webp'
