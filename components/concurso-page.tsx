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
                  <h3 className="text-xl font-semibold text-white">1 Repositorio público</h3>
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
            <div>
              <h2 className="mb-4 text-center text-3xl font-bold text-white">Nuestro Proyecto</h2>
              <p className="max-w-3xl text-lg text-white/80">{projectConfig.project.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Repositorios</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {projectConfig.repositories.map((repo) => (
                  <Card key={repo.name} className="border-white/20 bg-white/10 p-6 transition-all hover:bg-white/15">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="concurso-oak mb-2 text-xl font-semibold">{repo.name}</h4>
                        <p className="mb-3 text-sm text-white/70">{repo.technology}</p>
                      </div>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="concurso-oak transition-opacity hover:opacity-80">
                        <GitBranch className="h-6 w-6" />
                      </a>
                    </div>
                    <p className="mb-4 text-white/80">{repo.description}</p>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "concurso-oak w-full border-accent bg-accent hover:bg-accent/80",
                      })}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver en GitHub
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
                    <div className="mb-4 flex items-start justify-between">
                      <h4 className="text-lg font-semibold text-white">{source.name}</h4>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">{formatConcursoNumber(source.records)}</div>
                        <div className="text-xs text-white/70">registros</div>
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-white/70">{source.source}</p>
                    <p className="mb-4 text-white/80">{source.description}</p>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">{source.license}</span>
                      <span className="concurso-oak rounded bg-accent/30 px-2 py-1 text-xs">{source.usage}</span>
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
                  <Card key={dataset.name} className="border-white/20 bg-white/10 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="mb-2 text-xl font-semibold text-white">{dataset.name}</h4>
                        <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
                          <span className="font-medium">Fuente:</span>
                          <span>{dataset.source}</span>
                        </div>
                        {dataset.datasetId && (
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <span className="font-medium">Dataset ID:</span>
                            <code className="rounded bg-white/10 px-2 py-1">{dataset.datasetId}</code>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{formatConcursoNumber(dataset.records)}</div>
                        <div className="text-sm text-white/70">registros</div>
                      </div>
                    </div>
                    <p className="mb-4 text-white/80">{dataset.description}</p>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{dataset.license}</span>
                      <span className="concurso-oak rounded-full bg-accent/30 px-3 py-1 text-sm">{dataset.usage}</span>
                    </div>
                    {dataset.url && (
                      <a
                        href={dataset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "border-white/30 bg-white/10 text-white hover:bg-white/20",
                        })}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver en datos.gov.co
                      </a>
                    )}
                    {dataset.datasets && (
                      <div className="mt-4 border-t border-white/20 pt-4">
                        <p className="mb-2 text-sm font-medium text-white">Datasets individuales:</p>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                          {dataset.datasets.map((ds) => (
                            <a key={ds.id} href={ds.url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300 hover:underline">
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
