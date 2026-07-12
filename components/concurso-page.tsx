"use client"

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
  BookOpen
} from "lucide-react"

export function ConcursoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {projectConfig.project.competition}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {projectConfig.project.name}
          </h1>
          <p className="text-xl text-green-100 max-w-3xl">
            {projectConfig.project.description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        
        {/* Repositories Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <GitBranch className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Repositorios del Proyecto
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projectConfig.repositories.map((repo) => (
              <Card key={repo.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {repo.technology}
                    </p>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    <GitBranch className="w-6 h-6" />
                  </a>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {repo.description}
                </p>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver en GitHub
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Creators Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Equipo de Desarrollo
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projectConfig.creators.map((creator) => (
              <Card key={creator.name} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {creator.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{creator.name}</h3>
                    <p className="text-green-600 font-medium">{creator.role}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {creator.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{resp}</p>
                    </div>
                  ))}
                </div>
                <a href={creator.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Ver perfil de GitHub
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cronología del Proyecto
            </h2>
          </div>
          <div className="space-y-4">
            {projectConfig.timeline.map((phase, index) => (
              <Card key={phase.phase} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{phase.phase}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {phase.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.deliverables.map((deliverable, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Datasets Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Datasets del Concurso (Datos Abiertos)
            </h2>
          </div>
          <div className="space-y-6">
            {projectConfig.datasets.map((dataset) => (
              <Card key={dataset.name} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{dataset.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">Fuente:</span>
                      <span>{dataset.source}</span>
                    </div>
                    {dataset.datasetId && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Dataset ID:</span>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {dataset.datasetId}
                        </code>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {dataset.records?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      registros
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {dataset.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {dataset.license}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    {dataset.usage}
                  </span>
                </div>
                {dataset.url && (
                  <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver en datos.gov.co
                    </Button>
                  </a>
                )}
                {dataset.datasets && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium mb-2">Datasets individuales:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {dataset.datasets.map((ds) => (
                        <a
                          key={ds.id}
                          href={ds.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:text-green-700 hover:underline"
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
        </section>

        {/* External Data Sources Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Fuentes de Datos Externas (Open Data)
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projectConfig.externalDataSources.map((source) => (
              <Card key={source.name} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">{source.name}</h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      {source.records?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      registros
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {source.source}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {source.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {source.license}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                    {source.usage}
                  </span>
                </div>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visitar fuente
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Hugging Face Models Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Modelos de Machine Learning (Hugging Face)
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projectConfig.huggingFaceModels.map((model) => (
              <Card key={model.name} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold">{model.name}</h3>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm">
                    {model.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {model.framework}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {model.description}
                </p>
                {model.crops && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Cultivos soportados:</p>
                    <div className="flex flex-wrap gap-2">
                      {model.crops.map((crop) => (
                        <span
                          key={crop}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <a href={model.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver en Hugging Face
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Source Software Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Menciones Especiales - Software Libre
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Este proyecto agradece profundamente a las comunidades de software libre que hacen posible esta iniciativa.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectConfig.openSourceSoftware.map((software) => (
              <Card key={software.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold">{software.name}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                  {software.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Licencia:</span>
                    <span className="text-gray-700 dark:text-gray-300">{software.license}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Uso:</span>
                    <span className="text-gray-700 dark:text-gray-300">{software.usage}</span>
                  </div>
                </div>
                <a href={software.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visitar sitio web
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Stack Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Stack Tecnológico
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Backend</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lenguaje</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.backend.language}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Framework</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.backend.framework}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Base de datos</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.backend.database}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ML Frameworks</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {projectConfig.techStack.backend.ml.map((ml) => (
                      <span key={ml} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {ml}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Frontend</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lenguaje</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.frontend.language}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Framework</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.frontend.framework}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estilos</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.frontend.styling}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mapas</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.frontend.maps}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Animaciones</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.frontend.animation}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Deployment</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Modelos</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.deployment.models}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hosting Frontend</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.deployment.hosting}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Protocolo</p>
                  <p className="text-gray-900 dark:text-white">{projectConfig.techStack.deployment.protocol}</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green-600" />
            <span className="text-gray-600 dark:text-gray-400">
              Documentado siguiendo la metodología CRISP-ML
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {projectConfig.project.name} - {projectConfig.project.competition} - {projectConfig.project.year}
          </p>
        </div>
      </div>
    </div>
  )
}
