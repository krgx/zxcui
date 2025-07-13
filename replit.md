# replit.md

## Overview

This is a modern React-based furniture catalog application with a sophisticated configuration and pricing system. The application is designed as a frontend-only MVP that connects to an external FastAPI backend service for furniture data and pricing calculations. It features a responsive design with a comprehensive product configurator, real-time price calculations, and an intuitive admin-style interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build System**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod validation resolvers

### Backend Architecture
- **Server**: Express.js serving as a minimal proxy/static file server
- **External API**: All business logic handled by external FastAPI service at `http://212.193.27.132/fastapi/api/v1`
- **Development**: Custom Vite integration for hot module replacement and development experience

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Current State**: Memory storage implementation for development
- **Future Ready**: Database schema defined for collections, products, materials, mechanisms, and configurations
- **Migrations**: Drizzle Kit for schema management and migrations

## Key Components

### Core Pages
1. **Dashboard**: Overview with statistics and quick navigation
2. **Collections**: Browse furniture collections with product listings
3. **Configurator**: Interactive product customization with real-time pricing
4. **Calculator**: Advanced pricing calculator for multiple products

### UI Components
- **App Header**: Navigation bar with mobile-responsive design
- **App Sidebar**: Collapsible navigation with collection browsing
- **Product Card**: Reusable product display component
- **Configuration Panel**: Interactive product customization interface
- **Price Calculator**: Real-time pricing with detailed breakdowns

### Data Models
- **Collections**: Product groupings with metadata
- **Products**: Individual furniture items with base pricing
- **Materials**: Customizable material options with price multipliers
- **Mechanisms**: Additional features with fixed pricing
- **Configurations**: Predefined product setups

## Data Flow

1. **Initial Load**: Application fetches collections from external API
2. **Navigation**: Users browse collections and select products
3. **Configuration**: Interactive selection of materials, mechanisms, and options
4. **Pricing**: Real-time calculations sent to external pricing API
5. **State Management**: TanStack Query handles caching and synchronization

## External Dependencies

### Primary External Service
- **FastAPI Backend**: `http://212.193.27.132/fastapi/api/v1`
- **Authentication**: Basic auth with configurable credentials
- **Endpoints**: Collections, products, materials, mechanisms, pricing calculations

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing with Tailwind
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development
- **Hot Reloading**: Vite development server with Express proxy
- **Environment**: Node.js with ESM modules
- **Database**: In-memory storage for rapid development

### Production
- **Build Process**: Vite builds static assets, esbuild bundles server
- **Serving**: Express serves built React app and API proxy
- **Database**: PostgreSQL with Drizzle ORM (configured but not currently used)
- **External Dependencies**: FastAPI service for all business logic

### Configuration
- **Environment Variables**: Database URL, API endpoints, authentication
- **Static Assets**: Optimized build output with proper caching headers
- **Error Handling**: Comprehensive error boundaries and API error management

The architecture prioritizes rapid development and deployment while maintaining a clean separation between frontend presentation and external business logic. The system is designed to be easily extensible with additional features while keeping the core simple and maintainable.