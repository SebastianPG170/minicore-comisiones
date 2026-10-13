# Minicore · Comisiones de ventas por rango de fechas

Aplicación web en **Node.js + Express** con **patrón MVC** que calcula la comisión de cada vendedor en un rango de fechas. Ejercicio MVC de semestres pasados (Minicore, JavaScript Node).

## Funcionalidad

- Filtro por **rango de fechas** (inclusivo) y por **vendedor** (o todos).
- Cálculo automático de comisión según el **total vendido en el período**.
- Resumen: total de ventas, total de comisiones, vendedores y ventas.
- Detalle expandible con las ventas de cada vendedor.
- Endpoint JSON: `GET /api/comisiones?desde=2026-06-01&hasta=2026-06-30&vendedorId=4`.

### Reglas de comisión

| Total vendido en el período | Porcentaje | Regla |
| --- | --- | --- |
| $0 – $600 | 6 % | Básica |
| $600,01 – $800 | 8 % | Media |
| $800,01 – $1.000 | 10 % | Alta |
| Más de $1.000 | 15 % | Premium |

## Arquitectura MVC

```
minicore-comisiones/
├── server.js                      # Arranque (puerto)
├── src/
│   ├── app.js                     # Configuración de Express
│   ├── routes/comision.routes.js  # Rutas -> controlador
│   ├── controllers/               # C: recibe request, llama al servicio, elige vista
│   ├── services/                  # Lógica de negocio y validación
│   ├── models/                    # M: vendedores y ventas (datos de ejemplo)
│   ├── strategies/                # Patrón Strategy: una clase por regla
│   ├── factories/                 # Patrón Factory: elige la estrategia por monto
│   └── views/                     # V: plantillas EJS
├── public/css/styles.css
└── test/comision.test.js
```

Flujo: `Ruta → Controlador → Servicio → Modelo` y el controlador devuelve la `Vista` con el resultado.

### Principios y patrones aplicados

- **SRP**: `ValidacionService` solo valida, `ComisionService` solo calcula, el controlador solo coordina.
- **Inversión de dependencias**: `ComisionService` recibe modelos y factory por constructor, lo que permite probarlo con datos falsos.
- **Strategy**: cada regla de comisión es una clase intercambiable.
- **Factory**: `ComisionFactory.crearEstrategia(monto)` decide cuál usar.

## Ejecutar en local

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # pruebas con node:test
```

Requiere Node 18 o superior. Copia `.env.example` a `.env` si quieres cambiar el puerto.

## Deploy en Render

1. Sube el proyecto a un repositorio de GitHub.
2. En [render.com](https://render.com): **New → Web Service** y conecta el repositorio.
3. Configuración (o usa el `render.yaml` incluido con **New → Blueprint**):
   - Runtime: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
   - Plan: `Free`
4. Cuando termine, Render te da la URL pública. Prueba `/health` para confirmar que está activo.

> En el plan gratuito el servicio se duerme tras 15 minutos sin tráfico; la primera visita puede tardar cerca de un minuto. Abre la URL antes de grabar el video.

## Enlaces de entrega

- Repositorio GitHub: https://github.com/SebastianPG170/minicore-comisiones
- Video explicativo: https://youtu.be/_tRBAuFCbYY
- Deploy en Render: https://minicore-comisiones-whnf.onrender.com

## Referencias

- https://github.com/Carlooosfif/MINICORE-Sistema-Comisiones
- https://github.com/Anahi606/Minicore
