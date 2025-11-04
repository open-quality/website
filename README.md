# OpenQuality.cloud

Official website for OpenQuality - A modern, open-source test management platform.

## Overview

This repository contains the marketing website for OpenQuality, built with modern web technologies and designed to showcase the platform's features, use cases, and benefits.

## Features

- **Modern CNCF-style Design** - Clean, professional design inspired by Cloud Native Computing Foundation projects
- **3D Animated Hero** - Interactive Three.js sphere animation in the header
- **Smooth Scroll Animations** - Framer Motion for engaging user experience
- **Responsive Layout** - Mobile-first design that works on all devices
- **Fast & Optimized** - Built with Vite for optimal performance
- **GitHub Pages Deployment** - Automated CI/CD workflow included

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the site.

### Build

```bash
npm run build
```

The production build will be in `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages with a custom domain.

### Setup Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add OpenQuality website"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

3. **Configure Custom Domain**
   - In **Settings** → **Pages** → **Custom domain**, enter: `openquality.cloud`
   - Click **Save**
   - Check **Enforce HTTPS** (after DNS propagates)

4. **Configure DNS Records**

   Add these DNS records at your domain registrar:

   **For apex domain (openquality.cloud):**
   - Type: `A`
   - Name: `@`
   - Values (add all 4):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

   **For www subdomain (optional):**
   - Type: `CNAME`
   - Name: `www`
   - Value: `YOUR_USERNAME.github.io`

5. **Deploy**
   - Deployment happens automatically on push to `main`
   - Or manually trigger from the **Actions** tab

Your site will be available at: `https://openquality.cloud/`

### Alternative: GitHub Pages Subdomain

If you don't want to use a custom domain, update `vite.config.ts`:
```ts
export default defineConfig({
  plugins: [react()],
  base: '/openquality.cloud/',  // Use repo name as base
})
```

And remove the `public/CNAME` file. Your site will be at `https://YOUR_USERNAME.github.io/openquality.cloud/`

## Project Structure

```
openquality.cloud/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/
│   ├── logo.svg               # OpenQuality logo
│   └── logo-rect.svg          # Rectangular logo variant
├── src/
│   ├── App.tsx                # Main application
│   ├── App.css                # Styles
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Next-generation frontend build tool
- **Three.js** - 3D graphics for hero animation
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **Framer Motion** - Production-ready animation library

## Content

The website showcases:

- **Problem/Solution** - Why OpenQuality exists and what it solves
- **Key Features** - Complete visibility, actionable insights, universal integration, etc.
- **Use Cases** - CI/CD integration, multi-environment testing, regression analysis, etc.
- **Target Audience** - Small to medium teams, DevOps teams, regulated industries, open source projects
- **Tech Stack** - Technologies used in the OpenQuality platform
- **Quick Start** - Installation and setup instructions

## Customization

### Update Content

Edit `src/App.tsx` to modify:
- Hero section text and tagline
- Features and benefits
- Use cases
- Target audience information
- Quick start guide

### Update Styling

Edit `src/App.css` to customize:
- Color scheme (CSS custom properties in `:root`)
- Typography and fonts
- Spacing and layout
- Animation timing
- Responsive breakpoints

### Modify 3D Animation

The animated sphere can be customized in the `AnimatedSphere` component in `src/App.tsx`:
- Change colors with the `color` prop
- Adjust distortion with the `distort` prop (0.0 - 1.0)
- Modify animation speed with the `speed` prop
- Change material properties (`roughness`, `metalness`)

Example:
```tsx
<Sphere args={[1, 100, 200]} scale={2.5}>
  <MeshDistortMaterial
    color="#FF0000"      // Change color
    distort={0.5}        // More distortion
    speed={2}            // Faster animation
    roughness={0.1}      // Shinier surface
    metalness={0.9}      // More metallic
  />
</Sphere>
```

## Related Links

- [OpenQuality Platform](https://github.com/openquality/platform) - Main platform repository
- [Platform Documentation](https://github.com/openquality/platform/tree/main/docs) - Technical documentation
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D graphics documentation
- [Framer Motion](https://www.framer.com/motion/) - Animation library docs
- [Vite](https://vitejs.dev/) - Build tool documentation

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - Same as the OpenQuality platform

---

Built with ❤️ for the developer community
