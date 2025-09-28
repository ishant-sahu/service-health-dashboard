# Service Health Dashboard

A responsive, single-page application that provides a real-time visual map of microservices architecture, designed for DevOps Engineers and Site Reliability Engineers (SREs) to monitor service health and performance.

## 🎯 Project Overview

This dashboard visualizes application services and their connections, allowing engineers to quickly identify performance bottlenecks, outages, and service dependencies. The application displays services grouped by environment (Production/Staging) with real-time health indicators and interactive details panels.

## ✨ Features

### Core Functionality

- **Service Map Visualization**: Interactive graph showing microservices and their connections
- **Environment Grouping**: Services organized by Production and Staging environments
- **Real-time Health Monitoring**: Visual indicators for service status (Healthy, Degraded, Offline)
- **Interactive Details Panel**: Click on services or connections to view detailed information
- **Real-time Metrics Simulation**: Live updates for RPS, latency, and error rates

### Visual Indicators

- 🟢 **HEALTHY**: Green indicator for fully operational services
- 🟠 **DEGRADED**: Orange/Amber indicator for services with issues
- 🔴 **OFFLINE**: Red indicator for non-functional services

### Interactive Features

- **Hover Tooltips**: Quick status information on hover
- **Click Selection**: Detailed information in the sidebar panel
- **Real-time Updates**: Metrics refresh every 2-3 seconds for selected connections

## 🛠️ Tech Stack

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS with Radix UI components
- **Visualization**: React Flow for service topology rendering
- **State Management**: React hooks and context
- **Icons**: Lucide React
- **Charts**: D3.js for metrics visualization

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components (Radix UI)
│   ├── ServiceHealthDashboard.tsx  # Main dashboard component
│   ├── ServiceNode.tsx         # Individual service node component
│   ├── EnvironmentNode.tsx     # Environment grouping component
│   ├── CustomEdge.tsx          # Connection line component
│   └── DetailsPanel.tsx        # Sidebar details panel
├── data/
│   └── mock.ts                 # Mock service data
├── hooks/
│   └── use-toast.ts           # Toast notification hook
├── lib/
│   └── utils.ts               # Utility functions
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

- Service status colors can be modified in `src/index.css`
- Layout breakpoints are defined in `tailwind.config.js`
- Mock data can be updated in `src/data/mock.ts`

## 📈 Real-time Metrics

For selected connections, the dashboard simulates real-time metrics:

- **Requests Per Second (RPS)**: 300-1000 range
- **Average Latency**: 50-250ms range
- **Error Rate**: 0.00% - 5.00% range

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
