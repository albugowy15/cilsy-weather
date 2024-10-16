# Cilsy Weather

Cilsy Weather is a comprehensive weather application that allows users to register, select their location, and receive up-to-date weather information. The project is built using a monorepo strategy with Turborepo, incorporating modern web technologies and microservices architecture.

## Project Structure

This monorepo consists of three applications and four shared packages:

### Applications

1. **Web**: A Next.js application serving as the front-end interface for users.
2. **Seeder**: A tool for seeding the MongoDB database.
3. **API**: An Express.js REST API providing weather data for the web application.

### Packages

1. **eslint-config**: Shared ESLint configuration.
2. **typescript-config**: Shared TypeScript configuration.
3. **jest-config**: Shared Jest testing configuration.
4. **tailwind-config**: Shared Tailwind CSS configuration.

## Features

- User registration and authentication with email and password
- Location-based weather data retrieval
- Real-time weather data updates
- Email notifications for refreshed weather data

## Technologies Used

- TypeScript
- Next.js
- Express.js
- Tailwind CSS
- MongoDB
- RabbitMQ
- Docker
