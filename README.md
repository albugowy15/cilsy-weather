# Cilsy Weather

A comprehensive weather application that allows users to save locations and receive real-time weather updates. Built with modern technologies and a microservices architecture using Turborepo.

## Features

- Save favorite locations
- Get real-time weather updates for saved locations
- Weather data powered by OpenWeatherMap API
- Real-time notifications for weather updates
- Microservices architecture for scalability

## Architecture

This project is structured as a monorepo using Turborepo with multiple apps and shared packages:

### Apps

- `web`: Next.js frontend application
- `api`: Express.js backend service
- `seeder`: MongoDB database seeder
- `notification`: Message queue consumer for notifications

### Packages

- `eslint-config`: Shared ESLint configurations
- `jest-presets`: Shared Jest configurations
- `types`: Shared TypeScript types
- `typescript-config`: Shared TypeScript configurations

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Express.js
- **Databases**:
  - MongoDB (Main database)
  - Redis (Caching & Queue)
- **Message Queue**: RabbitMQ
- **DevOps**: Docker, Docker Compose
- **Weather Data**: OpenWeatherMap API

## Prerequisites

- Node.js (>=18)
- Docker and Docker Compose
- OpenWeatherMap API key

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/albugowy15/cilsy-weather.git
cd cilsy-weather
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` files based on the provided examples:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
cp apps/notification/.env.example apps/notification/.env
cp apps/seeder/.env.example apps/seeder/.env
```

4. Start the development environment using Docker:

```bash
docker-compose up -d
```

5. Run the database seeder:

```bash
pnpm seed
```

## Project Structure

```
cilsy-weather/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # Express.js backend
│   ├── seeder/           # Database seeder
│   └── notification/     # Notification service
├── packages/
│   ├── eslint-config/    # Shared ESLint config
│   ├── jest-presets/     # Shared Jest config
│   ├── types/            # Shared TypeScript types
│   └── typescript-config/# Shared TS config
└── package.json
```

## Development

### Available Scripts

- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all applications and packages
- `pnpm lint` - Run ESLint across the entire project
- `pnpm test` - Run tests across all applications
- `pnpm seed` - Run database seeder

### Docker Services

The project includes Docker Compose configuration for the following services:

- MongoDB
- Redis
- RabbitMQ

## Environment Variables

Each application requires specific environment variables. Check the `.env.example` files in each app directory for required variables.
