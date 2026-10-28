# 📊 Gestor Académico ISIL · Calculadora de Notas

Organiza tus cursos, calcula tus promedios y planifica tareas y exámenes desde una misma aplicación. Desarrollada con **Next.js, React, TypeScript y Tailwind CSS**, con modo claro/oscuro y diseño adaptable a móvil y ordenador.

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-149eca?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**[Abrir aplicación](https://calculadora-notas-isil.vercel.app/)** · [Reportar un problema](https://github.com/MateoRiosdev/calculadora-notas-isil/issues) · [Autor](https://github.com/MateoRiosdev)

## Funciones

- **Páginas y cursos:** separa tus ciclos o grupos de estudio; agrega cursos con nombre, código/NRC opcional y color personalizado.
- **Calculadora por curso:** conserva las notas y ponderaciones de cada curso por separado. También puedes usar la calculadora libre sin agregar cursos.
- **Tres modos de cálculo:** Promedio Actual, Promedio Antiguo y English Level, con descripciones, porcentajes y filas editables.
- **Calendario mensual:** muestra las tareas como barras que abarcan su período de apertura y cierre, incluso entre semanas y meses.
- **Cronograma:** busca por curso o tarea, filtra pendientes y entregadas, modifica fechas y abre la calculadora del curso con el botón **Nota**.
- **Google Calendar y `.ICS`:** abre una plantilla para agendar un evento en Google Calendar o descarga eventos individuales y el calendario del filtro seleccionado.
- **Guardado opcional y respaldos:** activa el guardado en el navegador, exporta todas tus páginas a JSON y restaura un respaldo cuando lo necesites.
- **Interfaz personalizada:** tema claro/oscuro, identidad celeste `#00D4F4`, logos según el tema, selectores propios de página y fechas, y paleta de cursos con muestras y código HEX.

## Modos de cálculo

| Modo | Evaluaciones predeterminadas | Ponderación |
| --- | --- | --- |
| Promedio Actual | PA 1, PA 2, PA 3, PA 4 y Evaluación Integral | 15% por PA + 40% de EI |
| Promedio Antiguo | E. Permanente 1–4, Evaluación Parcial y Evaluación Final | 10% por permanente + 30% parcial + 30% final |
| English Level | 6 Proficiency Achievement, 6 Platform Evaluation y Final Evaluation | 10% por Proficiency + 5% por Platform + 10% final |

El promedio se calcula sumando los aportes de cada evaluación:

```text
Promedio = Σ (nota × porcentaje / 100)
```

Con notas `18, 17, 19, 18, 19` en Promedio Actual, el resultado es **18.40**.

- La validación actual acepta notas de **0 a 100**; para una escala de 0 a 20, ingresa tus notas en esa escala.
- Para calcular la calificación final, todas las notas deben estar completas y los porcentajes deben sumar **100%**.
- La condición de aprobado implementada utiliza un promedio desde **12.50**.
- El panel lateral muestra puntos acumulados mientras falten notas; los campos vacíos aportan 0 a ese acumulado.
- Cambiar de modo reemplaza las filas y notas del curso. Las tareas ya programadas se conservan. **Limpiar** borra las notas y mantiene las ponderaciones.

## Guardado y calendarios

El guardado automático empieza **desactivado**. Puedes trabajar durante la sesión o activar **Guardar automáticamente en este navegador** para conservar páginas, cursos, notas y tareas al recargar.

Los datos se almacenan en `localStorage`, dentro del navegador y dirección web utilizados. **No hay cuentas ni sincronización entre dispositivos.** Al desactivar el guardado se elimina la copia local; los datos de la sesión siguen disponibles hasta recargar o cerrar. La aplicación muestra un aviso cuando el guardado está desactivado.

Los respaldos JSON permiten trasladar los datos a otro navegador o dispositivo. Restaurar un respaldo solicita confirmación porque reemplaza todas las páginas actuales.

**Google Calendar no se sincroniza automáticamente con la agenda.** El enlace abre un evento que debes confirmar en Google Calendar; editarlo después en la aplicación no modifica el evento externo. Los archivos `.ICS` sirven para importar los eventos en calendarios compatibles. Las horas usan la zona del dispositivo y se exportan en UTC.

## Ejecutar localmente

Requisitos: **Node.js 24.x** —el entorno usado en Vercel—, npm y Git.

```bash
git clone https://github.com/MateoRiosdev/calculadora-notas-isil.git
cd calculadora-notas-isil
npm ci --legacy-peer-deps
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

El proyecto incluye `package-lock.json`. Ejecuta los comandos desde la carpeta que contiene ese archivo y `package.json`.

Se usa `--legacy-peer-deps` por la incompatibilidad de dependencias existente entre Next.js 14 y el adaptador de Cloudflare incluido en el repositorio. El comando instala el árbol actual sin migrar de versión principal. El despliegue utilizado es Vercel.

## Primeros pasos

1. Usa la calculadora libre o crea una página para tu ciclo.
2. Agrega un curso con su nombre, código/NRC opcional y color.
3. Selecciona el modo de cálculo e ingresa las notas y porcentajes.
4. Programa una evaluación desde el icono de calendario de su fila, o agrega una tarea independiente.
5. Revisa **Calendario** y **Cronograma** para organizar las entregas.
6. Activa el guardado si deseas conservar tu trabajo y descarga un respaldo para trasladarlo a otro dispositivo.

## Comprobaciones y producción

```bash
npx tsc --noEmit --incremental false
npm run lint
npm test
npm run build
npm start
```

Las seis pruebas de lógica cubren ponderación y modos de cálculo, períodos entre semanas y meses, validación de fechas, generación de `.ICS`, enlaces de Google Calendar y validación de respaldos JSON. Los comandos de TypeScript y lint se ejecutan por separado: la configuración actual de Next.js los omite durante el build.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| `app/` | Página principal, layout, estilos globales y favicon |
| `components/AcademicPlanner.tsx` | Páginas, cursos, calendario, cronograma y guardado |
| `components/Calculator.tsx` | Filas, validaciones y cálculo de notas |
| `components/AcademicSelect.tsx` | Selector personalizado con navegación por teclado |
| `components/AcademicDateTime.tsx` | Selección de fecha y hora |
| `components/CourseColorPicker.tsx` | Paleta de colores y entrada HEX |
| `components/ThemeProvider.tsx` | Estado y persistencia del tema |
| `lib/academic.ts` | Modelos, períodos, calendario, respaldos y exportación `.ICS` |
| `lib/grade-presets.ts` | Evaluaciones y ponderaciones iniciales |
| `types/` | Tipos compartidos de la calculadora |
| `public/` | Imágenes y recursos estáticos |
| `tests/` | Pruebas de lógica con el test runner de Node.js |

## Despliegue en Vercel

La configuración de `vercel.json` utiliza:

| Opción | Valor |
| --- | --- |
| Framework | Next.js |
| Instalación | `npm ci --legacy-peer-deps` |
| Compilación | `npm run build` |
| Desarrollo | `npm run dev` |

Configura la raíz del proyecto en la carpeta que contiene `package.json`. Si vinculas el repositorio a Vercel, los cambios en su rama de producción pueden desplegarse mediante la integración de Git.

**Aplicación:** [calculadora-notas-isil.vercel.app](https://calculadora-notas-isil.vercel.app/)

## Autor y derechos

Proyecto personal de **Mateo Julio Gomero Rios · MateoRiosdev**.

[GitHub](https://github.com/MateoRiosdev) · [LinkedIn](https://www.linkedin.com/in/mateojuliogomerorios/)

© 2026 Mateo Julio Gomero Rios. Todos los derechos reservados.
