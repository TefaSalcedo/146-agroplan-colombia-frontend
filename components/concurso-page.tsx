"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { projectConfig } from "@/lib/project-config"
import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import {
  GitBranch,
  ExternalLink,
  Database,
  Cpu,
  Heart,
  Code2,
  Award,
  BookOpen,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { concursoSections, getConcursoSection, type ConcursoSection } from "@/lib/concurso-sections"

function formatConcursoNumber(value: number | null | undefined) {
  return value == null ? "No disponible" : new Intl.NumberFormat("es-CO").format(value)
}

export function ConcursoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeSection: ConcursoSection = getConcursoSection(searchParams.get("section"))
  const sectionRefs = useRef<Partial<Record<ConcursoSection, HTMLElement | null>>>({})
  const skipNextQueryScroll = useRef(false)
  const activeSectionRef = useRef(activeSection)
  const [isCompactViewport, setIsCompactViewport] = useState(false)
  const [openSections, setOpenSections] = useState<Set<ConcursoSection>>(
    () => new Set(concursoSections.map((section) => section.id))
  )
  activeSectionRef.current = activeSection

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1279px)")
    const updateViewport = () => {
      setIsCompactViewport(mediaQuery.matches)
      setOpenSections(
        mediaQuery.matches
          ? new Set([activeSectionRef.current])
          : new Set(concursoSections.map((section) => section.id))
      )
    }

    updateViewport()
    mediaQuery.addEventListener("change", updateViewport)
    return () => mediaQuery.removeEventListener("change", updateViewport)
  }, [])

  useEffect(() => {
    if (isCompactViewport) {
      setOpenSections((current) => {
        if (current.has(activeSection)) return current
        return new Set(current).add(activeSection)
      })
    }
  }, [activeSection, isCompactViewport])

  useEffect(() => {
    if (skipNextQueryScroll.current) {
      skipNextQueryScroll.current = false
      return
    }

    const section = sectionRefs.current[activeSection]
    const activeSectionIsOpen = !isCompactViewport || openSections.has(activeSection)
    if (section && searchParams.has("section") && activeSectionIsOpen) {
      section.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }, [activeSection, isCompactViewport, openSections, searchParams])

  useEffect(() => {
    const sections = Object.entries(sectionRefs.current)
      .filter((entry): entry is [ConcursoSection, HTMLElement] => Boolean(entry[1]))
      .map(([id, element]) => ({ id, element }))

    const observer = new IntersectionObserver(
      () => {
        const visible = sections
          .map(({ id, element }) => {
            const bounds = element.getBoundingClientRect()
            const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0))
            return { id, visibleHeight }
          })
          .sort((a, b) => b.visibleHeight - a.visibleHeight)[0]

        if (!visible || visible.visibleHeight === 0) return
        const id = visible.id
        if (id !== activeSection) {
          skipNextQueryScroll.current = true
          router.replace(`/concurso?section=${id}`, { scroll: false })
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach(({ element }) => observer.observe(element))
    return () => observer.disconnect()
  }, [activeSection, router])

  const renderContent = (section: ConcursoSection) => {
    switch (section) {
      case "que-es":
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Concurso nacional 2026</p>
              <h2 className="mb-4 text-center text-4xl font-bold">Datos al ecosistema 2026</h2>
              <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                Una convocatoria para convertir datos abiertos e inteligencia artificial en soluciones útiles para los retos públicos de Colombia.
              </p>
            </div>

            <Card className="border-primary/20 bg-primary/5 p-6">
              <p className="leading-7 text-card-foreground">
                El concurso invita a ciudadanía, estudiantes, investigadores, desarrolladores, entidades y organizaciones a crear aplicaciones, tableros y modelos de IA con impacto público. Busca fortalecer la cultura de datos abiertos, la innovación y la toma de decisiones basada en evidencia, con soluciones aplicables y escalables en los territorios.
              </p>
              <a
                href="https://www.datos.gov.co/stories/s/Concurso-Datos-al-Ecosistema-2026-IA-para-Colombia/ddau-8cy9/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Consultar convocatoria oficial
              </a>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <GitBranch className="concurso-oak h-8 w-8" />
                  <h3 className="text-xl font-semibold text-white">{projectConfig.repositories.length} recursos públicos</h3>
                </div>
                <p className="text-white/80">API pública del proyecto disponible para consulta</p>
              </Card>

              <Card className="border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Database className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold text-white">20+ Datasets</h3>
                </div>
                <p className="text-white/80">Fuentes de datos abiertos y complementarias integradas</p>
              </Card>

              <Card className="border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Cpu className="concurso-oak h-8 w-8" />
                  <h3 className="text-xl font-semibold text-white">5 Modelos ML</h3>
                </div>
                <p className="text-white/80">Dos de zonificación, dos de rendimiento y uno KNN para recomendaciones</p>
              </Card>
            </div>
          </div>
        )

      case "nuestro-proyecto":
        return (
          <div className="space-y-8">
            <div className="project-ecosystem-hero relative overflow-hidden rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 text-white shadow-[0_20px_60px_rgba(194,65,12,0.28)] sm:p-8">
              <div className="project-ecosystem-glow" aria-hidden="true" />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    <Sparkles className="size-4" aria-hidden="true" />
                    Ecosistema conectado
                  </div>
                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Nuestro proyecto</h2>
                  <p className="text-base leading-7 text-white/95 sm:text-lg">{projectConfig.project.description}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                    Seis piezas trabajan juntas: desde el pipeline de Machine Learning hasta la API, el dashboard, el MCP y los modelos publicados.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-black/20 p-4 backdrop-blur-sm">
                  <GitBranch className="size-8 text-white" aria-hidden="true" />
                  <div>
                    <p className="text-3xl font-bold text-white">{projectConfig.repositories.length}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/90">recursos públicos</p>
                  </div>
                </div>
              </div>
              <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-medium text-white/95">
                <span className="size-2 animate-pulse rounded-full bg-lime-300" aria-hidden="true" />
                Código, modelos y datos abiertos en un mismo flujo
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Repositorios relacionados</h3>
                  <p className="text-sm text-white/70">Explora cómo se construye y se publica AgroPlan Colombia.</p>
                </div>
                <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">{projectConfig.repositories.length} componentes</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {projectConfig.repositories.map((repo, index) => (
                  <Card
                    key={repo.name}
                    className="group relative flex flex-col border-orange-200/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/60 hover:bg-orange-50 hover:shadow-[0_12px_32px_rgba(194,65,12,0.16)] dark:border-orange-900/70 dark:hover:bg-orange-950/30"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-800 transition-colors group-hover:bg-orange-700 group-hover:text-white dark:bg-orange-500/20 dark:text-orange-200 dark:group-hover:bg-orange-500">
                        <GitBranch className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h4 className="text-lg font-semibold text-white">{repo.name}</h4>
                          <span className="shrink-0 rounded-full border border-orange-200 bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-800 dark:border-orange-700/60 dark:bg-orange-500/20 dark:text-orange-200">
                            {repo.category}
                          </span>
                        </div>
                        <p className="text-xs text-white/60">Componente {String(index + 1).padStart(2, "0")}</p>
                      </div>
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-6 text-white/80">{repo.description}</p>
                    <p className="mb-5 text-xs font-medium text-orange-800 dark:text-orange-200">{repo.technology}</p>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-repository-link inline-flex items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Explorar recurso
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Modelos de Machine Learning</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {projectConfig.huggingFaceModels.map((model) => (
                  <Card key={model.name} className="border-white/20 bg-white/10 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <h4 className="text-xl font-semibold text-white">{model.name}</h4>
                      <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">{model.type}</span>
                    </div>
                    <p className="mb-2 text-sm text-white/70">{model.framework}</p>
                    <p className="mb-4 text-white/80">{model.description}</p>
                    {model.crops && (
                      <div className="mb-4">
                        <p className="mb-2 text-sm font-medium text-white">Cultivos soportados:</p>
                        <div className="flex flex-wrap gap-2">
                          {model.crops.map((crop) => (
                            <span key={crop} className="concurso-oak rounded bg-accent/30 px-2 py-1 text-sm">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Stack Tecnológico</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-primary/20 bg-primary/5 p-6 shadow-sm">
                  <h4 className="mb-4 text-center text-lg font-semibold text-green-400">Backend</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-white/70">Lenguaje</p>
                      <p className="text-white">{projectConfig.techStack.backend.language}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Framework</p>
                      <p className="text-white">{projectConfig.techStack.backend.framework}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Base de datos</p>
                      <p className="text-white">{projectConfig.techStack.backend.database}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">ML Frameworks</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {projectConfig.techStack.backend.ml.map((ml) => (
                          <span key={ml} className="rounded bg-white/10 px-2 py-1 text-xs text-white">{ml}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-accent/30 bg-accent/10 p-6 shadow-sm">
                  <h4 className="mb-4 text-center text-lg font-semibold text-accent-foreground">Frontend</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-white/70">Lenguaje</p>
                      <p className="text-white">{projectConfig.techStack.frontend.language}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Framework</p>
                      <p className="text-white">{projectConfig.techStack.frontend.framework}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Estilos</p>
                      <p className="text-white">{projectConfig.techStack.frontend.styling}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Mapas</p>
                      <p className="text-white">{projectConfig.techStack.frontend.maps}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Animaciones</p>
                      <p className="text-white">{projectConfig.techStack.frontend.animation}</p>
                    </div>
                  </div>
                </Card>

                <Card className="border-secondary bg-secondary/60 p-6 shadow-sm">
                  <h4 className="mb-4 text-center text-lg font-semibold text-secondary-foreground">Deployment</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-white/70">Modelos</p>
                      <p className="text-white">{projectConfig.techStack.deployment.models}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Hosting</p>
                      <p className="text-white">{projectConfig.techStack.deployment.hosting}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Protocolo</p>
                      <p className="text-white">{projectConfig.techStack.deployment.protocol}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Fuentes de Datos Externas</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {projectConfig.externalDataSources.map((source) => (
                  <Card key={source.name} className="border-white/20 bg-white/10 p-6 transition-all hover:bg-white/15">
                    <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
                      <h4 className="text-lg font-semibold text-white">{source.name}</h4>
                      <div className="flex w-full items-center justify-between rounded-lg bg-primary/15 p-2 sm:w-auto sm:bg-transparent sm:p-0">
                        <div className="text-xl font-bold text-green-400">{formatConcursoNumber(source.records)}</div>
                        <div className="text-xs text-white/70 sm:ml-2">registros</div>
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-white/70">{source.source}</p>
                    <p className="mb-4 text-white/80">{source.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{source.license}</span>
                      <span className="concurso-oak rounded-full bg-accent/40 px-3 py-1 text-xs font-medium">{source.usage}</span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-full border-white/30 bg-white/10 text-white hover:bg-white/20",
                      })}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visitar fuente
                    </a>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Datasets del Concurso</h3>
              <div className="space-y-4">
                {projectConfig.datasets.map((dataset) => (
                  <Card key={dataset.name} className="border-white/20 bg-white/10 p-6 md:border-white/20 md:bg-white/10">
                    <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                      <div className="flex-1">
                        <h4 className="mb-2 text-xl font-semibold text-white">{dataset.name}</h4>
                        <div className="mb-2 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white/90">Fuente:</span>
                            <span className="text-white/80">{dataset.source}</span>
                          </div>
                          {dataset.datasetId && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white/90">ID:</span>
                              <code className="rounded-lg bg-primary/20 px-2 py-1 text-sm font-mono text-primary-foreground sm:bg-white/10 sm:text-white">{dataset.datasetId}</code>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between rounded-lg bg-primary/15 p-3 sm:w-auto sm:bg-transparent sm:p-0">
                        <div className="text-2xl font-bold text-green-400 sm:text-right">{formatConcursoNumber(dataset.records)}</div>
                        <div className="text-xs text-white/70 sm:ml-2 sm:text-sm">registros</div>
                      </div>
                    </div>
                    <p className="mb-4 text-white/80">{dataset.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{dataset.license}</span>
                      <span className="concurso-oak rounded-full bg-accent/40 px-3 py-1 text-sm font-medium">{dataset.usage}</span>
                    </div>
                    {dataset.url && (
                      <a
                        href={dataset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto",
                        })}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver en datos.gov.co
                      </a>
                    )}
                    {dataset.datasets && (
                      <div className="mt-4 border-t border-white/20 pt-4">
                        <p className="mb-3 text-sm font-medium text-white">Datasets individuales:</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                          {dataset.datasets.map((ds) => (
                            <a
                              key={ds.id}
                              href={ds.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/20 sm:bg-white/10 sm:text-green-400 sm:hover:bg-white/20"
                            >
                              {ds.crop}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "como-lo-hicimos":
        return (
          <div className="space-y-4">
            <h2 className="mb-6 text-center text-3xl font-bold text-white">Cómo lo hicimos</h2>
            <div className="space-y-4">
              {projectConfig.timeline.map((phase, index) => (
                <Card key={phase.phase} className="border-white/20 bg-white/10 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-semibold text-white">{phase.phase}</h3>
                      <p className="mb-4 text-white/80">{phase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((deliverable, i) => (
                          <span key={i} className="concurso-oak rounded-full bg-accent/30 px-3 py-1 text-sm">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      case "software-libre":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-center text-3xl font-bold text-white">Software libre</h2>
              <p className="text-white/80">
                Este proyecto agradece profundamente a las comunidades de software libre que hacen posible esta iniciativa. Muchas gracias a todos los desarrolladores, mantenedores y contribuyentes que comparten su trabajo con el mundo.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projectConfig.openSourceSoftware.map((software) => (
                <Card key={software.name} className="border-white/20 bg-white/10 p-6 transition-all hover:bg-white/15">
                  <div className="mb-4 flex items-center gap-3">
                    <Code2 className="h-6 w-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">{software.name}</h3>
                  </div>
                  <p className="mb-4 text-sm text-white/80">{software.description}</p>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-white/70">Licencia:</span>
                      <span className="text-white/80">{software.license}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-white/70">Uso:</span>
                      <span className="text-white/80">{software.usage}</span>
                    </div>
                  </div>
                  <a
                    href={software.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "w-full border-white/30 bg-white/10 text-white hover:bg-white/20",
                    })}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visitar sitio
                  </a>
                </Card>
              ))}
            </div>

          </div>
        )

      case "nuestro-equipo":
        return (
          <div className="space-y-4">
            <h2 className="mb-6 text-center text-3xl font-bold text-white">Nuestro equipo</h2>
            <div className="relative pt-0 md:pt-16">
              <div className="grid gap-4 md:grid-cols-2">
                {projectConfig.creators.map((creator) => (
                  <Card key={creator.name} className="relative z-10 border-white/20 bg-white/10 p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <Image
                        src={creator.avatar}
                        alt={`Foto de perfil de ${creator.name}`}
                        width={64}
                        height={64}
                        className="size-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white">{creator.name}</h3>
                        <p className="font-medium text-green-400">{creator.role}</p>
                      </div>
                    </div>
                    <div className="mb-4 space-y-2">
                      {creator.responsibilities.map((resp, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                          <p className="text-sm text-white/80">{resp}</p>
                        </div>
                      ))}
                    </div>
                    <a
                      href={creator.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-full border-white/30 bg-white/10 text-white hover:bg-white/20",
                      })}
                    >
                      <GitBranch className="mr-2 h-4 w-4" />
                      Ver perfil de GitHub
                    </a>
                  </Card>
                ))}
              </div>
              <Image
                src="/logo.webp"
                alt=""
                width={72}
                height={72}
                className="pointer-events-none absolute left-1/2 top-0 z-0 hidden size-16 -translate-x-1/2 object-cover md:block"
              />
            </div>
            <Card className="border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm">
              <Heart className="concurso-oak mx-auto mb-4 h-10 w-10" />
              <h3 className="mb-2 text-2xl font-bold text-white">Muchas gracias</h3>
              <p className="text-white/80">
                Gracias a todas las comunidades de código abierto, a los datos abiertos del Gobierno de Colombia y a quienes creen en compartir conocimiento para construir un mejor futuro.
              </p>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="concurso-shell relative -mx-4 -mt-6 bg-background text-foreground md:-mx-8 md:-mt-8">
      <div className="relative z-10 mx-auto max-w-6xl p-3 sm:p-4 xl:p-10">
        <header className="mb-5 xl:mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Award className="size-8 text-primary sm:size-10" />
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Datos al ecosistema 2026
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl xl:mb-4 xl:text-5xl">{projectConfig.project.name}</h1>
          <p className="max-w-3xl text-base text-white/80 sm:text-lg xl:text-xl">{projectConfig.project.description}</p>
        </header>

        <div className="space-y-4 xl:space-y-8">
          {concursoSections.map((section) => {
            const SectionIcon = section.icon
            const isOpen = !isCompactViewport || openSections.has(section.id)

            return (
              <section
                key={section.id}
                id={section.id}
                ref={(element) => {
                  sectionRefs.current[section.id] = element
                }}
                className="scroll-mt-4 xl:scroll-mt-8"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card/80 p-2 shadow-sm backdrop-blur-sm sm:p-3 xl:p-8">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${section.id}-content`}
                    onClick={() => {
                      if (!isCompactViewport) return
                      setOpenSections((current) => {
                        const next = new Set(current)
                        if (next.has(section.id)) {
                          next.delete(section.id)
                        } else {
                          next.add(section.id)
                        }
                        return next
                      })
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:hidden"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <SectionIcon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{section.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {isOpen ? "Ocultar contenido" : "Toca para explorar"}
                      </span>
                    </span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`${section.id}-content`}
                    className={isCompactViewport && !isOpen ? "hidden" : "block"}
                  >
                    {renderContent(section.id)}
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 border-t border-white/10 py-8 text-sm text-white/60">
          <BookOpen className="size-5" />
          <span>Documentado siguiendo la metodología CRISP-ML</span>
        </div>
      </div>
    </div>
  )
}
