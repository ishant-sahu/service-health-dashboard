import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateMetrics,
  getRandomStatus,
  mockServicesData,
} from '../../data/mock';
import { SERVICE_STATUS } from '../../constants/dashboard';

describe('Mock Data Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMetrics', () => {
    it('should generate metrics within specified ranges', () => {
      const metrics = generateMetrics();

      expect(metrics.rps).toBeGreaterThanOrEqual(300);
      expect(metrics.rps).toBeLessThanOrEqual(1000);
      expect(metrics.latency).toBeGreaterThanOrEqual(50);
      expect(metrics.latency).toBeLessThanOrEqual(250);
      expect(metrics.errorRate).toBeGreaterThanOrEqual(0);
      expect(metrics.errorRate).toBeLessThanOrEqual(5);
    });

    it('should generate different metrics on multiple calls', () => {
      const metrics1 = generateMetrics();
      const metrics2 = generateMetrics();

      // While it's possible they could be the same due to randomness,
      // it's very unlikely with the ranges we're using
      const isDifferent =
        metrics1.rps !== metrics2.rps ||
        metrics1.latency !== metrics2.latency ||
        metrics1.errorRate !== metrics2.errorRate;

      expect(isDifferent).toBe(true);
    });

    it('should generate valid numeric values', () => {
      const metrics = generateMetrics();

      expect(typeof metrics.rps).toBe('number');
      expect(typeof metrics.latency).toBe('number');
      expect(typeof metrics.errorRate).toBe('number');
      expect(Number.isFinite(metrics.rps)).toBe(true);
      expect(Number.isFinite(metrics.latency)).toBe(true);
      expect(Number.isFinite(metrics.errorRate)).toBe(true);
    });

    it('should generate integer values for rps and latency', () => {
      const metrics = generateMetrics();

      expect(Number.isInteger(metrics.rps)).toBe(true);
      expect(Number.isInteger(metrics.latency)).toBe(true);
    });

    it('should generate error rate with proper decimal precision', () => {
      const metrics = generateMetrics();

      // Error rate should be rounded to 2 decimal places
      const decimalPlaces = (metrics.errorRate.toString().split('.')[1] || '')
        .length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('getRandomStatus', () => {
    it('should return a valid service status', () => {
      const status = getRandomStatus();

      expect(Object.values(SERVICE_STATUS)).toContain(status);
    });

    it('should return different statuses on multiple calls', () => {
      const statuses = Array.from({ length: 10 }, () => getRandomStatus());
      const uniqueStatuses = new Set(statuses);

      // Should have at least 2 different statuses in 10 calls
      expect(uniqueStatuses.size).toBeGreaterThanOrEqual(2);
    });

    it('should eventually return all possible statuses', () => {
      const statuses = new Set();
      const maxAttempts = 100;

      for (let i = 0; i < maxAttempts; i++) {
        statuses.add(getRandomStatus());
        if (statuses.size === Object.keys(SERVICE_STATUS).length) {
          break;
        }
      }

      expect(statuses.size).toBe(Object.keys(SERVICE_STATUS).length);
    });
  });

  describe('mockServicesData', () => {
    it('should have valid structure', () => {
      expect(mockServicesData).toHaveProperty('nodes');
      expect(mockServicesData).toHaveProperty('connections');
      expect(Array.isArray(mockServicesData.nodes)).toBe(true);
      expect(Array.isArray(mockServicesData.connections)).toBe(true);
    });

    it('should have environment nodes', () => {
      const environmentNodes = mockServicesData.nodes.filter(
        (node) => node.type === 'environment'
      );

      expect(environmentNodes.length).toBeGreaterThan(0);
      expect(environmentNodes.every((node) => node.name)).toBe(true);
    });

    it('should have service nodes', () => {
      const serviceNodes = mockServicesData.nodes.filter(
        (node) => node.type === 'service'
      );

      expect(serviceNodes.length).toBeGreaterThan(0);
      serviceNodes.forEach((node) => {
        expect(node).toHaveProperty('name');
        expect(node).toHaveProperty('tech');
        expect(node).toHaveProperty('version');
        expect(node).toHaveProperty('status');
        expect(node).toHaveProperty('parent');
      });
    });

    it('should have valid service statuses', () => {
      const serviceNodes = mockServicesData.nodes.filter(
        (node) => node.type === 'service'
      );

      serviceNodes.forEach((node) => {
        expect(Object.values(SERVICE_STATUS)).toContain(node.status);
      });
    });

    it('should have valid connections', () => {
      mockServicesData.connections.forEach((connection) => {
        expect(connection).toHaveProperty('id');
        expect(connection).toHaveProperty('source');
        expect(connection).toHaveProperty('target');
        expect(connection).toHaveProperty('status');
        expect(Object.values(SERVICE_STATUS)).toContain(connection.status);
      });
    });

    it('should have valid parent-child relationships', () => {
      const serviceNodes = mockServicesData.nodes.filter(
        (node) => node.type === 'service'
      );
      const environmentNodes = mockServicesData.nodes.filter(
        (node) => node.type === 'environment'
      );

      serviceNodes.forEach((service) => {
        const parentExists = environmentNodes.some(
          (env) => env.id === service.parent
        );
        expect(parentExists).toBe(true);
      });
    });

    it('should have valid connection references', () => {
      const allNodeIds = mockServicesData.nodes.map((node) => node.id);

      mockServicesData.connections.forEach((connection) => {
        expect(allNodeIds).toContain(connection.source);
        expect(allNodeIds).toContain(connection.target);
      });
    });

    it('should have unique node IDs', () => {
      const nodeIds = mockServicesData.nodes.map((node) => node.id);
      const uniqueIds = new Set(nodeIds);

      expect(uniqueIds.size).toBe(nodeIds.length);
    });

    it('should have unique connection IDs', () => {
      const connectionIds = mockServicesData.connections.map((conn) => conn.id);
      const uniqueIds = new Set(connectionIds);

      expect(uniqueIds.size).toBe(connectionIds.length);
    });

    it('should have realistic service data', () => {
      const serviceNodes = mockServicesData.nodes.filter(
        (node) => node.type === 'service'
      );

      serviceNodes.forEach((node) => {
        expect(node.name).toBeTruthy();
        expect(node.tech).toBeTruthy();
        expect(node.version).toBeTruthy();
        expect(typeof node.name).toBe('string');
        expect(typeof node.tech).toBe('string');
        expect(typeof node.version).toBe('string');
      });
    });

    it('should have both production and staging environments', () => {
      const environmentNames = mockServicesData.nodes
        .filter((node) => node.type === 'environment')
        .map((node) => node.name);

      expect(environmentNames).toContain('Production');
      expect(environmentNames).toContain('Staging');
    });

    it('should have services in both environments', () => {
      const prodServices = mockServicesData.nodes.filter(
        (node) => node.type === 'service' && node.parent === 'prod-env'
      );
      const stagingServices = mockServicesData.nodes.filter(
        (node) => node.type === 'service' && node.parent === 'staging-env'
      );

      expect(prodServices.length).toBeGreaterThan(0);
      expect(stagingServices.length).toBeGreaterThan(0);
    });
  });
});
