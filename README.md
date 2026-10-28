# 📊 Calculadora de Notas - ISIL Grade Calculator

A modern, responsive grade calculator web application built with Next.js, TypeScript, and Tailwind CSS. This project features light/dark mode toggle, dynamic grade entry rows, and real-time grade validation for ISIL (Instituto San Ignacio de Loyola) students.

![Project Preview](https://img.shields.io/badge/Next.js-14.1.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎨 Modern UI/UX
- **Dual Theme Support**: Seamless light/dark mode toggle with localStorage persistence
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Clean Interface**: Professional design matching institutional branding (#00d4f4 ISIL cyan accent)

### 📝 Grade Calculation Modes
1. **Promedio Actual (Current Average)**
   - 5 default entries: PA 1-4 (15% each), Evaluación Integral (40%)
   - Modern grading system

2. **Promedio Antiguo (Old Average)**
   - 6 default entries: E. Permanente 1-4 (10% each), Evaluación Parcial & Final (30% each)
   - Legacy grading system

### 🔢 Dynamic Row Management
- **Add Rows**: Click `+` button to add new grade entries (starts at 0%)
- **Remove Rows**: Click `-` button to remove entries (minimum 1 row)
- **Custom Descriptions**: Editable description fields for each entry

### ✅ Smart Validation
- **Grade Range**: Validates all grades are between 0-100
- **Percentage Sum**: Ensures percentages total exactly 100%
- **Real-time Feedback**: Clear error modals with actionable messages

### 🎯 Grade Results
- **Passing Grade (≥12.50)**: Green success modal with checkmark
- **Failing Grade (<12.50)**: Yellow warning modal with alert icon
- **Institutional Note**: Displays "La nota mínima aprobatoria en ISIL es de 12.50" on passing grades

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (useState, useMemo, useContext)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/calculadora-de-notas.git
cd calculadora-de-notas
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/calculadora-de-notas)

### Manual Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Production Deployment**
```bash
vercel --prod
```

Your app will be live at `https://your-project-name.vercel.app`

## 📁 Project Structure

```
calculadora-de-notas/
├── app/
│   ├── globals.css          # Global styles & Tailwind imports
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Home page
├── components/
│   ├── Calculator.tsx        # Main calculator component
│   ├── Header.tsx            # App header with branding
│   ├── Footer.tsx            # App footer with copyright
│   ├── Modal.tsx             # Reusable modal component
│   └── ThemeProvider.tsx     # Theme context provider
├── types/
│   └── calculator.ts         # TypeScript interfaces
├── public/                   # Static assets
├── package.json              # Dependencies & scripts
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

## 🎨 Color Palette

### Light Mode
- Background: `#f1f5f9`
- Panel: `#ffffff`
- Accent: `#00d4f4` (ISIL Cyan)

### Dark Mode
- Background: `#0f172a`
- Panel: `#15203b`
- Input Background: `#4a5565`
- Accent: `#00d4f4` (ISIL Cyan)

## 🧪 Features Breakdown

| Feature | Description | Status |
|---------|-------------|--------|
| Light/Dark Toggle | Theme persistence with localStorage | ✅ |
| Promedio Actual | 5 default entries with customizable weights | ✅ |
| Promedio Antiguo | 6 default entries for legacy system | ✅ |
| Dynamic Rows | Add/remove grade entries on the fly | ✅ |
| Grade Validation | 0-100 range check | ✅ |
| Percentage Validation | Sum must equal 100% | ✅ |
| Weighted Average | Accurate grade calculation | ✅ |
| Error Modals | Clear validation feedback | ✅ |
| Success/Warning Modals | Grade result display | ✅ |
| Responsive Design | Mobile-first approach | ✅ |

## 📝 Usage Example

1. Select **Promedio Actual** or **Promedio Antiguo**
2. Enter grades (0-100) for each assessment
3. Adjust percentages if needed (must sum to 100%)
4. Click **Calcular Calificación Final**
5. View your weighted average in the modal

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is created for portfolio purposes. All rights reserved © 2026 Mateo Julio Gomero Rios.

## 👤 Author

**MateoRiosdev / Mateo Julio Gomero Rios**

- Portfolio: [Coming Soon]
- LinkedIn: [www.linkedin.com/in/mateojuliogomerorios]
- GitHub: [@MateoRiosdev](https://github.com/MateoRiosdev)

## 🙏 Acknowledgments

- ISIL (Instituto San Ignacio de Loyola) for the grading system reference
- Next.js team for the amazing framework
- Vercel for seamless deployment

---

**Built with ❤️ for ISIL students**

## Gestor académico: cursos, calendario y notas

La página principal ahora permite trabajar con varias páginas (por ejemplo, un ciclo por página) y cualquier cantidad de cursos. La calculadora libre sigue disponible mientras no se agreguen cursos. Se conservan los modos Promedio Actual, Antiguo y English Level, las ponderaciones editables y las filas personalizadas.

1. Crea una página y agrega tus cursos con nombre, código opcional y color.
2. En **Calculadora de Notas**, selecciona un curso e ingresa sus calificaciones. Cada curso mantiene sus propias filas y su modo de cálculo. Cambiar de modo reinicia las filas del curso; las tareas ya programadas permanecen.
3. Usa el calendario junto a una evaluación para programarla o crea una tarea independiente con **Nueva tarea o examen**. Indica apertura y cierre; el cierre debe ser posterior a la apertura.
4. **Calendario** muestra períodos continuos entre semanas y meses, filtros por curso y navegación mensual. **Cronograma** permite buscar, marcar entregas, editar fechas, restaurar las fechas originales y abrir la calculadora del curso mediante **Nota**.
5. El enlace externo abre una plantilla en Google Calendar para que el estudiante confirme el evento. El icono de descarga genera un `.ICS` individual; **Exportar .ICS** exporta los eventos del filtro de curso actual. No hay sincronización automática con Google. Las fechas se interpretan en la zona horaria del dispositivo y se exportan como instantes UTC.

### Guardado y privacidad

El guardado automático es opcional y empieza desactivado. Al activarlo se conservan todas las páginas, cursos, notas y tareas en `localStorage` (`isil-academic-v1`) del navegador y origen actuales. No requiere cuenta y no envía los datos a un servidor. No se comparte entre dispositivos. Al desactivarlo se elimina la copia guardada y se continúa solo durante la sesión. El respaldo JSON permite descargar y restaurar todas las páginas; restaurar solicita confirmación antes de reemplazarlas. Si el almacenamiento está bloqueado, lleno o contiene datos dañados, se muestra un aviso.

El tema claro/oscuro conserva la preferencia existente; ambos incluyen formularios, calendario, cronograma y resultados.

### Validación del cambio

```bash
npm ci --legacy-peer-deps
npx tsc --noEmit --incremental false
npm run lint
npm test
npm run build
```

El repositorio ya incluye Next 14 y un adaptador de Cloudflare que declara versiones de Next más recientes. `--legacy-peer-deps` permite instalar el árbol existente para validar esta funcionalidad sin migrar Next ni cambiar la configuración de despliegue. Esa incompatibilidad previa debe resolverse por separado antes de adoptar ese adaptador en producción. Los archivos generados `.next`, `.open-next` y `tsconfig.tsbuildinfo` no forman parte de esta actualización.

Las pruebas cubren ponderación, separación de modos de cálculo, semanas y períodos que cruzan meses, validación de fechas, escape y plegado UTF-8 de `.ICS`, enlaces de Google Calendar y validación de respaldos.

### Ajustes de interfaz v2

Los botones de vistas, exportación, filtros y tarjetas de cursos tienen fondos y bordes explícitos en ambos temas. Los nombres y NRC largos se recortan con puntos suspensivos, manteniendo el texto completo en el título al pasar el cursor. Las vistas se ajustan al ancho disponible sin desplazar toda la página horizontalmente.

El selector personalizado de páginas y evaluaciones admite navegación con flechas, Inicio/Fin, Enter y Escape. El botón de calendario de Apertura/Cierre muestra un selector propio de día y hora con navegación mensual, Hoy y Listo. Se conserva la entrada manual de fecha/hora.

### Identidad y controles v3

La interfaz utiliza el celeste ISIL `#00D4F4`. El logo de la cabecera usa `public/isil2.jpg` en modo claro y `public/isil1.jpg` en modo oscuro; el favicon es `app/icon.jpg`, copia de `isil1.jpg`.

El color del curso se elige con una paleta propia de doce muestras y un campo HEX. La paleta abre hacia arriba, queda limitada al ancho de la pantalla y admite cerrar con Listo, Escape o clic fuera. Los respaldos usan botones compactos accesibles por teclado.

Cuando el guardado local está desactivado se muestra un aviso persistente y un botón para activarlo. Si hay datos de sesión sin guardar, se solicita la advertencia de salida del navegador al recargar o cerrar, según el soporte del navegador. El resumen inferior separa los datos de la página y el aviso sobre Google Calendar en dos líneas.
