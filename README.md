# 500 AI Residency

Landing page and visitor registration for the 500 AI Residency program.

## Structure

```
├── apps/
│   └── www/          # Next.js - landing, registration, guide
├── packages/
│   ├── ui/           # @residence/ui shared components
│   └── typescript-config/
└── turbo.json
```

## Quick Start

```bash
bun install
cp apps/www/.env.example apps/www/.env.local
# Edit .env.local with your NUVEQ_KEYTOKEN
bun dev
```

## Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun check        # Lint with Biome
bun fix          # Auto-fix lint issues
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NUVEQ_KEYTOKEN` | API key for Nuveq visitor registration |
