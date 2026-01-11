# Boligbolig - AI-drevet Ejendomsplatform

En moderne ejendomsplatform der muliggør anonyme "skuffesager" med intelligent matching og cirkulære byttehandler.

## Funktioner

- **Anonyme skuffesager**: Sælg din bolig anonymt uden offentlig annoncering
- **Intelligent matching**: AI-drevet matchmaking mellem købere og sælgere
- **Ring-matching**: Cirkulære byttehandler mellem flere parter
- **Pris-slider med real-time feedback**: Se hvor mange købere der matcher ved forskellige priser
- **Indbygget auktionssystem**: Hold lukkede auktioner med forhåndsgodkendte købere

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + tRPC
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Auth**: Supabase Auth (med MitID integration planlagt)
- **Storage**: Supabase Storage

## 🚀 Quick Start

**Want to see it running right now?** Check out [QUICKSTART.md](./QUICKSTART.md) for a 2-minute setup guide!

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Projekt Status

Dette projekt er nu i **MVP-fase** med en funktionsdygtig prototype! ✨

**Implementeret:**

- ✅ Database schema migration med alle nødvendige tabeller
- ✅ TypeScript type definitions med fuld type-safety
- ✅ Projekt konfiguration (Next.js 15, tRPC, Tailwind CSS)
- ✅ Mock database layer for lokal udvikling (ingen Supabase påkrævet)
- ✅ tRPC API med property, buyer og match endpoints
- ✅ Complete UI med responsive design:
  - Landing page
  - Property browsing page
  - Multi-step property creation
- ✅ **Real-time Price Slider** med live buyer count feedback! 🎯
- ✅ 7 mock properties + 5 buyer profiles

**Se platformen:**
- Home: http://localhost:3000
- Browse boliger: http://localhost:3000/koeb
- **Pris-slider demo:** http://localhost:3000/saelg/ny (Step 2)

## Database Schema

Databasen er organiseret omkring følgende hoveddomæner:

### Boliger (Properties)
- Anonyme boligprofiler med regional placering
- Krypterede adresser der først afsløres efter match
- Support for forskellige boligtyper (villa, lejlighed, etc.)

### Køberprofiler
- Detaljerede søgekriterier med fleksibilitet
- Multi-region præferencer med prioritering
- Link til egen bolig for ring-matching

### Matching Engine
- Direkte 1:1 matches med score-baseret algoritme
- Ring-matches for cirkulære handler
- Real-time køberantal-beregning

### Auktioner & Services
- Tidsbaserede auktioner med reserve-priser
- Tilkøbsservices (juridisk, fotografering, etc.)

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run Supabase migrations
npm run db:migrate

# Start development server
npm run dev
```

## Database Migration

Databasen bruger Supabase migrations. Den initielle schema findes i:

```
supabase/migrations/001_initial_schema.sql
```

Denne migration inkluderer:
- Alle tabeller med proper constraints og indexes
- PostGIS extension for geografiske queries
- Helper functions til matching-algoritmer
- Auto-updating timestamps

## Type System

TypeScript types matcher databasen 1:1 og findes i:

```
src/types/database.ts
```

Inkluderer:
- Alle database tabeller som interfaces
- Enums for status-felter
- Composite types for joins
- Request/response types til API

## Næste Skridt

1. [ ] Implementer Supabase client configuration
2. [ ] Set up tRPC router structure
3. [ ] Create basic UI components
4. [ ] Implement matching algorithm
5. [ ] Add authentication flow
6. [ ] Implement price slider with real-time feedback

## Licens

Proprietary - Alle rettigheder forbeholdes
