'use client'

import { BrainCircuit, Trophy, ArrowUpRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { SettingsControls } from '@/components/settings-controls'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLocation } from '@/context/LocationContext'

export default function ConfiguracionPage() {
  const { selectedLocation, clearLocation } = useLocation()

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-start justify-between gap-4'>
        <PageHeader title='Configuración' subtitle='Ajusta la app a tu gusto y revisa la información del proyecto.' />
      </div>

      <SettingsControls />

      <section className='flex flex-col gap-4'>
        <h2 className='text-lg font-semibold'>Información</h2>

        <Card className='flex flex-row items-start gap-4 p-5'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
            <Image src='/logo.webp' alt='AgroPlan' width={44} height={44} className='size-11 rounded-xl object-cover' />
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

        <Card className='flex flex-col gap-4 p-5'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='font-medium'>Código Abierto</p>
              <p className='text-sm text-muted-foreground'>Contribuye en GitHub</p>
            </div>
            <Link
              href='https://github.com/TefaSalcedo/AgroPlan-Colombia'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:bg-primary hover:text-primary-foreground bg-primary/10 text-primary'
            >
              Ver Repositorio <ArrowUpRight className='size-3' />
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
