# Cotizador de Renting

Aplicación web en Next.js + TypeScript para calcular cotizaciones de renting en el momento.

## Requisitos

- Node.js 20+
- npm

## Ejecutar en local

Desde la carpeta `web`:

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

Tambien puedes ejecutar desde la raiz del repositorio:

```bash
npm --prefix web install
npm --prefix web run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Estructura principal

- `src/app/page.tsx`: formulario del cotizador.
- `src/app/resumen/page.tsx`: vista de resumen e impresion.
- `src/lib/cotizacion.ts`: validaciones y formulas.

## Notas

- No hay persistencia de datos en backend.
- Se usa `sessionStorage` solo para pasar datos entre formulario y resumen.
- El archivo Excel fuente no se versiona en git.
