# Pokedex Web Application

A fast, responsive, and fully functional Pokedex web application built with **Next.js 14**, **TypeScript**, and the official [PokeAPI](https://pokeapi.co/).

## ✨ Features

### Core Functionality
- 🔍 **Search** - Find Pokémon by name or ID with debounced search
- 🎯 **Filters** - Filter Pokémon by type
- ↩️ **Sorting** - Sort by ID or alphabetically by name
- 📊 **Statistics Visualization** - Base stats displayed in interactive bar charts
- ⭐ **Favorites** - Mark and view your favorite Pokémon (persisted in localStorage)
- 🔄 **Comparison** - Compare up to 3 Pokémon side-by-side

### Technical Features
- ⚡ Optimized performance with Next.js image optimization and caching strategies
- 📱 Mobile-first responsive design
- 🔒 Strict TypeScript type safety throughout the application
- ✅ Comprehensive test coverage (target: 80%)

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | TailwindCSS |
| **State Management** | React Hooks + localStorage |
| **Testing** | Vitest + Testing Library |
| **Visualization** | Recharts |
| **API** | PokeAPI v2 |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm, npm, or yarn package manager

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/hfelixmiguel/pokefedex-app.git
cd pokefedex-app

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
pokefedex-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Main search page
│   │   └── pokemon/[id]/    # Individual Pokémon details
│   ├── components/          # React components
│   ├── lib/
│   │   └── pokeapi.ts       # PokeAPI client & utilities
│   ├── types/
│   │   └── pokemon.ts       # TypeScript type definitions
│   └── tests/               # Test suite
├── .github/workflows/       # CI/CD pipelines
├── public/                  # Static assets
├── PRD.md                   # Product Requirements Document
├── PLAN.md                   # Roadmap and backlog
└── status/project_log.txt    # Development log
```

## 📚 API Documentation

All Pokémon data is fetched from: https://pokeapi.co/api/v2/

### Key Endpoints Used

- `GET /pokemon?limit=151` - All Pokémon list with pagination support
- `GET /pokemon/{id}` - Individual Pokémon details and stats
- `GET /pokemon-species/{id}` - Species information and lore
- `GET /type` - Type information for filtering

## 🧪 Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage report
pnpm test:coverage
```

## 📊 Routes Overview

| Route | Description |
|-------|-------------|
| `/` (home) | Main search interface with filters and sorting |
| `/pokemon/[id]` | Detailed Pokémon view with stats visualization |
| `/favorites` | Collection of marked favorite Pokémon |
| `/compare` | Side-by-side comparison tool |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with conventional commits format
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Format
```
<type> #[ISSUE_ID]: <description>

Types: feat, fix, refactor, chore, docs, test
```

## 📝 License

This project is built as part of the autonomous GitHub MCP workflow demonstration.

---

**Status**: ⚡ In Active Development - Follows Issue → PR → Merge workflow for all changes
