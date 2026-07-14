'use client'

import { BrainCircuit, Trophy, ArrowUpRight, GitBranch, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { SettingsControls } from '@/components/settings-controls'
import { BackendStatus } from '@/components/backend-status'
import { Card } from '@/components/ui/card'
import { projectConfig } from '@/lib/project-config'

export default function ConfiguracionPage() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-start justify-between gap-4'>
        <PageHeader title='Configuración' subtitle='Ajusta la app a tu gusto y revisa la información del proyecto.' />
      </div>

      <SettingsControls />

      <section className='flex flex-col gap-4'>
        <h2 className='text-lg font-semibold'>Backend</h2>
        <BackendStatus />
      </section>

      <section className='flex flex-col gap-4'>
        <h2 className='text-lg font-semibold'>Información</h2>

        <Card className='flex flex-row items-start gap-4 p-5'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
            <Image src='/logo.webp' alt='Agroplan' width={44} height={44} priority className='size-11 rounded-xl object-cover' />
          </div>
          <div>
            <p className='font-medium'>AgroPlan Colombia</p>
            <p className='text-sm text-muted-foreground text-pretty'>
              Sistema de inteligencia artificial que ayuda a agricultores y alcaldías a decidir qué
              cultivar, cuándo y dónde, con zonificación agroclimática.
            </p>
          </div>
        </Card>

        <Card className='flex flex-row items-start gap-4 p-5'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            <BrainCircuit className='size-5' />
          </div>
          <div>
            <p className='font-medium'>Modelo de Machine Learning</p>
            <p className='text-sm text-muted-foreground text-pretty'>
              Modelo de clasificación entrenado con variables de clima, suelo y altitud para estimar
              la probabilidad de éxito de cada cultivo por municipio. Versión de demostración con
              datos de prueba.
            </p>
          </div>
        </Card>

        <Card className='flex flex-row items-start gap-4 p-5'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground'>
            <Trophy className='size-5' />
          </div>
          <div>
            <p className='font-medium'>Datos al Ecosistema 2026</p>
            <p className='text-sm text-muted-foreground text-pretty'>
              Proyecto desarrollado para el concurso Datos al Ecosistema 2026.
            </p>
          </div>
        </Card>
      </section>

      <section className='flex flex-col gap-4'>
        <div className='relative overflow-hidden rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 text-white shadow-[0_18px_45px_rgba(194,65,12,0.24)] sm:p-7'>
          <div className='repository-hub-glow' aria-hidden='true' />
          <div className='relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]'>
                <Sparkles className='size-3.5' aria-hidden='true' />
                Ecosistema AgroPlan
              </div>
              <h2 className='text-2xl font-bold tracking-tight'>Proyecto y repositorios</h2>
              <p className='mt-2 max-w-2xl text-sm leading-6 text-white/95'>
                El pipeline de ML, la API, el dashboard, el MCP y los modelos publicados forman una solución conectada para el agro colombiano.
              </p>
            </div>
            <div className='flex items-center gap-3 rounded-2xl border border-white/40 bg-black/20 px-4 py-3 backdrop-blur-sm'>
              <GitBranch className='size-6' aria-hidden='true' />
              <div>
                <p className='text-2xl font-bold'>{projectConfig.repositories.length}</p>
                <p className='text-[10px] font-bold uppercase tracking-wider text-white/90'>recursos</p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {projectConfig.repositories.map((repo) => (
            <Card key={repo.name} className='group flex flex-col gap-3 border-orange-200/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/60 hover:shadow-lg dark:border-orange-900/70'>
              <div className='flex items-start gap-3'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-800 transition-colors group-hover:bg-orange-700 group-hover:text-white dark:bg-orange-500/20 dark:text-orange-200 dark:group-hover:bg-orange-500'>
                  <GitBranch className='size-5' aria-hidden='true' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='font-medium'>{repo.name}</p>
                    <span className='shrink-0 rounded-full border border-orange-200 bg-orange-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-800 dark:border-orange-700/60 dark:bg-orange-500/20 dark:text-orange-200'>
                      {repo.category}
                    </span>
                  </div>
                  <p className='mt-1 text-xs text-muted-foreground'>{repo.technology}</p>
                </div>
              </div>
              <p className='text-sm text-muted-foreground text-pretty'>{repo.description}</p>
              <Link
                href={repo.url}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-auto flex items-center justify-center gap-2 rounded-lg bg-orange-700 px-3 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2'
              >
                Explorar recurso <ArrowUpRight className='size-3' aria-hidden='true' />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className='flex flex-col gap-4'>
        <h2 className='text-lg font-semibold'>Equipo de Desarrollo</h2>

        <Card className='flex flex-col gap-4 p-5'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold'>
                ED
              </div>
              <div className='flex-1'>
                <p className='font-medium'>Edwar Diaz Ruiz</p>
                <p className='text-xs text-muted-foreground'>Desarrollador</p>
              </div>
              <Link
                href='https://github.com/BOTOOM'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:bg-primary/10 text-primary'
              >
                GitHub <ArrowUpRight className='size-3' />
              </Link>
            </div>
          </div>
        </Card>

        <Card className='flex flex-col gap-4 p-5'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold'>
                TS
              </div>
              <div className='flex-1'>
                <p className='font-medium'>Tefa Salcedo</p>
                <p className='text-xs text-muted-foreground'>Desarrollador</p>
              </div>
              <Link
                href='https://github.com/TefaSalcedo'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:bg-primary/10 text-primary'
              >
                GitHub <ArrowUpRight className='size-3' />
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
