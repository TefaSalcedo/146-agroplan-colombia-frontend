'use client'

export function CropDetailPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Detalles del Cultivo</h1>
      <p className="text-muted-foreground">
        Información detallada del cultivo seleccionado.
      </p>
      <div className="rounded-lg border p-4">
        <p>Detalles del cultivo en desarrollo...</p>
      </div>
    </div>
  )
}