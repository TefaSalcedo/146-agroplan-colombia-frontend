"use client"

import { useSearchParams } from "next/navigation"
import { projectConfig } from "@/lib/project-config"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  GitBranch,
  ExternalLink,
  Users,
  Database,
  Cpu,
  Heart,
  Code2,
  Globe,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react"
import { concursoSections, getConcursoSection, type ConcursoSection } from "@/lib/concurso-sections"

export function ConcursoPage() {
  const searchParams = useSearchParams()
  const activeSection: ConcursoSection = getConcursoSection(searchParams.get("section"))

  const renderContent = () => {
    switch (activeSection) {
      case "que-es":
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">{projectConfig.project.name}</h2>
              <p className="mx-auto max-w-2xl text-xl text-white/90">
                {projectConfig.project.description}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <GitBranch className="h-8 w-8 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">4 Repositorios</h3>
                </div>
                <p className="text-white/80">Proyecto completo distribuido en repositorios especializados</p>
              </Card>

              <Card className="border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Database className="h-8 w-8 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">20+ Datasets</h3>
                </div>
                <p className="text-white/80">Fuentes de datos abiertos y complementarias integradas</p>
              </Card>

              <Card className="border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Cpu className="h-8 w-8 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">2 Modelos ML</h3>
                </div>
                <p className="text-white/80">Modelos de zonificación y rendimiento en Hugging Face</p>
              </Card>
            </div>
          </div>
        )

      case "nuestro-proyecto":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">Nuestro Proyecto</h2>
              <p className="max-w-3xl text-lg text-white/80">{projectConfig.project.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Repositorios</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {projectConfig.repositories.map((repo) => (
                  <Card key={repo.name} className="border-white/20 bg-white/10 p-6 transition-all hover:bg-white/15">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="mb-2 text-xl font-semibold text-white">{repo.name}</h4>
                        <p className="mb-3 text-sm text-white/70">{repo.technology}</p>
                      </div>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                        <GitBranch className="h-6 w-6" />
                      </a>
                    </div>
                    <p className="mb-4 text-white/80">{repo.description}</p>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver en GitHub
                      </Button>
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
                      <span className="rounded-full bg-orange-400/20 px-3 py-1 text-sm text-orange-300">{model.type}</span>
                    </div>
                    <p className="mb-2 text-sm text-white/70">{model.framework}</p>
                    <p className="mb-4 text-white/80">{model.description}</p>
                    {model.crops && (
                      <div className="mb-4">
                        <p className="mb-2 text-sm font-medium text-white">Cultivos soportados:</p>
                        <div className="flex flex-wrap gap-2">
                          {model.crops.map((crop) => (
                            <span key={crop} className="rounded bg-green-400/20 px-2 py-1 text-sm text-green-300">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <a href={model.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver en Hugging Face
                      </Button>
                    </a>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Stack Tecnológico</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-white/20 bg-white/10 p-6">
                  <h4 className="mb-4 text-lg font-semibold text-green-400">Backend</h4>
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

                <Card className="border-white/20 bg-white/10 p-6">
                  <h4 className="mb-4 text-lg font-semibold text-green-400">Frontend</h4>
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

                <Card className="border-white/20 bg-white/10 p-6">
                  <h4 className="mb-4 text-lg font-semibold text-green-400">Deployment</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-white/70">Modelos</p>
                      <p className="text-white">{projectConfig.techStack.deployment.models}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">Hosting Frontend</p>
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
                        <div className="text-xl font-bold text-green-400">{source.records?.toLocaleString()}</div>
                        <div className="text-xs text-white/70">registros</div>
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-white/70">{source.source}</p>
                    <p className="mb-4 text-white/80">{source.description}</p>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded bg-blue-400/20 px-2 py-1 text-xs text-blue-300">{source.license}</span>
                      <span className="rounded bg-purple-400/20 px-2 py-1 text-xs text-purple-300">{source.usage}</span>
                    </div>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visitar fuente
                      </Button>
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
                        <div className="text-2xl font-bold text-green-400">{dataset.records?.toLocaleString()}</div>
                        <div className="text-sm text-white/70">registros</div>
                      </div>
                    </div>
                    <p className="mb-4 text-white/80">{dataset.description}</p>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-blue-400/20 px-3 py-1 text-sm text-blue-300">{dataset.license}</span>
                      <span className="rounded-full bg-purple-400/20 px-3 py-1 text-sm text-purple-300">{dataset.usage}</span>
                    </div>
                    {dataset.url && (
                      <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver en datos.gov.co
                        </Button>
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
            <h2 className="mb-6 text-3xl font-bold text-white">Cómo lo hicimos</h2>
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
                          <span key={i} className="rounded-full bg-green-400/20 px-3 py-1 text-sm text-green-300">
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
            <h2 className="mb-6 text-3xl font-bold text-white">Nuestro equipo</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {projectConfig.creators.map((creator) => (
                <Card key={creator.name} className="border-white/20 bg-white/10 p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-2xl font-bold text-white">
                      {creator.name.charAt(0)}
                    </div>
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
                  <a href={creator.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                      <GitBranch className="mr-2 h-4 w-4" />
                      Ver perfil de GitHub
                    </Button>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        )

      case "software-libre":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Software libre</h2>
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
                  <a href={software.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visitar sitio
                    </Button>
                  </a>
                </Card>
              ))}
            </div>

            <Card className="border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm">
              <Heart className="mx-auto mb-4 h-10 w-10 text-green-400" />
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

  const activeLabel = concursoSections.find((s) => s.id === activeSection)?.label ?? "Qué es"

  return (
    <div className="relative -mx-4 -mt-6 min-h-[calc(100svh-5rem)] overflow-hidden rounded-b-3xl bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 text-white md:-mx-8 md:-mt-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/ai images/Image-urban.webp')" }}
      />
      <div className="relative z-10 mx-auto max-w-6xl p-6 lg:p-10">
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Award className="size-10 text-green-300" />
            <span className="rounded-full border border-green-300/30 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-200">
              Datos al ecosistema 2026
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{projectConfig.project.name}</h1>
          <p className="max-w-3xl text-xl text-white/80">{projectConfig.project.description}</p>
        </header>

        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-white/60">Sección actual:</span>
          <span className="rounded-full border border-green-300/30 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-100">
            {activeLabel}
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8">
          {renderContent()}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 border-t border-white/10 py-8 text-sm text-white/60">
          <BookOpen className="size-5" />
          <span>Documentado siguiendo la metodología CRISP-ML</span>
        </div>
      </div>
    </div>
  )
}
