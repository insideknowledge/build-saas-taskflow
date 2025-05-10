# TaskFlow - Task Automation Application

A modern task management application with powerful automation capabilities built with Next.js 13, Tailwind CSS, and shadcn/ui.

## Features

- 📋 Task Management
- 🏷️ Custom Tags
- 🤖 Task Automation
- 📊 Dashboard Analytics
- 🌓 Dark/Light Mode
- 📱 Responsive Design
- 🔔 Notifications
- ⚡ Performance Optimized

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
taskflow/
├── app/                    # Next.js 13 app directory
│   ├── automations/       # Automation management
│   ├── settings/          # Application settings
│   ├── tags/             # Tag management
│   ├── tasks/            # Task management
│   └── upcoming/         # Upcoming tasks view
├── components/
│   ├── features/         # Feature-specific components
│   ├── layout/          # Layout components
│   └── ui/              # UI components (shadcn/ui)
├── lib/                  # Utilities and types
│   ├── store.ts         # Global state management
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## Development

### Code Style

- Use TypeScript for type safety
- Follow Next.js 13 best practices
- Implement proper error handling
- Write meaningful comments
- Use consistent naming conventions

### State Management

The application uses Zustand for state management with the following stores:
- Task Store: Manages tasks, tags, and automations
- Filter Store: Handles task filtering and search

### Components

- Use the "use client" directive for client-side components
- Implement proper prop types
- Follow component composition patterns
- Use proper error boundaries

## Production Deployment

### Build

```bash
npm run build
```

### Performance Optimization

- Implement proper code splitting
- Optimize images and assets
- Use proper caching strategies
- Implement proper error handling
- Use proper SEO meta tags

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - see LICENSE file for details