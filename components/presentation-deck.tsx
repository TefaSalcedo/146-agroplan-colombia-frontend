"use client"

import Image from "next/image"
import Link from "next/link"
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { RepositoryHubButton } from "@/components/repository-hub-button"
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Database,
  Expand,
  ExternalLink,
  Leaf,
  MapPinned,
  Network,
  Sprout,
  Users,
} from "lucide-react"

type Slide = {
  label: string
  title: string
  source?: string
  sourceUrl?: string
}

const slides: Slide[] = [
  {
    label: "",
    title: "El campo no necesita más datos aislados. Necesita mejores decisiones.",
  },
  {
    label: "El reto",
    title: "Cuando el clima cambia, sembrar con una receta fija cuesta caro.",
  },
  {
    label: "La oportunidad",
    title: "Cada municipio tiene una historia agrícola distinta.",
  },
  {
    label: "La solución",
    title: "AgroPlan convierte señales del territorio en decisiones accionables.",
  },
  {
    label: "Lo que nos hace diferentes",
    title: "La ventaja está en conectar lo que ya existe.",
    source: "Referencia: Datos Abiertos Colombia · datos.gov.co",
    sourceUrl: "https://www.datos.gov.co/",
  },
  {
    label: "Tracción",
    title: "Ya está construido. Ya puede usarse.",
  },
  {
    label: "Impacto",
    title: "Incluso donde faltan antecedentes, el territorio puede orientar la decisión.",
  },
  {
    label: "El equipo",
    title: "Queremos llevar esta decisión informada a más comunidades rurales.",
  },
]

const crops = ["Aguacate", "Algodón", "Caña panelera", "Cebolla", "Fresa", "Piña", "Soya"]

function Source({ slide }: { slide: Slide }) {
  if (!slide.source) return null

  return (
    <a
      href={slide.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="absolute bottom-4 left-6 inline-flex w-fit max-w-[calc(100%-3rem)] items-center gap-1.5 text-[10px] leading-4 text-muted-foreground transition-colors hover:text-primary md:bottom-6 md:left-10"
    >
      <ExternalLink className="size-3 shrink-0" />
      {slide.source}
    </a>
  )
}

function SlideLabel({ children }: { children: string }) {
  return (
    <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary md:text-sm">
      <span className="size-2 rounded-full bg-accent" />
      {children}
    </p>
  )
}

function CoverVisual() {
  const ruralRef = useRef<HTMLDivElement>(null)
  const urbanRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const rural = ruralRef.current
    const urban = urbanRef.current
    if (!rural || !urban) return

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      gsap.set(rural, { opacity: 1 })
      gsap.set(urban, { opacity: reducedMotion ? 1 : 0 })

      if (reducedMotion) return

      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
      timeline
        .to(rural, { opacity: 0, duration: 1.3, ease: "power2.inOut", delay: 1.8 })
        .to(urban, { opacity: 1, duration: 1.3, ease: "power2.inOut" }, "<")
        .to(urban, { opacity: 0, duration: 1.3, ease: "power2.inOut", delay: 1.8 })
        .to(rural, { opacity: 1, duration: 1.3, ease: "power2.inOut" }, "<")
    })

    return () => context.revert()
  }, [])

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
      <div ref={ruralRef} className="absolute inset-0">
        <Image src="/ai images/Image-rural.webp" alt="Paisaje rural colombiano" fill className="object-cover" priority />
      </div>
      <div ref={urbanRef} className="absolute inset-0">
        <Image src="/ai images/Image-urban.webp" alt="Paisaje urbano colombiano" fill className="object-cover" priority />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/5 to-transparent" />
      <div className="absolute bottom-7 left-7 right-7">
        <p className="text-sm font-semibold text-primary-foreground">Del territorio a la decisión.</p>
        <div className="mt-3 h-1 w-20 rounded-full bg-accent" />
      </div>
    </div>
  )
}

function ClimateCards() {
  const firstCardRef = useRef<HTMLDivElement>(null)
  const secondCardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const firstCard = firstCardRef.current
    const secondCard = secondCardRef.current
    if (!firstCard || !secondCard) return

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const cards = [firstCard, secondCard]

      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, x: 0, y: 0, rotation: 0 })
        return
      }

      gsap.set(firstCard, { opacity: 0, x: 35, y: -90, rotation: -6 })
      gsap.set(secondCard, { opacity: 0, x: 100, y: -120, rotation: 8 })

      gsap
        .timeline()
        .to(firstCard, { opacity: 1, x: 0, y: 0, rotation: -5, duration: 0.85, delay: 0.5, ease: "back.out(1.4)" })
        .to(secondCard, { opacity: 1, x: 45, y: 28, rotation: 6, duration: 0.85, ease: "back.out(1.3)" }, "+=0.15")
    })

    return () => context.revert()
  }, [])

  return (
    <div className="relative mx-auto h-[min(60vw,30rem)] w-full max-w-lg">
      <div
        ref={firstCardRef}
        className="absolute left-4 top-5 w-[min(78%,22rem)] rounded-[1.75rem] border border-border bg-card p-5 shadow-2xl shadow-primary/10 md:left-10 md:p-7"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <Image src="/slides-img/child1.jpeg" alt="Mapa y efectos del Fenómeno de El Niño en Colombia" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <a
            href="https://www.noticiascaracol.com/colombia/super-fenomeno-de-el-nino-y-sus-graves-efectos-en-colombia-en-caso-de-un-eventual-desarrollo-esto-advierten-expertos-rg10"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2 left-3 z-10 text-[9px] font-medium text-white underline decoration-white/60 underline-offset-2"
          >
            Fuente: Noticias Caracol
          </a>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-primary">El Niño · riesgo climático</p>
        <p className="mt-2 text-lg font-semibold">Una señal climática cambia la decisión.</p>
      </div>
      <div
        ref={secondCardRef}
        className="absolute right-1 top-24 w-[min(74%,21rem)] rounded-[1.75rem] border border-border bg-card p-5 shadow-2xl shadow-primary/10 md:right-4 md:p-7"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <Image src="/slides-img/child2.webp" alt="Paisaje afectado por sequía y degradación del suelo" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <a
            href="https://www.valoraanalitik.com/fenomeno-el-nino-10-billones-colombia-costo/"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2 left-3 right-3 z-10 text-[9px] font-medium leading-3 text-white underline decoration-white/60 underline-offset-2"
          >
            Imagen: Ministerio de Ambiente / ANLA · Valora Analitik
          </a>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">Territorio · impacto visible</p>
        <p className="mt-2 text-lg font-semibold">El contexto local completa la lectura.</p>
      </div>
    </div>
  )
}

function AnimatedMetric({
  value,
  label,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number
  label: string
  decimals?: number
  prefix?: string
  suffix?: string
}) {
  const valueRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const element = valueRef.current
    if (!element) return

    const formatValue = (currentValue: number) => {
      if (decimals > 0) return currentValue.toFixed(decimals).replace(".", ",")
      return Math.round(currentValue).toLocaleString("es-CO")
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const counter = { value: 0 }

    if (reducedMotion) {
      element.textContent = formatValue(value)
      return
    }

    const animation = gsap.to(counter, {
      value,
      duration: 1.5,
      delay: 0.2,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = formatValue(counter.value)
      },
    })

    return () => {
      animation.kill()
    }
  }, [decimals, value])

  return (
    <div className="border-l-2 border-accent pl-4">
      <p className="text-4xl font-bold tracking-tight text-primary md:text-6xl">
        {prefix}
        <span ref={valueRef}>0</span>
        {suffix}
      </p>
      <p className="mt-1 max-w-36 text-sm leading-5 text-muted-foreground">{label}</p>
    </div>
  )
}

function InsightCard({
  icon: Icon,
  value,
  label,
  detail,
  source,
  sourceUrl,
  prefix,
  suffix,
  decimals,
}: {
  icon: typeof CloudSun
  value: number
  label: string
  detail: string
  source: string
  sourceUrl: string
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  return (
    <article data-insight-card className="presentation-insight rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <Icon className="size-8 text-primary" />
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-primary md:text-4xl">
        {prefix}
        <AnimatedMetricNumber value={value} decimals={decimals} suffix={suffix} />
      </p>
      <p className="mt-2 font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">{detail}</p>
      <a href={sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-[10px] leading-4 text-muted-foreground hover:text-primary">
        {source}
      </a>
    </article>
  )
}

function AnimatedMetricNumber({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number
  decimals?: number
  suffix?: string
}) {
  const valueRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const element = valueRef.current
    if (!element) return

    const formatValue = (currentValue: number) => {
      if (decimals > 0) return currentValue.toFixed(decimals).replace(".", ",")
      return Math.round(currentValue).toLocaleString("es-CO")
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const counter = { value: 0 }

    if (reducedMotion) {
      element.textContent = formatValue(value)
      return
    }

    const animation = gsap.to(counter, {
      value,
      duration: 1.35,
      delay: 0.25,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = formatValue(counter.value)
      },
    })

    return () => {
      animation.kill()
    }
  }, [decimals, value])

  return (
    <>
      <span ref={valueRef}>0</span>
      {suffix}
    </>
  )
}

function InsightGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const context = gsap.context(() => {
      const cards = grid.querySelectorAll<HTMLElement>("[data-insight-card]")
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.18, ease: "power3.out" },
      )
    }, grid)

    return () => context.revert()
  }, [])

  return (
    <div ref={gridRef} className={className}>
      {children}
    </div>
  )
}

function IntegrationFlow() {
  const flowRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const flow = flowRef.current
    if (!flow) return

    const context = gsap.context(() => {
      const nodes = flow.querySelectorAll<HTMLElement>("[data-flow-node]")
      const arrows = flow.querySelectorAll<SVGElement>("[data-flow-arrow]")
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reducedMotion) {
        gsap.set(nodes, { opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.fromTo(
        nodes,
        { opacity: 0, y: 24, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.18, ease: "back.out(1.25)" },
      )
      gsap.to(arrows, {
        opacity: 0.35,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
        ease: "sine.inOut",
      })
    }, flow)

    return () => context.revert()
  }, [])

  return (
    <div ref={flowRef} className="relative grid gap-4 sm:grid-cols-3">
      {[
        { icon: Database, label: "Datos abiertos", caption: "Información pública que se puede reutilizar" },
        { icon: Network, label: "MCP", caption: "Una forma ágil de integrar nuevas fuentes" },
        { icon: BrainCircuit, label: "AgroPlan", caption: "Contexto convertido en decisión" },
      ].map(({ icon: Icon, label, caption }, position) => (
        <div key={label} data-flow-node className="relative rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
          {position < 2 && <ArrowRight data-flow-arrow className="absolute -right-7 top-1/2 z-10 hidden size-8 -translate-y-1/2 text-primary md:block" />}
          <Icon className="mx-auto size-10 text-primary" />
          <p className="mt-5 font-semibold">{label}</p>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">{caption}</p>
        </div>
      ))}
    </div>
  )
}

const recommendationChartData = [
  { name: "Aguacate", value: 60, image: "/crops/aguacate.png", color: "#e7bd4a" },
  { name: "Cebolla", value: 20, image: "/crops/cebolla.png", color: "#ef9950" },
  { name: "Fresa", value: 20, image: "/crops/fresa.png", color: "#ef9950" },
]

function RecommendationChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const ringsRef = useRef<(SVGCircleElement | null)[]>([])
  const circumference = 2 * Math.PI * 42

  useLayoutEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const context = gsap.context(() => {
      const rings = ringsRef.current.filter((ring): ring is SVGCircleElement => ring !== null)
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const targetOffsets = recommendationChartData.map(({ value }) => circumference * (1 - value / 100))

      if (reducedMotion) {
        rings.forEach((ring, index) => {
          ring.style.strokeDashoffset = String(targetOffsets[index])
        })
        return
      }

      gsap.fromTo(
        rings,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: (index) => targetOffsets[index],
          duration: 1.2,
          delay: 0.35,
          stagger: 0.22,
          ease: "power2.out",
        },
      )
    }, chart)

    return () => context.revert()
  }, [circumference])

  return (
    <div ref={chartRef} className="presentation-recommendation-chart rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8" aria-label="Ejemplo de cultivos recomendados por probabilidad">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Ejemplo de salida</p>
          <p className="mt-2 text-xl font-semibold">Cultivos recomendados</p>
        </div>
        <Sprout className="size-9 text-primary" />
      </div>
      <svg viewBox="0 0 320 190" className="mt-5 h-[clamp(15rem,38vh,24rem)] w-full" role="img" aria-label="Probabilidad de recomendación para aguacate, cebolla y fresa">
        <defs>
          {recommendationChartData.map(({ name }) => (
            <clipPath key={name} id={`crop-${name.toLowerCase()}`}>
              <circle cx="0" cy="0" r="26" />
            </clipPath>
          ))}
        </defs>
        {recommendationChartData.map(({ name, value, image, color }, index) => {
          const cx = 55 + index * 105
          return (
            <g key={name} transform={`translate(${cx} 72)`}>
              <circle r="42" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="9" />
              <circle
                ref={(element) => {
                  ringsRef.current[index] = element
                }}
                r="42"
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                transform="rotate(-90)"
              />
              <image href={image} x="-26" y="-26" width="52" height="52" preserveAspectRatio="xMidYMid slice" clipPath={`url(#crop-${name.toLowerCase()})`} />
              <text y="76" textAnchor="middle" className="fill-foreground text-[15px] font-bold">
                {value}%
              </text>
              <text y="94" textAnchor="middle" className="fill-muted-foreground text-[11px]">
                {name}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="text-xs leading-5 text-muted-foreground">La plataforma traduce clima, suelo y contexto en una recomendación que se puede explicar.</p>
    </div>
  )
}

function CropCalendar() {
  const calendarRef = useRef<HTMLDivElement>(null)
  const months = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
  const rows = [
    { name: "Aguacate", image: "/crops/aguacate.png", cells: ["", "", "", "ideal", "ideal", "", "", "", "possible", "", "", ""] },
    { name: "Cebolla", image: "/crops/cebolla.png", cells: ["", "", "ideal", "ideal", "", "harvest", "harvest", "", "possible", "", "", "possible"] },
    { name: "Fresa", image: "/crops/fresa.png", cells: ["", "", "possible", "possible", "", "", "", "", "possible", "possible", "", ""] },
  ]

  useLayoutEffect(() => {
    const calendar = calendarRef.current
    if (!calendar) return

    const context = gsap.context(() => {
      const cells = calendar.querySelectorAll<HTMLElement>("[data-calendar-cell]")
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reducedMotion) {
        gsap.set(cells, { opacity: 1, scale: 1 })
        return
      }

      gsap.fromTo(
        cells,
        { opacity: 0, scale: 0.35 },
        { opacity: 1, scale: 1, duration: 0.35, delay: 0.4, stagger: 0.025, ease: "back.out(1.5)" },
      )
    }, calendar)

    return () => context.revert()
  }, [])

  return (
    <div ref={calendarRef} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Calendario</p>
          <p className="mt-2 font-semibold">Siembra y cosecha</p>
        </div>
        <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">Ejemplo</span>
      </div>
      <div className="mt-5 grid grid-cols-[4.8rem_repeat(12,minmax(0,1fr))] items-center gap-y-3 text-[10px]">
        <span />
        {months.map((month, index) => <span key={`${month}-${index}`} className="text-center font-semibold text-muted-foreground">{month}</span>)}
        {rows.map((row) => (
          <div key={row.name} className="contents">
            <div className="flex items-center gap-1.5">
              <Image src={row.image} alt="" width={22} height={22} className="size-5 rounded-full object-cover" />
              <span className="truncate font-semibold">{row.name}</span>
            </div>
            {row.cells.map((status, index) => (
              <span
                key={`${row.name}-${index}`}
                data-calendar-cell
                className={`mx-auto size-4 rounded-full border border-dashed border-border ${status === "ideal" ? "border-transparent bg-emerald-600" : status === "possible" ? "border-transparent bg-emerald-200" : status === "harvest" ? "border-transparent bg-orange-500" : "bg-transparent"}`}
                title={status ? `${row.name}: ${status}` : undefined}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><i className="size-2 rounded-full bg-emerald-600" />Siembra ideal</span>
        <span className="inline-flex items-center gap-1"><i className="size-2 rounded-full bg-emerald-200" />Posible</span>
        <span className="inline-flex items-center gap-1"><i className="size-2 rounded-full bg-orange-500" />Cosecha</span>
      </div>
    </div>
  )
}

function PresentationSlide({ index }: { index: number }) {
  const slide = slides[index]

  return (
    <article className="presentation-slide relative flex min-h-0 flex-1 overflow-hidden px-6 pb-8 pt-9 md:px-16 md:pb-8 md:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_10%,color-mix(in_oklab,var(--primary)_13%,transparent),transparent_30%),radial-gradient(circle_at_10%_90%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_27%)]" />

      {index === 0 && (
        <div className="grid w-full flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Image src="/logo.webp" alt="AgroPlan Colombia" width={72} height={72} className="mb-7 size-16 rounded-2xl object-cover shadow-lg shadow-primary/20 md:size-[4.5rem]" priority />
            <h1 className="max-w-3xl text-balance text-5xl font-bold tracking-tight md:text-7xl">{slide.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-2xl md:leading-10">
              Inteligencia para planear mejor la agricultura colombiana, desde el municipio hasta la parcela.
            </p>
            <div className="mt-9 flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-px w-10 bg-primary" />
              AgroPlan Colombia
            </div>
          </div>
          <CoverVisual />
        </div>
      )}

      {index === 1 && (
        <div className="grid w-full flex-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SlideLabel>{slide.label}</SlideLabel>
            <h2 className="max-w-2xl text-balance text-4xl font-bold tracking-tight md:text-6xl">{slide.title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
              Sequías, lluvias intensas y cambios de temperatura no respetan calendarios fijos. La decisión necesita leer el momento y el lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Clima", "Suelo", "Territorio"].map((item) => (
                <span key={item} className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                  {item}
                </span>
              ))}
            </div>
            <InsightGrid className="mt-7 grid gap-3 sm:grid-cols-2">
              <InsightCard
                icon={CloudSun}
                value={1.93}
                decimals={2}
                prefix="COP $"
                suffix=" B"
                label="Pérdidas agropecuarias proyectadas"
                detail="Impacto estimado del Fenómeno de El Niño 2026."
                source="CCS · proyección 2026"
                sourceUrl="https://www.valoraanalitik.com/fenomeno-el-nino-10-billones-colombia-costo/"
              />
              <InsightCard
                icon={BarChart3}
                value={15}
                suffix="%"
                label="Incremento anual reportado"
                detail="Pérdidas agrícolas con aumento reportado del 15% anual desde 2015. Objetivo: revertir la tendencia."
                source="IDEAM 2020 · cita secundaria UNAD"
                sourceUrl="https://repository.unad.edu.co/bitstream/handle/10596/67129/cvurreau.pdf"
              />
            </InsightGrid>
          </div>
          <ClimateCards />
        </div>
      )}

      {index === 2 && (
        <div className="flex w-full flex-1 flex-col justify-center">
          <SlideLabel>{slide.label}</SlideLabel>
          <h2 className="max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl">{slide.title}</h2>
          <InsightGrid className="mt-10 grid gap-5 md:grid-cols-3">
            <InsightCard
              icon={BarChart3}
              value={9.3}
              decimals={1}
              suffix="%"
              label="Participación del agro en el PIB"
              detail="El sector agropecuario representó el 9,3% del PIB nacional en 2024."
              source="DANE · PIB 2024"
              sourceUrl="https://www.dane.gov.co/files/operaciones/PIB/cp-PIB-IVtrim2024.pdf"
            />
            <InsightCard
              icon={Users}
              value={2.7}
              decimals={1}
              suffix=" M"
              label="Productores agrícolas"
              detail="Cifra oficial del 3er Censo Nacional Agropecuario."
              source="DANE · CNA 2014"
              sourceUrl="https://www.dane.gov.co/files/CensoAgropecuario/entrega-definitiva/Boletin-2-Productores-residentes/2-Boletin.pdf"
            />
            <InsightCard
              icon={Sprout}
              value={2.6}
              decimals={1}
              prefix="USD "
              suffix=" B"
              label="Mercado AgTech latinoamericano"
              detail="Crecimiento proyectado de 16,9% anual hasta 2034."
              source="IMARC Group · 2026"
              sourceUrl="https://www.imarcgroup.com/latin-america-agritech-market"
            />
          </InsightGrid>
          <div className="mt-9 grid max-w-xl gap-5 sm:grid-cols-2">
            <AnimatedMetric value={32} label="departamentos y un Distrito Capital" />
            <AnimatedMetric value={1103} label="municipios constituidos" />
          </div>
          <div className="mt-12 flex max-w-4xl items-center gap-4 rounded-2xl border border-border bg-card p-5 text-muted-foreground shadow-sm">
            <MapPinned className="size-8 shrink-0 text-primary" />
            <p>La escala municipal no es un detalle: es donde una recomendación se vuelve útil para alguien.</p>
          </div>
        </div>
      )}

      {index === 3 && (
        <div className="grid w-full flex-1 items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SlideLabel>{slide.label}</SlideLabel>
            <h2 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">{slide.title}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: MapPinned, title: "Zonificación", text: "¿Dónde tiene sentido sembrar cada cultivo?" },
                { icon: CloudSun, title: "Rendimiento", text: "¿Qué rendimiento puede esperar el productor?" },
                { icon: Sprout, title: "Recomendaciones", text: "¿Qué alternativa se adapta mejor al contexto?" },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <Icon className="size-8 text-primary" />
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <RecommendationChart />
        </div>
      )}

      {index === 4 && (
        <div className="grid w-full flex-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SlideLabel>{slide.label}</SlideLabel>
            <Network className="size-14 text-primary" />
            <h2 className="mt-7 max-w-2xl text-balance text-4xl font-bold tracking-tight md:text-6xl">{slide.title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Conectamos datos abiertos, suelo y clima para que la recomendación no dependa de una sola fuente ni de un solo calendario.
            </p>
          </div>
          <IntegrationFlow />
        </div>
      )}

      {index === 5 && (
        <div className="flex w-full flex-1 flex-col justify-center">
          <SlideLabel>{slide.label}</SlideLabel>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">{slide.title}</h2>
            <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-bold text-primary">
              <Leaf className="size-5" />
              Listo para producción
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            <AnimatedMetric value={5} label="modelos entrenados" />
            <AnimatedMetric value={7} label="cultivos con zonificación" />
            <AnimatedMetric value={94} label="cultivos considerados en rendimiento" />
            <AnimatedMetric value={4} label="repositorios integrados" />
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-7">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Zonificación actual</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {crops.map((crop) => (
                  <span key={crop} className="rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                    {crop}
                  </span>
                ))}
              </div>
              <p className="mt-6 max-w-lg leading-6 text-muted-foreground">La disponibilidad de datos define hoy los cultivos con zonificación y abre la ruta para ampliar cobertura.</p>
            </div>
            <CropCalendar />
          </div>
        </div>
      )}

      {index === 6 && (
        <div className="grid w-full flex-1 items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SlideLabel>{slide.label}</SlideLabel>
            <h2 className="max-w-2xl text-balance text-4xl font-bold tracking-tight md:text-6xl">{slide.title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Aprendimos que es posible generar recomendaciones basadas en suelo y clima aun cuando no existan registros históricos de ese cultivo en el municipio.
            </p>
            <div className="presentation-impact-callout mt-8 rounded-3xl border border-accent/40 bg-accent/15 p-6">
              <p className="text-lg font-semibold">Más datos públicos → mejores modelos → más decisiones posibles.</p>
            </div>
            <div className="presentation-impact-goals mt-7 flex flex-wrap gap-2" aria-label="Objetivos de impacto">
              {[
                "ODS 2 · Hambre cero",
                "ODS 8 · Trabajo decente",
                "ODS 13 · Acción climática",
              ].map((goal) => (
                <span key={goal} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                  {goal}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
              <Database className="size-9 text-primary" />
              <p className="mt-5 text-xl font-semibold">Integrar el dato abierto acelera el camino.</p>
              <p className="mt-2 leading-6 text-muted-foreground">MCP nos permite sumar fuentes sin perder el foco en la experiencia de quien toma la decisión.</p>
            </div>
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-7">
              <Sprout className="size-9 text-primary" />
              <p className="mt-5 text-xl font-semibold">El territorio también habla cuando faltan antecedentes.</p>
              <p className="mt-2 leading-6 text-muted-foreground">Suelo, clima y contexto permiten construir una recomendación útil y explicable.</p>
            </div>
          </div>
        </div>
      )}

      {index === 7 && (
        <div className="grid w-full flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SlideLabel>{slide.label}</SlideLabel>
            <h2 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">{slide.title}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              El premio nos permitirá llevar AgroPlan a zonas rurales, ampliar municipios y cultivos, mejorar predicciones con más datos y motivar a las entidades públicas a producir información que haga crecer al campo.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-primary">
              <Users className="size-5" />
              Datos · modelos · producto · adopción
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Estefania Salcedo", role: "Datos, backend, producto y experiencia", avatar: "https://avatars.githubusercontent.com/u/122816145?v=4" },
                { name: "Edwar Diaz", role: "Modelos, arquitectura y despliegue", avatar: "https://avatars.githubusercontent.com/u/28914781?v=4" },
              ].map((person) => (
                <div key={person.name} className="rounded-2xl border border-border bg-background p-5">
                  <Image src={person.avatar} alt={`Foto de ${person.name}`} width={72} height={72} className="size-[72px] rounded-full object-cover" />
                  <p className="mt-4 font-semibold">{person.name}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{person.role}</p>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-primary p-5 text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Sprout className="size-8 shrink-0" />
              <p className="flex-1 font-semibold">Ahora, veamos AgroPlan funcionando.</p>
              <ArrowRight className="size-5 shrink-0" />
            </Link>
          </div>
        </div>
      )}

      <Source slide={slide} />
    </article>
  )
}

export function PresentationDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const deckRef = useRef<HTMLElement>(null)
  const isFirstSlide = currentSlide === 0
  const isLastSlide = currentSlide === slides.length - 1

  const goTo = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, slides.length - 1)))
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault()
        goTo(currentSlide + 1)
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goTo(currentSlide - 1)
      }
      if (event.key.toLowerCase() === "f") {
        deckRef.current?.requestFullscreen().catch(() => undefined)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [currentSlide])

  return (
    <main ref={deckRef} className="relative flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <div className="absolute left-0 top-0 z-20 h-1 w-full bg-border">
        <div className="h-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
      </div>

      <PresentationSlide index={currentSlide} />

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4 md:px-10">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(currentSlide - 1)}
            disabled={isFirstSlide}
            className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(currentSlide + 1)}
            disabled={isLastSlide}
            className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="size-5" />
          </button>
          <span className="ml-3 text-sm tabular-nums text-muted-foreground">{currentSlide + 1} / {slides.length}</span>
        </div>
        <div className="hidden items-center gap-2 md:flex" aria-label="Ir a una diapositiva">
          {slides.map((slide, index) => (
            <button
              key={`${slide.title}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-[width,background-color] duration-200 ${index === currentSlide ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`}
              aria-label={`Ir a la diapositiva ${index + 1}${slide.label ? `: ${slide.label}` : ""}`}
              aria-current={index === currentSlide ? "step" : undefined}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <RepositoryHubButton placement="inline" />
          <button
            type="button"
            onClick={() => deckRef.current?.requestFullscreen().catch(() => undefined)}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Ver en pantalla completa"
          >
            <Expand className="size-4" />
            Pantalla completa
          </button>
        </div>
      </footer>
    </main>
  )
}
