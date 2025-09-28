// Mock data for Service Health Dashboard
import { SERVICE_STATUS, NODE_TYPES } from '../constants/dashboard';

export type ServiceStatus =
  (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];

export interface ServiceNodeData {
  id: string;
  type: (typeof NODE_TYPES)[keyof typeof NODE_TYPES];
  parent?: string;
  name: string;
  tech?: string;
  version?: string;
  status?: ServiceStatus;
}

export interface ConnectionData {
  id: string;
  source: string;
  target: string;
  status: ServiceStatus;
}

export const mockServicesData: {
  nodes: ServiceNodeData[];
  connections: ConnectionData[];
} = {
  nodes: [
    { id: 'prod-env', type: 'environment', name: 'Production' },
    { id: 'staging-env', type: 'environment', name: 'Staging' },
    {
      id: 'frontend-app',
      type: 'service',
      parent: 'prod-env',
      name: 'React Frontend',
      tech: 'React',
      version: '2.1.0',
      status: 'HEALTHY',
    },
    {
      id: 'user-api',
      type: 'service',
      parent: 'prod-env',
      name: 'User API',
      tech: 'Node.js',
      version: '1.8.2',
      status: 'HEALTHY',
    },
    {
      id: 'auth-service',
      type: 'service',
      parent: 'prod-env',
      name: 'Auth Service',
      tech: 'Go',
      version: '1.5.0',
      status: 'DEGRADED',
    },
    {
      id: 'postgres-db',
      type: 'service',
      parent: 'prod-env',
      name: 'PostgreSQL DB',
      tech: 'PostgreSQL',
      version: '14.2',
      status: 'HEALTHY',
    },
    {
      id: 'redis-cache',
      type: 'service',
      parent: 'prod-env',
      name: 'Redis Cache',
      tech: 'Redis',
      version: '7.0',
      status: 'OFFLINE',
    },
    {
      id: 'staging-api',
      type: 'service',
      parent: 'staging-env',
      name: 'Staging User API',
      tech: 'Node.js',
      version: '1.9.0-rc',
      status: 'HEALTHY',
    },
  ],
  connections: [
    {
      id: 'conn-1',
      source: 'frontend-app',
      target: 'user-api',
      status: 'HEALTHY',
    },
    {
      id: 'conn-2',
      source: 'user-api',
      target: 'postgres-db',
      status: 'HEALTHY',
    },
    {
      id: 'conn-3',
      source: 'user-api',
      target: 'auth-service',
      status: 'DEGRADED',
    },
    {
      id: 'conn-4',
      source: 'user-api',
      target: 'redis-cache',
      status: 'OFFLINE',
    },
    {
      id: 'conn-5',
      source: 'auth-service',
      target: 'postgres-db',
      status: 'HEALTHY',
    },
    {
      id: 'conn-6',
      source: 'staging-api',
      target: 'postgres-db',
      status: 'HEALTHY',
    },
  ],
};

// Mock real-time metrics generator
export const generateMetrics = (): {
  rps: number;
  latency: number;
  errorRate: number;
} => ({
  rps: Math.floor(Math.random() * (1000 - 300) + 300),
  latency: Math.floor(Math.random() * (250 - 50) + 50),
  errorRate: Math.round(Math.random() * 5 * 100) / 100,
});

// Mock status updater for real-time simulation
export const getRandomStatus = (): ServiceStatus => {
  const statuses: ServiceStatus[] = [
    SERVICE_STATUS.HEALTHY,
    SERVICE_STATUS.DEGRADED,
    SERVICE_STATUS.OFFLINE,
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
