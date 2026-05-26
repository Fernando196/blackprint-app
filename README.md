# BlackPrint — Avalúos Hipotecarios

Aplicación de inteligencia inmobiliaria construida sobre datos de avalúos hipotecarios emitidos en México durante septiembre de 2024. Diseñada para brokers, desarrolladores e inversionistas que buscan entender el mercado inmobiliario mexicano a través de datos reales.

## URL de la aplicación

https://blackprint-app-lemon.vercel.app/

---

## Cómo correr localmente

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Colocar el archivo CSV del dataset en `scripts/`
4. Generar los JSONs procesados:

```bash
npm run process
```

5. Correr el servidor de desarrollo:

```bash
npm run dev
```

---

## Stack tecnológico

- **Nuxt 3** — framework principal, server routes y frontend
- **@nuxtjs/leaflet** — mapas interactivos con soporte SSR nativo
- **vue-chartjs + chart.js** — gráficas de dona y barras
- **Pinia** — estado global de filtros y data
- **Tailwind CSS** — estilos con variables CSS del brand kit de BlackPrint
- **csv-parse** — procesamiento del dataset en pipeline Node
- **Vercel** — deploy y hosting

---

## Decisiones de producto

**Dashboard + Mapa integrados**
Se decidió mostrar el mapa y el dashboard en la misma vista para que los filtros afecten ambos simultáneamente. El usuario ve el impacto geográfico y los KPIs al mismo tiempo sin cambiar de página.

**Pipeline de preprocesamiento offline**
El CSV de 40k registros se procesa localmente con un script Node que genera 4 JSONs optimizados. Esto elimina la necesidad de un backend pesado y hace el deploy trivial. El CSV nunca se sube al repositorio.

**GeoJSON de estados para inteligencia geográfica**
Se evaluaron GeoJSON de municipios (3GB) y códigos postales (290MB) pero se descartaron por impacto en performance. El GeoJSON de estados es manejable, permite hover interactivo, panel de métricas por entidad y filtrado geográfico sin sacrificar velocidad.

**Store global único**
Toda la data y los filtros viven en un solo store de Pinia. Cualquier cambio de filtro actualiza automáticamente el mapa, el dashboard y la tabla sin fetch adicionales.

**Catálogos como constantes tipadas**
Los 16 catálogos del dataset se implementaron como constantes TypeScript con tipos estrictos, accesibles via un composable `useCatalog` que es el único punto de acceso en toda la app.

---

## Enfoque de procesamiento de datos

El pipeline funciona en un solo script Node (`scripts/process-data.js`):

1. Lee el CSV con `csv-parse` respetando encoding UTF-8 y BOM
2. Filtra filas duplicadas y registros sin coordenadas válidas
3. Decodifica todos los campos codificados usando los 16 catálogos
4. Genera 4 JSONs especializados en `server/data/`:
   - `mapa.json` — campos mínimos para pintar markers (9MB)
   - `tabla.json` — campos para exploración tabular (13MB)
   - `metricas.json` — KPIs precalculados
   - `por_estado.json` — agregaciones por entidad

Los JSONs viven en `server/data/` y solo son accesibles via API routes de Nuxt — nunca se exponen directamente al cliente.

---

## Niveles completados

**Nivel 1 — Explorador interactivo** ✅

- Dashboard con KPIs: total de avalúos, valor promedio, valor mediano y valor por m²
- Gráficas de distribución por tipo de inmueble y clase de construcción
- Mapa interactivo con clustering de 40k markers
- Filtros globales por tipo, clase, estado, conservación y rango de valor
- Tabla de datos paginada con filtros
- Brand kit de BlackPrint aplicado completamente
- Campos codificados traducidos a etiquetas legibles con los 16 catálogos

**Nivel 2 — Inteligencia geográfica** ✅ parcial

- GeoJSON de estados con hover y resaltado interactivo
- Panel de métricas por estado al hacer click: total de avalúos, valor promedio y mediano
- Ranking de estados por total de avalúos y valor promedio
- Comparativa de estados en tabla con posición, total y valores

**Nivel 3, 4 y 5** — No implementados por limitaciones de tiempo. Ver sección "Qué mejoraría con más tiempo".

---

## Uso de herramientas de AI — AI Usage Log

**Herramienta utilizada:** Claude (claude.ai) — única herramienta de AI usada en todo el proyecto.

**En qué partes ayudó AI:**

- Generación de componentes Vue siguiendo el design system de BlackPrint
- Estructura inicial del script de procesamiento de datos
- Definición de la arquitectura de stores y composables
- Debugging de problemas de encoding (BOM en CSV, UTF-8 roto)
- Generación de server API routes de Nuxt

**Qué partes diseñé, modifiqué o validé personalmente:**

- Decisiones de producto: dashboard + mapa integrados, descarte de GeoJSON pesados
- Selección del stack tecnológico (Nuxt sobre Next.js por familiaridad)
- Arquitectura del pipeline de datos y estructura de JSONs
- Decisión de usar store global único vs stores separados
- Validación visual de cada componente contra el brand kit
- Debugging de problemas de matching entre catálogos y CSV
- Criterio de qué niveles priorizar dado el tiempo disponible

**En qué se equivocó o fue insuficiente AI:**

- Generó código con estilos inline en lugar de Tailwind — requirió corrección
- Definía types dentro de los componentes en lugar de en `app/types/` — requirió refactor
- El refactor del store global rompió la aplicación — se revirtió y se hizo por partes
- Sugirió fuentes de GeoJSON de municipios que no funcionaron o pesaban demasiado

**Cómo verifiqué que los resultados fueran correctos:**

- Pruebas manuales en browser en cada cambio
- Validación de datos contra el CSV original
- Revisión de cada componente contra el brand kit de BlackPrint
- Commits pequeños por funcionalidad para poder revertir si algo fallaba

**Cómo mejoraría el flujo con más tiempo:**

- Definir un contexto de arquitectura más detallado desde el inicio en CLAUDE.md
- Hacer commits después de cada archivo generado, no después de cada prompt
- Separar los prompts en instrucciones más pequeñas y atómicas

---

## Limitaciones conocidas

- El dataset representa avalúos hipotecarios de septiembre 2024 — no la totalidad del mercado inmobiliario. Las métricas reflejan actividad asociada a créditos hipotecarios, no todas las transacciones inmobiliarias.
- GeoJSON de municipios descartado por inconsistencias de nomenclatura entre fuentes y peso excesivo (3GB).
- GeoJSON de códigos postales descartado por peso (290MB nacional).
- La tabla carga 13MB de datos en el cliente — en producción se haría server-side con paginación real.
- Los filtros se aplican en el cliente sobre la data ya cargada — funciona bien para 40k registros pero no escalaría a millones sin cambios de arquitectura.
- No se implementó autenticación ni control de acceso.

---

## Qué mejoraría con más tiempo

- **Nivel 3 — Insights:** Comparativa entre zonas, detección de outliers, propiedades comparables por perfil
- **Nivel 4 — Chat:** Agente conversacional conectado a los datos reales usando Claude API con contexto pre-agregado por zona
- **GeoJSON de municipios:** Con más tiempo se normalizaría la nomenclatura para cruzar correctamente con el dataset
- **Filtros server-side:** Paginación y filtrado real en el servidor para soportar más volumen
- **Tests:** Pruebas unitarias de composables y API routes
- **Exportación:** Descarga de tabla filtrada en CSV o PDF
- **Vistas por rol:** Dashboard diferenciado para broker, desarrollador e inversionista

---

## Cómo escalarías el sistema para millones de registros

**Base de datos**

- PostgreSQL + PostGIS para queries geoespaciales eficientes
- Índices por entidad, municipio, tipo, clase y rango de valor
- Particionamiento por fecha para ingesta mensual

**Ingesta mensual**

- Pipeline automatizado que procesa el CSV mensual y hace upsert a la DB
- Validación de duplicados y calidad de datos en cada ingesta
- Aggregaciones precalculadas en tablas materializadas para KPIs y rankings

**APIs**

- Endpoints paginados con filtros server-side
- Redis para caché de agregaciones frecuentes (métricas nacionales, rankings por estado)
- Rate limiting y autenticación JWT

**Frontend**

- Carga lazy de markers — solo los visibles en el viewport actual
- Tiles vectoriales para el mapa en lugar de GeoJSON estático
- Aggregaciones geográficas en el servidor, no en el cliente

**Visualización geoespacial**

- Migrar a Mapbox GL JS o Deck.gl para rendering de cientos de miles de puntos
- Heatmaps y clustering server-side con H3 (Uber's geospatial indexing)

**Infraestructura**

- Autenticación y roles: broker, desarrollador, inversionista, admin
- Exportación de reportes en PDF con datos filtrados
- Monitoreo con métricas de uso por endpoint

---

## Privacidad y manejo de datos

- El CSV original nunca se sube al repositorio (incluido en `.gitignore`)
- Los JSONs procesados tampoco se suben al repositorio
- Los datos se sirven únicamente via API routes del servidor, nunca como archivos estáticos públicos
- No se exponen registros crudos innecesariamente — la tabla muestra solo campos relevantes para el análisis

---

## Tiempo dedicado

**Total: ~8 horas**

- Análisis del reto y planeación del stack: 30 min
- Pipeline de procesamiento de datos (script Node + catálogos): 1.5 horas
- Setup de Nuxt + brand kit + API routes: 45 min
- Dashboard con KPIs y gráficas: 1 hora
- Mapa interactivo con clustering y GeoJSON de estados: 2 horas
- Tabla de datos con filtros y paginación: 1 hora
- Store global, filtros y refactors de arquitectura: 1 hora
- Deploy en Vercel y README: 15 min
