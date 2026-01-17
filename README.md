# ConnectEd

A community platform designed to connect international people who are living abroad or planning to move. ConnectEd brings people together to share opportunities, support, and useful information related to jobs, housing, relocation, and daily life.

This space is about solidarity, collaboration, and real-life support, making it easier to settle, grow, and succeed wherever you are in the world.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **State Management**: 
  - [Zustand](https://zustand-demo.pmnd.rs/) (Client state)
  - [TanStack Query](https://tanstack.com/query) (Server state)
- **Database**: Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- A Supabase project ([Create one here](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd connect-ed
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
connect-ed/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   ├── (main)/                   # Main app route group
│   ├── api/                      # API routes
│   └── layout.tsx                # Root layout
│
├── client/                       # Client-side code
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── features/             # Feature-specific components
│   │   ├── layout/               # Layout components
│   │   └── shared/               # Shared components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Client utilities & validations
│   └── providers/                # React Context providers
│
├── services/                     # Business logic & API communication
│   ├── api/                      # API client setup (Supabase)
│   ├── features/                 # Feature-specific services
│   └── queries/                  # TanStack Query hooks
│
├── store/                        # Zustand stores
│   └── features/                 # Feature-specific stores
│
├── types/                        # TypeScript types
│   ├── domain/                   # Domain models
│   └── api/                      # API types
│
├── theme/                        # Theme & styling
│   └── colors.ts                 # ConnectEd color system
│
├── translations/                 # i18n translation files
│   └── en/                       # English translations
│
└── config/                       # Configuration files
    └── env.ts                    # Typed environment variables
```

## Architecture Principles

- **Separation of Concerns**: Clear separation between client, services, store, and types
- **Feature-Based Organization**: Components, hooks, and services organized by feature domain
- **Type Safety**: Full TypeScript coverage with strict typing
- **Domain-Driven Design**: Domain models separated from API types
- **Reusability**: Shared components, hooks, and utilities in dedicated folders

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

### Implemented (Layer 0 & 1)

✅ **Authentication Foundation**
- User domain model
- Authentication state handling with Zustand
- Authorization rules and helpers
- User signup (email & password)
- User login
- User logout

### Planned (See [PRD](prd.md))

- Layer 2: Core Content Model (Listings, Categories)
- Layer 3: Read Paths (Public Feed, Listing Detail)
- Layer 4: Filtering & Search
- Layer 5: Write Actions (Create/Edit Listings)
- Layer 6: Comments System
- Layer 7: Private Messaging

## Development Guidelines

- Follow the project's TypeScript conventions (readonly properties, strict typing)
- Keep files under 200 lines - split into smaller modules when needed
- Reuse existing components/services before creating new ones
- Use the established folder structure for new features
- Follow the PRD specifications for feature implementation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## License

[Add your license here]
