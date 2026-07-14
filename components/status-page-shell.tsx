'use client'

import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { RefreshCw, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

const youtubeEmbedUrl =
  'https://www.youtube-nocookie.com/embed/xpojAT5E640?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1'

type AnimatedLogoProps = {
  size?: 'medium' | 'large'
}

export function AnimatedLogo({ size = 'medium' }: AnimatedLogoProps) {
  const scopeRef = useRef<HTMLDivElement>(null)
  const isLarge = size === 'large'

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const logo = scopeRef.current?.querySelector('[data-status-logo]')
      const rings = scopeRef.current?.querySelectorAll('[data-status-ring]')

      if (!logo || !rings || reducedMotion) return

      const pulse = gsap.timeline({ repeat: -1, yoyo: true })
      pulse.to(logo, {
        opacity: 0.42,
        scale: 0.92,
        duration: 1.35,
        ease: 'sine.inOut',
      })

      gsap.to(rings, {
        rotation: 360,
        duration: 18,
        ease: 'none',
        repeat: -1,
        stagger: 1.8,
      })
    },
    { scope: scopeRef },
  )

  return (
    <div
      ref={scopeRef}
      className={cn(
        'relative flex shrink-0 items-center justify-center',
        isLarge ? 'size-44 sm:size-52' : 'size-32',
      )}
      role="img"
      aria-label="AgroPlan Colombia está cargando"
    >
      <span
        data-status-ring
        className={cn(
          'absolute rounded-full border border-primary/20',
          isLarge ? 'inset-0' : 'inset-1',
        )}
      />
      <span
        data-status-ring
        className={cn(
          'absolute rounded-full border border-accent/25',
          isLarge ? 'inset-4' : 'inset-3',
        )}
      />
      <span
        className={cn(
          'absolute rounded-full bg-primary/10 blur-xl',
          isLarge ? 'size-36 sm:size-44' : 'size-24',
        )}
        aria-hidden="true"
      />
      <div
        data-status-logo
        className={cn(
          'relative z-10 overflow-hidden rounded-[1.6rem] bg-card p-2 shadow-2xl shadow-primary/25 ring-1 ring-primary/20',
          isLarge ? 'size-24 sm:size-28' : 'size-20',
        )}
      >
        <Image
          src="/logo.webp"
          alt="AgroPlan Colombia"
          fill
          sizes={isLarge ? '(max-width: 640px) 96px, 112px' : '80px'}
          className="rounded-[1.2rem] object-cover"
          priority
        />
      </div>
    </div>
  )
}

function StatusAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="status-page-orb status-page-orb-primary absolute -left-32 -top-32 size-96 rounded-full" />
      <div className="status-page-orb status-page-orb-accent absolute -bottom-40 -right-28 size-[30rem] rounded-full" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--border)_35%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_35%,transparent)_1px,transparent_1px)] [background-size:4rem_4rem]" />
    </div>
  )
}

export function StatusPageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main
      className={cn(
        'status-page-shell relative isolate flex min-h-svh overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8',
        className,
      )}
    >
      <StatusAmbient />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-12">
        <section className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <AnimatedLogo />
          {children}
        </section>
        <YoutubeMiniPlayer />
      </div>
    </main>
  )
}

export function LoadingScreen({ title = 'Cargando aplicación...' }: { title?: string }) {
  return (
    <main className="status-page-shell relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-8 text-foreground">
      <StatusAmbient />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <AnimatedLogo size="large" />
        <div className="space-y-2">
          <p className="text-lg font-semibold text-primary">{title}</p>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Preparando tu experiencia agrícola
          </p>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-primary status-page-dot" />
          <span className="size-2 rounded-full bg-accent status-page-dot [animation-delay:150ms]" />
          <span className="size-2 rounded-full bg-primary status-page-dot [animation-delay:300ms]" />
        </div>
      </div>
    </main>
  )
}

function YoutubeMiniPlayer() {
  const [isOnline, setIsOnline] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false)
      setHasLoaded(false)
    }
    const handleOnline = () => {
      setIsOnline(true)
      setHasLoaded(false)
      setHasTimedOut(false)
      setReloadKey((key) => key + 1)
    }

    setIsOnline(navigator.onLine)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) return

    const timeout = window.setTimeout(() => setHasTimedOut(true), 9000)
    return () => window.clearTimeout(timeout)
  }, [isOnline, reloadKey])

  const showFallback = !isOnline || (!hasLoaded && hasTimedOut)

  const retry = () => {
    setHasLoaded(false)
    setHasTimedOut(false)
    setIsOnline(navigator.onLine)
    setReloadKey((key) => key + 1)
  }

  return (
    <aside className="w-full max-w-sm justify-self-center lg:justify-self-end" aria-label="Video de AgroPlan">
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/80 p-3 shadow-2xl shadow-primary/10 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-sm font-semibold">Conoce AgroPlan</p>
            <p className="text-xs text-muted-foreground">Video introductorio</p>
          </div>
          <span className="size-2 rounded-full bg-primary shadow-[0_0_0_5px_color-mix(in_srgb,var(--primary)_12%,transparent)]" aria-hidden="true" />
        </div>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src={isOnline ? youtubeEmbedUrl : undefined}
            title="Video introductorio de AgroPlan Colombia"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              setHasLoaded(true)
              setHasTimedOut(false)
            }}
            className={cn(
              'size-full border-0 transition-opacity duration-300',
              showFallback ? 'opacity-0' : 'opacity-100',
            )}
          />
          {showFallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted px-5 text-center">
              <WifiOff className="size-7 text-muted-foreground" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-medium">El video necesita conexión</p>
                <p className="text-xs text-muted-foreground">
                  La página sigue disponible. Puedes intentarlo nuevamente.
                </p>
              </div>
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Reintentar video
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
