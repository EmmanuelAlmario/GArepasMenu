# GArepasMenu — Menú digital de Gordo Arepas

Cliente React **desacoplado** del sistema administrativo (GArepasAppV2).
Es la cara que ve el cliente final: pizarra de local con aurora animada
(React Bits + ogl), animaciones con Framer Motion y datos en vivo del backend.

## Arquitectura

```text
GArepasMenu (React + Vite)  --fetch-->  GArepasAppV2 (Spring Boot)
        localhost:5173                        localhost:8080
                                       GET /api/public/menu (JSON público)
```

- El backend expone `GET /api/public/menu`: lista de productos activos con
  `id`, `nombre`, `precio` y `disponible` (no expone el stock exacto).
- El CORS del backend se configura con `app.cors.allowed-origins`
  (ver `application.properties` de GArepasAppV2).
- Los enlaces "Menú digital" del sistema apuntan a la URL de este cliente
  configurada en `app.menu-publico-url`.

## React Bits y detalles

Componentes de [React Bits](https://github.com/DavidHDev/react-bits) (MIT)
integrados en `src/components/reactbits/`, todos elegidos por encajar con
la carta y no recargarla:

| Componente | Rol |
|---|---|
| **Aurora** | Fondo vivo en colores de marca (desactivado con `prefers-reduced-motion`) |
| **Noise** | Grano de pizarra sutil sobre toda la pantalla |
| **BlurText** | Entrada letra a letra del título (con prop `tag` para usarlo como `h1`) |
| **ShinyText** | Brillo dorado recorriendo "— arepas artesanales —" |
| **GlareHover** | Destello diagonal al pasar por cada producto (solo puntero fino) |
| **ClickSpark** | Chispas doradas al tocar (el comal) |

La dependencia `motion` es la que usan internamente (nuevo nombre de
Framer Motion) y el proyecto la usa para las animaciones propias.

### Ficha del producto

- **PC**: al pasar el cursor sobre una fila se despliega hacia abajo la
  ficha con ilustración, descripción e ingredientes. Se cierra al salir
  o con `Escape`; solo hay una abierta a la vez.
- **Móvil**: se abre y cierra con el toque (acordeón).
- Las descripciones e ingredientes son inventados y viven en
  `src/data/detalles.js` (mapa por nombre + fallback). Cuando el backend
  gane `descripcion`/`ingredientes` reales, este mapa queda de fallback.
- Las ilustraciones son SVG on-brand por tipo de producto
  (`src/components/IlustracionProducto.jsx`); reemplazables por fotos reales.

## Desarrollo

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend no está en 8080
npm run dev            # http://localhost:5173
```

1. Arranca primero el backend: `./mvnw spring-boot:run` (en GArepasAppV2).
2. Después este cliente: `npm run dev`.
3. Abre http://localhost:5173.

## Producción

```bash
npm run build   # genera dist/ listo para publicar en cualquier hosting estático
```

### URL de la API en producción

El contenedor (`Dockerfile` + nginx) genera `config.js` al arrancar con la
variable de entorno **`API_URL`**, así que **no hay que reconstruir** si cambia
el dominio del backend. Prioridad que usa la app:

1. `window.__API_URL__` (lo escribe el contenedor)
2. `VITE_API_URL` (útil en desarrollo)
3. `http://localhost:8080`

Para desarrollo local alcanza con `VITE_API_URL`; para el despliegue en Railway
ver la guía `GArepasAppV2/docs/DESPLIEGUE-RAILWAY.md`.

Recuerda agregar el dominio del menú a `app.cors.allowed-origins` del backend.

## Estado offline / vacío

- **Error de conexión**: mensaje "Se cayó la pizarra" con botón Reintentar.
- **Sin productos**: mensaje "Hoy la pizarra está vacía".
- **Accesibilidad**: la aurora es decorativa y se desactiva con
  `prefers-reduced-motion`; los estados usan `role="status"`/`role="alert"`.
