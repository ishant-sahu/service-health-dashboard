# Service Health Dashboard

A modern, responsive single-page application that provides a real-time visual map of microservices architecture, designed for DevOps Engineers and Site Reliability Engineers (SREs) to monitor service health and performance.

## 🎯 Project Overview

This dashboard visualizes application services and their connections, allowing engineers to quickly identify performance bottlenecks, outages, and service dependencies. The application displays services grouped by environment (Production/Staging) with real-time health indicators, interactive details panels, and comprehensive metrics visualization.

## ✨ Features

### Core Functionality

- **Service Map Visualization**: Interactive graph showing microservices and their connections
- **Environment Grouping**: Services organized by Production and Staging environments
- **Real-time Health Monitoring**: Visual indicators for service status (Healthy, Degraded, Offline)
- **Interactive Details Panel**: Click on services or connections to view detailed information
- **Real-time Metrics Simulation**: Live updates for RPS, latency, and error rates
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Theme Support**: Light and dark mode toggle
- **Centralized Configuration**: All constants and styling centralized for easy maintenance

### Visual Indicators

- 🟢 **HEALTHY**: Green indicator for fully operational services
- 🟠 **DEGRADED**: Orange/Amber indicator for services with issues
- 🔴 **OFFLINE**: Red indicator for non-functional services

### Interactive Features

- **Hover Tooltips**: Quick status information on hover
- **Click Selection**: Detailed information in the sidebar panel
- **Real-time Updates**: Metrics refresh every 2-3 seconds for selected connections
- **Chart Visualization**: Real-time charts for RPS, latency, and error rates
- **Responsive Panel**: Details panel adapts to screen size
- **Smooth Animations**: Hover effects and transitions for better UX

## 🛠️ Tech Stack

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS with Radix UI components
- **Visualization**: React Flow for service topology rendering
- **Charts**: Recharts for real-time metrics visualization
- **State Management**: React hooks and custom services
- **Icons**: Lucide React
- **UI Components**: Comprehensive Radix UI component library
- **Form Handling**: React Hook Form with Zod validation
- **Theme**: Next Themes for dark/light mode support

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components (Radix UI)
│   ├── charts/                 # Chart components
│   │   ├── RealTimeChart.tsx   # Real-time metrics chart
│   │   └── index.ts            # Chart exports
│   ├── ServiceHealthDashboard.tsx  # Main dashboard component
│   ├── ServiceNode.tsx         # Individual service node component
│   ├── EnvironmentNode.tsx     # Environment grouping component
│   ├── CustomEdge.tsx          # Connection line component
│   ├── DetailsPanel.tsx        # Sidebar details panel
│   └── DashboardHeader.tsx     # Dashboard header component
├── constants/
│   └── dashboard.ts            # Centralized constants and configuration
├── data/
│   └── mock.ts                 # Mock service data
├── hooks/
│   ├── useConnectionMetrics.ts # Connection metrics hook
│   ├── useStatusUpdates.ts     # Status update hook
│   └── useToast.ts             # Toast notification hook
├── services/
│   ├── CacheService.ts         # Caching service
│   ├── MetricsService.ts       # Metrics data service
│   ├── StatusService.ts        # Status update service
│   └── StreamService.ts        # Real-time streaming service
├── utils/
│   └── responsive.ts           # Responsive utility functions
├── lib/
│   └── utils.ts                # General utility functions
├── App.tsx                     # Main application component
└── main.tsx                    # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd service-health-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Data Structure

The application uses a predefined JSON structure for service data:

```json
{
  "nodes": [
    {
      "id": "prod-env",
      "type": "environment",
      "name": "Production"
    },
    {
      "id": "frontend-app",
      "type": "service",
      "parent": "prod-env",
      "name": "React Frontend",
      "tech": "React",
      "version": "2.1.0",
      "status": "HEALTHY"
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "source": "frontend-app",
      "target": "user-api",
      "status": "HEALTHY"
    }
  ]
}
```

## 🎨 Design Guidelines

- **Clarity**: Clean, readable interface with good contrast
- **Professional**: Modern, polished aesthetic suitable for enterprise use
- **Responsive**: Optimized for desktop and tablet viewing
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for any environment-specific configurations:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_REFRESH_INTERVAL=3000
```

### Customization

- **Constants**: All configuration constants are centralized in `src/constants/dashboard.ts`
- **Colors**: Service status colors, themes, and UI colors can be modified in constants
- **Layout**: Responsive breakpoints and dimensions are defined in constants
- **Mock Data**: Service data can be updated in `src/data/mock.ts`
- **Styling**: Tailwind CSS classes are managed through constants for consistency

## 📈 Real-time Metrics

For selected connections, the dashboard simulates real-time metrics:

- **Requests Per Second (RPS)**: 300-1000 range
- **Average Latency**: 50-250ms range
- **Error Rate**: 0.00% - 5.00% range

## 🏗️ Architecture & Design Patterns

### Component Architecture

- **Modular Design**: Each component is self-contained with clear responsibilities
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Constants-Driven**: All hardcoded values replaced with centralized constants
- **Responsive First**: Mobile-first design with progressive enhancement

### State Management

- **Custom Hooks**: Specialized hooks for metrics, status updates, and UI state
- **Service Layer**: Dedicated services for caching, metrics, and streaming
- **Real-time Updates**: Efficient data streaming with connection-specific metrics

### Code Quality

- **ESLint Configuration**: Comprehensive linting rules for code quality
- **Consistent Styling**: Centralized color and layout constants
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance**: Optimized rendering with React Flow and efficient re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs` folder

---

Built with ❤️ for DevOps teams who need reliable service monitoring.
