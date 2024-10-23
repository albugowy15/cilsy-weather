# Cilsy Weather

Cilsy Weather is a feature-rich weather application that allows users to save their favorite locations and receive real-time weather updates. Built using modern web technologies and a scalable microservices architecture powered by Turborepo.

## Features

- **Save Favorite Locations**: Users can store multiple locations for quick access.
- **Real-Time Weather Updates**: Get the latest weather information for saved locations.
- **Powered by OpenWeatherMap**: Weather data is sourced from the OpenWeatherMap API.
- **Notifications**: Receive real-time notifications for weather updates via a message queue system.
- **Scalable Architecture**: Built using microservices for easy scaling and maintenance.

## Architecture

This project is organized as a monorepo using Turborepo, consisting of multiple apps and shared packages for streamlined development and consistency.

### Apps

- `web`: A Next.js frontend providing the user interface.
- `api`: An Express.js backend that communicates with the OpenWeatherMap API and handles user data.E
- `seeder`: Seeds the MongoDB database with initial data.
- `notification`: A message queue consumer using RabbitMQ to handle real-time weather notifications.

### Packages

- `eslint-config`: Centralized ESLint configurations for consistent code styling.
- `jest-presets`: Shared Jest configurations for unit testing.
- `types`: TypeScript type definitions shared across services.
- `typescript-config`: Shared TypeScript configurations to ensure consistency in type checking.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Express.js
- **Databases**:
  - MongoDB (Main database)
  - Redis (Caching)
- **Message Queue**: RabbitMQ
- **DevOps**: Docker, Docker Compose
- **Weather Data**: OpenWeatherMap API

## Prerequisites

- Node.js (>=18)
- Docker and Docker Compose
- OpenWeatherMap API key

## Environment Variables

Each application in the monorepo requires specific environment variables. Example `.env` files for each app can be found in their respective directories. For development purposes, use the provided `.env.example` files as a template.

Make sure to generate your own OpenWeatherMap API key and save it as `OPENWEATHERMAP_APPID` in the `.env` files for the `api` and `notification` apps, and also include this environment variable in your docker-compose.yml configuration. This key is required for making requests to the OpenWeatherMap API.

In the `.env` files:

```sh
OPENWEATHERMAP_APPID=<your_api_key>
```

In the `docker-compose.yml`:

```yaml
version: "3.8"
services:
  api:
    environment:
      - OPENWEATHERMAP_APPID=${OPENWEATHERMAP_APPID}
  notification:
    environment:
      - OPENWEATHERMAP_APPID=${OPENWEATHERMAP_APPID}
```

## Getting Started

To get the project up and running locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/albugowy15/cilsy-weather.git
cd cilsy-weather
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env` files based on the provided examples.

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
cp apps/notification/.env.example apps/notification/.env
cp apps/seeder/.env.example apps/seeder/.env
```

**Important**: Add your OpenWeatherMap API key to the .env files for the api and notification apps and also the docker compose.

```sh
# .env
OPENWEATHERMAP_APPID=<your_api_key>

# docker-compose.yml
- OPENWEATHERMAP_APPID=<your-key>

```

4. Start the development environment using Docker:

```bash
docker-compose up -d
```

5. Run the database seeder to populate the database with initial data::

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
