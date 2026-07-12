# AgroPlan Colombia - Frontend

Frontend de AgroPlan Colombia para consultar cultivos, clima, calendario agricola y zonificacion por municipio. La aplicacion usa Next.js 16, React 19, TypeScript y un backend HTTP versionado bajo `/api/v1`.

## Requisitos

- Node.js compatible con Next.js 16.
- pnpm.
- Backend AgroPlan disponible y accesible desde el entorno donde se ejecuta Next.js.

## Configuracion

Copia `.env.example` a `.env.local` y define la URL base del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

La variable debe incluir el prefijo `/api/v1`. En produccion debe ser una URL HTTPS accesible por el servidor y, si el navegador consume directamente el backend, debe permitir el origen de la aplicacion mediante CORS.

`NEXT_PUBLIC_*` se incorpora al bundle del navegador. No coloques claves privadas ni `X-Admin-API-Key` en esta variable.

## Desarrollo

```bash
pnpm install --frozen-lockfile
pnpm dev
```

La aplicacion se abre normalmente en `http://localhost:3000`.

## Validacion antes de publicar

Ejecuta los comandos existentes del proyecto:

```bash
pnpm lint
pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters
pnpm build
pnpm start
```

El backend debe responder correctamente antes del despliegue:

```text
GET /api/v1/health
GET /api/v1/readiness
GET /openapi.json
```

`/readiness` debe reportar `status: "ok"` y todos sus componentes como `ready: true`.

## Integracion con el backend

El cliente de `lib/api-client`:

1. Usa `/api/*` en el navegador para pasar por el rewrite de Next.js.
2. Usa `NEXT_PUBLIC_API_URL` en renderizado del servidor.
3. Convierte automaticamente claves `snake_case` del backend a `camelCase`.
4. Reintenta errores de red y conserva una cache GET en memoria de cinco minutos.

Endpoints principales consumidos:

| Area | Endpoint |
| --- | --- |
| Salud | `/health`, `/readiness` |
| Municipios | `/municipalities`, `/municipalities/{id}`, `/municipalities/search`, `/municipalities/departments` |
| Cultivos | `/crops`, `/crops/lite`, `/crops/{crop_id}` |
| Clima | `/weather/{municipality_id}`, `/forecast/daily/{municipality_id}`, `/forecast/monthly/{municipality_id}` |
| Zonificacion | `/zoning/recommendations/{municipality_id}`, `/zoning/map/{crop_id}` |
| Calendario | `POST /calendars/predict-batch` |
| Alertas | `/alerts/{municipality_id}` |
| IA | `/zoning/recommendations/{municipality_id}/ai-insights` |

El backend 2.0.0 devuelve `score` en `climate_based_recommendations`; el frontend usa ese campo. En resultados de zonificacion, `suitability` es la clasificacion oficial y `confidence` se conserva como valor numerico de confianza.

El endpoint `POST /zoning/predict` ya no forma parte del OpenAPI actual y no se expone desde el cliente frontend. Las rutas activas usan recomendaciones por municipio y mapas por cultivo.

Las fechas diarias y mensuales del backend son fechas de calendario (`YYYY-MM-DD` o `YYYY-MM-01`). Deben procesarse con `lib/date-utils.ts` para evitar desplazamientos por UTC.

## Estructura

```text
app/                  Rutas Next.js y paginas.
components/           Componentes de interfaz.
context/              Estado global, incluida la ubicacion.
hooks/                Hooks de datos y estado.
lib/api-client/       Cliente HTTP, tipos y adaptadores del backend.
lib/date-utils.ts     Parseo seguro de fechas de calendario.
public/               Imagenes y recursos estaticos.
docs/                 Documentacion de contratos y operacion.
```

## Produccion

1. Configura `NEXT_PUBLIC_API_URL` antes de ejecutar `pnpm build`; la configuracion queda incorporada en el bundle.
2. Usa HTTPS para frontend y backend.
3. Verifica que el backend pueda resolver sus modelos, base de datos y proveedores externos.
4. Ejecuta `pnpm start` con el artefacto construido.
5. Comprueba las rutas principales y revisa `/configuracion` para confirmar el estado del backend.
6. No expongas endpoints administrativos desde el navegador sin una capa server-side segura. Los endpoints `/admin/*` protegidos requieren `X-Admin-API-Key`.

## Documentacion adicional

Consulta [docs/backend-integration.md](docs/backend-integration.md) para ejemplos de payloads, contrato vigente y una lista de comprobaciones de despliegue.
