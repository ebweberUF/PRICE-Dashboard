# PRICE Dashboard - Frontend

Next.js 15 web application for the PRICE Study Dashboard.

## Features

- **Framework:** Next.js 15 with App Router
- **UI:** React 19 with TypeScript
- **Authentication:** UF Shibboleth SSO (server-side)
- **Styling:** Tailwind CSS
- **State Management:** React Context + Server Components
- **API Client:** Fetch API with authentication

## Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication layouts
│   ├── dashboard/         # Main dashboard
│   ├── labs/              # Lab management
│   ├── studies/           # Study management
│   ├── participants/      # Participant tracking
│   └── admin/             # Admin panel
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── layouts/           # Layout components
│   └── features/          # Feature-specific components
├── lib/                    # Client utilities
│   ├── api/               # API client
│   ├── auth/              # Auth utilities
│   └── utils/             # Helper functions
└── styles/                 # Global styles
```

## Getting Started

See main README.md for setup instructions.

## Environment Variables

Required variables (create `.env.local` file):

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001

# Shibboleth (set by Nginx in production)
NEXT_PUBLIC_SSO_ENABLED=false
```

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Building

```bash
npm run build
npm run start
```

## Testing

```bash
npm run test
npm run test:watch
```
