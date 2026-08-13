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

**Mateo Julio Gomero Rios**

- Portfolio: [Coming Soon]
- LinkedIn: [www.linkedin.com/in/mateojuliogomerorios]
- GitHub: [@MateoRiosdev](https://github.com/MateoRiosdev)

## 🙏 Acknowledgments

- ISIL (Instituto San Ignacio de Loyola) for the grading system reference
- Next.js team for the amazing framework
- Vercel for seamless deployment

---

**Built with ❤️ for ISIL students**
