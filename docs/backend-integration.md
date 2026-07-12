# Integracion frontend-backend

Esta documentacion describe el contrato validado contra el backend AgroPlan disponible el 12 de julio de 2026.

## Version y disponibilidad validadas

- Version reportada por `GET /api/v1/health`: `2.0.0`.
- `health.status`: `ok`.
- `health.models_loaded`: `true`.
- `readiness.status`: `ok`.
- Componentes listos: `database`, `zoning_model`, `yield_models`, `reference_profiles` y `golden_vectors`.
- OpenAPI disponible en `GET /openapi.json`.

## Contratos relevantes

### Recomendaciones por municipio

```http
GET /api/v1/zoning/recommendations/68013
```

Los resultados de zonificacion tienen esta forma conceptual:

```json
{
  "crop_id": "aguacate",
  "suitability": "medium",
  "confidence": 0.7678,
  "model_version": "zoning-lightgbm-v1"
}
```

Las recomendaciones climaticas usan `score`:

```json
{
  "crop_id": "pina",
  "score": 0.2,
  "source": "climate_analytics"
}
```

El frontend convierte las claves a camelCase. No cambiar `score` por `escort` sin actualizar coordinadamente el backend y el tipo `ClimateBasedRecommendation`.

### Pronostico diario

```http
GET /api/v1/forecast/daily/68013?days=12
```

La respuesta contiene fechas de calendario, por ejemplo `2026-07-12`, y valores como `temp_min`, `temp_max`, `precipitation` y `humidity`. El cliente normaliza las claves y usa `parseApiDate` para no interpretar la fecha como UTC.

### Pronostico mensual

```http
GET /api/v1/forecast/monthly/68013?months=6
```

Cada elemento contiene `forecast_month` (`2026-07-01`), `month_name`, tendencia, temperatura, precipitacion y la fecha de consulta. La interfaz muestra mes y año para diferenciar periodos de distintos años.

### Calendario agricola

```http
POST /api/v1/calendars/predict-batch
Content-Type: application/json

{
  "municipality_id": "68013",
  "crop_ids": ["aguacate"],
  "horizon_months": 12
}
```

### Zonificacion

El contrato vigente expone:

```text
GET /api/v1/zoning/recommendations/{municipality_id}
GET /api/v1/zoning/map/{crop_id}
```

`POST /api/v1/zoning/predict` no aparece en el OpenAPI actual y devuelve `404`; por eso se retiro del cliente frontend.

## Cliente HTTP

`lib/api-client/client.ts` aplica estas reglas:

- Navegador: solicita `/api/{endpoint}` y usa el rewrite de Next.js.
- Servidor: solicita directamente `${NEXT_PUBLIC_API_URL}{endpoint}`.
- La URL base debe terminar conceptualmente en `/api/v1`; el cliente agrega cada endpoint sin duplicar el prefijo.
- Las respuestas exitosas GET se cachean cinco minutos en memoria del proceso.
- Los errores HTTP se propagan como `ApiError`.

El rewrite se configura en `next.config.mjs`. La configuracion de imagenes remotas se deriva de la misma URL del backend para no depender de una IP privada fija.

## Operacion administrativa

El backend protege varios endpoints `/admin/*` con `X-Admin-API-Key`. Esa clave no debe vivir en `NEXT_PUBLIC_API_URL` ni en componentes cliente. Si se necesita una consola administrativa, debe implementarse mediante Route Handlers o un servicio server-side que mantenga la clave fuera del navegador.

## Checklist de despliegue

- [ ] `NEXT_PUBLIC_API_URL` apunta al backend productivo HTTPS.
- [ ] `GET /api/v1/health` devuelve `status: ok`.
- [ ] `GET /api/v1/readiness` devuelve todos los componentes listos.
- [ ] El frontend puede resolver `/api/crops`, `/api/municipalities`, `/api/forecast/daily/68013` y `/api/zoning/map/aguacate`.
- [ ] El backend permite el origen del frontend si existe consumo directo desde navegador.
- [ ] Se ejecutaron `pnpm lint`, TypeScript estricto y `pnpm build`.
- [ ] No se incluyeron claves administrativas en variables `NEXT_PUBLIC_*`.
