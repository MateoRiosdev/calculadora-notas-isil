# 🚀 Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
```
http://localhost:3000
```

---

## 📝 Available Commands

### Development
```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Git Commands
```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: Calculadora de Notas"
git branch -M main

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/calculadora-de-notas.git
git push -u origin main

# Subsequent pushes
git add .
git commit -m "Your commit message"
git push
```

### Vercel Deployment
```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod

# Other commands
vercel ls        # List deployments
vercel logs      # View logs
vercel open      # Open project dashboard
```

---

## 📚 Documentation Files

| File | Purpose | Language |
|------|---------|----------|
| `INSTRUCCIONES.md` | Quick start guide | 🇪🇸 Spanish |
| `README.md` | Full documentation | 🇬🇧 English |
| `DEPLOYMENT.md` | Vercel deployment guide | 🇬🇧 English |
| `PROJECT.md` | Technical summary | 🇬🇧 English |
| `INDEX.md` | Project file index | 🇬🇧 English |
| `SUMMARY.md` | Project completion summary | 🇬🇧 English |
| `QUICKSTART.md` | This file | 🇬🇧 English |

---

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Test locally with `npm run dev`
3. ✅ Push to GitHub
4. ✅ Deploy to Vercel
5. ✅ Add to your CV/LinkedIn

---

## 🆘 Common Issues

### Port 3000 already in use?
```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

### Module not found?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
npm run build
# Read the error message and fix accordingly
```

---

## 🔗 Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vercel**: https://vercel.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Ready to start? Run `npm install` now!** 🚀
