'use client'

import { LandingPage } from '@/components/landing-page'

/**
 * Renders the landing page at `/`.
 *
 * The auto-redirect to `/inicio` was removed so that the "Volver a home"
 * button in the sidebar shows the landing page instead of bouncing back
 * to the dashboard. The redirect is now handled exclusively by the
 * LandingPage itself when the user actively selects a location.
 */
export function PageWrapper() {
  return <LandingPage />
}
