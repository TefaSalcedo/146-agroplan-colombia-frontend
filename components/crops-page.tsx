'use client'

export function CropsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Cultivos Recomendados</h1>
      <p className="text-muted-foreground">
        Cultivos recomendados para tu ubicación.
      </p>
      <div className="rounded-lg border p-4">
        <p>Lista de cultivos en desarrollo...</p>
      </div>
    </div>
  )
}